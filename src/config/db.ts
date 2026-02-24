import mongoose from 'mongoose';

let connectionPromise: Promise<typeof mongoose> | null = null;

const connectDB = async (): Promise<void> => {

    if (mongoose.connection.readyState === 1) {
        return;
    }


    if (connectionPromise) {
        await connectionPromise;
        return;
    }


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

