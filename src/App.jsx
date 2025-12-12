import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import React, { Suspense, lazy } from 'react';
import Layout from './layouts/Layout'

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const CompanyProfile = lazy(() => import('./pages/CompanyProfile'));
const MyRequests = lazy(() => import('./pages/MyRequests'));
const Account = lazy(() => import('./pages/Account'));
const ChangePassword = lazy(() => import('./pages/ChangePassword'));

const queryClient = new QueryClient()

function ProtectedRoute({ children, requireCompany = false }) {
  const { user, loading, hasCompany } = useAuth();
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

  // Force company creation if not present (except when already on that page)
  // If user is logged in BUT has no company, redirect to /company-profile
  // UNLESS we are already there to avoid loop
  if (hasCompany === false && location.pathname !== "/company-profile") {
    return <Navigate to="/company-profile" replace />;
  }

  // If requireCompany is true (e.g. for dashboard features) and we don't have it, we redirected above.
  // But strictly speaking:
  // - Dashboard: Requires Company? Maybe yes, to see requests.
  // - My Requests: Yes.
  // - Company Profile: No (can create).

  return children;
}

function LayoutWrapper({ children }) {
  const location = useLocation();
  let pageName = "Dashboard";
  if (location.pathname === "/") pageName = "Landing";
  if (location.pathname === "/company-profile") pageName = "پروفایل شرکت";
  if (location.pathname === "/my-requests") pageName = "درخواست‌های من";

  return (
    <Layout currentPageName={pageName}>
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

              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <LayoutWrapper><Dashboard /></LayoutWrapper>
                </ProtectedRoute>
              } />

              <Route path="/company-profile" element={
                <ProtectedRoute>
                  <LayoutWrapper><CompanyProfile /></LayoutWrapper>
                </ProtectedRoute>
              } />

              <Route path="/my-requests" element={
                <ProtectedRoute>
                  <LayoutWrapper><MyRequests /></LayoutWrapper>
                </ProtectedRoute>
              } />

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
