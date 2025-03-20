

import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import db from "../config/db";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// Configure multer with Cloudinary storage
export const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "user_uploads", // Store uploaded images in this Cloudinary folder
    format: async (_req: Request, _file: Express.Multer.File) => "png", // Define file format
    public_id: (_req: Request, file: Express.Multer.File) => `${Date.now()}-${file.originalname}`,
  } as unknown as { folder: string }, // Type assertion to fix TS error
});

const upload = multer({ storage }).single("image");

// ✅ Upload Image API
export const uploadImage = async (req: Request, res: Response): Promise<void> => {
  try {

    console.log("Request Headers:", req.headers);
    console.log("Request Params:", req.params);
    console.log("Request Body:", req.body);


    if (!req.file) {
      res.status(400).json({ message: "No file uploaded" });
      return;
    }

    // ✅ Get userId from request PAARAMS
    const userId = req.params.userId; 
    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    // Convert Buffer to Base64 for Cloudinary Upload
    const fileBase64 = req.file.buffer.toString("base64");

    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(`data:image/png;base64,${fileBase64}`, {
      folder: "user_uploads",
      use_filename: true,
      unique_filename: false,
    });

    if (!result.secure_url) {
      res.status(500).json({ message: "Cloudinary upload failed" });
      return;
    }

    console.log("Cloudinary URL:", result.secure_url); // Debugging

    //  Save image URL in MySQL database
    const sql = "INSERT INTO user_images (user_id, image_url) VALUES (?, ?)";
    const [insertResult] = await db.execute(sql, [userId, result.secure_url]);

    console.log("Insert Result:", insertResult); // Debugging

    res.status(200).json({
      message: "File uploaded successfully",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ message: "File upload failed", error });
  }
};
//  Fetch User's Uploaded Images API
export const getUserImages = async (req: Request, res: Response) => {
  try {
    const { user_id } = req.params;
    const sql = "SELECT id, image_url FROM user_images WHERE user_id = ?";
    const [rows]: any = await db.query(sql, [user_id]);

    if (!rows.length) return res.status(404).json({ message: "No images found" });

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error fetching images:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//  Delete Image API
export const deleteImage = async (req: Request, res: Response) => {
  try {
    const { imageId } = req.params;

    // Fetch the image URL from the database
    const [rows]: any = await db.query("SELECT image_url FROM user_images WHERE id = ?", [imageId]);
    if (rows.length === 0) return res.status(404).json({ message: "Image not found" });

    const imageUrl = rows[0].image_url;
    const publicId = imageUrl.split("/").pop()?.split(".")[0]; // Extract Cloudinary public_id

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(`user_uploads/${publicId}`);

    // Delete from MySQL
    await db.query("DELETE FROM user_images WHERE id = ?", [imageId]);

    res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    res.status(500).json({ message: "Image deletion failed" });
  }
};
