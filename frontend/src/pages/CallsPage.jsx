import React from 'react';
import { Phone, Video, MoreVertical, Search, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { calls } from '../data/mockData';
import { motion } from 'framer-motion';
import { cn } from '../utils';

const CallsPage = () => {
  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] dark:bg-whatsapp-dark transition-colors duration-300">
      {/* Header */}
      <div className="px-6 py-5 bg-[#f0f2f5] dark:bg-whatsapp-dark-header flex justify-between items-center border-b dark:border-white/5 sticky top-0 z-20">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Calls</h2>
        <div className="flex gap-5 text-gray-600 dark:text-gray-400">
          <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            <Search size={22} />
          </button>
          <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            <MoreVertical size={22} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto chat-scrollbar px-6 py-6">
        <div className="space-y-1">
          {calls.map((call, index) => (
            <motion.div 
              key={call.id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 5 }}
              className="flex items-center gap-5 p-3 cursor-pointer group hover:bg-white dark:hover:bg-whatsapp-dark-header rounded-2xl transition-all duration-300 border border-transparent hover:border-gray-100 dark:hover:border-white/5 hover:shadow-sm"
            >
              <div className="shrink-0 relative">
                <img src={call.user.avatar} alt={call.user.name} className="w-13 h-13 rounded-full object-cover ring-1 ring-black/5 dark:ring-white/10" />
              </div>
              <div className="flex-1 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-white text-[16px] mb-0.5">{call.user.name}</h3>
                  <div className="flex items-center gap-1.5 text-[13px]">
                    {call.status === 'missed' ? (
                      <ArrowDownLeft size={16} strokeWidth={2.5} className="text-red-500" />
                    ) : call.status === 'incoming' ? (
                      <ArrowDownLeft size={16} strokeWidth={2.5} className="text-whatsapp-green" />
                    ) : (
                      <ArrowUpRight size={16} strokeWidth={2.5} className="text-whatsapp-green" />
                    )}
                    <span className="text-gray-500 dark:text-gray-400 font-medium">{call.timestamp}</span>
                  </div>
                </div>
                <div className="text-whatsapp-green p-2 hover:bg-whatsapp-green/10 rounded-full transition-colors">
                  {call.type === 'video' ? <Video size={22} /> : <Phone size={22} />}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CallsPage;
