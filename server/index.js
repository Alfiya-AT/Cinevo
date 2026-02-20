import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';

// Load env vars (optional - works without .env too)
dotenv.config();

// Initialize the database (creates cinevo.db + tables if not exist)
import('./config/db.js').catch(err => {
    console.error('DB init error:', err);
    process.exit(1);
});

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
    res.json({ success: true, message: 'Cinevo server is running 🎬' });
});

// Routes
app.use('/api/auth', authRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`✅ Cinevo server running on http://localhost:${PORT}`);
    console.log(`   Using local SQLite database (no cloud DB needed)`);
});
