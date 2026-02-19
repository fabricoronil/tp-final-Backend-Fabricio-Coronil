export interface CreateVetDto {
    nombre: string;
    apellido: string;
    especialidad: string;
    telefono?: string;
    email: string;
}

export interface UpdateVetDto {
    nombre?: string;
    apellido?: string;
    especialidad?: string;
    telefono?: string;
    email?: string;
}
