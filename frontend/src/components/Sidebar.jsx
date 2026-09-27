import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Search,
  MoreVertical,
  MessageSquarePlus,
  CircleDot,
  Users,
  Check,
  CheckCheck,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  fetchChatsThunk,
  setActiveChat,
} from "../store/slices/chatSlice";
import {
  setNewChatModalOpen,
  setProfileModalOpen,
} from "../store/slices/uiSlice";
import { joinChatRoom } from "../socket/socketClient";
import { cn } from "../utils";

// Format helper for chat timestamp
const formatTimestamp = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) return "Yesterday";

  return date.toLocaleDateString([], { month: "short", day: "numeric" });
};

const ChatCard = ({ chat, active, currentUserId, onlineUsers, onClick }) => {
  // Determine if direct or group chat
  const isGroup = chat.isGroup;
  let title = "Chat";
  let avatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150";
  let isOnline = false;

  if (isGroup) {
    title = chat.groupName || "Group";
    avatar =
      chat.groupAvatar ||
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150";
  } else {
    const otherParticipant =
      chat.participants?.find((p) => p._id !== currentUserId) ||
      chat.participants?.[0];

    if (otherParticipant) {
      title = otherParticipant.name || otherParticipant.userName || "User";
      avatar =
        otherParticipant.avatar ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150";
      isOnline =
        onlineUsers.includes(otherParticipant._id) ||
        Boolean(otherParticipant.isOnline);
    }
  }

  // Format last message preview
  const lastMsg = chat.lastMessage;
  let lastMessageText = "Tap to start chatting";
  if (lastMsg) {
    if (lastMsg.isDeleted) {
      lastMessageText = "This message was deleted";
    } else if (lastMsg.content) {
      lastMessageText = lastMsg.content;
    } else if (lastMsg.mediaUrl) {
      lastMessageText = "📷 Media";
    }
  }

  const timeString = formatTimestamp(lastMsg?.createdAt || chat.updatedAt);
  const isLastMsgMe =
    lastMsg?.senderId === currentUserId ||
    lastMsg?.senderId?._id === currentUserId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.005 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3.5 px-4 py-3 cursor-pointer transition-all border-b border-gray-100 dark:border-white/5",
        active
          ? "bg-[#f0f2f5] dark:bg-[#2a3942] shadow-inner"
          : "bg-white dark:bg-[#111b21] hover:bg-gray-50 dark:hover:bg-[#202c33]/70"
      )}
    >
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-transparent group-hover:border-whatsapp-green transition-all bg-gray-200 dark:bg-white/10">
          <img
            src={avatar}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>
        {isOnline && !isGroup && (
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-whatsapp-green rounded-full border-2 border-white dark:border-[#111b21]" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <h3 className="font-semibold text-[15px] truncate text-slate-800 dark:text-slate-100">
            {title}
          </h3>
          <span className="text-[11px] text-gray-400 font-medium">
            {timeString}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-[13px] text-gray-500 dark:text-gray-400 truncate leading-snug flex items-center gap-1">
            {isLastMsgMe && lastMsg && (
              <span className="inline-flex shrink-0">
                {lastMsg.status === "read" ? (
                  <CheckCheck size={14} className="text-[#53bdeb]" />
                ) : (
                  <Check size={14} className="text-gray-400" />
                )}
              </span>
            )}
            <span className="truncate">{lastMessageText}</span>
          </p>

          {chat.unreadCount > 0 && (
            <span className="bg-whatsapp-green text-white text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] h-[20px] flex items-center justify-center shrink-0">
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Sidebar = ({ isMobile, onChatSelect }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { chats, activeChat, onlineUsers, loading } = useSelector(
    (state) => state.chat
  );
  const { user: currentUser } = useSelector((state) => state.auth);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchChatsThunk());
  }, [dispatch]);

  // Filter chats by user name or group name
  const filteredChats = chats.filter((chat) => {
    if (chat.isGroup) {
      return chat.groupName?.toLowerCase().includes(search.toLowerCase());
    }
    const otherParticipant = chat.participants?.find(
      (p) => p._id !== currentUser?._id
    );
    return (
      otherParticipant?.name?.toLowerCase().includes(search.toLowerCase()) ||
      otherParticipant?.userName?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleSelectChat = (chat) => {
    dispatch(setActiveChat(chat));
    joinChatRoom(chat._id);
    navigate("/chats");
    if (onChatSelect) onChatSelect(chat);
  };

  return (
    <div
      className={cn(
        "flex flex-col h-full border-r dark:border-white/10 bg-white dark:bg-[#111b21] transition-all duration-300",
        isMobile ? "w-full" : "w-[35%] min-w-[340px] max-w-[450px]"
      )}
    >
      {/* Header */}
      <div className="px-4 py-3 bg-[#f0f2f5] dark:bg-[#202c33] flex justify-between items-center shrink-0 border-b dark:border-white/5">
        <div
          className="relative group cursor-pointer flex items-center gap-3"
          onClick={() => dispatch(setProfileModalOpen(true))}
          title="Click to edit profile"
        >
          <img
            src={
              currentUser?.avatar ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
            }
            alt="My Profile"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent group-hover:ring-whatsapp-green transition-all"
          />
          <div className="hidden lg:block">
            <h4 className="text-xs font-bold text-slate-800 dark:text-white leading-tight">
              {currentUser?.name}
            </h4>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">
              @{currentUser?.userName}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <button
            onClick={() => navigate("/status")}
            title="Status"
            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <CircleDot size={20} />
          </button>
          <button
            onClick={() => dispatch(setNewChatModalOpen(true))}
            title="Start New Chat"
            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-whatsapp-green hover:bg-whatsapp-green/10 transition-colors"
          >
            <MessageSquarePlus size={20} />
          </button>
          <button
            onClick={() => navigate("/settings")}
            title="Settings"
            className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-3 py-2.5 shrink-0 bg-white dark:bg-[#111b21]">
        <div className="relative flex items-center bg-[#f0f2f5] dark:bg-[#202c33] rounded-xl px-3.5 py-1.5 transition-all focus-within:bg-white focus-within:ring-1 ring-whatsapp-green/40 dark:focus-within:bg-[#202c33]">
          <Search size={16} className="text-gray-400 mr-2.5 shrink-0" />
          <input
            type="text"
            placeholder="Search or start new chat"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-[14px] w-full dark:text-white placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Chats List */}
      <div className="flex-1 overflow-y-auto chat-scrollbar bg-white dark:bg-[#111b21]">
        {loading && chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400">
            <Loader2 size={24} className="animate-spin text-whatsapp-green mb-2" />
            <p className="text-xs">Loading conversations...</p>
          </div>
        ) : filteredChats.length > 0 ? (
          filteredChats.map((chat) => (
            <ChatCard
              key={chat._id}
              chat={chat}
              active={activeChat?._id === chat._id}
              currentUserId={currentUser?._id}
              onlineUsers={onlineUsers}
              onClick={() => handleSelectChat(chat)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-gray-400 p-8 text-center">
            <p className="text-sm font-medium mb-3">
              {search ? `No chats matching "${search}"` : "No conversations yet"}
            </p>
            <button
              onClick={() => dispatch(setNewChatModalOpen(true))}
              className="px-4 py-2 bg-whatsapp-green text-white text-xs font-bold rounded-xl shadow-md shadow-whatsapp-green/20 hover:bg-[#20bd5a] transition-all flex items-center gap-1.5"
            >
              <MessageSquarePlus size={16} />
              Start a Conversation
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
