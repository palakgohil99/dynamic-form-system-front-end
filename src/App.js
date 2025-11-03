// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Auth/login';
import Signup from './pages/Auth/signup';
import ForgotPassword from './pages/Auth/forgot-password';
import VerifyOtp from './pages/Auth/verify-otp';
import UpdatePassword from './pages/Auth/update-password';
import MainLayout from './layouts/main-layout';
import Settings from './pages/Settings/settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/update-password" element={<UpdatePassword />} />

        <Route path="/settings" element={<MainLayout />}>
          <Route path="/settings" element={<Settings />}></Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
