import { Schema, model, Document } from 'mongoose';

export interface IOwner extends Document {
    nombre: string;
    apellido: string;
    telefono: string;
    direccion: string;
    email: string;
}

const ownerSchema = new Schema<IOwner>({
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
    telefono: {
        type: String,
        required: [true, 'El telefono es obligatorio'],
        trim: true
    },
    direccion: {
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

const Owner = model<IOwner>('Owner', ownerSchema);

export default Owner;
