import { Box, Button, Card, Typography, Link } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { FormField } from '../components/common/formField';
import { ToastContainer, toast } from 'react-toastify';
import background from '../assets/bgIMG.png';
import google from '../assets/google-logo.png';

const LoginPage = () => {
  const navigate = useNavigate(); // Use the navigate hook from react-router-dom
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object().shape({
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string().min(8, 'Minimum 8 characters').required('Password is required'),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post('/login', {
          email: values.email,
          password: values.password,
        });

        console.log('response', response.data); 
        
        if (response?.status === 200 && response?.data?.data?.access_token) {
          const access_token = response.data.data.access_token;
          sessionStorage.setItem('access_token', access_token);
          navigate('/dashboard');
          toast.success('Sign in successful!');
        } else {
          setError('Login failed. Please check your credentials and try again.');
          toast.error('Login failed. Please check your credentials.');
        }
      } catch (err: any) {
        // Log the error structure to inspect it
        console.error('Login Error:', err);
        if (axios.isAxiosError(err)) {
          // Check if the error has a response property
          if (err.response && err.response?.status === 403 ) {
            const errorMessage = err.response?.data?.message || 'An error occurred during login.';
            console.log('Axios Error Response:', err.response);
            console.log('err.response.data.message:', err.response.data.message);
            toast.error(errorMessage, {
              onClose: () => {
                navigate(`/otp-verify?email=${encodeURIComponent(values.email)}`);
              },
            });
          } else {
            console.error('Error without response:', err.message);
            toast.error('An unexpected error occurred. Please try again later.');
          }
        } else {
          console.error('Non-Axios Error:', err);
          toast.error('An error occurred');
        }
        
        setError(err.message || 'An error occurred');
      }
    },
  });

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
      <Card sx={{ padding: '30px', borderRadius: '12px', width: '100%', maxWidth: '260px', mr: 8 }}>
        {/* Left-aligned Title and Link */}
        <Box sx={{ textAlign: 'left', mb: 2 }}>
          <Typography variant="h6" sx={{ fontSize: '18px', fontWeight: 'bold' }}>Sign in to NetAutoCare.</Typography>
          <Typography variant="body2">
            New here? <Link href="/signup" sx={{ color: '#a595f4', cursor: 'pointer', textDecoration: 'none' }}>Create an account</Link>
          </Typography>
        </Box>

        {/* Form */}
        <form onSubmit={formik.handleSubmit}>
          <FormField label="Email" name="email" formik={formik} />

          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <FormField label="Password" name="password" type="password" formik={formik} />

            {/* Forgot Password Link */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: '-6px', mb: '10px' }}>
              <Link href="/forgot-password" sx={{ color: '#a595f4', textDecoration: 'none', fontSize: '12px' }}>
                Forgot password?
              </Link>
            </Box>
          </Box>

          {error && <Typography variant="caption" sx={{ color: 'red', mb: 1 }}>{error}</Typography>}

          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ textTransform: 'none', bgcolor: '#5744E3' }}
          >
            Sign in
          </Button>

          {/* OR Divider */}
          <Box sx={{ display: 'flex', alignItems: 'center', my: '10px' }}>
            <Box sx={{ flex: 1, height: '1px', backgroundColor: '#ccc' }} />
            <Typography variant="body2" sx={{ mx: '6px' }}>OR</Typography>
            <Box sx={{ flex: 1, height: '1px', backgroundColor: '#ccc' }} />
          </Box>

          <Button
            fullWidth
            variant="outlined"
            sx={{
              position: 'relative',
              textTransform: 'none',
              color: '#a595f4',
              border: '1px solid #ccc',
              boxShadow: 'none',
              '&:focus': { outline: 'none', boxShadow: 'none' },
              '&:hover': { backgroundColor: 'none', boxShadow: 'none' },
            }}
          >
            <Box
              component="img"
              src={google}
              alt="Google logo"
              sx={{ position: 'absolute', left: 8, height: 20, width: 20 }}
            />
            Sign in with Google
          </Button>
        </form>

        <ToastContainer />
      </Card>
    </Box>
  );
};

export default LoginPage;