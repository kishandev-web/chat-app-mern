import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowRight, MessageCircle } from "lucide-react";
import { sendOtp, verifyOtp } from "../services/authService";

const LoginScreen = ({ onLogin }) => {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };
  const handleSendOtp = async () => {
    try {
      const cleanPhone = phone.trim();
      if (!cleanPhone) {
        alert("Phone number required");
        return;
      }
      if (!/^\d+$/.test(cleanPhone)) {
        alert("Only numbers allowed");
        return;
      }
      if (cleanPhone.length !== 10) {
        alert("Enter valid phone number");
        return;
      }
      await sendOtp(`+91${phone}`);

      setStep(2);
      alert("OTP sent successfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleVerifyOtp = async () => {
    const code = otp.join("");

    const firebaseToken = await verifyOtp(code);

    console.log(firebaseToken);

    onLogin();
  };

  // const handleContinue = () => {
  //   if (step === 1 && phone) {
  //     setStep(2);
  //   } else if (step === 2) {
  //     onLogin();
  //   }
  // };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#f0f2f5] dark:bg-whatsapp-dark overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-whatsapp-green-dark/10 dark:bg-whatsapp-green-dark/5 z-0" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-whatsapp-green/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-whatsapp-blue/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
        className="w-full max-w-[420px] mx-6 glass dark:glass-dark rounded-[32px] p-10 z-10 shadow-2xl relative border border-white/40 dark:border-white/5"
      >
        <div className="flex flex-col items-center mb-10">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="w-20 h-20 bg-whatsapp-green rounded-[24px] flex items-center justify-center shadow-xl shadow-whatsapp-green/40 mb-6"
          >
            <MessageCircle size={44} color="white" fill="white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
            WhatsApp
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-[15px] mt-2 font-medium text-center">
            {step === 1
              ? "Verify your phone number"
              : "Enter verification code"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="space-y-8"
            >
              <div className="space-y-5">
                {/* <div className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-transparent focus-within:border-whatsapp-green transition-all cursor-pointer">
                  <span className="text-[15px] dark:text-white font-semibold">
                    United States
                  </span>
                  <ChevronDown size={20} className="text-gray-400" />
                </div> */}
                <div className="flex gap-4">
                  <div className="w-24 p-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-transparent text-center font-bold text-slate-800 dark:text-white">
                    +91
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone number"
                    autoFocus
                    maxLength={10}
                    value={phone}
                    // onChange={(e) => setPhone(e.target.value)}
                    onChange={(e) =>
                      setPhone(e.target.value.replace(/\D/g, ""))
                    }
                    className="flex-1 p-4 bg-gray-50/50 dark:bg-white/5 rounded-2xl border border-transparent outline-none text-[16px] dark:text-white font-medium focus:ring-2 ring-whatsapp-green/20 transition-all placeholder:text-gray-400"
                  />
                  <div id="recaptcha-container"></div>
                </div>
              </div>
              <p className="text-[12px] text-gray-500/80 dark:text-gray-400 text-center leading-relaxed font-medium">
                WhatsApp will send an SMS message to verify your phone number.
                Carrier charges may apply.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex justify-between gap-3">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    autoFocus={i === 0}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-full h-16 bg-gray-50/80 dark:bg-white/5 rounded-2xl text-center text-2xl font-bold text-slate-800 dark:text-white border-2 border-transparent focus:border-whatsapp-green focus:bg-white dark:focus:bg-transparent outline-none transition-all shadow-sm"
                  />
                ))}
              </div>
              <div className="text-center">
                <button className="text-[14px] text-whatsapp-green font-bold hover:underline transition-all underline-offset-4">
                  Didn't receive code? Resend SMS
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: "#20bd5a" }}
          whileTap={{ scale: 0.98 }}
          onClick={step === 1 ? handleSendOtp : handleVerifyOtp}
          className="w-full bg-whatsapp-green text-white font-bold py-4.5 rounded-2xl mt-10 flex items-center justify-center gap-3 shadow-xl shadow-whatsapp-green/30 text-[16px] transition-all"
        >
          {step === 1 ? "NEXT" : "VERIFY"}
          <ArrowRight size={22} strokeWidth={2.5} />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default LoginScreen;
