import express from "express";
import { signup, login } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.get("/signin", login);

export default router;
