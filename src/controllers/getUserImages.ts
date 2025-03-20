import {Request, Response} from "express";
import db from "../config/db"

export const getUserImages = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params; // Get userId from request params
  
      const query = "SELECT * FROM user_images WHERE user_id = ?";
      const [images] = await db.execute(query, [userId]);
  
      res.status(200).json(images);
    } catch (error) {
      console.error("Error fetching images:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };