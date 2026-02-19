# Patitas Felices - Sistema de Gestion Veterinaria

Sistema de gestion para la veterinaria "Patitas Felices" desarrollado como Trabajo Practico Final de Backend - UTN.

## Tecnologias Utilizadas

### Backend
- **Node.js** con **Express**
- **TypeScript**
- **MongoDB** con **Mongoose**
- **JWT** para autenticacion
- **bcryptjs** para encriptacion de contraseñas
- **express-validator** para validaciones
- **dotenv** para variables de entorno
- **cors** para Cross-Origin Resource Sharing

### Frontend
- **HTML, CSS y JavaScript** vanilla (ubicado en `/public`)

## Instalacion y Ejecucion

### Requisitos Previos
- Node.js (v18 o superior)
- MongoDB (local o MongoDB Atlas)

### Pasos

1. Clonar el repositorio:
```bash
git clone https://github.com/fabricoronil/tp-final-Fabricio-Coronil.git
cd tp-final-Fabricio-Coronil
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear archivo `.env` en la raiz del proyecto (ver seccion Variables de Entorno).

4. Iniciar el servidor en modo desarrollo:
```bash
npm run dev
```

5. Abrir el navegador en `http://localhost:3000`

## Variables de Entorno

Crear un archivo `.env` en la raiz del proyecto con las siguientes variables:

```
PORT=3000
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/patitas_felices
JWT_SECRET=tu_clave_secreta_jwt
```

## Estructura del Proyecto

```
├── src/
│   ├── config/
│   │   └── db.ts                 # Conexion a MongoDB
│   ├── controllers/
│   │   ├── authController.ts     # Login y registro
│   │   ├── ownerController.ts    # CRUD de dueños
│   │   ├── petController.ts      # CRUD de mascotas
│   │   ├── vetController.ts      # CRUD de veterinarios
│   │   └── clinicalHistoryController.ts  # CRUD de historial clinico
│   ├── middlewares/
│   │   ├── auth.ts               # Middleware JWT
│   │   ├── errorHandler.ts       # Manejo centralizado de errores
│   │   └── validators/           # Validaciones con express-validator
│   ├── dtos/
│   │   ├── ownerDto.ts            # DTOs de dueño
│   │   ├── petDto.ts              # DTOs de mascota
│   │   ├── vetDto.ts              # DTOs de veterinario
│   │   └── clinicalHistoryDto.ts  # DTOs de historial clinico
│   ├── models/
│   │   ├── User.ts               # Modelo de usuario
│   │   ├── Owner.ts              # Modelo de dueño
│   │   ├── Pet.ts                # Modelo de mascota
│   │   ├── Vet.ts                # Modelo de veterinario
│   │   └── ClinicalHistory.ts    # Modelo de historial clinico
│   ├── routes/
│   │   ├── authRoutes.ts
│   │   ├── ownerRoutes.ts
│   │   ├── petRoutes.ts
│   │   ├── vetRoutes.ts
│   │   └── clinicalHistoryRoutes.ts
│   └── app.ts                    # Servidor principal
├── public/                       # Frontend HTML/CSS/JS
│   ├── index.html                # Login y registro
│   ├── dashboard.html            # Dashboard con CRUD de todas las entidades
│   ├── styles.css
│   ├── app.js
│   └── dashboard.js
├── .env.example
├── package.json
└── tsconfig.json
```

## Endpoints de la API

### Autenticacion (publicos)
| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| POST | `/api/auth/register` | Registrar usuario |
| POST | `/api/auth/login` | Iniciar sesion |

### Dueños (requieren autenticacion)
| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/api/owners` | Listar todos los dueños |
| GET | `/api/owners/:id` | Obtener dueño por ID |
| POST | `/api/owners` | Crear dueño |
| PUT | `/api/owners/:id` | Actualizar dueño |
| DELETE | `/api/owners/:id` | Eliminar dueño |

### Mascotas (requieren autenticacion)
| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/api/pets` | Listar todas las mascotas |
| GET | `/api/pets/:id` | Obtener mascota por ID |
| POST | `/api/pets` | Crear mascota |
| PUT | `/api/pets/:id` | Actualizar mascota |
| DELETE | `/api/pets/:id` | Eliminar mascota |

### Veterinarios (requieren autenticacion)
| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/api/vets` | Listar todos los veterinarios |
| GET | `/api/vets/:id` | Obtener veterinario por ID |
| POST | `/api/vets` | Crear veterinario |
| PUT | `/api/vets/:id` | Actualizar veterinario |
| DELETE | `/api/vets/:id` | Eliminar veterinario |

### Historial Clinico (requieren autenticacion)
| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| GET | `/api/clinical-histories` | Listar todos los historiales |
| GET | `/api/clinical-histories/:id` | Obtener historial por ID |
| POST | `/api/clinical-histories` | Crear historial |
| PUT | `/api/clinical-histories/:id` | Actualizar historial |
| DELETE | `/api/clinical-histories/:id` | Eliminar historial |

## Ejemplos de Uso

### Registrar usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "email": "admin@mail.com", "password": "123456"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@mail.com", "password": "123456"}'
```

### Crear un dueño (con token)
```bash
curl -X POST http://localhost:3000/api/owners \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{"nombre": "Juan", "apellido": "Perez", "telefono": "1122334455", "email": "juan@mail.com"}'
```

### Crear una mascota (con token)
```bash
curl -X POST http://localhost:3000/api/pets \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{"nombre": "Rocky", "especie": "Perro", "raza": "Labrador", "edad": 3, "owner": "ID_DEL_DUENO"}'
```

## Frontend

El frontend esta desarrollado con **HTML, CSS y JavaScript** vanilla, ubicado en la carpeta `/public`. Permite:

- Registro e inicio de sesion de usuarios
- CRUD completo de mascotas desde el dashboard
- CRUD completo de dueños
- CRUD completo de veterinarios
- CRUD completo de historial clinico
- Todas las operaciones se realizan consumiendo la API REST del backend

## Autor

Fabricio Coronil - UTN
