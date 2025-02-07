import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('./pages/HomePage'));
const ExplorePage = React.lazy(() => import('./pages/ExplorePage'));
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
  return (
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
  );
}

export default App;
