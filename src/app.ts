import express from 'express';
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

const PORT = process.env.PORT || 3000;

app.get('/', (_req, res) => {
    res.json({ mensaje: 'API Veterinaria Patitas Felices funcionando' });
});

app.use('/api/auth', authRoutes);
app.use('/api/owners', ownerRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/vets', vetRoutes);
app.use('/api/clinical-histories', clinicalHistoryRoutes);

app.use(errorHandler);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en puerto ${PORT}`);
    });
});

export default app;
