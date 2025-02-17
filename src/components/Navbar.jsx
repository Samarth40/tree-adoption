import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const publicNavItems = [
    { label: 'Home', path: '/' },
    { label: 'Explore', path: '/explore' },
    { label: 'About', path: '/about' },
  ];

  const privateNavItems = [
    { label: 'NFT Dashboard', path: '/nft' },
    { label: 'Community', path: '/community' },
  ];

  const navItems = [...publicNavItems, ...(currentUser ? privateNavItems : [])];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'py-2' 
          : 'py-3'
      }`}
    >
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-forest-green/95 via-sage-green/95 to-forest-green/95 backdrop-blur-md shadow-lg"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
          >
            <span className="text-3xl transform transition-transform duration-300 group-hover:rotate-12">🌳</span>
            <span className="hidden sm:block text-2xl font-bold bg-gradient-to-r from-white to-cream bg-clip-text text-transparent">
              Tree Adoption
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                  isActive(item.path) 
                    ? 'text-white bg-gradient-to-r from-leaf-green to-sage-green shadow-md' 
                    : 'text-white hover:text-white group'
                }`}
              >
                <span className="relative z-10">{item.label}</span>
                {!isActive(item.path) && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-leaf-green to-sage-green opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                    animate={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {currentUser ? (
              <div className="relative group">
                <button
                  className="flex items-center space-x-2 text-white hover:text-cream transition-colors duration-300"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-leaf-green to-sage-green flex items-center justify-center">
                    <span className="text-white font-medium">{currentUser.email.split('@')[0].charAt(0).toUpperCase()}</span>
                  </div>
                  <motion.div
                    animate={{ rotate: isProfileMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    <svg 
                      className="w-4 h-4 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </motion.div>
                </button>
                
                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 mt-2 w-64 bg-gradient-to-b from-white to-cream rounded-lg shadow-lg py-2"
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="px-4 py-2 border-b border-forest-green/10"
                      >
                        <p className="font-medium text-forest-green truncate">{currentUser.email.split('@')[0]}</p>
                        <p className="text-sm text-sage-green truncate" title={currentUser.email}>{currentUser.email}</p>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15 }}
                      >
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-forest-green hover:bg-forest-green/5 transition-colors duration-200"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profile
                        </Link>
                        <Link
                          to="/dashboard"
                          className="flex items-center px-4 py-2 text-forest-green hover:bg-forest-green/5 transition-colors duration-200"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={2} 
                              d="M12 3c-1.5 0-2.5 1-3.5 2.5C7 7.5 6 9 6 11c0 3 2.5 5 6 5s6-2 6-5c0-2-1-3.5-2.5-5.5C14.5 4 13.5 3 12 3zM12 16v5"
                            />
                          </svg>
                          My Trees
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsProfileMenuOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200"
                        >
                          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Log out
                        </button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-white hover:text-cream transition-colors duration-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2.5 bg-gradient-to-r from-leaf-green to-sage-green hover:from-sage-green hover:to-leaf-green text-white rounded-xl shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white transition-all duration-300"
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={isMobileMenuOpen ? "open" : "closed"}
              variants={{
                open: { rotate: 180 },
                closed: { rotate: 0 }
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <svg 
                className="w-7 h-7" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <motion.path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2}
                  variants={{
                    open: { d: "M6 18L18 6M6 6l12 12" },
                    closed: { d: "M4 6h16M4 12h16M4 18h16" }
                  }}
                />
              </svg>
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-gradient-to-b from-forest-green/95 to-sage-green/95 backdrop-blur-md"
          >
            <div className="px-4 py-6 space-y-4">
              {/* Navigation Section */}
              <div className="space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive(item.path) 
                        ? 'text-white bg-gradient-to-r from-leaf-green to-sage-green shadow-md' 
                        : 'text-white hover:bg-white/10'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {currentUser ? (
                <>
                  {/* Simple Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-4" />

                  <div className="space-y-2 px-4">
                    {/* Profile Actions */}
                    <Link
                      to="/profile"
                      className="flex items-center justify-center w-full px-4 py-3 rounded-xl bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Profile
                    </Link>

                    <Link
                      to="/dashboard"
                      className="flex items-center justify-center w-full px-4 py-3 rounded-xl bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3c-1.5 0-2.5 1-3.5 2.5C7 7.5 6 9 6 11c0 3 2.5 5 6 5s6-2 6-5c0-2-1-3.5-2.5-5.5C14.5 4 13.5 3 12 3zM12 16v5" />
                      </svg>
                      My Trees
                    </Link>

                    {/* Divider before logout */}
                    <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-2" />

                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center justify-center w-full px-4 py-3 rounded-xl bg-gradient-to-r from-red-800/40 to-red-900/40 text-red-100 text-sm font-medium hover:from-red-800/50 hover:to-red-900/50 transition-all duration-300"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Simple Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mx-4" />

                  <div className="space-y-3 px-4">
                    <Link
                      to="/login"
                      className="block px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-all duration-300 text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      className="block px-4 py-3 bg-gradient-to-r from-leaf-green to-sage-green hover:from-sage-green hover:to-leaf-green text-white rounded-xl shadow-lg transition-all duration-300 text-center"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;