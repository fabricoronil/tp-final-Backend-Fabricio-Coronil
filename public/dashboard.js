const API_URL = 'http://localhost:3000/api';

function getToken() {
    return localStorage.getItem('token');
}

function authHeaders() {
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + getToken()
    };
}

function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    window.location.href = '/';
}

function mostrarMsg(texto, tipo) {
    const div = document.getElementById('mensaje-dashboard');
    div.textContent = texto;
    div.className = 'mensaje ' + tipo;
    setTimeout(() => {
        div.textContent = '';
        div.className = 'mensaje';
    }, 3000);
}

// ======= NAVEGACION =======

function cambiarSeccion(seccion) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(t => t.classList.remove('active'));

    document.getElementById('seccion-mascotas').classList.add('hidden');
    document.getElementById('seccion-duenos').classList.add('hidden');

    if (seccion === 'mascotas') {
        document.getElementById('seccion-mascotas').classList.remove('hidden');
        tabs[0].classList.add('active');
        cargarMascotas();
    } else {
        document.getElementById('seccion-duenos').classList.remove('hidden');
        tabs[1].classList.add('active');
        cargarDuenosTabla();
    }
}

// ======= INICIO =======

window.onload = function () {
    const token = getToken();
    if (!token) {
        window.location.href = '/';
        return;
    }

    const username = localStorage.getItem('username');
    document.getElementById('bienvenida').textContent = 'Hola, ' + (username || 'Usuario');

    cargarMascotas();
    cargarDuenosSelect();
};

// ======= DUEÑOS - CRUD =======

async function cargarDuenosTabla() {
    try {
        const res = await fetch(API_URL + '/owners', {
            headers: authHeaders()
        });

        if (res.status === 401) { cerrarSesion(); return; }

        const duenos = await res.json();
        const tbody = document.getElementById('lista-duenos');
        tbody.innerHTML = '';

        if (duenos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No hay dueños registrados</td></tr>';
            return;
        }

        duenos.forEach(d => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${d.nombre}</td>
                <td>${d.apellido}</td>
                <td>${d.telefono || '-'}</td>
                <td>${d.email}</td>
                <td class="acciones">
                    <button class="btn btn-small" onclick="editarDueno('${d._id}')">Editar</button>
                    <button class="btn btn-danger btn-small" onclick="eliminarDueno('${d._id}')">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        mostrarMsg('Error al cargar dueños', 'error');
    }
}

async function cargarDuenosSelect() {
    try {
        const res = await fetch(API_URL + '/owners', {
            headers: authHeaders()
        });

        const duenos = await res.json();
        const select = document.getElementById('mascota-owner');
        const aviso = document.getElementById('aviso-duenos');

        select.innerHTML = '<option value="">Seleccionar dueño...</option>';

        if (duenos.length === 0) {
            if (aviso) aviso.classList.remove('hidden');
        } else {
            if (aviso) aviso.classList.add('hidden');
            duenos.forEach(d => {
                const option = document.createElement('option');
                option.value = d._id;
                option.textContent = d.nombre + ' ' + d.apellido;
                select.appendChild(option);
            });
        }
    } catch (error) {
        mostrarMsg('Error al cargar dueños', 'error');
    }
}

function mostrarFormDueno() {
    document.getElementById('formulario-dueno').classList.remove('hidden');
    document.getElementById('form-titulo-dueno').textContent = 'Agregar Dueño';
    document.getElementById('dueno-id').value = '';
    document.getElementById('dueno-nombre').value = '';
    document.getElementById('dueno-apellido').value = '';
    document.getElementById('dueno-telefono').value = '';
    document.getElementById('dueno-direccion').value = '';
    document.getElementById('dueno-email').value = '';
}

function cancelarFormDueno() {
    document.getElementById('formulario-dueno').classList.add('hidden');
}

async function guardarDueno() {
    const id = document.getElementById('dueno-id').value;
    const datos = {
        nombre: document.getElementById('dueno-nombre').value,
        apellido: document.getElementById('dueno-apellido').value,
        telefono: document.getElementById('dueno-telefono').value,
        direccion: document.getElementById('dueno-direccion').value,
        email: document.getElementById('dueno-email').value
    };

    if (!datos.nombre || !datos.apellido || !datos.email) {
        mostrarMsg('Nombre, apellido y email son obligatorios', 'error');
        return;
    }

    try {
        const url = id ? API_URL + '/owners/' + id : API_URL + '/owners';
        const method = id ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method: method,
            headers: authHeaders(),
            body: JSON.stringify(datos)
        });

        const data = await res.json();

        if (!res.ok) {
            const msg = data.errores
                ? data.errores.map(e => e.msg).join(', ')
                : data.mensaje || 'Error al guardar';
            mostrarMsg(msg, 'error');
            return;
        }

        mostrarMsg(id ? 'Dueño actualizado' : 'Dueño creado', 'exito');
        cancelarFormDueno();
        cargarDuenosTabla();
        cargarDuenosSelect();
    } catch (error) {
        mostrarMsg('Error de conexion', 'error');
    }
}

async function editarDueno(id) {
    try {
        const res = await fetch(API_URL + '/owners/' + id, {
            headers: authHeaders()
        });

        const dueno = await res.json();

        document.getElementById('formulario-dueno').classList.remove('hidden');
        document.getElementById('form-titulo-dueno').textContent = 'Editar Dueño';
        document.getElementById('dueno-id').value = dueno._id;
        document.getElementById('dueno-nombre').value = dueno.nombre;
        document.getElementById('dueno-apellido').value = dueno.apellido;
        document.getElementById('dueno-telefono').value = dueno.telefono || '';
        document.getElementById('dueno-direccion').value = dueno.direccion || '';
        document.getElementById('dueno-email').value = dueno.email;
    } catch (error) {
        mostrarMsg('Error al cargar dueño', 'error');
    }
}

async function eliminarDueno(id) {
    if (!confirm('¿Estás seguro de eliminar este dueño?')) return;

    try {
        const res = await fetch(API_URL + '/owners/' + id, {
            method: 'DELETE',
            headers: authHeaders()
        });

        if (!res.ok) {
            mostrarMsg('Error al eliminar dueño', 'error');
            return;
        }

        mostrarMsg('Dueño eliminado', 'exito');
        cargarDuenosTabla();
        cargarDuenosSelect();
    } catch (error) {
        mostrarMsg('Error de conexion', 'error');
    }
}

// ======= MASCOTAS - CRUD =======

async function cargarMascotas() {
    try {
        const res = await fetch(API_URL + '/pets', {
            headers: authHeaders()
        });

        if (res.status === 401) { cerrarSesion(); return; }

        const mascotas = await res.json();
        const tbody = document.getElementById('lista-mascotas');
        tbody.innerHTML = '';

        if (mascotas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No hay mascotas registradas</td></tr>';
            return;
        }

        mascotas.forEach(m => {
            const ownerNombre = m.owner ? m.owner.nombre + ' ' + m.owner.apellido : 'Sin dueño';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${m.nombre}</td>
                <td>${m.especie}</td>
                <td>${m.raza || '-'}</td>
                <td>${m.edad || '-'}</td>
                <td>${ownerNombre}</td>
                <td class="acciones">
                    <button class="btn btn-small" onclick="editarMascota('${m._id}')">Editar</button>
                    <button class="btn btn-danger btn-small" onclick="eliminarMascota('${m._id}')">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        mostrarMsg('Error al cargar mascotas', 'error');
    }
}

function mostrarFormulario() {
    document.getElementById('formulario-mascota').classList.remove('hidden');
    document.getElementById('form-titulo').textContent = 'Agregar Mascota';
    document.getElementById('mascota-id').value = '';
    document.getElementById('mascota-nombre').value = '';
    document.getElementById('mascota-especie').value = '';
    document.getElementById('mascota-raza').value = '';
    document.getElementById('mascota-edad').value = '';
    document.getElementById('mascota-owner').value = '';
    cargarDuenosSelect();
}

function cancelarFormulario() {
    document.getElementById('formulario-mascota').classList.add('hidden');
}

async function guardarMascota() {
    const id = document.getElementById('mascota-id').value;
    const datos = {
        nombre: document.getElementById('mascota-nombre').value,
        especie: document.getElementById('mascota-especie').value,
        raza: document.getElementById('mascota-raza').value,
        edad: document.getElementById('mascota-edad').value ? Number(document.getElementById('mascota-edad').value) : undefined,
        owner: document.getElementById('mascota-owner').value
    };

    if (!datos.nombre || !datos.especie || !datos.owner) {
        mostrarMsg('Nombre, especie y dueño son obligatorios', 'error');
        return;
    }

    try {
        const url = id ? API_URL + '/pets/' + id : API_URL + '/pets';
        const method = id ? 'PUT' : 'POST';

        const res = await fetch(url, {
            method: method,
            headers: authHeaders(),
            body: JSON.stringify(datos)
        });

        const data = await res.json();

        if (!res.ok) {
            const msg = data.errores
                ? data.errores.map(e => e.msg).join(', ')
                : data.mensaje || 'Error al guardar';
            mostrarMsg(msg, 'error');
            return;
        }

        mostrarMsg(id ? 'Mascota actualizada' : 'Mascota creada', 'exito');
        cancelarFormulario();
        cargarMascotas();
    } catch (error) {
        mostrarMsg('Error de conexion', 'error');
    }
}

async function editarMascota(id) {
    try {
        const res = await fetch(API_URL + '/pets/' + id, {
            headers: authHeaders()
        });

        const mascota = await res.json();

        document.getElementById('formulario-mascota').classList.remove('hidden');
        document.getElementById('form-titulo').textContent = 'Editar Mascota';
        document.getElementById('mascota-id').value = mascota._id;
        document.getElementById('mascota-nombre').value = mascota.nombre;
        document.getElementById('mascota-especie').value = mascota.especie;
        document.getElementById('mascota-raza').value = mascota.raza || '';
        document.getElementById('mascota-edad').value = mascota.edad || '';

        await cargarDuenosSelect();
        document.getElementById('mascota-owner').value = mascota.owner._id || mascota.owner;
    } catch (error) {
        mostrarMsg('Error al cargar mascota', 'error');
    }
}

async function eliminarMascota(id) {
    if (!confirm('¿Estás seguro de eliminar esta mascota?')) return;

    try {
        const res = await fetch(API_URL + '/pets/' + id, {
            method: 'DELETE',
            headers: authHeaders()
        });

        if (!res.ok) {
            mostrarMsg('Error al eliminar mascota', 'error');
            return;
        }

        mostrarMsg('Mascota eliminada', 'exito');
        cargarMascotas();
    } catch (error) {
        mostrarMsg('Error de conexion', 'error');
    }
}
