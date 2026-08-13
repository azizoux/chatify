import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = (userId, res) => {
  const { JWT_SECRET, NODE_ENV } = ENV;
  if (!JWT_SECRET) throw Error("JWT_SECRET is not set");

  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // prevent XSS attacks: cross-site acripting
    sameSite: "lax", // CSRF attacks
    secure: NODE_ENV === "production",
  });
  return token;
};

export const getParties = async (req, res) => {
  // Récupérer la table des parties
  const partiesTable = await Game.findById(ENV.PARTY_TABLE_ID);
  if (!partiesTable) {
    return res.status(404).json({
      success: false,
      message: "Party table not found",
    });
    return partiesTable;
  }
};
