import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Booking from "./Pages/Booking";
import AdminLogin from "./Components/Admin/AdminLogin";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import AdminAllBookings from "./Components/Admin/AdminAllBookings";
import AdminAllLeads from "./Components/Admin/AdminAllLeads";
import AdminAllCars from "./Components/Admin/AdminAllCars";
import AdminAddCar from "./Components/Admin/AdminAddCar";
import AdminPricing from "./Components/Admin/AdminPricing";
import AdminAllPricing from "./Components/Admin/AdminAllPricing";
import AdminAllLocations from "./Components/Admin/AdminAllLocations";
import AdminAddLocation from "./Components/Admin/AdminAddLocation";
import AdminLocationPricing from "./Components/Admin/AdminLocationPricing";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Booking />} />

        {/* Admin Routes */}
        <Route path="/login-admin" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/leads" element={<AdminAllLeads />} />
        <Route path="/admin/bookings" element={<AdminAllBookings />} />
        <Route path="/admin/vehicles" element={<AdminAllCars />} />
        <Route path="/admin/add-car" element={<AdminAddCar />} />
        <Route path="/admin/pricing" element={<AdminPricing />} />
        <Route path="/admin/all-pricing" element={<AdminAllPricing />} />

        {/* Location Routes */}
        <Route path="/admin/locations" element={<AdminAllLocations />} />
        <Route path="/admin/add-location" element={<AdminAddLocation />} />
        <Route path="/admin/edit-location/:id" element={<AdminAddLocation />} />
        <Route path="/admin/location-pricing/:locationId" element={<AdminLocationPricing />} />

      </Routes>
    </Router>
  );
}

export default App;

