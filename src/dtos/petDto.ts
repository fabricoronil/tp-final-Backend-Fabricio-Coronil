export interface CreatePetDto {
    nombre: string;
    especie: string;
    raza?: string;
    edad?: number;
    owner: string;
}

export interface UpdatePetDto {
    nombre?: string;
    especie?: string;
    raza?: string;
    edad?: number;
    owner?: string;
}
