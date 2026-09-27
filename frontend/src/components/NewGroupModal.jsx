import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Users, Camera, X, Check, Loader2, Search } from "lucide-react";
import { createGroupThunk, searchUsersThunk } from "../store/slices/chatSlice";
import { setNewGroupModalOpen } from "../store/slices/uiSlice";

const NewGroupModal = ({ isOpen }) => {
  const dispatch = useDispatch();
  const { user: currentUser } = useSelector((state) => state.auth);
  const { searchResults } = useSelector((state) => state.chat);

  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [selectedParticipants, setSelectedParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      groupName: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      dispatch(searchUsersThunk(""));
    }
  }, [isOpen, dispatch]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleParticipant = (userId) => {
    if (selectedParticipants.includes(userId)) {
      setSelectedParticipants(selectedParticipants.filter((id) => id !== userId));
    } else {
      setSelectedParticipants([...selectedParticipants, userId]);
    }
  };

  const onSubmit = async (data) => {
    if (selectedParticipants.length === 0) {
      alert("Please select at least one participant");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("groupName", data.groupName.trim());
      // Backend expects participants array
      selectedParticipants.forEach((pId) => {
        formData.append("participants[]", pId);
      });

      if (avatarFile) {
        formData.append("groupAvatar", avatarFile);
      }

      const result = await dispatch(createGroupThunk(formData));
      if (createGroupThunk.fulfilled.match(result)) {
        dispatch(setNewGroupModalOpen(false));
        reset();
        setSelectedParticipants([]);
        setAvatarPreview("");
        setAvatarFile(null);
      }
    } catch (err) {
      console.error("Failed to create group:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-[480px] bg-white dark:bg-[#111b21] rounded-3xl shadow-2xl border border-gray-100 dark:border-white/10 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-5 bg-[#f0f2f5] dark:bg-[#202c33] flex items-center justify-between border-b dark:border-white/5">
          <div className="flex items-center gap-2.5">
            <Users className="text-whatsapp-green" size={22} />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">
              Create New Group
            </h3>
          </div>
          <button
            onClick={() => dispatch(setNewGroupModalOpen(false))}
            className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-gray-500 dark:text-gray-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5 flex-1 overflow-y-auto">
          {/* Avatar & Group Name Row */}
          <div className="flex items-center gap-4">
            <div className="relative group cursor-pointer shrink-0">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-whatsapp-green/40 bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Group icon preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera size={24} className="text-gray-400" />
                )}
              </div>
              <label
                htmlFor="group-avatar-upload"
                className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer text-white"
              >
                <Camera size={18} />
              </label>
              <input
                id="group-avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <div className="flex-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                Group Subject
              </label>
              <input
                type="text"
                placeholder="Enter group name..."
                {...register("groupName", {
                  required: "Group name is required",
                  minLength: {
                    value: 2,
                    message: "Group name must be at least 2 characters",
                  },
                })}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent focus:border-whatsapp-green outline-none text-sm text-slate-800 dark:text-white"
              />
              {errors.groupName && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.groupName.message}
                </p>
              )}
            </div>
          </div>

          {/* Select Participants Section */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
              Select Participants ({selectedParticipants.length} selected)
            </label>

            <div className="flex items-center bg-gray-100 dark:bg-white/5 rounded-xl px-3 py-2 mb-3">
              <Search size={16} className="text-gray-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search people to add..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  dispatch(searchUsersThunk(e.target.value));
                }}
                className="bg-transparent border-none outline-none text-xs w-full dark:text-white placeholder:text-gray-400"
              />
            </div>

            <div className="max-h-48 overflow-y-auto chat-scrollbar space-y-1 pr-1">
              {searchResults
                .filter((u) => u._id !== currentUser?._id)
                .map((u) => {
                  const isSelected = selectedParticipants.includes(u._id);
                  return (
                    <div
                      key={u._id}
                      onClick={() => toggleParticipant(u._id)}
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                        isSelected
                          ? "bg-whatsapp-green/10 dark:bg-whatsapp-green/20"
                          : "hover:bg-gray-50 dark:hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            u.avatar ||
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
                          }
                          alt={u.name}
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-xs font-semibold text-slate-800 dark:text-white">
                            {u.name}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            @{u.userName}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-whatsapp-green border-whatsapp-green text-white"
                            : "border-gray-300 dark:border-white/20"
                        }`}
                      >
                        {isSelected && <Check size={14} strokeWidth={3} />}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-whatsapp-green hover:bg-[#20bd5a] text-white font-bold rounded-xl shadow-lg shadow-whatsapp-green/30 flex items-center justify-center gap-2 text-sm transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Creating Group...
                </>
              ) : (
                <>
                  <Check size={18} strokeWidth={2.5} />
                  Create Group
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default NewGroupModal;
