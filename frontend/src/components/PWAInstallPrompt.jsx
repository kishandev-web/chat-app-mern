import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';

const PWAInstallPrompt = () => {
  const [show, setShow] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show prompt after 5 seconds of activity
      setTimeout(() => setShow(true), 5000);
    });

    window.addEventListener('appinstalled', () => {
      setShow(false);
      setDeferredPrompt(null);
    });
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-24 left-4 right-4 md:left-auto md:right-8 md:w-80 bg-white dark:bg-whatsapp-dark-header p-4 rounded-2xl shadow-2xl z-[100] border dark:border-white/10"
        >
          <div className="flex gap-4">
            <div className="w-12 h-12 bg-whatsapp-green rounded-xl flex-shrink-0 flex items-center justify-center text-white">
              <Download size={24} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold dark:text-white">Install WhatsApp</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Install our app for a better experience and offline access.
              </p>
            </div>
            <button onClick={() => setShow(false)} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
          <button
            onClick={handleInstall}
            className="w-full bg-whatsapp-green text-white text-sm font-bold py-2 rounded-lg mt-4"
          >
            INSTALL NOW
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PWAInstallPrompt;
