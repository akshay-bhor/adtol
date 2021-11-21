import * as yup from "yup";

export const registerValidationSchema = yup.object({
    user: yup
      .string("Enter your Username")
      .required("Username is Required")
      .min(4, "Min username length is 4"),
    mail: yup
      .string("Enter your Email")
      .required("Email is required")
      .email("Inavalid email"),
    pass: yup
      .string("Enter your Password")
      .required("Password is Required")
      .min(8, "Min password length is 8"),
    country: yup.string("Select your country").required("Country is required"),
    mobile: yup
      .string("Enter your Phone")
      .required("Phone is required")
      .min(4, "Min phone length is 4")
      .max(10, "Max phone length is 10"),
    ac_type: yup
      .string("Select account type")
      .required("Account type is required"),
    agreement: yup.boolean().oneOf([true], 'You must agree to guildlines and terms of service'),
  });

  export const googleRegisterValidationSchema = yup.object({
    user: yup
      .string("Enter your Username")
      .required("Username is Required")
      .min(4, "Min username length is 4"),
    country: yup.string("Select your country").required("Country is required"),
    mobile: yup
      .string("Enter your Phone")
      .required("Phone is required")
      .min(4, "Min phone length is 4")
      .max(10, "Max phone length is 10"),
    ac_type: yup
      .string("Select account type")
      .required("Account type is required"),
    agreement: yup.boolean().oneOf([true], 'You must agree to guildlines and terms of service'),
  });