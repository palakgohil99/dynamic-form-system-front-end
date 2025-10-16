// src/pages/Auth/SignUp.jsx
import React, { useState } from 'react';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import SocialLoginButton from '../../components/SocialLoginButton';
import { loginUser } from '../../api/AuthApi';

const Login = () => {
  const [form, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form);
    try {
      const res = await loginUser(form);
      console.log("✅ Login Success:", res);

      // You can now store JWT token, user data etc.
      localStorage.setItem("token", res);
      alert("Login successful!");
    } catch (err) {
      console.error(err);
      // setError(err.response?.data?.message || "Something went wrong!");
    } finally {
      // setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Image Section */}
      <div className="w-1/2 bg-gray-100 flex flex-col justify-center items-center p-8">
        <img
          src="/logo-placeholder.png"
          alt="Logo"
          className="w-16 h-16 mb-4"
        />
        <h2 className="text-xl font-bold mb-2">Credentialing & Certification Services</h2>
        <p className="text-gray-600 text-center">
          Manage all your licenses, certificates, and forms from one dashboard.
        </p>
      </div>

      {/* Right Form Section */}
      <div className="w-1/2 flex flex-col justify-center p-12">
        <h1 className="text-3xl font-bold mb-2">Let's get started!</h1>
        <p className="text-gray-700 mb-6">
          Sign in to Credentialing & Certification Services
        </p>

        <form onSubmit={handleSubmit}>
          <InputField
            label="Your email"
            type="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            name="email"
          />
          <InputField
            label="Your password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            name="password"
          />

          <p className="text-blue-600 text-sm mb-4 text-right cursor-pointer">
            Forgot Password?
          </p>

          <Button type="submit">Create account</Button>
          <SocialLoginButton>Login with Google →</SocialLoginButton>
          <SocialLoginButton>Login with CAQH ProView →</SocialLoginButton>

          <p className="text-center text-gray-600 mt-4">
            Not registered? <span className="text-blue-600 cursor-pointer">Create account</span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
