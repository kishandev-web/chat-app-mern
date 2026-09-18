import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const SplashScreen = () => {
  return (
    <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-white dark:bg-[#0b141a] transition-colors duration-700">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: 'spring',
          damping: 15,
          stiffness: 100,
          duration: 0.8 
        }}
        className="flex flex-col items-center relative"
      >
        <div className="absolute inset-0 bg-whatsapp-green/20 rounded-full blur-[80px] animate-pulse" />
        <div className="w-24 h-24 bg-whatsapp-green rounded-[28px] flex items-center justify-center shadow-2xl shadow-whatsapp-green/40 relative z-10">
          <MessageCircle size={56} color="white" fill="white" />
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-32 flex flex-col items-center z-10"
        >
          <p className="text-gray-400 dark:text-gray-500 text-[11px] uppercase tracking-[0.3em] mb-3 font-bold">From</p>
          <div className="flex items-center gap-2">
            <span className="text-whatsapp-green font-black text-2xl tracking-[0.1em]">Own</span>
          </div>
        </motion.div>
      </motion.div>
      
      <div className="absolute bottom-20 w-64 h-1 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
        <motion.div
          initial={{ left: '-100%' }}
          animate={{ left: '100%' }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute w-1/2 h-full bg-gradient-to-r from-transparent via-whatsapp-green to-transparent"
        />
      </div>
    </div>
  );
};

export default SplashScreen;
