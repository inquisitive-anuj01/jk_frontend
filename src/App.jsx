import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Booking from "./Pages/Booking";
import AdminLogin from "./Components/Admin/AdminLogin";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import AdminAllBookings from "./Components/Admin/AdminAllBookings";
import AdminAllLeads from "./Components/Admin/AdminAllLeads";

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

      </Routes>
    </Router>
  );
}

export default App;

