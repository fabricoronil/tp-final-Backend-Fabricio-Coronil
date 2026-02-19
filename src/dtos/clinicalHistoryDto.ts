export interface CreateClinicalHistoryDto {
    fecha?: Date;
    diagnostico: string;
    tratamiento: string;
    observaciones?: string;
    pet: string;
    vet: string;
}

export interface UpdateClinicalHistoryDto {
    fecha?: Date;
    diagnostico?: string;
    tratamiento?: string;
    observaciones?: string;
    pet?: string;
    vet?: string;
}
