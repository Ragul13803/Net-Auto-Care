// src/components/Layout.js
import { Box } from '@mui/material';
import { Outlet } from 'react-router-dom'; // Outlet is used for nested routes
import LeftMenuBar from './leftMenuBar';

const Layout = () => {
  return (
    <Box sx={{ display: 'flex', position: 'relative', minHeight: '100vh' }}>
      {/* Left Sidebar */}
      <LeftMenuBar />

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1, // Take remaining space after sidebar
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          transition: 'margin-left 0.3s ease', // Smooth transition for margin change
          height: '100vh',
        }}
      >
        {/* Nested route content */}
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
