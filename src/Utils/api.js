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

    // Create vehicle (admin)
    createVehicle: async (formData) => {
        const response = await api.post("/api/vehicles", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    },

    // Get all vehicles (admin)
    getAllVehicles: async (params = {}) => {
        const response = await api.get("/api/vehicles", { params });
        return response.data;
    },

    // Update vehicle (admin)
    updateVehicle: async (id, data) => {
        const response = await api.put(`/api/vehicles/${id}`, data, {
            headers: { "Content-Type": "multipart/form-data" }
        });
        return response.data;
    },

    // Delete vehicle (admin)
    deleteVehicle: async (id) => {
        const response = await api.delete(`/api/vehicles/${id}`);
        return response.data;
    },

    // Toggle vehicle status (admin)
    toggleVehicleStatus: async (id) => {
        const response = await api.patch(`/api/vehicles/${id}/toggle-status`);
        return response.data;
    },
};

// Pricing APIs
export const pricingAPI = {
    // Get all pricing configurations
    getAllPricing: async (params = {}) => {
        const response = await api.get("/api/pricing", { params });
        return response.data;
    },

    // Get pricing for a specific vehicle
    getVehiclePricing: async (vehicleId) => {
        const response = await api.get(`/api/pricing/vehicle/${vehicleId}`);
        return response.data;
    },

    // Set P2P pricing for a vehicle
    setP2PPricing: async (vehicleId, data) => {
        const response = await api.put(`/api/pricing/vehicle/${vehicleId}/p2p`, data);
        return response.data;
    },

    // Set Hourly pricing for a vehicle
    setHourlyPricing: async (vehicleId, data) => {
        const response = await api.put(`/api/pricing/vehicle/${vehicleId}/hourly`, data);
        return response.data;
    },

    // Delete pricing configuration
    deletePricing: async (id) => {
        const response = await api.delete(`/api/pricing/${id}`);
        return response.data;
    },
};

// Location (Airport) APIs
export const locationAPI = {
    // Get all locations
    getAll: async (params = {}) => {
        const response = await api.get("/api/airports", { params });
        return response.data;
    },

    // Get single location
    getById: async (id) => {
        const response = await api.get(`/api/airports/${id}`);
        return response.data;
    },

    // Create location
    create: async (data) => {
        const response = await api.post("/api/airports", data);
        return response.data;
    },

    // Update location
    update: async (id, data) => {
        const response = await api.put(`/api/airports/${id}`, data);
        return response.data;
    },

    // Delete location
    delete: async (id) => {
        const response = await api.delete(`/api/airports/${id}`);
        return response.data;
    },

    // Search locations
    search: async (query) => {
        const response = await api.get("/api/airports/search", { params: { q: query } });
        return response.data;
    },
};

// Location Pricing APIs
export const locationPricingAPI = {
    // Get all location pricing
    getAll: async (params = {}) => {
        const response = await api.get("/api/airport-pricing", { params });
        return response.data;
    },

    // Get pricing for a specific location
    getByLocation: async (airportId) => {
        const response = await api.get(`/api/airport-pricing/airport/${airportId}`);
        return response.data;
    },

    // Get pricing for a specific vehicle
    getByVehicle: async (vehicleId) => {
        const response = await api.get(`/api/airport-pricing/vehicle/${vehicleId}`);
        return response.data;
    },

    // Create or update location pricing
    create: async (data) => {
        const response = await api.post("/api/airport-pricing", data);
        return response.data;
    },

    // Update location pricing
    update: async (id, data) => {
        const response = await api.put(`/api/airport-pricing/${id}`, data);
        return response.data;
    },

    // Delete location pricing
    delete: async (id) => {
        const response = await api.delete(`/api/airport-pricing/${id}`);
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
