import pg from 'pg';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
dotenv.config();

const pool = new pg.Pool({
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  host: process.env.PG_HOST,
  port: process.env.PG_PORT,
  database: process.env.PG_DATABASE,
});

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