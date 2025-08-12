
import { create } from "zustand";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

type Role = "admin" | "driver" | "member";

type User = {
    id: string;
    name: string;
    lastName: string;
    phoneNumber: string;
    role: Role;
};

type AuthState = {
    authUser: User | null;
    token: string | null;
    phoneNumber: string;
    isStartingLogin: boolean;
    isVerifyingOtp: boolean;
    socket: any;
    onlineUsers: string[];

    startLogin: (phone: string) => Promise<void>;
    verifyOtp: (otp: string) => Promise<void>;
    logout: () => void;
    connectSocket: () => void;
    disconnectSocket: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => {
    const storedUser = localStorage.getItem("user");
    return {
        authUser: storedUser ? (JSON.parse(storedUser) as User) : null,
        token: localStorage.getItem("token"),
        phoneNumber: "",
        isStartingLogin: false,
        isVerifyingOtp: false,
        socket: null,
        onlineUsers: [],

        startLogin: async (phone: string) => {
            set({ isStartingLogin: true });
            try {
                const res = await fetch(`${BASE}/auth/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ phoneNumber: phone }),
                });
                if (!res.ok) throw new Error(await res.text());
                const data = await res.json();
                set({ phoneNumber: phone });
                toast.success("OTP sent successfully");
                if (data.devOtp) console.log("Dev OTP:", data.devOtp);
            } catch (err: any) {
                toast.error(err?.message || "Failed to send OTP");
            } finally {
                set({ isStartingLogin: false });
            }
        },

        verifyOtp: async (otp: string) => {
            const { phoneNumber } = get();
            if (!phoneNumber) {
                toast.error("Phone number missing. Start login first.");
                return;
            }
            set({ isVerifyingOtp: true });
            try {
                const res = await fetch(`${BASE}/auth/verify-otp`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ phoneNumber, otp }),
                });
                if (!res.ok) throw new Error(await res.text());
                const data = await res.json();
                set({ token: data.token, authUser: data.user });
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                toast.success("Logged in successfully");
                get().connectSocket();
            } catch (err: any) {
                toast.error(err?.message || "OTP verification failed");
            } finally {
                set({ isVerifyingOtp: false });
            }
        },

        logout: () => {
            set({ authUser: null, token: null, phoneNumber: "" });
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            toast.success("Logged out");
            get().disconnectSocket();
        },

        connectSocket: () => {
            const { authUser, socket } = get();
            if (!authUser || socket?.connected) return;

            const userId = (authUser as any)?.id ?? (authUser as any)?._id;
            const s = io(BASE, { query: { userId } });
            s.connect();

            s.on("getOnlineUsers", (userIds: string[]) => {
                set({ onlineUsers: userIds });
            });

            set({ socket: s });
        },

        disconnectSocket: () => {
            const { socket } = get();
            if (socket?.connected) socket.disconnect();
            set({ socket: null });
        },
    };
});
