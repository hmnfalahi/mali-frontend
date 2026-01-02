import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import React, { Suspense, lazy } from 'react';
import Layout from './layouts/Layout'

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const ConsultantDashboard = lazy(() => import('./pages/ConsultantDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminRequests = lazy(() => import('./pages/admin/AdminRequests'));
const AdminCompanies = lazy(() => import('./pages/admin/AdminCompanies'));
const AdminFinancingTypes = lazy(() => import('./pages/admin/AdminFinancingTypes'));
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const CompanyProfile = lazy(() => import('./pages/CompanyProfile'));
const MyRequests = lazy(() => import('./pages/MyRequests'));
const RequestDetail = lazy(() => import('./pages/RequestDetail'));
const Account = lazy(() => import('./pages/Account'));
const ChangePassword = lazy(() => import('./pages/ChangePassword'));

const queryClient = new QueryClient()

function ProtectedRoute({ children, requireCompany = false, allowedRoles = null }) {
  const { user, loading, hasCompany, isConsultant, isAdmin, isCompany } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (isConsultant || isAdmin) {
      return <Navigate to="/consultant-dashboard" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  // Force company creation for COMPANY role users if not present (except when already on that page)
  if (isCompany && hasCompany === false && location.pathname !== "/company-profile") {
    return <Navigate to="/company-profile" replace />;
  }

  return children;
}

// Smart redirect component that redirects to appropriate dashboard based on role
function SmartDashboardRedirect() {
  const { user, loading, isConsultant, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect based on role
  if (isAdmin) {
    return <Navigate to="/admin-dashboard" replace />;
  }
  if (isConsultant) {
    return <Navigate to="/consultant-dashboard" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}

function LayoutWrapper({ children }) {
  const location = useLocation();
  const { isConsultant, isAdmin } = useAuth();
  
  let pageName = "Dashboard";
  if (location.pathname === "/") pageName = "Landing";
  if (location.pathname === "/company-profile") pageName = "پروفایل شرکت";
  if (location.pathname === "/my-requests") pageName = "درخواست‌های من";
  if (location.pathname === "/consultant-dashboard") pageName = "داشبورد مشاور";
  if (location.pathname === "/admin-dashboard") pageName = "داشبورد ادمین";
  if (location.pathname === "/admin/requests") pageName = "مدیریت درخواست‌ها";
  if (location.pathname === "/admin/companies") pageName = "مدیریت شرکت‌ها";
  if (location.pathname === "/admin/financing-types") pageName = "انواع تامین مالی";
  if (location.pathname.startsWith("/request/")) pageName = "جزئیات درخواست";
  if (location.pathname === "/account") pageName = "حساب کاربری";

  // Determine layout theme - admin pages use admin theme
  const isAdminPage = location.pathname.startsWith("/admin") || isAdmin;

  return (
    <Layout currentPageName={pageName} isConsultant={isConsultant} isAdmin={isAdminPage}>
      {children}
    </Layout>
  )
}

function LoadingFallback() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#1e3a5f] border-t-transparent" />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<LayoutWrapper><Home /></LayoutWrapper>} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              {/* Smart redirect to appropriate dashboard */}
              <Route path="/auto-dashboard" element={<SmartDashboardRedirect />} />

              {/* Company Dashboard - Only for COMPANY role */}
              <Route path="/dashboard" element={
                <ProtectedRoute allowedRoles={['COMPANY']}>
                  <LayoutWrapper><Dashboard /></LayoutWrapper>
                </ProtectedRoute>
              } />

              {/* Consultant Dashboard - Only for CONSULTANT role */}
              <Route path="/consultant-dashboard" element={
                <ProtectedRoute allowedRoles={['CONSULTANT']}>
                  <LayoutWrapper><ConsultantDashboard /></LayoutWrapper>
                </ProtectedRoute>
              } />

              {/* Admin Dashboard - Only for ADMIN role */}
              <Route path="/admin-dashboard" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <LayoutWrapper><AdminDashboard /></LayoutWrapper>
                </ProtectedRoute>
              } />

              {/* Admin Requests */}
              <Route path="/admin/requests" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <LayoutWrapper><AdminRequests /></LayoutWrapper>
                </ProtectedRoute>
              } />

              {/* Admin Companies */}
              <Route path="/admin/companies" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <LayoutWrapper><AdminCompanies /></LayoutWrapper>
                </ProtectedRoute>
              } />

              {/* Admin Financing Types */}
              <Route path="/admin/financing-types" element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <LayoutWrapper><AdminFinancingTypes /></LayoutWrapper>
                </ProtectedRoute>
              } />

              {/* Company Profile - Only for COMPANY role */}
              <Route path="/company-profile" element={
                <ProtectedRoute allowedRoles={['COMPANY']}>
                  <LayoutWrapper><CompanyProfile /></LayoutWrapper>
                </ProtectedRoute>
              } />

              {/* My Requests - Only for COMPANY role */}
              <Route path="/my-requests" element={
                <ProtectedRoute allowedRoles={['COMPANY']}>
                  <LayoutWrapper><MyRequests /></LayoutWrapper>
                </ProtectedRoute>
              } />

              {/* Request Detail - Available to all authenticated users */}
              <Route path="/request/:id" element={
                <ProtectedRoute>
                  <LayoutWrapper><RequestDetail /></LayoutWrapper>
                </ProtectedRoute>
              } />

              {/* Account - Available to all authenticated users */}
              <Route path="/account" element={
                <ProtectedRoute>
                  <LayoutWrapper><Account /></LayoutWrapper>
                </ProtectedRoute>
              } />

              <Route path="/change-password" element={
                <ProtectedRoute>
                  <LayoutWrapper><ChangePassword /></LayoutWrapper>
                </ProtectedRoute>
              } />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App

