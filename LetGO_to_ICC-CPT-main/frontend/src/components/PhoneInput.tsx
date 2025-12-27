import { TextField, InputAdornment } from "@mui/material";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import { FieldErrors, UseFormRegister } from "react-hook-form";

type PhoneInputProps = {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  name?: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
};

const PhoneInput: React.FC<PhoneInputProps> = ({
  register,
  errors,
  name = "phone",
  label = "Phone number",
  placeholder = "+27780492663",
  disabled = false,
}) => {
  const errorMessage = errors[name]?.message as string | undefined;

  return (
    <TextField
      label={label}
      placeholder={placeholder}
      fullWidth
      required
      {...register(name)}
      disabled={disabled}
      error={!!errorMessage}
      helperText={errorMessage} // ✅ MESSAGE AFFICHÉ
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <PhoneIphoneIcon sx={{ color: "#FF9900" }} />
          </InputAdornment>
        ),
      }}
      sx={{
        "& .MuiOutlinedInput-root": {
          borderRadius: "12px",
          "& fieldset": {
            borderColor: "#142C54",
          },
          "&:hover fieldset": {
            borderColor: "#FF9900",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#FF9900",
          },
        },
      }}
    />
  );
};

export default PhoneInput;