import User from "../models/User.js";
import Game from "../models/Game.js";
import { data } from "../constants/data.js";
import { ENV } from "../lib/env.js";

export const createGame = async (req, res) => {
  const myId = req.user._id;
  const { id: adversorId } = req.params;

  try {
    // Vérifier l'adversaire
    const adversorUser = await User.findById(adversorId).select("-password");

    if (!adversorUser) {
      return res.status(404).json({
        success: false,
        message: "Adversor not found",
      });
    }

    // Récupérer la table des parties
    const partiesTable = await Game.findById(ENV.PARTY_TABLE_ID);

    if (!partiesTable) {
      return res.status(404).json({
        success: false,
        message: "Party table not found",
      });
    }

    const myIdString = myId.toString();
    const adversorIdString = adversorUser._id.toString();

    const partyId = `${myIdString}_${adversorIdString}`;
    const reversePartyId = `${adversorIdString}_${myIdString}`;

    // Vérifier si une partie existe déjà
    const existingParty = partiesTable.parties.find(
      (party) => party.id === partyId || party.id === reversePartyId,
    );

    if (existingParty) {
      return res.status(400).json({
        success: false,
        message: "Party already exists",
      });
    }

    // Créer la nouvelle partie
    const newParty = {
      id: partyId,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Définir les joueurs
    newParty.users[0].id = myId;
    newParty.users[0].username = req.user.fullName;

    newParty.users[1].id = adversorUser._id;
    newParty.users[1].username = adversorUser.fullName;

    // Définir le tour initial
    newParty.party.tourId = myId;

    // Ajouter la partie
    partiesTable.parties.push(newParty);

    await partiesTable.save();

    return res.status(201).json({
      success: true,
      message: "Game created successfully",
      party: newParty,
    });
  } catch (error) {
    console.error("Error in createGame controller:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getMyGames = async (req, res) => {
  const myId = req.user._id.toString();

  try {
    const partiesTable = await Game.findById(ENV.PARTY_TABLE_ID);

    if (!partiesTable) {
      return res.status(404).json({
        success: false,
        message: "Party table not found",
      });
    }

    const myParties = partiesTable.parties.filter((party) => {
      const partyIds = party.id.split("_");
      return partyIds.includes(myId);
    });

    return res.status(200).json({
      success: true,
      myParties,
    });
  } catch (error) {
    console.error("Error in getMyGames controller:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getGameByAdversorId = async (req, res) => {
  try {
    const myId = req.user._id.toString();
    const { id: adversorId } = req.params;

    const partyId = `${myId}_${adversorId}`;
    const reversePartyId = `${adversorId}_${myId}`;

    const partiesTable = await Game.findById(ENV.PARTY_TABLE_ID);

    if (!partiesTable) {
      return res.status(404).json({
        success: false,
        message: "Party table not found",
      });
    }

    const party = partiesTable.parties.find(
      (party) => party.id === partyId || party.id === reversePartyId,
    );

    if (!party) {
      return res.status(404).json({
        success: false,
        message: "Party not found",
      });
    }

    return res.status(200).json({
      success: true,
      party,
    });
  } catch (error) {
    console.error("Error in getGameByAdversorId controller:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const deleteGame = (req, res) => {
  res.status(200).json({ success: true, message: "deleteGame" });
};
