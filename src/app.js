import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import announcementRoutes from './routes/announcements.js';
import authRoutes from './routes/auth.js';
import eventRoutes from './routes/events.js';
import healthRoutes from './routes/health.js';
import registrationRoutes from './routes/registrations.js';
import errorHandler from './middleware/errorHandler.js';
import AppError from './utils/AppError.js';

const app = express();

if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));
app.use(express.json());
app.use(mongoSanitize());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/announcements', announcementRoutes);
app.use((req, res, next) => next(new AppError('Route not found', 404)));
app.use(errorHandler);

export default app;
