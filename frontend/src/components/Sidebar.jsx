import React, { useState } from 'react';
import { Search, MoreVertical, MessageSquare, Plus, Archive, Pin, Star, CheckCheck, Menu, CircleDot } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../utils';

const ChatCard = ({ chat, active, onClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 px-4 py-3.5 cursor-pointer transition-all border-b border-gray-100 dark:border-white/5",
        active ? "bg-[#f0f2f5] dark:bg-whatsapp-dark-header shadow-inner" : "bg-white dark:bg-whatsapp-dark hover:bg-gray-50 dark:hover:bg-whatsapp-dark-header/50"
      )}
    >
      <div className="relative flex-shrink-0">
        <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-transparent group-hover:border-whatsapp-green transition-all">
          <img src={chat.user.avatar} alt={chat.user.name} className="w-full h-full object-cover" />
        </div>
        {chat.user.status === 'Online' && (
          <div className="absolute bottom-1 right-1 w-3.5 h-3.5 bg-whatsapp-green rounded-full border-2 border-white dark:border-whatsapp-dark" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-semibold text-base truncate text-slate-800 dark:text-slate-100">{chat.user.name}</h3>
          <span className={cn(
            "text-xs",
            chat.unreadCount > 0 ? "text-whatsapp-green font-semibold" : "text-gray-400"
          )}>{chat.timestamp}</span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-[13.5px] text-gray-500 dark:text-gray-400 truncate leading-tight">
            {chat.lastMessage}
          </p>
          {chat.unreadCount > 0 && (
            <span className="bg-whatsapp-green text-white text-[11px] font-bold px-2 py-0.5 rounded-full min-w-[22px] h-[22px] flex items-center justify-center shadow-lg shadow-whatsapp-green/20">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Sidebar = ({ isMobile, onChatSelect }) => {
  const { chats, activeChat, setActiveChat, currentUser, theme } = useAppContext();
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredChats = chats.filter(chat => 
    chat.user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={cn(
      "flex flex-col h-full border-r dark:border-white/10 bg-white dark:bg-whatsapp-dark transition-all duration-300",
      isMobile ? "w-full" : "w-[35%] min-w-[350px] max-w-[450px]"
    )}>
      {/* Header */}
      <div className="px-5 py-4 bg-[#f0f2f5] dark:bg-whatsapp-dark-header flex justify-between items-center shrink-0 border-b dark:border-white/5">
        <div className="relative group cursor-pointer" onClick={() => navigate('/settings')}>
          <img 
            src={currentUser.avatar} 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-whatsapp-green transition-all" 
          />
        </div>
        <div className="flex items-center gap-5 text-gray-600 dark:text-gray-400">
          <button onClick={() => navigate('/status')} title="Status" className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            <CircleDot size={22} />
          </button>
          <button title="New Chat" className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            <MessageSquare size={22} />
          </button>
          <button onClick={() => navigate('/settings')} title="Menu" className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            <MoreVertical size={22} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="px-4 py-2.5 shrink-0">
        <div className="relative flex items-center bg-[#f0f2f5] dark:bg-whatsapp-dark-lighter rounded-xl px-4 py-2 transition-all focus-within:bg-white focus-within:shadow-md dark:focus-within:bg-whatsapp-dark-header">
          <Search size={18} className="text-gray-500 mr-3 shrink-0" />
          <input 
            type="text" 
            placeholder="Search or start new chat" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-[15px] w-full dark:text-white placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* Chats List */}
      <div className="flex-1 overflow-y-auto chat-scrollbar bg-white dark:bg-whatsapp-dark">
        {filteredChats.length > 0 ? (
          filteredChats.map(chat => (
            <ChatCard 
              key={chat.id} 
              chat={chat} 
              active={activeChat?.id === chat.id}
              onClick={() => {
                setActiveChat(chat);
                navigate('/chats');
                if (onChatSelect) onChatSelect(chat);
              }}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-gray-400 p-10 text-center">
            <p className="text-sm">No chats found for "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
