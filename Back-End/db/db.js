import pkg from 'pg';
const { Pool } = pkg;
import "dotenv/config";

// Create a new connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test the database connection
const connectToDatabase = async () => {
  try {
    const client = await pool.connect();
    console.log("Database connection established");
    client.release(); // Release the client back to the pool
  } catch (error) {
    console.error("Connection failed: " + error);
  }
};

connectToDatabase();


export default pool;