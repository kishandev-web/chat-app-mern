import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

import { auth } from "../config/firebase";

let confirmationResult = null;

export const sendOtp = async (
  phoneNumber
) => {
  const verifier =
    new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "invisible",
      }
    );

  confirmationResult =
    await signInWithPhoneNumber(
      auth,
      phoneNumber,
      verifier
    );

  return true;
};


export const verifyOtp = async (
  otp
) => {
  if (!confirmationResult) {
    throw new Error(
      "Send OTP first"
    );
  }

  const result =
    await confirmationResult.confirm(
      otp
    );

  const firebaseToken =
    await result.user.getIdToken();

  return firebaseToken;
};


/////new//////



// import {
//   RecaptchaVerifier,
//   signInWithPhoneNumber,
// } from "firebase/auth";

// import { auth } from "../firebase";

// let confirmationResult = null;

// export const setupRecaptcha = () => {
//   if (!window.recaptchaVerifier) {
//     window.recaptchaVerifier =
//       new RecaptchaVerifier(
//         auth,
//         "recaptcha-container",
//         {
//           size: "invisible",
//         }
//       );
//   }
// };

// export const sendOtp = async (phone) => {
//   setupRecaptcha();

//   confirmationResult =
//     await signInWithPhoneNumber(
//       auth,
//       phone,
//       window.recaptchaVerifier
//     );

//   return confirmationResult;
// };

// export const verifyOtp = async (otp) => {
//   const result =
//     await confirmationResult.confirm(
//       otp
//     );

//   return result.user;
// };

// const token =
//   await user.getIdToken();

// await fetch(
//   "http://localhost:5000/api/auth/firebase",
//   {
//     method: "POST",
//     headers: {
//       "Content-Type":
//         "application/json",
//     },
//     body: JSON.stringify({
//       token,
//     }),
//   }
// );