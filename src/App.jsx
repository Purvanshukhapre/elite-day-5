import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/pages/login/login";
import Register from "./components/pages/signup/signup";
import Forgot from "./components/pages/forget/forget";
import Reset from "./components/pages/reset/reset";
import Dashboard from "./components/pages/dashboard/dashboard";
import Categories from "./components/pages/categories/categories";
import Reports from "./components/pages/reports/reports";
import LegalPolicy from "./components/pages/policy/policy";
import Location from "./components/pages/location/location";
import Rating from "./components/pages/rating/rating";
import ProtectedRoute from "./components/PrivateRoute";

export default function App() {
  return (
      <Routes>

        {/* AUTH ROUTES */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset-password/:token" element={<Reset />} />

        {/* DASHBOARD ROUTES */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

        <Route
          path="/legal-policy"
          element={
            <ProtectedRoute>
              <LegalPolicy />
            </ProtectedRoute>
          }
        />

        <Route
          path="/location"
          element={
            <ProtectedRoute>
              <Location />
            </ProtectedRoute>
          }
        />

        <Route
          path="/rating"
          element={
            <ProtectedRoute>
              <Rating />
            </ProtectedRoute>
          }
        />

        {/* DEFAULT */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  );
}