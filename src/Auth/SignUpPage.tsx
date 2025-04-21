// src/components/signup/SignUpPage.tsx
import { Box, Button, Card, Typography, Link } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { FormField } from '../components/common/formField';
import { ToastContainer, toast } from 'react-toastify';
import background from '../assets/bgIMG.png';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: { name: '', mobile: '', email: '', password: '', confirmPassword: '' },
    validationSchema: Yup.object().shape({
      name: Yup.string().required('Full name is required'),
      mobile: Yup.string().min(8, 'Minimum 8 characters').required('Full name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().min(8, 'Minimum 8 characters').required('Password is required'),
      confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post('/register', { name: values.name, mobile: values.mobile, email: values.email, password: values.password });
        
        if (response?.status === 200) {
          toast.success('Registration successful! Please check your email for OTP.');
          // After successful registration, navigate to OTP verification page
          navigate(`/otp-verify?email=${values.email}`);
        }
      } catch (err: any) {
        setError(err.message || 'An error occurred');
        toast.error(err.message || 'An error occurred');
      }
    },
  });


  const handleSignInRedirect = () => {
    navigate('/login');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100vw',
        height: '100vh',
        alignItems: 'center',
        backgroundImage: `url(${background})`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
      }}
    >       
        <Card sx={{ padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '260px', mr: 8 }}>
        <Typography sx={{ fontSize: '18px', fontWeight: 'bold', mb: 2 }}>Sign Up with NetAutoCare</Typography>

        <form onSubmit={formik.handleSubmit}>
          <FormField label="Full Name" name="name" formik={formik} />
          <FormField label="Mobile Number" name="mobile" formik={formik} />
          <FormField label="Email" name="email" formik={formik} />
          <FormField label="Password" name="password" type="password" formik={formik} />
          <FormField label="Confirm Password" name="confirmPassword" type="password" formik={formik} />

          {error && <Typography variant="caption" sx={{ color: 'red', mb: 1 }}>{error}</Typography>}

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ textTransform: 'none', bgcolor: '#5744E3' }}
          >
            Create Account
          </Button>

          {/* Sign-in redirect */}
          <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
            Already have an account?{' '}
            <Link sx={{ cursor: 'pointer', color: '#a595f4' }} onClick={handleSignInRedirect}>
              Sign In
            </Link>
          </Typography>        
        </form>
        <ToastContainer />
      </Card>
    </Box>
  );
};

export default SignUpPage;