import { Box, Card, Typography, Button } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import { FormField } from '../components/common/formField'
import background from '../assets/bgIMG.png';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import api from '../components/api';

const forgotPassword = () => {
    const navigate = useNavigate(); // Use the navigate hook from react-router-dom
    const [ isReset, setIsReset ] = useState(false);

    const formik = useFormik({
        initialValues: { email: '', otp: '', password: ''},
        validationSchema: Yup.object().shape({
          email: Yup.string().email('Invalid email').required('Email is required'),
        }),
        onSubmit: async (values) => {
          if(isReset){
            try{
              const response = await api.post('/resetPassword', {
                email: values.email,
                otp: values.otp,
                password: values.password,
              });
              console.log('response', response.data); 
              toast.success(response.data.success)
              setTimeout(() => {
                navigate('/login');
              }, 2000); 
            }catch(e){
              console.error('Reset Error:', e);
            }
          }else{
            try {
              const response = await api.post('/requestResetPassword', {
                email: values.email,
              });
              toast.success(response.data.success)
              setIsReset(true);
              console.log('response', response.data); 
            } catch (err: any) {
              // Log the error structure to inspect it
              console.error('Login Error:', err);

            //     toast.error('An unexpected error occurred. Please try again later.');
            //   }
            // } else {
            //   console.error('Non-Axios Error:', err);
            //   toast.error('An error occurred');
            // }
            
            // setError(err.message || 'An error occurred');
            }
          }
        },
      });
    
  return (
    <Box
    sx={{
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: '100vw',
      height: '100vh',
      backgroundImage: `url(${background})`,
      backgroundSize: '100% 100%',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
    }}
  >
    <Card sx={{ padding: 4, borderRadius: '12px', width: '100%', maxWidth: '280px', mr: 8 }}>
      {/* Title */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontSize: '18px', fontWeight: 'bold' }}>
          {isReset ? 'Reset Your Password' : 'Request to Reset Password'}
        </Typography>
      </Box>
  
      {/* Description */}
      {isReset ? '':
      <Typography
        variant="body2"
        sx={{
          textAlign: 'center',
          width: '100%',
          mb: 2,
        }}
      > Enter your Email ID to get an OTP< br />(One-Time Password) to Reset Password</Typography>}
        
      
  
      {/* Form */}
      <form onSubmit={formik.handleSubmit}>
      <FormField label="Email" name="email" formik={formik} />

      {isReset && (
        <>
          <FormField label="OTP" name="otp" formik={formik} />
          <FormField label="Password" name="password" type="password" formik={formik} />
        </>
      )}

      {/* Sign In Link */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 2 }}>
        <Link to={'/login'} style={{ color: '#a595f4', textDecoration: 'none', fontSize: '12px' }}>
          Sign in
        </Link>
      </Box>

      {/* Submit Button */}
      <Button
        fullWidth
        variant="contained"
        type="submit"
        sx={{
          textTransform: 'none',
          bgcolor: '#5744E3',
          '&:hover': { bgcolor: '#4534C8' },
        }}
      >
        {isReset ? 'Reset Password' : 'Send OTP'}
      </Button>
    </form>
  
      {/* Toast container */}
      <ToastContainer />
    </Card>
  </Box>
  
  )
}

export default forgotPassword