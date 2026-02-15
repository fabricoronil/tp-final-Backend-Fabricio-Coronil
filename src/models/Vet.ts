import { Schema, model, Document } from 'mongoose';

export interface IVet extends Document {
    nombre: string;
    apellido: string;
    especialidad: string;
    telefono: string;
    email: string;
}

const vetSchema = new Schema<IVet>({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    apellido: {
        type: String,
        required: [true, 'El apellido es obligatorio'],
        trim: true
    },
    especialidad: {
        type: String,
        required: [true, 'La especialidad es obligatoria'],
        trim: true
    },
    telefono: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El email es obligatorio'],
        unique: true,
        trim: true,
        lowercase: true
    }
}, {
    timestamps: true
});

const Vet = model<IVet>('Vet', vetSchema);

export default Vet;
