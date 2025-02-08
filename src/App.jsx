import React, { Suspense, useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PasswordGate from './components/PasswordGate';
import ExplorePage from './pages/ExplorePage';
import TreePlayground from './pages/TreePlayground';
import CommunityPage from './pages/CommunityPage';

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

// Loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-cream">
    <div className="space-y-4 text-center">
      <div className="w-16 h-16 border-4 border-forest-green border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p className="text-forest-green text-lg">Loading...</p>
    </div>
  </div>
);

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeInOut" }
};

function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Check if the app was previously unlocked
  useEffect(() => {
    const unlocked = localStorage.getItem('treeAdoptionUnlocked');
    if (unlocked === 'true') {
      setIsUnlocked(true);
    }
  }, []);

  const handleUnlock = (status) => {
    setIsUnlocked(status);
    localStorage.setItem('treeAdoptionUnlocked', status);
  };

  if (!isUnlocked) {
    return <PasswordGate onUnlock={handleUnlock} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-white flex flex-col">
          <Navbar />
          <Suspense fallback={<PageLoader />}>
            <AnimatePresence mode="wait">
              <motion.main 
                className="flex-grow"
                {...pageTransition}
              >
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/explore" element={<ExplorePage />} />
                  <Route path="/playground/:treeId" element={<TreePlayground />} />
                  <Route path="/community" element={<CommunityPage />} />
                  <Route path="/about" element={<About />} />
                  <Route 
                    path="/contact" 
                    element={
                      <div className="p-8 text-center min-h-[60vh] flex items-center justify-center">
                        <h1 className="text-2xl text-forest-green">Contact page coming soon!</h1>
                      </div>
                    } 
                  />
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
