import { Request, Response } from "express";
import db from "../config/db";
import cloudinary from "../config/cloudinary";

export const deleteImage = async (req: Request, res: Response): Promise<void> => {
    try {
        const imageId = req.params.imageId;

    
        const [rows]: any = await db.query("SELECT image_url FROM user_images WHERE id = ?", [imageId]);

        if (!rows.length) {

            return
           res.status(404).json({ message: "Image not found" });
        }

        const imageUrl = rows[0].image_url;
        const publicIdMatch = imageUrl.match(/\/user_uploads\/([^/.]+)/);
        const publicId = publicIdMatch ? publicIdMatch[1] : null;

        if (!publicId) {
            return 
            res.status(500).json({ message: "Failed to extract Cloudinary public ID" });
        }

        
        await cloudinary.uploader.destroy(`user_uploads/${publicId}`);

 
        await db.query("DELETE FROM user_images WHERE id = ?", [imageId]);

        res.json({ message: "Image deleted successfully" });
    } catch (error) {
        console.error("Delete Image Error:", error);
        res.status(500).json({ message: "Failed to delete image" });
    }
};
