// src/pages/Auth/SignUp.jsx
import React, { useState } from 'react';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import SocialLoginButton from '../../components/SocialLoginButton';
import { loginUser } from '../../api/AuthApi';
import Loader from "../../components/Loader";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock } from 'lucide-react';

const Login = () => {
  const [form, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form);

    const newErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    }
    else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(form.password)
    ) {
      newErrors.password =
        "Password must be at least 8 characters, include 1 uppercase, 1 lowercase, and 1 number";
    }
    // If there are client-side errors, stop here
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    } else {
      setLoading(true);
    }


    try {
      const res = await loginUser(form);
      console.log("✅ Login Success:", res);

      // You can now store JWT token, user data etc.
      if(res.data.jwt_token != "") {
        console.log('res.data: ' + res.data)
        localStorage.setItem("token", res.data.jwt_token);
        localStorage.setItem("user_id", res.data._id);
        navigate("/settings");
      } else {
        setErrors({ general: "Invalid token or token has expired." });
      }
      
    } catch (err) {
      console.error('error: ' + JSON.stringify(err.response.data));
      setErrors({ general: err.response?.data?.message || "Something went wrong!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {loading && <Loader />}
      {/* Left Image Section */}
      <div className="w-full md:w-1/2 bg-gray-100 flex flex-col justify-center items-center p-6 md:p-10 relative">
        <div className="flex flex-col items-center text-center">
          <img
            src="/assets/Logo.png"
            alt="Logo"
            className="w-[200px] md:w-[300px] lg:w-[449px] h-auto mb-8"
          />
        </div>
        <div className="w-full max-w-[448px] min-h-[356px] flex flex-col items-center">
          {/* <div className="w-full h-[180px] flex items-center justify-center bg-gray-100 rounded-md mb-6"> */}
          <img
            src="/assets/Card.png"
            alt="Logo"
            className="flex flex-col w-full max-w-[448px] min-h-[356px] mx-auto"
          />
          {/* </div> */}
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 top-[181px] left-[764px]">
        <div className="top-[185px] w-[460px] left-[107px] h-[36px] opacity-100 mb-8 flex justify-start">
          <h2 className="font-base font-semibold text-4xl leading-9 tracking-normal text-gray-900">
            Let’s get started!
          </h2>
        </div>
        <div className="top-[185px] w-[460px] left-[107px] h-[36px] opacity-100 mb-8 flex justify-start">
          <h3 className="font-semibold text-xl leading-7 tracking-normal text-gray-900">
            Sign in to Credentialing & Certification Services
          </h3>
        </div>
        {/* <p className="text-gray-700 mb-6 text-center md:text-left w-[462px] h-[28px]">
          Sign in to Credentialing & Certification Services
        </p> */}
        {
          errors.general && (
            <p className="text-red-600 mb-2 text-center md:text-left">{errors.general}</p>
          )
        }
        <form onSubmit={handleSubmit} className="w-[462px] h-[390px] opacity-100 flex flex-col">
          <InputField
            label="Your email"
            type="text"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            name="email"
            icon={Mail}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          <InputField
            label="Your password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            name="password"
            icon={Lock}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          <p className="text-blue-600 font-semibold font-bold text-sm mb-4 text-right cursor-pointer">
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>

          <Button type="submit">Sign in</Button>
          <SocialLoginButton>Log in with Google →</SocialLoginButton>
          <SocialLoginButton>Log in with CAQH ProView →</SocialLoginButton>

          <p className="text-center text-gray-600 mt-4">
            Not registered? <Link to="/signup" className="text-blue-600 cursor-pointer">Create account</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
