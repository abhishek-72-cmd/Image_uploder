import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import uploadRoutes from "./routes/uploadRoutes"
import deleteRoutes from "./routes/deteteRoutes"
import imageRoutes from "./routes/imageRoutes"

dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Allow form data
// Routes
app.use("/api/auth", authRoutes);
app.use("/api", uploadRoutes)
app.use("/api", deleteRoutes)
app.use("/api", imageRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
