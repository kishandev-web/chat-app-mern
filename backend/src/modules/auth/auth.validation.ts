import * as yup from "yup";

export const verifyTokenValidation = yup.object({
  body: yup.object({
    token: yup.string().trim().required("Firebase token is required"),
  }),
});

export const completeProfilevalidation = yup.object({
  body: yup.object({
    name: yup.string().trim().required("Name is required"),
    userName: yup
      .string()
      .trim()
      .required("Username is required")
      .min(3, "Username must be at least 3 characters")
      .matches(/^[a-zA-Z0-9_]+$/, "Username can only have letters, numbers, underscores"),
    about: yup.string().trim().optional(),
  }),
});

