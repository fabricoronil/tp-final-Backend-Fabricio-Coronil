import { Schema, model, Document, Types } from 'mongoose';

export interface IPet extends Document {
    nombre: string;
    especie: string;
    raza: string;
    edad: number;
    owner: Types.ObjectId;
}

const petSchema = new Schema<IPet>({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    especie: {
        type: String,
        required: [true, 'La especie es obligatoria'],
        trim: true
    },
    raza: {
        type: String,
        trim: true
    },
    edad: {
        type: Number
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'Owner',
        required: [true, 'El dueno es obligatorio']
    }
}, {
    timestamps: true
});

const Pet = model<IPet>('Pet', petSchema);

export default Pet;
