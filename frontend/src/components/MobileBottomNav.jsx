import React from 'react';
import { MessageSquare, CircleDot, Phone, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../utils';

const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: 'chats', path: '/chats', icon: MessageSquare, label: 'Chats' },
    { id: 'status', path: '/status', icon: CircleDot, label: 'Status' },
    { id: 'calls', path: '/calls', icon: Phone, label: 'Calls' },
    { id: 'settings', path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const activeTab = location.pathname.split('/')[1] || 'chats';

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 dark:bg-whatsapp-dark-header/90 backdrop-blur-lg border-t border-gray-100 dark:border-white/10 px-4 py-2 flex justify-around items-center z-[60] safe-area-bottom">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            className={cn(
              "flex flex-col items-center gap-1 transition-all flex-1 py-1 relative",
              isActive ? "text-whatsapp-green" : "text-gray-500 dark:text-gray-400"
            )}
          >
            <div className={cn(
              "p-1.5 rounded-full px-5 transition-all duration-300",
              isActive ? "bg-whatsapp-green/15" : "bg-transparent"
            )}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              {isActive && (
                <motion.div 
                  layoutId="nav-indicator"
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-whatsapp-green rounded-full shadow-[0_0_8px_rgba(37,211,102,0.8)]"
                />
              )}
            </div>
            <span className={cn(
              "text-[11px] font-semibold transition-all",
              isActive ? "opacity-100 translate-y-0" : "opacity-70"
            )}>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default MobileBottomNav;
