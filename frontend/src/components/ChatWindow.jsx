import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  MoreVertical,
  Phone,
  Video,
  Smile,
  Paperclip,
  Mic,
  Send,
  ArrowLeft,
  Check,
  CheckCheck,
  Trash2,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  fetchMessagesThunk,
  deleteMessageThunk,
} from "../store/slices/messageSlice";
import {
  joinChatRoom,
  leaveChatRoom,
  emitSendMessage,
  emitTyping,
  emitStopTyping,
  emitMessageRead,
} from "../socket/socketClient";
import { cn } from "../utils";

const formatMessageTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const MessageBubble = ({ message, isMe, onDelete }) => {
  const [showOptions, setShowOptions] = useState(false);

  return (
    <div
      className={cn(
        "flex w-full mb-2 group relative",
        isMe ? "justify-end" : "justify-start"
      )}
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      <motion.div
        initial={{ scale: 0.96, opacity: 0, y: 4 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className={cn(
          "relative max-w-[78%] md:max-w-[65%] px-3.5 py-1.5 rounded-2xl text-[14px] shadow-sm",
          isMe
            ? "bg-[#d9fdd3] dark:bg-[#005c4b] text-slate-800 dark:text-slate-100 rounded-tr-none"
            : "bg-white dark:bg-[#202c33] text-slate-800 dark:text-slate-100 rounded-tl-none"
        )}
      >
        {/* Sender name for group chats */}
        {!isMe && message.senderId?.name && (
          <p className="text-[11px] font-bold text-whatsapp-green mb-0.5">
            {message.senderId.name}
          </p>
        )}

        {/* Message Content */}
        {message.isDeleted ? (
          <p className="italic text-gray-500 dark:text-gray-400 text-[13px] flex items-center gap-1.5 py-0.5">
            <Trash2 size={13} className="shrink-0" />
            This message was deleted
          </p>
        ) : (
          <p className="pr-12 leading-relaxed whitespace-pre-wrap break-words">
            {message.content}
          </p>
        )}

        {/* Timestamp & Status ticks */}
        <div className="flex items-center justify-end gap-1 mt-0.5 select-none">
          <span className="text-[10px] text-gray-500/80 dark:text-gray-400/80 font-medium">
            {formatMessageTime(message.createdAt)}
          </span>
          {isMe && !message.isDeleted && (
            <span className="inline-flex">
              {message.status === "read" ? (
                <CheckCheck size={14} className="text-[#53bdeb]" />
              ) : (
                <Check size={14} className="text-gray-400" />
              )}
            </span>
          )}
        </div>

        {/* Delete option for own message */}
        {isMe && !message.isDeleted && showOptions && (
          <button
            onClick={() => onDelete(message._id)}
            title="Delete for everyone"
            className="absolute -left-7 top-2 p-1 rounded-full bg-white dark:bg-[#202c33] shadow text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={13} />
          </button>
        )}
      </motion.div>
    </div>
  );
};

const ChatWindow = ({ isMobile, onBack }) => {
  const dispatch = useDispatch();
  const { activeChat, typingUsers, onlineUsers } = useSelector(
    (state) => state.chat
  );
  const { user: currentUser } = useSelector((state) => state.auth);

  const messagesState = useSelector(
    (state) => state.message.messagesByChat[activeChat?._id]
  );
  const messages = messagesState?.list || [];

  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // 1. Join chat room & load messages
  useEffect(() => {
    if (activeChat?._id) {
      joinChatRoom(activeChat._id);
      dispatch(fetchMessagesThunk({ chatId: activeChat._id, page: 1 }));

      return () => {
        leaveChatRoom(activeChat._id);
      };
    }
  }, [activeChat?._id, dispatch]);

  // 2. Mark incoming messages as read
  useEffect(() => {
    if (activeChat?._id && messages.length > 0 && currentUser?._id) {
      const unreadIds = messages
        .filter((m) => {
          const sender = m.senderId?._id || m.senderId;
          return sender !== currentUser._id && m.status !== "read" && !m.isDeleted;
        })
        .map((m) => m._id);

      if (unreadIds.length > 0) {
        emitMessageRead({ chatId: activeChat._id, messageIds: unreadIds });
      }
    }
  }, [activeChat?._id, messages, currentUser?._id]);

  // 3. Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Typing debounce handler
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);

    if (!activeChat?._id) return;

    // Emit typing
    emitTyping(activeChat._id);

    // Reset stop typing timer
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      emitStopTyping(activeChat._id);
    }, 1500);
  };

  const handleSendMessage = () => {
    const text = inputValue.trim();
    if (!text || !activeChat?._id) return;

    emitSendMessage({
      chatId: activeChat._id,
      content: text,
      messageType: "text",
    });

    emitStopTyping(activeChat._id);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    setInputValue("");
  };

  const handleDeleteMessage = (messageId) => {
    if (!messageId || !activeChat?._id) return;
    dispatch(deleteMessageThunk({ messageId, chatId: activeChat._id }));
  };

  if (!activeChat) {
    return (
      <div className="hidden md:flex flex-1 flex-col items-center justify-center bg-[#f0f2f5] dark:bg-[#222e35] border-l dark:border-white/5 relative overflow-hidden h-full select-none">
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] bg-[url('https://w0.peakpx.com/wallpaper/580/650/HD-wallpaper-whatsapp-bg-cool-whatsapp-texture.jpg')] bg-repeat" />
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md text-center p-8 z-10"
        >
          <div className="w-56 h-56 mx-auto mb-8 relative flex items-center justify-center">
            <div className="absolute inset-0 bg-whatsapp-green/10 rounded-full blur-3xl animate-pulse" />
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
              className="w-28 h-28 mx-auto opacity-70 drop-shadow-lg"
              alt="WhatsApp Web"
            />
          </div>
          <h1 className="text-3xl font-light text-slate-700 dark:text-slate-200 mb-3 tracking-tight">
            WhatsApp Web
          </h1>
          <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed">
            Send and receive messages in real time. Choose a conversation from the
            sidebar or start a new chat to begin messaging.
          </p>
        </motion.div>
        <div className="mt-auto pb-8 flex items-center gap-2 text-gray-400 text-xs font-medium z-10">
          <Lock size={14} /> End-to-end encrypted
        </div>
      </div>
    );
  }

  // Active chat header info
  const isGroup = activeChat.isGroup;
  let chatTitle = "Chat";
  let chatAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150";
  let isParticipantOnline = false;

  if (isGroup) {
    chatTitle = activeChat.groupName || "Group";
    chatAvatar =
      activeChat.groupAvatar ||
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150";
  } else {
    const otherParticipant =
      activeChat.participants?.find((p) => p._id !== currentUser?._id) ||
      activeChat.participants?.[0];

    if (otherParticipant) {
      chatTitle = otherParticipant.name || otherParticipant.userName || "User";
      chatAvatar =
        otherParticipant.avatar ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150";
      isParticipantOnline =
        onlineUsers.includes(otherParticipant._id) ||
        Boolean(otherParticipant.isOnline);
    }
  }

  // Check if someone else is typing in active chat
  const typingList = typingUsers[activeChat._id] || [];
  const isOtherTyping = typingList.some((id) => id !== currentUser?._id);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#efeae2] dark:bg-[#0b141a] relative overflow-hidden">
      {/* WhatsApp Background Wallpaper */}
      <div className="absolute inset-0 opacity-[0.06] dark:opacity-[0.04] pointer-events-none bg-[url('https://w0.peakpx.com/wallpaper/580/650/HD-wallpaper-whatsapp-bg-cool-whatsapp-texture.jpg')] bg-repeat" />

      {/* Chat Top Header */}
      <div className="z-20 px-4 py-2.5 bg-[#f0f2f5] dark:bg-[#202c33] flex justify-between items-center shrink-0 border-b dark:border-white/5">
        <div className="flex items-center gap-3">
          {isMobile && (
            <button
              onClick={onBack}
              className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full mr-1 text-gray-600 dark:text-gray-300 transition-colors"
            >
              <ArrowLeft size={22} />
            </button>
          )}
          <div className="relative">
            <img
              src={chatAvatar}
              alt={chatTitle}
              className="w-10 h-10 rounded-full object-cover ring-1 ring-black/5 dark:ring-white/10"
            />
            {isParticipantOnline && !isGroup && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-whatsapp-green rounded-full border-2 border-[#f0f2f5] dark:border-[#202c33]" />
            )}
          </div>
          <div className="flex flex-col">
            <h3 className="text-[15px] font-semibold text-slate-800 dark:text-slate-100 leading-tight">
              {chatTitle}
            </h3>
            <span className="text-[12px] font-medium leading-tight">
              {isOtherTyping ? (
                <span className="text-whatsapp-green font-semibold animate-pulse">
                  typing...
                </span>
              ) : isGroup ? (
                <span className="text-gray-500 dark:text-gray-400 text-[11px]">
                  {activeChat.participants?.length || 0} participants
                </span>
              ) : isParticipantOnline ? (
                <span className="text-whatsapp-green">online</span>
              ) : (
                <span className="text-gray-400">offline</span>
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
          <Video
            size={19}
            className="cursor-pointer hover:text-whatsapp-green transition-colors"
          />
          <Phone
            size={17}
            className="cursor-pointer hover:text-whatsapp-green transition-colors"
          />
          <div className="w-px h-5 bg-gray-300 dark:bg-white/10 mx-0.5" />
          <Search
            size={19}
            className="cursor-pointer hover:text-whatsapp-green transition-colors"
          />
          <MoreVertical
            size={19}
            className="cursor-pointer hover:text-whatsapp-green transition-colors"
          />
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 md:px-8 py-5 z-10 chat-scrollbar flex flex-col gap-1"
      >
        <div className="flex justify-center mb-4 sticky top-0 z-20">
          <span className="bg-white/80 dark:bg-[#182229]/80 backdrop-blur-sm text-[11px] px-3 py-1 rounded-lg text-gray-500 dark:text-gray-300 shadow-sm font-semibold uppercase tracking-wider border border-white/40 dark:border-white/5">
            Messages
          </span>
        </div>

        <div className="flex flex-col w-full">
          {messages.map((msg) => {
            const senderId = msg.senderId?._id || msg.senderId;
            const isMe = senderId === currentUser?._id;
            return (
              <MessageBubble
                key={msg._id}
                message={msg}
                isMe={isMe}
                onDelete={handleDeleteMessage}
              />
            );
          })}
        </div>
      </div>

      {/* Message Input Bar */}
      <div className="z-20 px-3 md:px-4 py-2.5 bg-[#f0f2f5] dark:bg-[#202c33] flex items-center gap-2.5 shrink-0">
        <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
          <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            <Smile size={22} />
          </button>
          <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
            <Paperclip size={20} />
          </button>
        </div>

        <div className="flex-1">
          <input
            type="text"
            placeholder="Type a message"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            className="w-full bg-white dark:bg-[#2a3942] outline-none px-4 py-2.5 rounded-xl text-[14.5px] dark:text-white placeholder:text-gray-400 shadow-sm focus:ring-1 ring-whatsapp-green/40"
          />
        </div>

        <div className="text-gray-500 dark:text-gray-400">
          {inputValue.trim() ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSendMessage}
              className="bg-whatsapp-green hover:bg-[#20bd5a] p-2.5 rounded-full text-white shadow-md shadow-whatsapp-green/30 flex items-center justify-center cursor-pointer transition-colors"
            >
              <Send size={18} fill="currentColor" className="ml-0.5" />
            </motion.button>
          ) : (
            <button className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full transition-colors">
              <Mic size={22} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
