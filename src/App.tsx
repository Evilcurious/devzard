import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { StoreProvider } from "./context/StoreContext";
import { StaffProvider } from "./context/StaffContext";
import { LanguageProvider } from "./context/LanguageContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProcessPage from "./pages/ProcessPage";
import ReviewsPage from "./pages/ReviewsPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AccountPage from "./pages/AccountPage";
import OrderPage from "./pages/OrderPage";
import AdminPage from "./pages/AdminPage";
import StaffPortalPage from "./pages/StaffPortalPage";
import StaffAdminPage from "./pages/StaffAdminPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <LanguageProvider>
      <StoreProvider>
        <StaffProvider>
          <AuthProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/services/:slug" element={<ServiceDetailPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/products/:slug" element={<ProductDetailPage />} />
                <Route path="/process" element={<ProcessPage />} />
                <Route path="/reviews" element={<ReviewsPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* Auth */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />

                {/* Protected */}
                <Route
                  path="/account"
                  element={
                    <ProtectedRoute>
                      <AccountPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/order"
                  element={
                    <ProtectedRoute>
                      <OrderPage />
                    </ProtectedRoute>
                  }
                />
                {/* Staff Portal — all logged-in staff */}
                <Route
                  path="/staff"
                  element={
                    <ProtectedRoute>
                      <StaffPortalPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/staff/admin"
                  element={
                    <ProtectedRoute>
                      <StaffAdminPage />
                    </ProtectedRoute>
                  }
                />

                {/* Legacy Admin */}
                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <AdminPage />
                    </AdminRoute>
                  }
                />

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Layout>
          </AuthProvider>
        </StaffProvider>
      </StoreProvider>
    </LanguageProvider>
  );
}
