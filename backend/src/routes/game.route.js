import express from "express";
import {
  createGame,
  deleteGame,
  getMyGames,
  getGameByAdversorId,
} from "../controllers/game.controller.js";

import { protectedRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create/:id", protectedRoute, createGame);
router.get("/my-games", protectedRoute, getMyGames);
router.get("/get-game/:id", protectedRoute, getGameByAdversorId);
router.delete("/delete", deleteGame);

export default router;
