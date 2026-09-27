import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MessageCircle, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { sendOtp, verifyOtp } from "../services/authService";
import { verifyFirebaseTokenThunk } from "../store/slices/authSlice";

const LoginScreen = ({ onLoginSuccess }) => {
  const dispatch = useDispatch();
  const { loading: authLoading, error: authError } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1); // 1 = Phone, 2 = OTP
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpValues, setOtpValues] = useState(["", "", "", "", "", ""]);
  const [localError, setLocalError] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);

  // Phone Form with React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors: phoneErrors },
  } = useForm({
    defaultValues: {
      phone: "",
    },
  });

  // Step 1: Send OTP via Firebase
  const handlePhoneSubmit = async (data) => {
    try {
      setLocalError("");
      setSendingOtp(true);
      const cleanPhone = data.phone.trim();
      setPhoneNumber(cleanPhone);

      await sendOtp(`+91${cleanPhone}`);
      setSendingOtp(false);
      setStep(2);
    } catch (err) {
      console.error("Firebase sendOtp error:", err);
      setSendingOtp(false);
      setLocalError(err.message || "Failed to send OTP. Please try again.");
    }
  };

  // Handle individual OTP input digits
  const handleOtpChange = (index, value) => {
    const val = value.replace(/\D/g, "");
    if (val.length > 1) return;

    const newOtp = [...otpValues];
    newOtp[index] = val;
    setOtpValues(newOtp);

    // Auto focus next box
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpValues[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Step 2: Verify Firebase OTP and Exchange for Backend JWT
  const handleVerifyOtp = async () => {
    const code = otpValues.join("");
    if (code.length !== 6) {
      setLocalError("Please enter complete 6-digit OTP");
      return;
    }

    try {
      setLocalError("");
      setVerifyingOtp(true);

      // Verify OTP with Firebase
      const firebaseToken = await verifyOtp(code);

      // Exchange Firebase Token for Backend JWT
      const resultAction = await dispatch(
        verifyFirebaseTokenThunk(firebaseToken)
      );

      setVerifyingOtp(false);

      if (verifyFirebaseTokenThunk.fulfilled.match(resultAction)) {
        if (onLoginSuccess) {
          onLoginSuccess(resultAction.payload.user);
        }
      } else {
        setLocalError(resultAction.payload || "Backend verification failed");
      }
    } catch (err) {
      console.error("OTP verification error:", err);
      setVerifyingOtp(false);
      setLocalError(err.message || "Invalid verification code");
    }
  };

  const handleResendOtp = async () => {
    if (!phoneNumber) return;
    try {
      setLocalError("");
      setSendingOtp(true);
      await sendOtp(`+91${phoneNumber}`);
      setSendingOtp(false);
      setOtpValues(["", "", "", "", "", ""]);
      alert("New OTP sent successfully!");
    } catch (err) {
      setSendingOtp(false);
      setLocalError(err.message || "Failed to resend OTP");
    }
  };

  const displayError = localError || authError;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#f0f2f5] dark:bg-[#0b141a] overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-whatsapp-green/10 dark:bg-whatsapp-green/5 z-0" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-whatsapp-green/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#128c7e]/15 rounded-full blur-3xl" />

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="w-full max-w-[440px] mx-6 bg-white/80 dark:bg-[#111b21]/80 backdrop-blur-xl rounded-[32px] p-8 md:p-10 z-10 shadow-2xl relative border border-white/60 dark:border-white/10"
      >
        {/* Top Logo */}
        <div className="flex flex-col items-center mb-8">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="w-20 h-20 bg-whatsapp-green rounded-[24px] flex items-center justify-center shadow-xl shadow-whatsapp-green/40 mb-5"
          >
            <MessageCircle size={44} color="white" fill="white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
            WhatsApp
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-[15px] mt-1.5 font-medium text-center">
            {step === 1
              ? "Verify your phone number"
              : `Enter code sent to +91 ${phoneNumber}`}
          </p>
        </div>

        {/* Error Notification */}
        {displayError && (
          <div className="mb-6 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl flex items-center gap-2.5 text-red-600 dark:text-red-400 text-xs">
            <AlertCircle size={16} className="shrink-0" />
            <span>{displayError}</span>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 ? (
            /* ─── STEP 1: Phone Form (React Hook Form) ─── */
            <motion.form
              key="step1"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              onSubmit={handleSubmit(handlePhoneSubmit)}
              className="space-y-6"
            >
              <div>
                <div className="flex gap-3">
                  <div className="w-20 py-3.5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 text-center font-bold text-slate-800 dark:text-white flex items-center justify-center text-sm">
                    +91
                  </div>
                  <input
                    type="tel"
                    placeholder="10-digit mobile number"
                    autoFocus
                    maxLength={10}
                    {...register("phone", {
                      required: "Mobile number is required",
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: "Enter a valid 10-digit Indian phone number",
                      },
                    })}
                    className="flex-1 px-4 py-3.5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 outline-none text-[15px] dark:text-white font-medium focus:border-whatsapp-green transition-all placeholder:text-gray-400"
                  />
                </div>
                {phoneErrors.phone && (
                  <p className="text-xs text-red-500 mt-2 font-medium">
                    {phoneErrors.phone.message}
                  </p>
                )}
              </div>

              {/* Recaptcha container required by Firebase */}
              <div id="recaptcha-container"></div>

              <p className="text-[12px] text-gray-500/80 dark:text-gray-400 text-center leading-relaxed font-medium">
                WhatsApp will send an SMS message to verify your phone number.
                Carrier rates may apply.
              </p>

              <button
                type="submit"
                disabled={sendingOtp}
                className="w-full bg-whatsapp-green hover:bg-[#20bd5a] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-whatsapp-green/30 text-[15px] transition-all disabled:opacity-60 cursor-pointer"
              >
                {sendingOtp ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  <>
                    NEXT
                    <ArrowRight size={20} strokeWidth={2.5} />
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            /* ─── STEP 2: OTP Verification ─── */
            <motion.div
              key="step2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex justify-between gap-2">
                {otpValues.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-input-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    autoFocus={i === 0}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-14 bg-gray-50 dark:bg-white/5 rounded-2xl text-center text-xl font-bold text-slate-800 dark:text-white border-2 border-transparent focus:border-whatsapp-green focus:bg-white dark:focus:bg-transparent outline-none transition-all shadow-sm"
                  />
                ))}
              </div>

              <div className="flex items-center justify-between text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-gray-500 hover:text-slate-800 dark:hover:text-white transition-colors"
                >
                  Change Number
                </button>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={sendingOtp}
                  className="text-whatsapp-green hover:underline flex items-center gap-1"
                >
                  <RefreshCw size={12} className={sendingOtp ? "animate-spin" : ""} />
                  Resend SMS
                </button>
              </div>

              <button
                type="button"
                onClick={handleVerifyOtp}
                disabled={verifyingOtp || authLoading}
                className="w-full bg-whatsapp-green hover:bg-[#20bd5a] text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-whatsapp-green/30 text-[15px] transition-all disabled:opacity-60 cursor-pointer"
              >
                {verifyingOtp || authLoading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    VERIFY & ENTER
                    <ArrowRight size={20} strokeWidth={2.5} />
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
