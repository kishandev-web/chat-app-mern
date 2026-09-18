import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreVertical, Phone, Video, Smile, Paperclip, Mic, Send, ArrowLeft, Check, CheckCheck } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { messages as mockMessages } from '../data/mockData';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../utils';

const MessageBubble = ({ message, isMe }) => {
  return (
    <div className={`flex w-full mb-3 ${isMe ? 'justify-end' : 'justify-start'}`}>
      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 5 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className={cn(
          "relative max-w-[75%] px-3.5 py-2 rounded-2xl text-[14.5px] shadow-sm",
          isMe 
            ? 'bg-whatsapp-bubble-sent dark:bg-whatsapp-bubble-sent-dark text-slate-800 dark:text-slate-100 rounded-tr-none' 
            : 'bg-white dark:bg-whatsapp-bubble-received-dark text-slate-800 dark:text-slate-100 rounded-tl-none'
        )}
      >
        <p className="pr-14 leading-relaxed">{message.text}</p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-[10px] text-gray-500/70 dark:text-gray-400/70 font-medium">{message.timestamp}</span>
          {isMe && (
            <span className={cn(
              "transition-colors",
              message.status === 'read' ? 'text-whatsapp-blue' : 'text-gray-400'
            )}>
              {message.status === 'read' ? <CheckCheck size={14} strokeWidth={2.5} /> : <Check size={14} strokeWidth={2.5} />}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const ChatWindow = ({ isMobile, onBack }) => {
  const { activeChat, currentUser } = useAppContext();
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (activeChat) {
      setMessages(mockMessages[activeChat.id] || []);
    }
  }, [activeChat]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    const newMessage = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent'
    };
    setMessages([...messages, newMessage]);
    setInputValue('');
  };

  if (!activeChat) {
    return (
      <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#f0f2f5] dark:bg-whatsapp-dark-lighter border-l dark:border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] bg-[url('https://w0.peakpx.com/wallpaper/580/650/HD-wallpaper-whatsapp-bg-cool-whatsapp-texture.jpg')] bg-repeat" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md text-center p-8 z-10"
        >
          <div className="w-64 h-64 mx-auto mb-10 relative">
             <div className="absolute inset-0 bg-whatsapp-green/10 rounded-full blur-3xl animate-pulse" />
             <img src="https://abs.twimg.com/errors/logo46x38.png" className="w-32 h-32 mx-auto mt-16 grayscale opacity-20" alt="logo" />
          </div>
          <h1 className="text-3xl font-light text-slate-700 dark:text-slate-300 mb-4">WhatsApp Web</h1>
          <p className="text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed">
            Send and receive messages without keeping your phone online.<br />
            Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
          </p>
        </motion.div>
        <div className="mt-auto pb-10 flex items-center gap-2 text-gray-400 text-xs font-medium z-10">
          <CheckCheck size={16} /> End-to-end encrypted
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#efeae2] dark:bg-[#0b141a] relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.04] pointer-events-none bg-[url('https://w0.peakpx.com/wallpaper/580/650/HD-wallpaper-whatsapp-bg-cool-whatsapp-texture.jpg')] bg-repeat" />

      {/* Header */}
      <div className="z-20 px-4 py-2.5 bg-[#f0f2f5]/90 dark:bg-whatsapp-dark-header/90 backdrop-blur-md flex justify-between items-center shrink-0 border-b dark:border-white/5">
        <div className="flex items-center gap-3">
          {isMobile && (
            <button onClick={onBack} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full mr-1 transition-colors">
              <ArrowLeft size={22} className="text-gray-600 dark:text-gray-300" />
            </button>
          )}
          <div className="relative">
            <img src={activeChat.user.avatar} alt={activeChat.user.name} className="w-10 h-10 rounded-full object-cover ring-1 ring-black/5 dark:ring-white/10" />
            {activeChat.user.status === 'Online' && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-whatsapp-green rounded-full border-2 border-[#f0f2f5] dark:border-whatsapp-dark-header" />
            )}
          </div>
          <div className="flex flex-col">
            <h3 className="text-[15px] font-semibold text-slate-800 dark:text-slate-100 leading-tight">{activeChat.user.name}</h3>
            <span className="text-[11px] text-gray-500 dark:text-whatsapp-green/80 font-medium">{activeChat.user.status}</span>
          </div>
        </div>
        <div className="flex items-center gap-5 text-gray-600 dark:text-gray-400">
          <Video size={20} className="cursor-pointer hover:text-whatsapp-green transition-colors" />
          <Phone size={18} className="cursor-pointer hover:text-whatsapp-green transition-colors" />
          <div className="w-px h-6 bg-gray-300 dark:bg-white/10 mx-1" />
          <Search size={20} className="cursor-pointer hover:text-whatsapp-green transition-colors" />
          <MoreVertical size={20} className="cursor-pointer hover:text-whatsapp-green transition-colors" />
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 md:px-10 py-6 z-10 chat-scrollbar flex flex-col gap-1"
      >
        <div className="flex justify-center mb-6 sticky top-0 z-20">
          <span className="bg-white/60 dark:bg-whatsapp-dark-header/60 backdrop-blur-sm text-[11px] px-3 py-1 rounded-lg text-gray-500 dark:text-gray-300 shadow-sm font-semibold uppercase tracking-wider border border-white/20 dark:border-white/5">Today</span>
        </div>
        
        <div className="flex flex-col w-full">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} isMe={msg.sender === 'me'} />
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="z-20 px-4 py-3 bg-[#f0f2f5] dark:bg-whatsapp-dark-header flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
          <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            <Smile size={24} />
          </button>
          <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            <Paperclip size={22} />
          </button>
        </div>
        <div className="flex-1">
          <input 
            type="text" 
            placeholder="Type a message" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="w-full bg-white dark:bg-whatsapp-dark-lighter outline-none px-5 py-2.5 rounded-xl text-[14.5px] dark:text-white placeholder:text-gray-500 shadow-sm focus:ring-1 ring-whatsapp-green/30"
          />
        </div>
        <div className="text-gray-600 dark:text-gray-400">
          {inputValue.trim() ? (
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              className="bg-whatsapp-green p-2.5 rounded-full text-white shadow-lg shadow-whatsapp-green/30 flex items-center justify-center"
            >
              <Send size={20} fill="currentColor" className="ml-0.5" />
            </motion.button>
          ) : (
            <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
              <Mic size={24} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
