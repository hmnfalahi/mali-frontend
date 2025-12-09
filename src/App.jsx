import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Layout from './layouts/Layout'

const queryClient = new QueryClient()

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
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

  return children;
}

function LayoutWrapper({ children }) {
  const location = useLocation();
  let pageName = "Dashboard";
  if (location.pathname === "/") pageName = "Landing";

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
                <LayoutWrapper><div className="p-8">Company Profile Page Placeholder</div></LayoutWrapper>
              </ProtectedRoute>
            } />

            <Route path="/financing-methods" element={
              <ProtectedRoute>
                <LayoutWrapper><div className="p-8">Financing Methods Page Placeholder</div></LayoutWrapper>
              </ProtectedRoute>
            } />

            <Route path="/my-requests" element={
              <ProtectedRoute>
                <LayoutWrapper><div className="p-8">My Requests Page Placeholder</div></LayoutWrapper>
              </ProtectedRoute>
            } />
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App
