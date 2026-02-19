import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.AIVEN_HOST,
    port: process.env.AIVEN_PORT,
    user: process.env.AIVEN_USER,
    password: process.env.AIVEN_PASSWORD,
    database: process.env.AIVEN_DATABASE,
    ssl: { rejectUnauthorized: true },
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

export default pool;
