import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const { data } = await axiosInstance.get("/auth/check");
      if (data.success) {
        set({ authUser: data.user });
        get().connectSocket();
      } else {
        throw Error("Error in authCheck zustand");
      }
    } catch (error) {
      console.log("Error in authCheck:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (body) => {
    set({ isSigningUp: true });
    try {
      const { data } = await axiosInstance.post("/auth/signup", body);
      if (data.success) {
        set({ authUser: data.user });
        toast.success(data.message);
        get().connectSocket();
      } else {
        toast.error(data.message);
        console.log(data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error in signup zustand:", error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (body) => {
    set({ isLoggingIn: true });
    try {
      const { data } = await axiosInstance.post("/auth/login", body);
      if (data.success) {
        set({ authUser: data.user });
        toast.success(data.message);
        get().connectSocket();
      } else {
        toast.error(data.message);
        console.log(data);
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error in login zustand:", error);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    set({ isUpdatingProfile: true });
    try {
      const { data } = await axiosInstance.post("/auth/logout");
      if (data.success) {
        set({ authUser: null });
        toast.success(data.message);
        get().disconnectSocket();
      } else {
        throw Error("Error logging out");
      }
    } catch (error) {
      console.log("Error logging out:", error);
      toast.error("Error logging out");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  updateProfile: async (body) => {
    try {
      const { data } = await axiosInstance.put("/auth/update-profile", body);
      if (data.success) {
        set({ authUser: data.user });
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log("Error in updateProfile zustand:", error);
      toast.error(error.response.data.message);
    }
  },

  connectSocket: () => {
    console.log("BASE_URL:", BASE_URL);
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      withCredentials: true, // this ensures cookies are send with the connection
    });

    // socket.connect();

    set({ socket });
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });

    // listen for online users event
    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));
