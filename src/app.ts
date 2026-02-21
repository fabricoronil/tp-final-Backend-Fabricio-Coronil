import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import ownerRoutes from './routes/ownerRoutes';
import petRoutes from './routes/petRoutes';
import vetRoutes from './routes/vetRoutes';
import clinicalHistoryRoutes from './routes/clinicalHistoryRoutes';
import errorHandler from './middlewares/errorHandler';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '..', 'public')));

// Middleware para asegurar conexión a MongoDB antes de cada request
app.use(async (_req, _res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        next(error);
    }
});

app.use('/api/auth', authRoutes);
app.use('/api/owners', ownerRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/vets', vetRoutes);
app.use('/api/clinical-histories', clinicalHistoryRoutes);

app.use(errorHandler);

// Solo escuchar en un puerto cuando se ejecuta localmente (no en Vercel)
if (process.env.VERCEL !== '1') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
    });
}

export default app;

