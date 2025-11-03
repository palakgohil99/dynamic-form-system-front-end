// src/pages/Auth/SignUp.jsx
import React, { useState } from 'react';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import SocialLoginButton from '../../components/SocialLoginButton';
import { registerUser } from '../../api/AuthApi';
import Loader from "../../components/Loader";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
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

    if (!form.first_name) {
      newErrors.first_name = "First name is required";
    }

    if (!form.last_name) {
      newErrors.last_name = "Last name is required";
    }

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
    }
    setLoading(true);
    try {
      const res = await registerUser(form);

      // You can now store JWT token, user data etc.
      localStorage.setItem("token", res);
      navigate("/");
    } catch (err) {
      console.error('error: ' + err.response.data.message);
      setErrors({ general: err.response?.data?.message || "Something went wrong!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
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
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 md:p-12 top-[181px] left-[764px] w-[676px]">
        <div className="top-[185px] w-[470px] left-[107px] h-[36px] opacity-100 mb-8 flex justify-start">
          <h2 className="opacity-100 absolute font-semibold text-4xl leading-9 tracking-normal font-base">
            Create an account.
          </h2>
        </div>
        <div className="top-[185px] w-[470px] left-[107px] h-[36px] opacity-100 mb-5 flex justify-start">
          <h3 className="font-semibold text-xl leading-7 tracking-normal text-gray-900">
            Sign up to Credentialing & Certification Services
          </h3>
        </div>
        {errors.general && (
          <p className="text-red-600 mb-2">{errors.general}</p>
        )}
        <form onSubmit={handleSubmit} className="w-[462px] h-[535px] opacity-100 flex flex-col">
          <InputField
            label="Enter Your First Name"
            type="text"
            placeholder="Enter your first name"
            value={form.first_name}
            onChange={handleChange}
            name="first_name"
          />
          {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
          <InputField
            label="Enter Your Last Name"
            type="text"
            placeholder="Enter your last name"
            value={form.last_name}
            onChange={handleChange}
            name="last_name"
          />
          {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
          <InputField
            label="Your email"
            type="text"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            name="email"
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          <InputField
            label="Your password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            name="password"
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}

          <Button type="submit">Sign Up</Button>
          <SocialLoginButton>Sign up with Google →</SocialLoginButton>
          <SocialLoginButton>Sign up with CAQH ProView →</SocialLoginButton>

          <p className="text-center text-gray-600 mt-4">
            Already have an account? <Link to="/" className="text-blue-600 cursor-pointer">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
