import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled);
    set({ isSoundEnabled: !get().isSoundEnabled });
  },

  setActiveTab: (tab) => {
    if (tab === "game") set({ selectedUser: null });
    set({ activeTab: tab });
  },
  setSelectedUser: (user) => set({ selectedUser: user }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const { data } = await axiosInstance.get("/messages/contacts");
      if (data.success) {
        set({ allContacts: data.users });
      }
    } catch (error) {
      toast.error(error.response.data.message);
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
      toast.error(error.response.data.message);
      console.log("Error in getMyChatPartners zustand:", error);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessageByUserId: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const { data } = await axiosInstance.get(`/messages/${userId}`);
      if (data.success) {
        set({ messages: data.messages });
      } else {
        toast.error(data.message);
        console.error(data.message);
      }
    } catch (error) {
      console.log("Error in getMessageByUserId Zustand:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (body) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: body.text,
      image: body.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };
    // immediatly update the ui by adding the message
    set({ messages: [...messages, optimisticMessage] });
    try {
      const { data } = await axiosInstance.post(
        `/messages/send/${selectedUser?._id}`,
        body,
      );
      if (data.success) {
        set({ messages: messages.concat(data.message) });
      } else {
        toast(data.message);
        set({ messages: messages });
      }
    } catch (error) {
      set({ messages: messages });
      console.log("Error in sendMessage Zustand:", error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  },

  subcribeToMessage: () => {
    const { selectedUser, isSoundEnabled } = get();
    if (!selectedUser) return;

    const { socket } = useAuthStore.getState();

    socket.on("newMessage", (newMessage) => {
      const isMessageSendFromSelectedUser =
        newMessage.senderId === selectedUser._id;
      if (!isMessageSendFromSelectedUser) return;
      const currentMessages = get().messages;
      set({ messages: [...currentMessages, newMessage] });

      if (isSoundEnabled) {
        const notificationSound = new Audio("/sounds/notification.mp3");
        notificationSound.currentTime = 0; // reset to start
        notificationSound
          .play()
          .catch((e) => console.log("Audion play Failed:", e));
      }
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket.off("newMessage");
  },
}));
