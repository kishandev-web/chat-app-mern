import React from 'react';
import { User, Lock, MessageCircle, Bell, Shield, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { cn } from '../utils';

const SettingItem = ({ icon: Icon, title, subtitle, color, onClick }) => (
  <motion.div 
    whileHover={{ x: 5 }}
    onClick={onClick}
    className="flex items-center gap-5 py-4.5 px-6 hover:bg-white dark:hover:bg-whatsapp-dark-header cursor-pointer transition-all border-b border-gray-50 dark:border-white/5 group"
  >
    <div className={cn(
      "p-2.5 rounded-xl transition-all duration-300 group-hover:scale-110",
      color ? color.replace('text-', 'bg-').replace('-500', '/10') : 'bg-gray-100 dark:bg-white/5'
    )}>
      <Icon size={22} className={color || 'text-gray-600 dark:text-gray-400'} />
    </div>
    <div className="flex-1">
      <h3 className="text-[16px] font-semibold text-slate-800 dark:text-slate-100 leading-tight group-hover:text-whatsapp-green transition-colors">{title}</h3>
      {subtitle && <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-1 font-medium">{subtitle}</p>}
    </div>
    <ChevronRight size={18} className="text-gray-300 group-hover:text-whatsapp-green transition-colors" />
  </motion.div>
);

const SettingsPage = () => {
  const { currentUser, toggleTheme, theme } = useAppContext();

  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] dark:bg-whatsapp-dark transition-colors duration-300">
      {/* Header */}
      <div className="px-6 py-5 bg-[#f0f2f5] dark:bg-whatsapp-dark-header flex justify-between items-center border-b dark:border-white/5 sticky top-0 z-20">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Settings</h2>
      </div>

      <div className="flex-1 overflow-y-auto chat-scrollbar">
        {/* Profile Card */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-6 p-8 mb-4 bg-white dark:bg-whatsapp-dark-lighter border-b border-gray-100 dark:border-white/5 shadow-sm"
        >
          <div className="relative">
            <img src={currentUser.avatar} alt="Profile" className="w-20 h-20 rounded-full object-cover ring-4 ring-whatsapp-green/20" />
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-whatsapp-green rounded-full border-4 border-white dark:border-whatsapp-dark-lighter shadow-md" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1">{currentUser.name}</h3>
            <p className="text-[14px] text-gray-500 dark:text-gray-400 font-medium leading-relaxed">{currentUser.about}</p>
          </div>
        </motion.div>

        {/* Setting Sections */}
        <div className="px-2">
          <SettingItem 
            onClick={toggleTheme}
            icon={Lock} 
            title="Theme" 
            subtitle={`Current: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`} 
            color="text-whatsapp-green"
          />
          <SettingItem icon={User} title="Account" subtitle="Privacy, security, change number" />
          <SettingItem icon={MessageCircle} title="Chats" subtitle="Theme, wallpapers, chat history" />
          <SettingItem icon={Bell} title="Notifications" subtitle="Message, group & call tones" />
          <SettingItem icon={Shield} title="Privacy" subtitle="Last seen, profile photo, groups" />
          <SettingItem icon={HelpCircle} title="Help" subtitle="Help center, contact us, privacy policy" />
          
          <div className="mt-10 mb-10">
            <SettingItem icon={LogOut} title="Log out" color="text-red-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
