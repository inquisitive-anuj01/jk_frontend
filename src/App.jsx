import React, { useEffect } from "react";

import Lenis from "lenis";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./Pages/Home";
import Booking from "./Pages/Booking";
import Services from "./Pages/Services";
import ServiceWrapper from "./Pages/ServiceWrapper";
import Fleet from "./Pages/Fleet";
import FleetDetail from "./Pages/FleetDetail";
import EventWrapper from "./Pages/EventWrapper";
import Blog from "./Pages/Blog";
import BlogWrapper from "./Pages/BlogWrapper";
import AboutUs from "./Pages/AboutUs";
import ContactUs from "./Pages/ContactUs";
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

  useEffect(() => {
    const lenis = new Lenis();
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }, []);


  return (
    <Router>
      <Routes>
        {/* Public Routes with Layout */}
        <Route path="/" element={<Layout isHeroPage={true}><Home /></Layout>} />
        <Route path="/booking" element={<Layout isHeroPage={false} headerTheme="light"><Booking /></Layout>} />
        <Route path="/services" element={<Layout isHeroPage={false}><Services /></Layout>} />
        <Route path="/services/:slug" element={<Layout isHeroPage={false}><ServiceWrapper /></Layout>} />
        <Route path="/fleet" element={<Layout isHeroPage={false}><Fleet /></Layout>} />
        <Route path="/fleet/:slug" element={<Layout isHeroPage={false}><FleetDetail /></Layout>} />
        <Route path="/events/:slug" element={<Layout isHeroPage={false}><EventWrapper /></Layout>} />
        <Route path="/blog" element={<Layout isHeroPage={false}><Blog /></Layout>} />
        <Route path="/blog/:slug" element={<Layout isHeroPage={false}><BlogWrapper /></Layout>} />
        <Route path="/about" element={<Layout isHeroPage={false}><AboutUs /></Layout>} />
        <Route path="/contact" element={<Layout isHeroPage={false}><ContactUs /></Layout>} />

        {/* Admin Routes (no layout wrapper) */}
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
