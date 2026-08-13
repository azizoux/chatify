import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";
import {
  getPlayerPions,
  isAlignedY,
  isAlignedX,
  getEmptyCases,
} from "../lib/agrah";

export const useGameStore = create((set, get) => ({
  myGames: [],
  selectedGame: null,
  selectedGameAdversor: null,
  selectedCell: null,
  isGameLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setSelectedGame: (game) => set({ selectedGame: game }),
  setSelectedGameAdversor: (game) => {
    if (!game) {
      set({ selectedGameAdversor: null });
      return;
    }
    const playerIds = game.id.split("_");
    set({
      selectedGameAdversor:
        playerIds[0] === useAuthStore.getState().authUser._id.toString()
          ? {
              id: playerIds[1],
              fullName: game.users[1].username,
            }
          : {
              id: playerIds[0],
              fullName: game.users[0].username,
            },
    });
  },
  getMyGames: async () => {
    set({ isGameLoading: true });
    try {
      const { data } = await axiosInstance.get("/games/my-games");
      if (data.success) {
        console.log("Data:", data.myParties);
        set({ myGames: data.myParties });
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error in getMyGames zustand:", error);
    } finally {
      set({ isGameLoading: false });
    }
  },

  toggleSelectCell: (cell) => {
    const { selectedGame, unCheckValidMove } = get();

    if (!selectedGame) return;

    const newPions = selectedGame.pions.map((pion) =>
      pion.id === cell.id
        ? { ...pion, isSelected: !pion.isSelected }
        : { ...pion, isSelected: false },
    );

    set({
      selectedGame: {
        ...selectedGame,
        pions: newPions,
      },
    });
    if (!get().selectedCell) {
      set({ selectedCell: cell });
    } else {
      set({ selectedCell: null });
      unCheckValidMove();
    }
  },

  checkValidMove: (cell) => {
    const { selectedGame } = get();

    if (!selectedGame) return;

    if (getEmptyCases(cell.id, selectedGame).length > 0) {
      const newPions = selectedGame.pions.map((pion) =>
        pion.id === cell.id ? { ...pion, isValidMove: true } : pion,
      );
      set({
        selectedGame: {
          ...selectedGame,
          pions: newPions,
        },
      });
    }
  },

  unCheckValidMove: () => {
    const { selectedGame } = get();

    if (!selectedGame) return;

    const newPions = selectedGame.pions.map((pion) => ({
      ...pion,
      isValidMove: false,
    }));
    set({
      selectedGame: {
        ...selectedGame,
        pions: newPions,
      },
    });
  },

  fillCell: (cell) => {
    const { selectedGame } = get();

    if (!selectedGame) return;
    if (
      isAlignedX(cell.id, selectedGame.party.tourId, selectedGame) ||
      isAlignedY(cell.id, selectedGame.party.tourId, selectedGame)
    ) {
      console.log("Not authorized - Filling");
      return;
    }

    const newPions = selectedGame.pions.map((pion) => {
      if (pion.id === cell.id) {
        return { ...pion, ownerId: selectedGame.party.tourId };
      } else {
        return pion;
      }
    });
    const newSelectedGame = {
      ...selectedGame,
      pions: newPions,
    };

    // toggle player tour
    newSelectedGame.party.tourId = newSelectedGame.party.tourId === 1 ? 2 : 1;

    if (
      getPlayerPions(1, newSelectedGame).length === 12 &&
      getPlayerPions(2, newSelectedGame).length === 12
    ) {
      newSelectedGame.party.isFilling = false;
      newSelectedGame.party.isMoving = true;
      console.log("Filling completed");
    }
    set({
      selectedGame: newSelectedGame,
    });
  },

  moveCell: (cell) => {
    const { selectedGame, selectedCell, toggleSelectCell, unCheckValidMove } =
      get();
    if (!selectedGame) return;

    const initialCell = selectedCell;
    const finalCell = cell;

    if (getEmptyCases(initialCell.id, selectedGame).includes(finalCell.id)) {
      const newPions = selectedGame.pions.map((pion) => {
        if (pion.id === initialCell.id) {
          return { ...pion, ownerId: 0 };
        } else if (pion.id === finalCell.id) {
          return { ...pion, ownerId: initialCell.ownerId };
        } else {
          return pion;
        }
      });
      const newSelectedGame = {
        ...selectedGame,
        pions: newPions,
      };
      // toggle player tour
      newSelectedGame.party.tourId = newSelectedGame.party.tourId === 1 ? 2 : 1;

      set({
        selectedGame: newSelectedGame,
      });

      toggleSelectCell(selectedCell);

      console.log("Cell moved success");
    } else {
      toggleSelectCell(selectedCell);
      console.log("Cell moving Error:");
    }
  },

  togglePlayerTour: () => {
    const { selectedGame } = get();

    if (!selectedGame) return;

    set({
      selectedGame: {
        ...selectedGame,
        party: {
          ...selectedGame.party,
          tourId: selectedGame.party.tourId === 1 ? 2 : 1,
        },
      },
    });
  },

  sendGame: async () => {},

  subcribeToGame: () => {},

  unsubscribeFromGame: () => {},
}));
