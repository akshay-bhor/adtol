import { Checkbox, FormControlLabel, makeStyles, Switch, TextField } from "@material-ui/core";
import { useField } from "formik";

const useStyles = makeStyles((theme) => ({
  errorText: {
    color: theme.palette.error.main,
    fontSize: '0.75rem',
    width: '60%',
    margin: '-20px auto 6px auto',
    textAlign: 'left'
  }
}));

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

export const MyCheckboxField = ({ label, className, ...props }) => {
  const [field, meta] = useField(props);
  const errorText = meta.error && meta.touched ? meta.error : "";
  const muiStyle = useStyles();

  return (
    <div>
      <FormControlLabel
        {...field}
        control={
          <Checkbox
            color="primary"
          />
        }
        label={label}
        className={className}
      />
      <div className={muiStyle.errorText}>&nbsp;&nbsp;&nbsp;&nbsp;{errorText}</div>  
    </div>
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
