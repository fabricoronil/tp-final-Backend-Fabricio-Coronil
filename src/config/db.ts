import mongoose from 'mongoose';

let cached = global as typeof global & { mongoosePromise?: Promise<typeof mongoose> };

const connectDB = async (): Promise<void> => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }

    if (!cached.mongoosePromise) {
        cached.mongoosePromise = mongoose.connect(process.env.MONGO_URI as string, {
            tls: true,
            tlsAllowInvalidCertificates: true,
            bufferCommands: false,
        });
    }

    try {
        await cached.mongoosePromise;
        console.log('MongoDB conectado');
    } catch (error) {
        cached.mongoosePromise = undefined;
        console.error('Error al conectar con MongoDB:', error);
        throw error;
    }
};

export default connectDB;

