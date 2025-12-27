export const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export async function asJson<T>(res: Response): Promise<T> {
    if (!res.ok) {
        let e = {};
        try {
            e = await res.json();
        } catch (err) {
            // Failed to parse json error body; ignore
        }

        const errorMessage =
            (e && typeof (e as any).error === "string" && (e as any).error) ||
            (e && typeof (e as any).message === "string" && (e as any).message) ||
            `HTTP ${res.status}`;

        throw new Error(errorMessage);
    }
    return res.json();
}
