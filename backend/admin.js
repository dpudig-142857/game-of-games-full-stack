import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import pool from '../server.js';
dotenv.config();

const run = async () => {
    const password = 'password';//process.env.PASSWORD;
    const hash = await bcrypt.hash(password, 12);

    /*await pool.query(`
        INSERT INTO accounts (username, password_hash, role, avatar_seed)
        VALUES ($1, $2, 'admin', 'https://api.dicebear.com/9.x/fun-emoji/svg?seed=Emery&radius=50&backgroundColor=ff0000')
    `, ['DanTheMan', hash]);*/
    console.log(hash);

    console.log('Admin user created');
    process.exit();
};

run();