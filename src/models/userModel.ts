import pool from "../config/db";

export const findUserByEmail = async (email: string) => {
    try {
      const [rows]: any = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(" Error in findUserByEmail:", error);
      throw error;
    }
  };
  
  export const createUser = async (email: string, hashedPassword: string) => {
    try {
      const result = await pool.query("INSERT INTO users (email, password) VALUES (?, ?)", [email, hashedPassword]);
      return result;
    } catch (error) {
      console.error(" Error in createUser:", error);
      throw error;
    }
  };