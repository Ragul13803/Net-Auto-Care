// src/components/Layout.js
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom'; // Outlet is used for nested routes
import LeftMenuBar from './leftMenuBar';

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', position: 'absolute', top: 0 }}>
      {/* Left Sidebar */}
      <LeftMenuBar />
      
      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, // Take remaining space
          bgcolor: 'background.default',
          display: 'flex',
          justifyContent: 'flex-start',
          flexDirection: 'column',
          transition: 'margin-left 0.3s ease', // Smooth transition for margin change
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;