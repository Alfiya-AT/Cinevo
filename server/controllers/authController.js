import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'cinevo_dev_secret_key_change_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export const signup = async (req, res) => {
    try {
        const { full_name, email, password, plan } = req.body;

        // 1. Validate inputs
        if (!full_name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // 2. Check password strength
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters'
            });
        }

        // 3. Check if email already exists
        const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered. Please sign in instead.'
            });
        }

        // 4. Hash the password
        const password_hash = await bcrypt.hash(password, 12);

        // 5. Insert user into SQLite
        const insertUser = db.prepare(
            'INSERT INTO users (full_name, email, password_hash, plan) VALUES (?, ?, ?, ?)'
        );
        const result = insertUser.run(full_name, email, password_hash, plan || 'basic');
        const userId = result.lastInsertRowid;

        // 6. Auto-create default profile
        db.prepare(
            'INSERT INTO profiles (user_id, profile_name, avatar) VALUES (?, ?, ?)'
        ).run(userId, full_name.split(' ')[0], '🎬');

        // 7. Generate JWT Token
        const token = jwt.sign(
            { userId, email, plan: plan || 'basic' },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            token,
            user: {
                id: userId,
                full_name,
                email,
                plan: plan || 'basic',
                avatar: '🎬'
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during signup. Please try again.'
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate inputs
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // 2. Fetch user from SQLite
        const user = db.prepare(
            'SELECT id, full_name, email, password_hash, plan, avatar FROM users WHERE email = ?'
        ).get(email);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // 3. Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // 4. Update last login timestamp
        db.prepare('UPDATE users SET updated_at = datetime(\'now\') WHERE id = ?').run(user.id);

        // 5. Generate JWT Token
        const token = jwt.sign(
            { userId: user.id, email: user.email, plan: user.plan },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                plan: user.plan,
                avatar: user.avatar
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during login. Please try again.'
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const user = db.prepare(
            'SELECT id, full_name, email, plan, avatar FROM users WHERE id = ?'
        ).get(req.user.userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('GetProfile error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const logout = async (req, res) => {
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};
