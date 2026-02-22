import mongoose from 'mongoose';

let connectionPromise: Promise<typeof mongoose> | null = null;

const connectDB = async (): Promise<void> => {
    // Si ya está conectado, no hacer nada
    if (mongoose.connection.readyState === 1) {
        return;
    }

    // Si hay una conexión en progreso, esperar a que termine
    if (connectionPromise) {
        await connectionPromise;
        return;
    }

    // Crear nueva conexión
    connectionPromise = mongoose.connect(process.env.MONGO_URI as string, {
        tls: true,
        tlsAllowInvalidCertificates: true,
    });

    try {
        await connectionPromise;
        console.log('MongoDB conectado');
    } catch (error) {
        connectionPromise = null;
        console.error('Error al conectar con MongoDB:', error);
        throw error;
    }
};

export default connectDB;

