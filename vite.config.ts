import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      // Login route
      '/login': {
        target: 'https://netautocare.whyceeyes.com',  // Your backend API base URL
        changeOrigin: true,
        secure: false, // Set to true if your API uses HTTPS (use false for HTTP)
      },
      
      // Registration route
      '/register': {
        target: 'https://netautocare.whyceeyes.com',  // Your backend API base URL
        changeOrigin: true,
        secure: false, // Set to true if your API uses HTTPS
      },

      // Completed Bills route
      '/getBillsByStatus/Completed': {
        target: 'https://netautocare.whyceeyes.com',  // Same backend URL for fetching completed bills
        changeOrigin: true,
        secure: false, // Set to true if your API uses HTTPS
      },
      // Pending Bills route
      '/getBillsByStatus/Pending': {
        target: 'https://netautocare.whyceeyes.com',  // Same backend URL for fetching completed bills
        changeOrigin: true,
        secure: false, // Set to true if your API uses HTTPS
      },
      //getRecentlyaddedBills
      '/getRecentlyaddedBills': {
        target: 'https://netautocare.whyceeyes.com',  // Same backend URL for fetching completed bills
        changeOrigin: true,
        secure: false, // Set to true if your API uses HTTPS
      },
      //Verify OTP Route
      '/verifyOtp': {
        target: 'https://netautocare.whyceeyes.com',  // Same backend URL for fetching completed bills
        changeOrigin: true,
        secure: false, // Set to true if your API uses HTTPS
      },
      '/getBillById': {
        target: 'https://netautocare.whyceeyes.com',  // Same backend URL for fetching completed bills
        changeOrigin: true,
        secure: false, // Set to true if your API uses HTTPS
      },
      '/getProfile': {
        target: 'https://netautocare.whyceeyes.com',  // Same backend URL for fetching completed bills
        changeOrigin: true,
        secure: false, // Set to true if your API uses HTTPS
      },
      '/logout': {
        target: 'https://netautocare.whyceeyes.com',  // Same backend URL for fetching completed bills
        changeOrigin: true,
        secure: false, // Set to true if your API uses HTTPS
      },
       //getRecentlyPaidBills
       '/getRecentlyPaidBills': {
        target: 'https://netautocare.whyceeyes.com',  // Same backend URL for fetching completed bills
        changeOrigin: true,
        secure: false, // Set to true if your API uses HTTPS
      },
       //requestResetPassword
       '/requestResetPassword': {
        target: 'https://netautocare.whyceeyes.com',  // Same backend URL for fetching completed bills
        changeOrigin: true,
        secure: false, // Set to true if your API uses HTTPS
      },
      //resetPassword
      '/resetPassword': {
        target: 'https://netautocare.whyceeyes.com',  // Same backend URL for fetching completed bills
        changeOrigin: true,
        secure: false, // Set to true if your API uses HTTPS
      },
      //updateProfile
      '/updateProfile': {
        target: 'https://netautocare.whyceeyes.com',  // Same backend URL for fetching completed bills
        changeOrigin: true,
        secure: false, // Set to true if your API uses HTTPS
      },
    },
  },
});
