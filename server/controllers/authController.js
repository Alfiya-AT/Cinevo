import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/aiven.js';

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
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                message: 'Password must be 8+ chars with uppercase, lowercase, number & special character'
            });
        }

        // 3. Check if email exists
        const [existingUser] = await pool.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );
        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // 4. ENCODE PASSWORD → Hash with bcrypt salt rounds 12
        const saltRounds = 12;
        const salt = await bcrypt.genSalt(saltRounds);
        const password_hash = await bcrypt.hash(password, salt);

        // 5. Store in Aiven database
        const [result] = await pool.execute(
            'INSERT INTO users (full_name, email, password_hash, plan) VALUES (?, ?, ?, ?)',
            [full_name, email, password_hash, plan || 'basic']
        );

        // 6. Auto-create default profile
        await pool.execute(
            'INSERT INTO profiles (user_id, profile_name, avatar) VALUES (?, ?, ?)',
            [result.insertId, full_name.split(' ')[0], '🎬']
        );

        // 7. Generate JWT Token
        const token = jwt.sign(
            {
                userId: result.insertId,
                email: email,
                plan: plan
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            token,
            user: {
                id: result.insertId,
                full_name,
                email,
                plan: plan || 'basic'
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during signup'
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

        // 2. Fetch user from Aiven DB
        const [users] = await pool.execute(
            'SELECT id, full_name, email, password_hash, plan, avatar FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = users[0];

        // 3. DECODE/COMPARE PASSWORD
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // 4. Generate JWT Token
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                plan: user.plan
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        // 5. Update last login
        await pool.execute(
            'UPDATE users SET updated_at = NOW() WHERE id = ?',
            [user.id]
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
            message: 'Server error during login'
        });
    }
};

export const getProfile = async (req, res) => {
    try {
        const [users] = await pool.execute(
            'SELECT id, full_name, email, plan, avatar FROM users WHERE id = ?',
            [req.user.userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            user: users[0]
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const logout = async (req, res) => {
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};
