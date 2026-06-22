import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./components/dashboard/DashboardLayout";

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

import CustomerOverview from "./pages/dashboard/customer/Overview";
import BrowseServices from "./pages/dashboard/customer/BrowseServices";
import MyBookings from "./pages/dashboard/customer/MyBookings";
import CustomerProfile from "./pages/dashboard/customer/Profile";

import ProviderOverview from "./pages/dashboard/provider/Overview";
import MyServices from "./pages/dashboard/provider/MyServices";
import ProviderBookings from "./pages/dashboard/provider/Bookings";
import ProviderProfile from "./pages/dashboard/provider/Profile";

import AdminOverview from "./pages/dashboard/admin/Overview";
import Users from "./pages/dashboard/admin/Users";
import AllBookings from "./pages/dashboard/admin/AllBookings";
import Categories from "./pages/dashboard/admin/Categories";
import AdminProfile from "./pages/dashboard/admin/Profile";
import NetworkBackground from "./components/NetworkBackground";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <NetworkBackground />
          <Routes>
            {/* Public */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />

            {/* Customer dashboard */}
            <Route
              path="/dashboard/customer"
              element={
                <ProtectedRoute allowedRoles={["customer"]}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<CustomerOverview />} />
              <Route path="services" element={<BrowseServices />} />
              <Route path="bookings" element={<MyBookings />} />
              <Route path="profile" element={<CustomerProfile />} />
            </Route>

            {/* Provider dashboard */}
            <Route
              path="/dashboard/provider"
              element={
                <ProtectedRoute allowedRoles={["provider"]}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<ProviderOverview />} />
              <Route path="services" element={<MyServices />} />
              <Route path="bookings" element={<ProviderBookings />} />
              <Route path="profile" element={<ProviderProfile />} />
            </Route>

            {/* Admin dashboard — only admins can reach this */}
            <Route
              path="/dashboard/admin"
              element={
                <ProtectedRoute allowedRoles={["admin"]}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminOverview />} />
              <Route path="users" element={<Users />} />
              <Route path="bookings" element={<AllBookings />} />
              <Route path="categories" element={<Categories />} />
              <Route path="profile" element={<AdminProfile />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
