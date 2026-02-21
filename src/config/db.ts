import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI as string, {
            tls: true,
            tlsAllowInvalidCertificates: true,
        });
        console.log(`MongoDB conectado: ${conn.connection.host}`);
    } catch (error) {
        console.error('Error al conectar con MongoDB:', error);
    }
};

export default connectDB;
