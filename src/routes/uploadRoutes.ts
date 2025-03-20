import express from "express";
import upload from "../config/multerConfig"; // Import multerConfig
import { uploadImage } from "../controllers/uploadController"; // 

const router = express.Router();

router.post("/upload/:userId", upload.single("image"), async (req, res) => {
    try {
        await uploadImage(req, res);
    } catch (err) {
        console.error("Error in uploadImage:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;