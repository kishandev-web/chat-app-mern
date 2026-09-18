import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { AppProvider, useAppContext } from './context/AppContext';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import MobileBottomNav from './components/MobileBottomNav';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import StatusPage from './pages/StatusPage';
import CallsPage from './pages/CallsPage';
import SettingsPage from './pages/SettingsPage';
import { AnimatePresence, motion } from 'framer-motion';

const MainLayout = () => {
  const { activeChat, setActiveChat } = useAppContext();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Sync activeTab with location for mobile
  const activeTab = location.pathname.split('/')[1] || 'chats';

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f0f2f5] dark:bg-[#0b141a] transition-colors duration-500">
      <PWAInstallPrompt />
      
      {/* Desktop Layout */}
      {!isMobile ? (
        <div className="flex w-full h-[95vh] max-w-[1600px] m-auto premium-shadow overflow-hidden rounded-xl border border-white/20 dark:border-white/5">
          <Sidebar />
          <div className="flex-1 bg-[#efeae2] dark:bg-whatsapp-dark-lighter relative overflow-hidden">
            {/* Background pattern for WhatsApp feel */}
            <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.03] pointer-events-none bg-[url('https://w0.peakpx.com/wallpaper/580/650/HD-wallpaper-whatsapp-bg-cool-whatsapp-texture.jpg')] bg-repeat"></div>
            <div className="relative z-10 h-full">
              <Routes>
                <Route path="/" element={<Navigate to="/chats" />} />
                <Route path="/chats" element={<ChatWindow />} />
                <Route path="/status" element={<StatusPage />} />
                <Route path="/calls" element={<CallsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </div>
          </div>
        </div>
      ) : (
        /* Mobile Layout */
        <div className="relative w-full h-full bg-white dark:bg-whatsapp-dark">
          <AnimatePresence mode="wait">
            {!activeChat ? (
              <motion.div 
                key={location.pathname}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 pb-16 overflow-hidden"
              >
                <Routes>
                  <Route path="/" element={<Navigate to="/chats" />} />
                  <Route path="/chats" element={<Sidebar isMobile onChatSelect={() => {}} />} />
                  <Route path="/status" element={<StatusPage />} />
                  <Route path="/calls" element={<CallsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </motion.div>
            ) : (
              <motion.div 
                key="chat"
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                className="absolute inset-0 z-50 bg-[#efeae2] dark:bg-whatsapp-dark"
              >
                <ChatWindow isMobile onBack={() => setActiveChat(null)} />
              </motion.div>
            )}
          </AnimatePresence>
          {!activeChat && <MobileBottomNav />}
        </div>
      )}
    </div>
  );
};

function App() {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      if (!isLoggedIn) {
        navigate('/login');
      }
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/chats');
  };

  return (
    <AppProvider>
      <AnimatePresence>
        {loading && <SplashScreen key="splash" />}
      </AnimatePresence>

      {!loading && (
        <Routes>
          <Route path="/login" element={<LoginScreen onLogin={handleLogin} />} />
          <Route path="/*" element={isLoggedIn ? <MainLayout /> : <Navigate to="/login" />} />
        </Routes>
      )}
    </AppProvider>
  );
}

export default App;
