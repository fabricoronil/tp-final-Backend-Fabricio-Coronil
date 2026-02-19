export interface CreateOwnerDto {
    nombre: string;
    apellido: string;
    telefono: string;
    direccion?: string;
    email: string;
}

export interface UpdateOwnerDto {
    nombre?: string;
    apellido?: string;
    telefono?: string;
    direccion?: string;
    email?: string;
}
