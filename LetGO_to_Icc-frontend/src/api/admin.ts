import { BASE, asJson } from "./index";

function authHeaders(token: string | null) {
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
}

export type Status = "pending" | "approved" | "blocked";

export type Member = {
    id: string;
    fullName: string;
    name: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    status: Status;
};

export type Driver = {
    id: string;
    fullName: string;
    name: string;
    lastName: string;
    phoneNumber: string;
    address: string;
    status: Status;
    availability: string; // "available" | "not_available"
    car_model: string;
    car_plate: string;
    car_year: string;
};

export type Admin = {
    id: string;
    fullName: string;
    name: string;
    lastName: string;
    phoneNumber: string;
    status: Status;
};

export type Stats = {
    approvedMembers: number;
    approvedDrivers: number;
    pendingDrivers: number;
    pendingMembers: number;
    pendingAdmins: number;
};

export const adminApi = {
    getMembers(token: string | null) {
        return fetch(`${BASE}/api/admin/members`, { headers: authHeaders(token) }).then(asJson<Member[]>);
    },
    getDrivers(token: string | null) {
        return fetch(`${BASE}/api/admin/drivers`, { headers: authHeaders(token) }).then(asJson<Driver[]>);
    },
    getAdmins(token: string | null) {
        return fetch(`${BASE}/api/admin/admins`, { headers: authHeaders(token) }).then(asJson<Admin[]>);
    },
    getStats(token: string | null) {
        return fetch(`${BASE}/api/admin/stats`, { headers: authHeaders(token) }).then(asJson<Stats>);
    },
    setUserStatus(token: string | null, id: string, status: Status) {
        return fetch(`${BASE}/api/admin/user/${id}/status`, {
            method: "PATCH",
            headers: authHeaders(token),
            body: JSON.stringify({ status }),
        }).then(asJson<{ message: string }>);
    },
    deleteUser(token: string | null, id: string) {
        return fetch(`${BASE}/api/admin/user/${id}`, {
            method: "DELETE",
            headers: authHeaders(token),
        }).then(asJson<{ message: string }>);
    },
    setDriverAvailability(token: string | null, id: string, availability: string) {
        return fetch(`${BASE}/api/admin/driver/${id}/availability`, {
            method: "PATCH",
            headers: authHeaders(token),
            body: JSON.stringify({ availability }),
        }).then(asJson<{ message: string }>);
    },
    addUser(token: string | null, data: { name: string; lastName: string; phoneNumber: string; role: string }) {
        return fetch(`${BASE}/api/admin/user`, {
            method: "POST",
            headers: authHeaders(token),
            body: JSON.stringify(data),
        }).then(asJson<{ message: string; user: Member | Driver | Admin }>);
    },
};
