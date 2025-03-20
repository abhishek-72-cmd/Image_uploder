import express from "express";

import {getUserImages} from "../controllers/getUserImages";

const router = express.Router();

router.get("/getimages/:userId", getUserImages );

export default router;














//router.get("/user/:userId", getUserImages);