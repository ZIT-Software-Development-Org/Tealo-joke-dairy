import express from 'express';
import fs from 'fs';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { Pool } from 'pg';
import  sequelize  from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import jokeRoutes from './routes/jokeRoutes.js';

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
});

dotenv.config();

const app = express();

const SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
    console.error('SESSION_SECRET is not defined. Please set it in the environment variables.');
    process.exit(1);
}

// Create a Postgres connection pool
const pgPool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT) || 5432,
    max: 20, // Max number of clients in the pool
    idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
    connectionTimeoutMillis: 2000, // Return an error after 2 seconds if connection could not be established
});

const PgSession = connectPgSimple(session);

app.use(session({
    store: new PgSession({
        pool: pgPool, // Connection pool
        tableName: 'user_sessions', // Table name
        createTableIfMissing: true, // Create the table if it doesn't exist
    }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false, // Set to false for development
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
        sameSite: 'lax'
    }
}));

// Middleware
// Configure CORS
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Enable pre-flight requests for all routes
app.options('*', cors());

// Configure security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' } // Allow loading images from our server
}));
app.use(express.json());

// Create uploads directory if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}
if (!fs.existsSync('uploads/profile-pictures')) {
  fs.mkdirSync('uploads/profile-pictures');
}

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: false }));
// app.use(morgan('dev'));

// Routes
app.use('/api/auth/', authRoutes);
app.use('/api/jokes/', jokeRoutes);
app.use('/api/users/', userRoutes);

const PORT = process.env.PORT || 4000;

// Start the server
// Sync database models
sequelize
    .sync() // Sync without dropping tables
    .then(() => {
        console.log('✅ Database tables created successfully');
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('❌ Database error:', error);
        process.exit(1);
    });
