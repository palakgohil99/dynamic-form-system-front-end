// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route, HashRouter } from 'react-router-dom';
import Login from './pages/Auth/login';
import Signup from './pages/Auth/signup';
import ForgotPassword from './pages/Auth/forgot-password';
import VerifyOtp from './pages/Auth/verify-otp';
import UpdatePassword from './pages/Auth/update-password';
import MainLayout from './layouts/main-layout';
import Settings from './pages/Settings/settings';
import VaultPage from './pages/Vault/vault';
import FormPage from './pages/Form/form';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerStyle={{
          zIndex: 999999,
        }}
      />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/update-password" element={<UpdatePassword />} />

          <Route path="/settings" element={<MainLayout />}>
            <Route path="/settings" element={<Settings />}></Route>
          </Route>
          <Route path="/vault" element={<MainLayout />}>
            <Route path="/vault" element={<VaultPage />}></Route>
          </Route>
          <Route path="/application-credentialing" element={<MainLayout />}>
            <Route path="/application-credentialing" element={<FormPage />}></Route>
          </Route>
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
