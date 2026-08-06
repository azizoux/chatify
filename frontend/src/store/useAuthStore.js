import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,

  checkAuth: async () => {
    try {
      const { data } = await axiosInstance.get("/auth/check");
      if (data.success) {
        set({ authUser: data.user });
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
}));
