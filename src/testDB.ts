import pool from "./config/db";

const testDB = async () => {
  try {
    const connection = await pool.getConnection();
    console.log(" MySQL Database Connected!");
    connection.release();
  } catch (error) {
    console.error(" Database Connection Error:", error);
  }
};

testDB();
