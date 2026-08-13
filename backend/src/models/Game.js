import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    parties: [{ type: Object }],
  },
  { timestamps: true, minimize: false },
);

const Game = mongoose.model("Game", gameSchema);

export default Game;
