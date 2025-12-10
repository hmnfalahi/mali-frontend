import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import CompanyProfile from './pages/CompanyProfile'
import MyRequests from './pages/MyRequests'
import Layout from './layouts/Layout'

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

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LayoutWrapper><Home /></LayoutWrapper>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

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
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
