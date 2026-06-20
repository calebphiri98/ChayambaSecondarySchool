import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: true, // Mandatory structural check for Neon Cloud Server environments
  },
});

pool.on('connect', () => {
  console.log('⚡ Connected safely to the Neon cloud PostgreSQL database service Layer.');
});

export const query = (text, params) => pool.query(text, params);
export default pool;
