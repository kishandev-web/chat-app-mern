import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SplashScreen from "./components/SplashScreen";
import LoginScreen from "./components/LoginScreen";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import MobileBottomNav from "./components/MobileBottomNav";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import NewChatModal from "./components/NewChatModal";
import NewGroupModal from "./components/NewGroupModal";
import ProfileSetupModal from "./components/ProfileSetupModal";
import StatusPage from "./pages/StatusPage";
import CallsPage from "./pages/CallsPage";
import SettingsPage from "./pages/SettingsPage";
import { fetchCurrentUserThunk } from "./store/slices/authSlice";
import { clearActiveChat } from "./store/slices/chatSlice";
import { initSocket, disconnectSocket } from "./socket/socketClient";
import { AnimatePresence, motion } from "framer-motion";

const MainLayout = () => {
  const dispatch = useDispatch();
  const { activeChat } = useSelector((state) => state.chat);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f0f2f5] dark:bg-[#0b141a] transition-colors duration-500">
      <PWAInstallPrompt />

      {/* Desktop Layout */}
      {!isMobile ? (
        <div className="flex w-full h-[95vh] max-w-[1600px] m-auto shadow-2xl overflow-hidden rounded-2xl border border-black/5 dark:border-white/5">
          <Sidebar />
          <div className="flex-1 bg-[#efeae2] dark:bg-[#222e35] relative overflow-hidden">
            {/* WhatsApp Texture Wallpaper */}
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
        <div className="relative w-full h-full bg-white dark:bg-[#111b21]">
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
                  <Route
                    path="/chats"
                    element={<Sidebar isMobile onChatSelect={() => {}} />}
                  />
                  <Route path="/status" element={<StatusPage />} />
                  <Route path="/calls" element={<CallsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Routes>
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="absolute inset-0 z-50 bg-[#efeae2] dark:bg-[#0b141a]"
              >
                <ChatWindow
                  isMobile
                  onBack={() => dispatch(clearActiveChat())}
                />
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
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    isAuthenticated,
    isProfileCompleted,
    token,
  } = useSelector((state) => state.auth);

  const {
    newChatModalOpen,
    newGroupModalOpen,
    profileModalOpen,
  } = useSelector((state) => state.ui);

  const [loadingSplash, setLoadingSplash] = useState(true);

  // 1. Check existing session on load
  useEffect(() => {
    const storedToken = localStorage.getItem("chat_token");
    if (storedToken) {
      dispatch(fetchCurrentUserThunk());
    }

    const timer = setTimeout(() => {
      setLoadingSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  // 2. Initialize or disconnect Socket.IO client based on authentication
  useEffect(() => {
    if (isAuthenticated && token) {
      initSocket(token, dispatch);
    } else {
      disconnectSocket();
    }
  }, [isAuthenticated, token, dispatch]);

  const handleLoginSuccess = () => {
    navigate("/chats");
  };

  return (
    <>
      <AnimatePresence>
        {loadingSplash && <SplashScreen key="splash" />}
      </AnimatePresence>

      {!loadingSplash && (
        <>
          <Routes>
            <Route
              path="/login"
              element={
                isAuthenticated && isProfileCompleted ? (
                  <Navigate to="/chats" />
                ) : (
                  <LoginScreen onLoginSuccess={handleLoginSuccess} />
                )
              }
            />
            <Route
              path="/*"
              element={
                isAuthenticated ? (
                  <MainLayout />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>

          {/* Global Modals */}
          <NewChatModal isOpen={newChatModalOpen} />
          <NewGroupModal isOpen={newGroupModalOpen} />
          <ProfileSetupModal
            isOpen={
              profileModalOpen ||
              (isAuthenticated && !isProfileCompleted)
            }
            isForced={isAuthenticated && !isProfileCompleted}
          />
        </>
      )}
    </>
  );
}

export default App;
