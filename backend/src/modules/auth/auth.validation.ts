import * as yup from "yup";

export const verifyTokenValidation = yup.object({
  body: yup.object({
    token: yup.string().trim().required(),
  }),
});

export const completeProfilevalidation = yup.object({
  body: yup.object({
    name: yup.string().trim().required(),
    userName: yup.string().trim().required(),
    about: yup.string().trim().required(),
    bio: yup.string().trim().optional(),
  }),
  params: yup.object({
    id: yup.string().trim().required(),
  }),
});
