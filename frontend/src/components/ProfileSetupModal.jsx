import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, User, AtSign, Info, Check, AlertCircle, Loader2 } from "lucide-react";
import { completeProfileThunk } from "../store/slices/authSlice";
import { setProfileModalOpen } from "../store/slices/uiSlice";

const ProfileSetupModal = ({ isOpen, isForced = false }) => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar || "");
  const [avatarFile, setAvatarFile] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name !== "New User" ? user?.name || "" : "",
      userName: user?.userName?.startsWith("user_") ? "" : user?.userName || "",
      about: user?.about || "Hey there! I am using WhatsApp.",
    },
  });

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

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name.trim());
      formData.append("userName", data.userName.trim());
      formData.append("about", data.about?.trim() || "Hey there! I am using WhatsApp.");
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }

      console.log("[ProfileSetup] Dispatching completeProfileThunk...");
      console.log("[ProfileSetup] Token in localStorage:", localStorage.getItem("chat_token"));

      const resultAction = await dispatch(completeProfileThunk(formData));

      console.log("[ProfileSetup] Result action:", resultAction);

      if (completeProfileThunk.fulfilled.match(resultAction)) {
        console.log("[ProfileSetup] ✅ Profile completed successfully!");
        dispatch(setProfileModalOpen(false));
      } else {
        console.error("[ProfileSetup] ❌ Profile completion failed:", resultAction.payload);
      }
    } catch (err) {
      console.error("[ProfileSetup] Unexpected error:", err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-[480px] bg-white dark:bg-[#111b21] rounded-3xl p-8 shadow-2xl border border-gray-100 dark:border-white/10 relative overflow-hidden"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            {isForced ? "Complete Your Profile" : "Edit Profile"}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Choose how you appear to your friends and contacts
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl flex items-center gap-2.5 text-red-600 dark:text-red-400 text-sm">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Avatar Preview & Upload */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative group cursor-pointer">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-whatsapp-green/30 bg-gray-100 dark:bg-white/5 flex items-center justify-center shadow-lg">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User size={40} className="text-gray-400" />
                )}
              </div>
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer text-white"
              >
                <Camera size={24} />
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <label
              htmlFor="avatar-upload"
              className="text-xs text-whatsapp-green font-semibold mt-2 cursor-pointer hover:underline"
            >
              Change Photo
            </label>
          </div>

          {/* Full Name Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Full Name
            </label>
            <div className="relative flex items-center">
              <User size={18} className="absolute left-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="e.g. Alex Johnson"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent focus:border-whatsapp-green focus:bg-white dark:focus:bg-[#111b21] outline-none text-slate-800 dark:text-white text-sm transition-all"
              />
            </div>
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Username Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              Username
            </label>
            <div className="relative flex items-center">
              <AtSign size={18} className="absolute left-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="e.g. alex_99"
                {...register("userName", {
                  required: "Username is required",
                  minLength: {
                    value: 3,
                    message: "Username must be at least 3 characters",
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message:
                      "Only letters, numbers, and underscores are allowed",
                  },
                })}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent focus:border-whatsapp-green focus:bg-white dark:focus:bg-[#111b21] outline-none text-slate-800 dark:text-white text-sm transition-all"
              />
            </div>
            {errors.userName && (
              <p className="text-xs text-red-500 mt-1">
                {errors.userName.message}
              </p>
            )}
          </div>

          {/* About Field */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
              About / Bio
            </label>
            <div className="relative flex items-center">
              <Info size={18} className="absolute left-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="e.g. Available"
                {...register("about", {
                  maxLength: {
                    value: 120,
                    message: "About cannot exceed 120 characters",
                  },
                })}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent focus:border-whatsapp-green focus:bg-white dark:focus:bg-[#111b21] outline-none text-slate-800 dark:text-white text-sm transition-all"
              />
            </div>
            {errors.about && (
              <p className="text-xs text-red-500 mt-1">
                {errors.about.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            {!isForced && (
              <button
                type="button"
                onClick={() => dispatch(setProfileModalOpen(false))}
                className="flex-1 py-3 px-4 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 font-semibold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading || isSubmitting}
              className="flex-1 py-3 px-4 bg-whatsapp-green hover:bg-[#20bd5a] text-white font-bold rounded-xl shadow-lg shadow-whatsapp-green/30 flex items-center justify-center gap-2 text-sm transition-all disabled:opacity-50"
            >
              {loading || isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={18} strokeWidth={2.5} />
                  Save Profile
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProfileSetupModal;
