// src/router/AppRouter.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '../components/layout';
import SignUpPage from '../Auth/SignUpPage';
import LoginPage from '../Auth/loginPage';
import OtpVerificationPage from '../Auth/otpVerificationPage';
import NotFound from '../pages/notFound';
import DashboardTabs from '../components/Dashboard/dashboardTabs';
import DetailsViewBill from '../components/common/detailsViewBill';
import ForgotPassword from '../Auth/forgotPassword';
import Account from '../components/account';

const AppRouter = () => {
  return (
    <Routes>
      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" />} />

      {/* Login and signup routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      
      {/* OTP verification route */}
      <Route path="/otp-verify" element={<OtpVerificationPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Routes with layout */}
      <Route element={<Layout />}>
      <Route path="/dashboard" element={<Navigate to="/dashboard/recent" />} />
      <Route path="/dashboard/recent" element={<DashboardTabs />} />
      <Route path="/dashboard/pending" element={<DashboardTabs />} />
      <Route path="/dashboard/completed" element={<DashboardTabs />} />
      <Route path="/account" element={<Account />} />

      <Route path="/dashboard/recent-detail" element={<DetailsViewBill />} />
      <Route path="/dashboard/pending-detail" element={<DetailsViewBill />} />
      <Route path="/dashboard/completed-detail" element={<DetailsViewBill />} />
      
    </Route>

      {/* 404 page */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;