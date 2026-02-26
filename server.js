import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './src/config/db.js';
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import propertyRoutes from './src/routes/propertyRoutes.js';
import favoriteRoutes from './src/routes/favoriteRoutes.js';
import appointmentRoutes from './src/routes/appointmentRoutes.js';
import notificationRoutes from './src/routes/notificationRoutes.js';

import uploadRoutes from './src/routes/uploadRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Security Middlewares
app.use(helmet({
    crossOriginResourcePolicy: false, // Prevent helmet from blocking local images
}));

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// CORS
app.use(cors());

// Body parser
app.use(express.json());

// Set up static folder for uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Set up Swagger Doc
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/properties', propertyRoutes);
app.use('/api/v1/favorites', favoriteRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/upload', uploadRoutes);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Centralized Error Handling Middlewares
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});