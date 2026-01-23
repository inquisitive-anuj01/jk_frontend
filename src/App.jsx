import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Booking from "./Pages/Booking";
import AdminLogin from "./Components/Admin/AdminLogin";
import AdminDashboard from "./Components/Admin/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Booking />} />

        {/* Admin Routes */}
        <Route path="/login-admin" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        
      </Routes>
    </Router>
  );
}

export default App;
