import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Booking from "./Pages/Booking";
import AdminLogin from "./Pages/AdminLogin";
import AdminDashboard from "./Pages/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Booking />} />
        <Route path="/login-admin" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
