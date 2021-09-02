import { FormControlLabel, Switch, TextField } from "@material-ui/core";
import { useField } from "formik";

export const MyTextField = ({ label, type, className, disabled, multiline, placeholder, ...props }) => {
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
      disabled={disabled ? true : false}
      multiline={multiline ? true : false}
      placeholder={placeholder ? placeholder : ''}
      rows={'3'}
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
          checked={field.value}
          {...field}
        />
      }
      label={label}
    />
  );
};
