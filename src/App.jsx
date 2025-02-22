import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ExplorePage from './pages/ExplorePage';
import TreePlayground from './pages/TreePlayground';
import CommunityPage from './pages/CommunityPage';
import DashboardPage from './pages/DashboardPage';
import AdoptionPage from './pages/AdoptionPage';
import Login from './components/Login';
import Register from './components/Register';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './contexts/AuthContext';
import UserProfile from './components/UserProfile';
import AdoptionSuccessPage from './pages/AdoptionSuccessPage';
import NFTDashboard from './pages/NFTDashboard';
import Volunteer from './pages/Volunteer';
import Partner from './pages/Partner';
import Donate from './pages/Donate';
import TreeChatPage from './pages/TreeChatPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import ContactUsPage from './pages/ContactUsPage';
import LoadingScreen from './components/LoadingScreen';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('./pages/HomePage'));
const About = React.lazy(() => import('./components/About'));

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeInOut" }
};

function App() {
  const { currentUser } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-white flex flex-col">
          <Navbar />
          <Suspense fallback={<LoadingScreen />}>
            <AnimatePresence mode="wait">
              <motion.main 
                className="flex-grow"
                {...pageTransition}
              >
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/explore" element={<ExplorePage />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={currentUser ? <Navigate to="/dashboard" /> : <Login />} />
                  <Route path="/register" element={currentUser ? <Navigate to="/dashboard" /> : <Register />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/contact-us" element={<ContactUsPage />} />

                  {/* Protected Routes */}
                  <Route path="/playground/:treeId" element={
                    <PrivateRoute>
                      <TreePlayground />
                    </PrivateRoute>
                  } />
                  <Route path="/adopt/:treeId" element={
                    <PrivateRoute>
                      <AdoptionPage />
                    </PrivateRoute>
                  } />
                  <Route path="/adoption/success" element={
                    <PrivateRoute>
                      <AdoptionSuccessPage />
                    </PrivateRoute>
                  } />
                  <Route path="/community" element={
                    <PrivateRoute>
                      <CommunityPage />
                    </PrivateRoute>
                  } />
                  <Route path="/dashboard" element={
                    <PrivateRoute>
                      <DashboardPage />
                    </PrivateRoute>
                  } />
                  <Route path="/nft" element={
                    <PrivateRoute>
                      <NFTDashboard />
                    </PrivateRoute>
                  } />
                  <Route path="/profile" element={
                    <PrivateRoute>
                      <UserProfile />
                    </PrivateRoute>
                  } />
                  <Route path="/volunteer" element={<Volunteer />} />
                  <Route path="/partner" element={<Partner />} />
                  <Route path="/donate" element={<Donate />} />
                  
                  {/* Tree Chat Route */}
                  <Route path="/tree-chat" element={
                    <PrivateRoute>
                      <TreeChatPage />
                    </PrivateRoute>
                  } />
                  
                  {/* Fallback Route */}
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </motion.main>
            </AnimatePresence>
          </Suspense>
          <Footer />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
