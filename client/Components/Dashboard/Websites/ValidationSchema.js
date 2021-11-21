import * as yup from "yup";

export const websiteFormValidationSchema = yup.object({
  domain: yup
    .string("Enter domain without http or www")
    .matches(
        /((https?):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/,
        'Enter correct url!'
    )
    .required("Domain name is required"),
  category: yup
    .string("Select website category")
    .required("Category is required"),
  language: yup.string("Select language").required("Language is required"),
  traffic: yup
    .number("Enter daily traffic")
    .required("Daily traffic is required"),
});
