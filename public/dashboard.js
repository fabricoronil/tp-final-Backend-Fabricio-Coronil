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



function toggleUserMenu() {
    const dropdown = document.getElementById('user-dropdown');
    dropdown.classList.toggle('hidden');
}

document.addEventListener('click', function (e) {
    const menu = document.querySelector('.user-menu');
    const dropdown = document.getElementById('user-dropdown');
    if (menu && dropdown && !menu.contains(e.target)) {
        dropdown.classList.add('hidden');
    }
});



function cambiarSeccion(seccion) {
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(t => t.classList.remove('active'));

    document.getElementById('seccion-mascotas').classList.add('hidden');
    document.getElementById('seccion-duenos').classList.add('hidden');
    document.getElementById('seccion-veterinarios').classList.add('hidden');
    document.getElementById('seccion-historial').classList.add('hidden');

    if (seccion === 'mascotas') {
        document.getElementById('seccion-mascotas').classList.remove('hidden');
        tabs[0].classList.add('active');
        cargarMascotas();
    } else if (seccion === 'duenos') {
        document.getElementById('seccion-duenos').classList.remove('hidden');
        tabs[1].classList.add('active');
        cargarDuenosTabla();
    } else if (seccion === 'veterinarios') {
        document.getElementById('seccion-veterinarios').classList.remove('hidden');
        tabs[2].classList.add('active');
        cargarVeterinarios();
    } else if (seccion === 'historial') {
        document.getElementById('seccion-historial').classList.remove('hidden');
        tabs[3].classList.add('active');
        cargarHistorial();
    }
}



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

        const optNuevo = document.createElement('option');
        optNuevo.value = 'nuevo';
        optNuevo.textContent = '+ Crear nuevo dueño';
        select.appendChild(optNuevo);
    } catch (error) {
        mostrarMsg('Error al cargar dueños', 'error');
    }
}

function toggleNuevoDueno() {
    const select = document.getElementById('mascota-owner');
    const formInline = document.getElementById('nuevo-dueno-inline');
    if (select.value === 'nuevo') {
        formInline.classList.remove('hidden');
    } else {
        formInline.classList.add('hidden');
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
    document.getElementById('nuevo-dueno-inline').classList.add('hidden');
}

async function guardarMascota() {
    const id = document.getElementById('mascota-id').value;
    let ownerId = document.getElementById('mascota-owner').value;

    if (ownerId === 'nuevo') {
        const nombre = document.getElementById('nuevo-dueno-nombre').value;
        const apellido = document.getElementById('nuevo-dueno-apellido').value;
        const telefono = document.getElementById('nuevo-dueno-telefono').value;
        const direccion = document.getElementById('nuevo-dueno-direccion').value;
        const email = document.getElementById('nuevo-dueno-email').value;

        if (!nombre || !apellido || !telefono || !email) {
            mostrarMsg('Completá nombre, apellido, teléfono y email del nuevo dueño', 'error');
            return;
        }

        try {
            const resDueno = await fetch(API_URL + '/owners', {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify({ nombre, apellido, telefono, direccion, email })
            });

            if (!resDueno.ok) {
                const errData = await resDueno.json();
                mostrarMsg(errData.mensaje || 'Error al crear dueño', 'error');
                return;
            }

            const nuevoDueno = await resDueno.json();
            ownerId = nuevoDueno._id;
        } catch (error) {
            mostrarMsg('Error de conexion al crear dueño', 'error');
            return;
        }
    }

    const datos = {
        nombre: document.getElementById('mascota-nombre').value,
        especie: document.getElementById('mascota-especie').value,
        raza: document.getElementById('mascota-raza').value,
        edad: document.getElementById('mascota-edad').value || undefined,
        owner: ownerId
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
        cargarDuenosTabla();
        cargarDuenosSelect();
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



async function cargarVeterinarios() {
    try {
        const res = await fetch(API_URL + '/vets', {
            headers: authHeaders()
        });

        if (res.status === 401) { cerrarSesion(); return; }

        const vets = await res.json();
        const tbody = document.getElementById('lista-vets');
        tbody.innerHTML = '';

        if (vets.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">No hay veterinarios registrados</td></tr>';
            return;
        }

        vets.forEach(v => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${v.nombre}</td>
                <td>${v.apellido}</td>
                <td>${v.especialidad}</td>
                <td>${v.email}</td>
                <td class="acciones">
                    <button class="btn btn-small" onclick="editarVet('${v._id}')">Editar</button>
                    <button class="btn btn-danger btn-small" onclick="eliminarVet('${v._id}')">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        mostrarMsg('Error al cargar veterinarios', 'error');
    }
}

function mostrarFormVet() {
    document.getElementById('formulario-vet').classList.remove('hidden');
    document.getElementById('form-titulo-vet').textContent = 'Agregar Veterinario';
    document.getElementById('vet-id').value = '';
    document.getElementById('vet-nombre').value = '';
    document.getElementById('vet-apellido').value = '';
    document.getElementById('vet-especialidad').value = '';
    document.getElementById('vet-telefono').value = '';
    document.getElementById('vet-email').value = '';
}

function cancelarFormVet() {
    document.getElementById('formulario-vet').classList.add('hidden');
}

async function guardarVet() {
    const id = document.getElementById('vet-id').value;
    const datos = {
        nombre: document.getElementById('vet-nombre').value,
        apellido: document.getElementById('vet-apellido').value,
        especialidad: document.getElementById('vet-especialidad').value,
        telefono: document.getElementById('vet-telefono').value,
        email: document.getElementById('vet-email').value
    };

    if (!datos.nombre || !datos.apellido || !datos.especialidad || !datos.email) {
        mostrarMsg('Nombre, apellido, especialidad y email son obligatorios', 'error');
        return;
    }

    try {
        const url = id ? API_URL + '/vets/' + id : API_URL + '/vets';
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

        mostrarMsg(id ? 'Veterinario actualizado' : 'Veterinario creado', 'exito');
        cancelarFormVet();
        cargarVeterinarios();
    } catch (error) {
        mostrarMsg('Error de conexion', 'error');
    }
}

async function editarVet(id) {
    try {
        const res = await fetch(API_URL + '/vets/' + id, {
            headers: authHeaders()
        });

        const vet = await res.json();

        document.getElementById('formulario-vet').classList.remove('hidden');
        document.getElementById('form-titulo-vet').textContent = 'Editar Veterinario';
        document.getElementById('vet-id').value = vet._id;
        document.getElementById('vet-nombre').value = vet.nombre;
        document.getElementById('vet-apellido').value = vet.apellido;
        document.getElementById('vet-especialidad').value = vet.especialidad;
        document.getElementById('vet-telefono').value = vet.telefono || '';
        document.getElementById('vet-email').value = vet.email;
    } catch (error) {
        mostrarMsg('Error al cargar veterinario', 'error');
    }
}

async function eliminarVet(id) {
    if (!confirm('¿Estás seguro de eliminar este veterinario?')) return;

    try {
        const res = await fetch(API_URL + '/vets/' + id, {
            method: 'DELETE',
            headers: authHeaders()
        });

        if (!res.ok) {
            mostrarMsg('Error al eliminar veterinario', 'error');
            return;
        }

        mostrarMsg('Veterinario eliminado', 'exito');
        cargarVeterinarios();
    } catch (error) {
        mostrarMsg('Error de conexion', 'error');
    }
}



async function cargarHistorial() {
    try {
        const res = await fetch(API_URL + '/clinical-histories', {
            headers: authHeaders()
        });

        if (res.status === 401) { cerrarSesion(); return; }

        const historiales = await res.json();
        const tbody = document.getElementById('lista-historial');
        tbody.innerHTML = '';

        if (historiales.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No hay registros en el historial</td></tr>';
            return;
        }

        historiales.forEach(h => {
            const mascotaNombre = h.pet ? h.pet.nombre : 'Sin mascota';
            const vetNombre = h.vet ? h.vet.nombre + ' ' + h.vet.apellido : 'Sin veterinario';
            const fecha = h.fecha ? new Date(h.fecha).toLocaleDateString('es-AR') : '-';
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${fecha}</td>
                <td>${mascotaNombre}</td>
                <td>${vetNombre}</td>
                <td>${h.diagnostico}</td>
                <td>${h.tratamiento}</td>
                <td class="acciones">
                    <button class="btn btn-small" onclick="editarHistorial('${h._id}')">Editar</button>
                    <button class="btn btn-danger btn-small" onclick="eliminarHistorial('${h._id}')">Eliminar</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    } catch (error) {
        mostrarMsg('Error al cargar historial', 'error');
    }
}

async function cargarMascotasSelect() {
    try {
        const res = await fetch(API_URL + '/pets', {
            headers: authHeaders()
        });

        const mascotas = await res.json();
        const select = document.getElementById('historial-mascota');
        select.innerHTML = '<option value="">Seleccionar mascota...</option>';

        mascotas.forEach(m => {
            const option = document.createElement('option');
            option.value = m._id;
            option.textContent = m.nombre + ' (' + m.especie + ')';
            select.appendChild(option);
        });
    } catch (error) {
        mostrarMsg('Error al cargar mascotas', 'error');
    }
}

async function cargarVetsSelect() {
    try {
        const res = await fetch(API_URL + '/vets', {
            headers: authHeaders()
        });

        const vets = await res.json();
        const select = document.getElementById('historial-vet');
        select.innerHTML = '<option value="">Seleccionar veterinario...</option>';

        vets.forEach(v => {
            const option = document.createElement('option');
            option.value = v._id;
            option.textContent = v.nombre + ' ' + v.apellido + ' - ' + v.especialidad;
            select.appendChild(option);
        });
    } catch (error) {
        mostrarMsg('Error al cargar veterinarios', 'error');
    }
}

async function mostrarFormHistorial() {
    document.getElementById('formulario-historial').classList.remove('hidden');
    document.getElementById('form-titulo-historial').textContent = 'Agregar Registro';
    document.getElementById('historial-id').value = '';
    document.getElementById('historial-fecha').value = new Date().toISOString().split('T')[0];
    document.getElementById('historial-mascota').value = '';
    document.getElementById('historial-vet').value = '';
    document.getElementById('historial-diagnostico').value = '';
    document.getElementById('historial-tratamiento').value = '';
    document.getElementById('historial-observaciones').value = '';
    await cargarMascotasSelect();
    await cargarVetsSelect();
}

function cancelarFormHistorial() {
    document.getElementById('formulario-historial').classList.add('hidden');
}

async function guardarHistorial() {
    const id = document.getElementById('historial-id').value;
    const datos = {
        fecha: document.getElementById('historial-fecha').value,
        diagnostico: document.getElementById('historial-diagnostico').value,
        tratamiento: document.getElementById('historial-tratamiento').value,
        observaciones: document.getElementById('historial-observaciones').value,
        pet: document.getElementById('historial-mascota').value,
        vet: document.getElementById('historial-vet').value
    };

    if (!datos.diagnostico || !datos.tratamiento || !datos.pet || !datos.vet) {
        mostrarMsg('Diagnóstico, tratamiento, mascota y veterinario son obligatorios', 'error');
        return;
    }

    try {
        const url = id ? API_URL + '/clinical-histories/' + id : API_URL + '/clinical-histories';
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

        mostrarMsg(id ? 'Registro actualizado' : 'Registro creado', 'exito');
        cancelarFormHistorial();
        cargarHistorial();
    } catch (error) {
        mostrarMsg('Error de conexion', 'error');
    }
}

async function editarHistorial(id) {
    try {
        const res = await fetch(API_URL + '/clinical-histories/' + id, {
            headers: authHeaders()
        });

        const historial = await res.json();

        document.getElementById('formulario-historial').classList.remove('hidden');
        document.getElementById('form-titulo-historial').textContent = 'Editar Registro';
        document.getElementById('historial-id').value = historial._id;
        document.getElementById('historial-fecha').value = historial.fecha ? historial.fecha.split('T')[0] : '';
        document.getElementById('historial-diagnostico').value = historial.diagnostico;
        document.getElementById('historial-tratamiento').value = historial.tratamiento;
        document.getElementById('historial-observaciones').value = historial.observaciones || '';

        await cargarMascotasSelect();
        await cargarVetsSelect();
        document.getElementById('historial-mascota').value = historial.pet._id || historial.pet;
        document.getElementById('historial-vet').value = historial.vet._id || historial.vet;
    } catch (error) {
        mostrarMsg('Error al cargar registro', 'error');
    }
}

async function eliminarHistorial(id) {
    if (!confirm('¿Estás seguro de eliminar este registro?')) return;

    try {
        const res = await fetch(API_URL + '/clinical-histories/' + id, {
            method: 'DELETE',
            headers: authHeaders()
        });

        if (!res.ok) {
            mostrarMsg('Error al eliminar registro', 'error');
            return;
        }

        mostrarMsg('Registro eliminado', 'exito');
        cargarHistorial();
    } catch (error) {
        mostrarMsg('Error de conexion', 'error');
    }
}
