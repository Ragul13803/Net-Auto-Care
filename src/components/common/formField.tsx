import { Box, Typography } from "@mui/material";
import CustomTextField from "./customTextField";

// FormField component remains the same
export const FormField = ({ label, name, type = 'text', formik }: any) => (
  <Box sx={{ display: 'flex', flexDirection: 'column', mb: 2 }}>
    <Typography variant="caption" sx={{ mb: 0.5, textAlign: 'left', color: '#ccc' }}>{label}</Typography>
    <CustomTextField
      placeholder={label}
      name={name}
      value={formik.values[name]}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      type={type}
    />
    {formik.touched[name] && formik.errors[name] && (
      <Typography variant="caption" sx={{ color: 'red', mt: 0.5, textAlign: 'left', alignSelf: 'flex-start' }}>
        * {formik.errors[name]}
      </Typography>
    )}
  </Box>
);
  