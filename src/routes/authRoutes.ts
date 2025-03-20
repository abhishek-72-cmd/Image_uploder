import express, { Request, Response } from "express";
import { register, login } from "../controllers/authController";

const router = express.Router();

router.post("/login", (req: Request, res: Response) => {
  login(req, res);
});

router.post("/register", (req: Request, res: Response) => {
  register(req, res);
});

export default router;
