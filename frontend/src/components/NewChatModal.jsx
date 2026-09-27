import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Search, X, Users, MessageSquarePlus, Loader2, UserCheck } from "lucide-react";
import {
  searchUsersThunk,
  createOrGetChatThunk,
  clearSearchResults,
} from "../store/slices/chatSlice";
import {
  setNewChatModalOpen,
  setNewGroupModalOpen,
} from "../store/slices/uiSlice";

const NewChatModal = ({ isOpen }) => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const { searchResults, searchLoading } = useSelector((state) => state.chat);
  const { user: currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 1) {
        dispatch(searchUsersThunk(searchQuery.trim()));
      } else {
        dispatch(clearSearchResults());
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, dispatch]);

  const handleStartChat = async (userId) => {
    const result = await dispatch(createOrGetChatThunk(userId));
    if (createOrGetChatThunk.fulfilled.match(result)) {
      dispatch(setNewChatModalOpen(false));
      dispatch(clearSearchResults());
      setSearchQuery("");
    }
  };

  const handleOpenGroupModal = () => {
    dispatch(setNewChatModalOpen(false));
    dispatch(setNewGroupModalOpen(true));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-[440px] h-[520px] flex flex-col bg-white dark:bg-[#111b21] rounded-3xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 bg-[#f0f2f5] dark:bg-[#202c33] flex items-center justify-between border-b dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <MessageSquarePlus className="text-whatsapp-green" size={22} />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              New Chat
            </h3>
          </div>
          <button
            onClick={() => dispatch(setNewChatModalOpen(false))}
            className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 dark:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Action button to create group */}
        <div className="p-3 border-b dark:border-white/5">
          <button
            onClick={handleOpenGroupModal}
            className="w-full flex items-center gap-4 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-slate-800 dark:text-white transition-colors group"
          >
            <div className="w-10 h-10 rounded-full bg-whatsapp-green/10 text-whatsapp-green flex items-center justify-center group-hover:bg-whatsapp-green group-hover:text-white transition-all">
              <Users size={20} />
            </div>
            <span className="font-semibold text-sm">New Group</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="p-3">
          <div className="flex items-center bg-gray-100 dark:bg-[#202c33] rounded-xl px-3.5 py-2">
            <Search size={18} className="text-gray-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search by name or username..."
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full dark:text-white placeholder:text-gray-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto chat-scrollbar px-2 py-1">
          {searchLoading ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <Loader2 size={26} className="animate-spin text-whatsapp-green mb-2" />
              <p className="text-xs">Searching users...</p>
            </div>
          ) : searchResults.length > 0 ? (
            searchResults
              .filter((u) => u._id !== currentUser?._id)
              .map((u) => (
                <div
                  key={u._id}
                  onClick={() => handleStartChat(u._id)}
                  className="flex items-center gap-3.5 p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-all"
                >
                  <div className="relative">
                    <img
                      src={
                        u.avatar ||
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                      }
                      alt={u.name}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                    {u.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-whatsapp-green rounded-full border-2 border-white dark:border-[#111b21]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-white truncate">
                      {u.name}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      @{u.userName}
                    </p>
                  </div>
                  <button className="px-3 py-1.5 bg-whatsapp-green/10 hover:bg-whatsapp-green hover:text-white text-whatsapp-green text-xs font-bold rounded-lg transition-colors">
                    Chat
                  </button>
                </div>
              ))
          ) : searchQuery ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-center p-4">
              <p className="text-sm">No users found for "{searchQuery}"</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400 text-center p-4">
              <UserCheck size={36} className="opacity-30 mb-2" />
              <p className="text-xs text-gray-500">
                Type a username or name to find someone
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default NewChatModal;
