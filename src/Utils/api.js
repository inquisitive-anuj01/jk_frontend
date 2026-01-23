import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Vehicle APIs
export const vehicleAPI = {
    // Search vehicles with fare calculation
    searchVehiclesWithFare: async (data) => {
        const response = await api.post("/api/vehicles/search", data);
        return response.data;
    },

    // Get single vehicle
    getVehicle: async (id) => {
        const response = await api.get(`/api/vehicles/${id}`);
        return response.data;
    },
};

// Payment APIs
export const paymentAPI = {
    // Create payment intent
    createPaymentIntent: async (data) => {
        const response = await api.post("/api/payments/create-intent", data);
        return response.data;
    },

    // Get payment status  
    getPaymentStatus: async (paymentIntentId) => {
        const response = await api.get(`/api/payments/status/${paymentIntentId}`);
        return response.data;
    },
};

// Booking APIs (called after payment is complete)
export const bookingAPI = {
    // Create booking (after successful payment)
    createBooking: async (data) => {
        const response = await api.post("/api/bookings", data);
        return response.data;
    },

    // Get booking by ID
    getBooking: async (id) => {
        const response = await api.get(`/api/bookings/${id}`);
        return response.data;
    },

    // Update booking status
    updateBookingStatus: async (id, data) => {
        const response = await api.patch(`/api/bookings/${id}/status`, data);
        return response.data;
    },

    // Get all bookings (admin)
    getAllBookings: async (params = {}) => {
        const response = await api.get("/api/bookings", { params });
        return response.data;
    },

    // Delete booking (admin)
    deleteBooking: async (id) => {
        const response = await api.delete(`/api/bookings/${id}`);
        return response.data;
    },
};

// Extras APIs
export const extrasAPI = {
    // Get all extras
    getExtras: async () => {
        const response = await api.get("/api/extras");
        return response.data;
    },
};

// Admin APIs
export const adminAPI = {
    // Admin login
    login: async (email, password) => {
        const response = await api.post("/api/admin/login", { email, password });
        return response.data;
    },

    // Verify admin token
    verify: async () => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            throw new Error("No token found");
        }
        const response = await api.get("/api/admin/verify", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    // Get dashboard stats
    getStats: async () => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            throw new Error("No token found");
        }
        const response = await api.get("/api/admin/stats", {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    // Logout (clear token from localStorage)
    logout: () => {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminInfo");
    },
};

export default api;
