import React from 'react';
import { motion } from 'framer-motion';
import { Plus, MoreVertical, CircleDot } from 'lucide-react';
import { stories, users } from '../data/mockData';
import { cn } from '../utils';

const StatusPage = () => {
  return (
    <div className="flex flex-col h-full bg-[#f8f9fa] dark:bg-whatsapp-dark transition-colors duration-300">
      {/* Header */}
      <div className="px-6 py-5 bg-[#f0f2f5] dark:bg-whatsapp-dark-header flex justify-between items-center border-b dark:border-white/5 sticky top-0 z-20">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Status</h2>
        <div className="flex gap-5 text-gray-600 dark:text-gray-400">
          <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            <CircleDot size={22} />
          </button>
          <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            <MoreVertical size={22} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto chat-scrollbar px-6 py-6">
        {/* My Status */}
        <motion.div 
          whileHover={{ x: 5 }}
          className="flex items-center gap-5 mb-10 cursor-pointer group p-3 bg-white dark:bg-whatsapp-dark-lighter rounded-2xl shadow-sm border border-gray-100 dark:border-white/5"
        >
          <div className="relative shrink-0">
            <div className="p-0.5 rounded-full border-2 border-dashed border-whatsapp-green">
              <img src="https://images.unsplash.com/photo-1776715139302-281f91c0c9ca?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHx0b3BpYy1mZWVkfDYxfHRvd0paRnNrcEdnfHxlbnwwfHx8fHw%3D" alt="My Status" className="w-14 h-14 rounded-full object-cover" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-whatsapp-green text-white rounded-full p-1 border-4 border-white dark:border-whatsapp-dark shadow-lg">
              <Plus size={16} strokeWidth={3} />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">My Status</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tap to add status update</p>
          </div>
        </motion.div>

        <div className="px-1">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-6">Recent Updates</p>
          
          <div className="space-y-2">
            {stories.map((story, index) => (
              <motion.div 
                key={story.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 8 }}
                className="flex items-center gap-5 p-3 cursor-pointer group hover:bg-white dark:hover:bg-whatsapp-dark-header rounded-2xl transition-all duration-300 border border-transparent hover:border-gray-100 dark:hover:border-white/5 hover:shadow-sm"
              >
                <div className={cn(
                  "shrink-0 p-0.5 rounded-full border-2 transition-transform duration-300 group-hover:rotate-12",
                  story.viewed ? 'border-gray-300 dark:border-gray-600' : 'border-whatsapp-green shadow-[0_0_10px_rgba(37,211,102,0.3)]'
                )}>
                  <img src={story.user.avatar} alt={story.user.name} className="w-12 h-12 rounded-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-800 dark:text-white text-[16px]">{story.user.name}</h3>
                  <p className="text-[13px] text-gray-500 dark:text-gray-400">Today, 10:45 AM</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusPage;
