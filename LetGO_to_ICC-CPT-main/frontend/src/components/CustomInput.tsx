import React, { ReactNode } from "react";
import { TextField, InputAdornment, TextFieldProps } from "@mui/material";
import { UseFormRegister, FieldErrors } from "react-hook-form";

type CustomInputProps = Omit<TextFieldProps, "name"> & {
  name?: string;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  label?: string;
  placeholder?: string;
  icon?: ReactNode; // icon to render at start adornment
  inputStyle?: React.CSSProperties; // optional styles for input element
};

const CustomInput: React.FC<CustomInputProps> = ({
  register,
  errors,
  name = "input",
  label,
  placeholder,
  icon,
  inputStyle,
  disabled = false,
  ...rest
}) => {

  return (
    <TextField
      label={label}
      placeholder={placeholder}
      fullWidth
      required
      error={!!errors[name]}
      {...register(name)}
      disabled={disabled}
      inputProps={{
        style: inputStyle,
        ...rest.inputProps,
      }}
      InputProps={{
        startAdornment: icon ? (
          <InputAdornment position="start">{icon}</InputAdornment>
        ) : undefined,
        ...rest.InputProps,
      }}
      {...rest}
    />
  );
};

export default CustomInput;
