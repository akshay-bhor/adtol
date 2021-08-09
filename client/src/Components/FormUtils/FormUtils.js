import { FormControlLabel, Switch, TextField } from "@material-ui/core";
import { useField } from "formik";

export const MyTextField = ({ label, type, className, ...props }) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : "";

  return (
    <TextField
      label={label}
      type={type}
      className={className}
      {...field}
      helperText={errorText}
      error={!!errorText}
      variant="outlined"
    ></TextField>
  );
};

export const MySelectField = ({ label, size, className, ...props }) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : "";

  return (
    <TextField
      label={label}
      select
      className={className}
      {...field}
      helperText={errorText}
      error={!!errorText}
      variant="outlined"
      size={size ? size : 'medium'}
    >
      {props.children}
    </TextField>
  );
};

export const MySwitchField = ({ label, className, ...props }) => {
  const [field, meta] = useField(props);

  return (
    <FormControlLabel
      className={className}
      control={
        <Switch
          color="primary"
          {...field}
        />
      }
      label={label}
    />
  );
};
