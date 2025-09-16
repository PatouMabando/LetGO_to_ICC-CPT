// src/lib/api.ts
import axios from "axios";

/** 1) Instance axios — pourquoi ?
 * - `baseURL` unique pour éviter de répéter "http://localhost:5000"
 * - plus tard, tu peux ajouter des intercepteurs (auth, logs, retry)
 */
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
export const api = axios.create({ baseURL: API_BASE });

/** 2) Types DTO — pourquoi ?
 * - Séparer les *types du front* de tes *modèles Mongoose du back*
 * - Évite les collisions de noms (ex: Booking côté back déjà utilisé par Mongoose)
 */
export type BookingDTO = {
  _id: string;
  member: string;           // ObjectId du user
  pickupAddress: string;
  destination: string;
  serviceDate: string;      // ISO string
  selectedTime: string;
  status: "pending" | "confirmed" | "assigned" | "completed" | "cancelled";
  driver?: string;          // optionnel, quand tu l’ajouteras
  createdAt: string;
  updatedAt: string;
};

/** 3) Fonctions d’API — pourquoi ?
 * - Encapsuler chaque endpoint dans une fonction claire
 * - Centraliser les erreurs/headers ici (pas dans chaque page)
 */
export async function getNextSundayBooking(memberId: string) {
  const { data } = await api.get<BookingDTO | null>(`/api/bookings/next/${memberId}`);
  return data;
}

export async function createNextSundayBooking(input: {
  memberId: string;
  selectedTime: string;
  pickupAddress: string;
}) {
  const { data } = await api.post<BookingDTO>(`/api/bookings/next`, input);
  return data;
}
// Optionnel: intercepteur pour logguer les erreurs (à mettre dans api.ts)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API error:", err?.response?.status, err?.response?.data || err.message);
    return Promise.reject(err);
  }
);
