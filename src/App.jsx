import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Layout from './layouts/Layout'

const queryClient = new QueryClient()

function LayoutWrapper({ children }) {
  const location = useLocation();
  // Determine page name based on path for Layout prop
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
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LayoutWrapper><Home /></LayoutWrapper>} />
          <Route path="/dashboard" element={<LayoutWrapper><Dashboard /></LayoutWrapper>} />
          {/* Add placeholders for other routes */}
          <Route path="/company-profile" element={<LayoutWrapper><div className="p-8">Company Profile Page Placeholder</div></LayoutWrapper>} />
          <Route path="/financing-methods" element={<LayoutWrapper><div className="p-8">Financing Methods Page Placeholder</div></LayoutWrapper>} />
          <Route path="/my-requests" element={<LayoutWrapper><div className="p-8">My Requests Page Placeholder</div></LayoutWrapper>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
