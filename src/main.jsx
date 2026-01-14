import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import FreelancerDashboard from "./pages/FreelancerDashboard.jsx";
import ClientDashboard from "./pages/ClientDashboard.jsx";
import FrontPage from "./pages/FrontPage.jsx";
import GigBids from "./pages/GigBids.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FrontPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/freelancer-dashboard"
          element={
            <ProtectedRoute>
              <FreelancerDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/client-dashboard"
          element={
            <ProtectedRoute>
              <ClientDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/gigs/:gigId/bids"
          element={<GigBids />}
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
