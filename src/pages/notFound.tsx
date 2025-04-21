// src/components/NotFound.tsx
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#575757' }}>404</Typography>
      <Typography variant="h6" sx={{ color: '#757575' }}>Oops! Page Not Found</Typography>
      <Button variant="contained" sx={{ marginTop: '20px' }} onClick={() => navigate('/')}>
        Go to Home
      </Button>
    </Box>
  );
};

export default NotFound;