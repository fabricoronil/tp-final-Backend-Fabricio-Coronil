import { Schema, model, Document, Types } from 'mongoose';

export interface IClinicalHistory extends Document {
    fecha: Date;
    diagnostico: string;
    tratamiento: string;
    observaciones: string;
    pet: Types.ObjectId;
    vet: Types.ObjectId;
}

const clinicalHistorySchema = new Schema<IClinicalHistory>({
    fecha: {
        type: Date,
        required: [true, 'La fecha es obligatoria'],
        default: Date.now
    },
    diagnostico: {
        type: String,
        required: [true, 'El diagnostico es obligatorio'],
        trim: true
    },
    tratamiento: {
        type: String,
        required: [true, 'El tratamiento es obligatorio'],
        trim: true
    },
    observaciones: {
        type: String,
        trim: true
    },
    pet: {
        type: Schema.Types.ObjectId,
        ref: 'Pet',
        required: [true, 'La mascota es obligatoria']
    },
    vet: {
        type: Schema.Types.ObjectId,
        ref: 'Vet',
        required: [true, 'El veterinario es obligatorio']
    }
}, {
    timestamps: true
});

const ClinicalHistory = model<IClinicalHistory>('ClinicalHistory', clinicalHistorySchema);

export default ClinicalHistory;
