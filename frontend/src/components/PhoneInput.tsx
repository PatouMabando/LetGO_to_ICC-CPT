import React from "react";
import { TextField, InputAdornment, TextFieldProps } from "@mui/material";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import { UseFormRegister, FieldErrors } from "react-hook-form";

type PhoneInputProps = Omit<TextFieldProps, "name"> & {
  name?: string; // default "phone"
  register: UseFormRegister<any>; // form register function
  errors: FieldErrors<any>; // form errors object
  label?: string;
  placeholder?: string;
};

const PhoneInput: React.FC<PhoneInputProps> = ({
  register,
  errors,
  name = "phone",
  label = "Mobile Number (E.164 format)",
  placeholder = "+27821234567",
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
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <PhoneIphoneIcon color="primary" />
          </InputAdornment>
        ),
        ...rest.InputProps,
      }}
      {...rest}
    />
  );
};

export default PhoneInput;
