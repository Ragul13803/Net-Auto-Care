import React, { useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface CustomTextFieldProps {
  placeholder: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  type?: string;
  disabled: boolean
}

const CustomTextField: React.FC<CustomTextFieldProps> = ({
  placeholder,
  value,
  onChange,
  name,
  onBlur,
  type = "text",
  disabled
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === "password";
  const actualType = isPasswordField && showPassword ? "text" : type;

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <TextField
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      onChange={onChange}
      onBlur={onBlur}
      name={name}
      type={actualType}
      fullWidth
      variant="standard"
      InputProps={{
        disableUnderline: true,
        endAdornment: isPasswordField && (
          <InputAdornment position="end">
            <IconButton
              onClick={togglePasswordVisibility}
              edge="end"
              size="small"
            >
              {showPassword ? <Visibility fontSize="small" /> : <VisibilityOff fontSize="small" />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      sx={{
        '& .MuiInputBase-root': {
          border: '2px solid #d9d9d9',
          borderRadius: '8px',
          paddingRight: '8px', // spacing for eye icon
          '&:hover': { backgroundColor: 'transparent' },
          '&.Mui-focused': {
            backgroundColor: 'transparent',
            boxShadow: 'none',
          },
        },
        '& .MuiInputBase-input': {
          padding: '10px',
          fontSize: '12px',
        },
      }}
    />
  );
};

export default CustomTextField;