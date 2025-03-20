import express from "express";

import { deleteImage } from "../controllers/deleteImage";

const router = express.Router();

router.delete("/delete/:imageId", deleteImage);

export default router;
