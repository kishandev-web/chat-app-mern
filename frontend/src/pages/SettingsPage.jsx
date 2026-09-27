import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  MessageCircle,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Edit2,
  Moon,
  Sun,
} from "lucide-react";
import { motion } from "framer-motion";
import { logout } from "../store/slices/authSlice";
import { resetChatState } from "../store/slices/chatSlice";
import { resetMessagesState } from "../store/slices/messageSlice";
import { toggleTheme, setProfileModalOpen } from "../store/slices/uiSlice";
import { disconnectSocket } from "../socket/socketClient";
import { cn } from "../utils";

const SettingItem = ({ icon: Icon, title, subtitle, color, onClick }) => (
  <motion.div
    whileHover={{ x: 4 }}
    onClick={onClick}
    className="flex items-center gap-4 py-4 px-6 hover:bg-white dark:hover:bg-[#202c33] cursor-pointer transition-all border-b border-gray-100 dark:border-white/5 group"
  >
    <div
      className={cn(
        "p-2.5 rounded-xl transition-all duration-300 group-hover:scale-105",
        color
          ? color.replace("text-", "bg-").replace("-500", "/10")
          : "bg-gray-100 dark:bg-white/5"
      )}
    >
      <Icon size={20} className={color || "text-gray-600 dark:text-gray-400"} />
    </div>
    <div className="flex-1">
      <h3 className="text-[15px] font-semibold text-slate-800 dark:text-slate-100 leading-tight group-hover:text-whatsapp-green transition-colors">
        {title}
      </h3>
      {subtitle && (
        <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
          {subtitle}
        </p>
      )}
    </div>
    <ChevronRight
      size={16}
      className="text-gray-300 group-hover:text-whatsapp-green transition-colors"
    />
  </motion.div>
);

const SettingsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);

  const handleLogout = () => {
    disconnectSocket();
    dispatch(logout());
    dispatch(resetChatState());
    dispatch(resetMessagesState());
    navigate("/login");
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] dark:bg-[#111b21] transition-colors duration-300">
      {/* Header */}
      <div className="px-6 py-4 bg-[#f0f2f5] dark:bg-[#202c33] flex justify-between items-center border-b dark:border-white/5 sticky top-0 z-20">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">
          Settings
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto chat-scrollbar">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => dispatch(setProfileModalOpen(true))}
          className="flex items-center gap-5 p-6 mb-3 bg-white dark:bg-[#111b21] border-b border-gray-100 dark:border-white/5 shadow-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
        >
          <div className="relative">
            <img
              src={
                currentUser?.avatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
              }
              alt={currentUser?.name}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-whatsapp-green/30 group-hover:ring-whatsapp-green transition-all"
            />
            <div className="absolute bottom-0 right-0 w-5 h-5 bg-whatsapp-green rounded-full border-2 border-white dark:border-[#111b21] flex items-center justify-center text-white">
              <Edit2 size={10} />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-0.5">
              {currentUser?.name || "WhatsApp User"}
            </h3>
            <p className="text-xs text-whatsapp-green font-medium mb-1">
              @{currentUser?.userName || "username"}
            </p>
            <p className="text-[13px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed truncate">
              {currentUser?.about || "Available"}
            </p>
          </div>
          <ChevronRight
            size={18}
            className="text-gray-300 group-hover:text-whatsapp-green transition-colors"
          />
        </motion.div>

        {/* Setting Sections */}
        <div className="px-1">
          <SettingItem
            onClick={() => dispatch(toggleTheme())}
            icon={theme === "dark" ? Moon : Sun}
            title="Theme"
            subtitle={`Current: ${theme.charAt(0).toUpperCase() + theme.slice(1)} Mode`}
            color="text-whatsapp-green"
          />
          <SettingItem
            onClick={() => dispatch(setProfileModalOpen(true))}
            icon={User}
            title="Edit Profile"
            subtitle="Name, username, bio, profile photo"
          />
          <SettingItem
            icon={MessageCircle}
            title="Chats"
            subtitle="Theme, wallpapers, chat history"
          />
          <SettingItem
            icon={Bell}
            title="Notifications"
            subtitle="Message, group & call tones"
          />
          <SettingItem
            icon={Shield}
            title="Privacy"
            subtitle="Last seen, profile photo, online presence"
          />
          <SettingItem
            icon={HelpCircle}
            title="Help"
            subtitle="Help center, contact us, privacy policy"
          />

          <div className="mt-8 mb-8">
            <SettingItem
              onClick={handleLogout}
              icon={LogOut}
              title="Log out"
              subtitle="Sign out from this device"
              color="text-red-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
