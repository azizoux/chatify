import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: localStorage.getItem("isSoundEnabled") === true,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (user) => set({ selectedUser: user }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const { data } = await axiosInstance.get("/messages/contacts");
      if (data.success) {
        set({ allContacts: data.users });
      }
    } catch (error) {
      toast.error("error.message.data.message");
      console.log("Error in getAllContacts zustand:", error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const { data } = await axiosInstance.get("/messages/chats");
      if (data.success) {
        set({ chats: data.chatPartners });
      }
    } catch (error) {
      toast.error("error.message.data.message");
      console.log("Error in getMyChatPartners zustand:", error);
    } finally {
      set({ isUsersLoading: false });
    }
  },
}));
