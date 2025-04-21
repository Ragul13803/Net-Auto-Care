import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    proxy: {
      // Login route
      '/login': {
        target: 'https://netautocare.whyceeyes.com',  // Your backend API base URL
        changeOrigin: true,
        secure: false, // Set to true if your API uses HTTPS (use false for HTTP)
        rewrite: (path) => path.replace(/^\/login/, '/login'),
      },
      
      // Registration route
      '/register': {
        target: 'https://netautocare.whyceeyes.com',  // Your backend API base URL
        changeOrigin: true,
        secure: false, // Set to true if your API uses HTTPS
        rewrite: (path) => path.replace(/^\/register/, '/register'),
      },

      // Completed Bills route
      '/getBillsByStatus/Completed': {
        target: 'https://netautocare.whyceeyes.com',  // Same backend URL for fetching completed bills
        changeOrigin: true,
        secure: false, // Set to true if your API uses HTTPS
        // The proxy automatically handles the endpoint correctly, no need for a rewrite here
      },
      // Pending Bills route
      '/getBillsByStatus/Pending': {
        target: 'https://netautocare.whyceeyes.com',  // Same backend URL for fetching completed bills
        changeOrigin: true,
        secure: false, // Set to true if your API uses HTTPS
        // The proxy automatically handles the endpoint correctly, no need for a rewrite here
      },
      //getRecentlyaddedBills
      '/getRecentlyaddedBills': {
        target: 'https://netautocare.whyceeyes.com',  // Same backend URL for fetching completed bills
        changeOrigin: true,
        secure: false, // Set to true if your API uses HTTPS
        // The proxy automatically handles the endpoint correctly, no need for a rewrite here
      },
      //Verify OTP Route
      '/verifyOtp': {
        target: 'https://netautocare.whyceeyes.com',  // Same backend URL for fetching completed bills
        changeOrigin: true,
        secure: false, // Set to true if your API uses HTTPS
        // The proxy automatically handles the endpoint correctly, no need for a rewrite here
      },
      '/getBillById': {
        target: 'https://netautocare.whyceeyes.com',  // Same backend URL for fetching completed bills
        changeOrigin: true,
        secure: false, // Set to true if your API uses HTTPS
        // The proxy automatically handles the endpoint correctly, no need for a rewrite here
      },

    },
  },
});
