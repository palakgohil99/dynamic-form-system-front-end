// src/pages/Auth/SignUp.jsx
import React, { useState } from 'react';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { verifyOtp } from '../../api/AuthApi';
import Loader from "../../components/Loader";
import { Link, useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [form, setFormData] = useState({
    otp: '',
  });

  const [errors, setErrors] = useState({});

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const email = localStorage.getItem('email');
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(form);

    const newErrors = {};

    if (!form.otp) {
      newErrors.otp = "Please Enter OTP";
    }

    // If there are client-side errors, stop here
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    try {
      const res = await verifyOtp({ 'email': email, 'otp': form.otp });

      // You can now store JWT token, user data etc.
      localStorage.setItem("token", res);
      navigate("/update-password");
      console.log('result: ' + JSON.stringify(res));
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
            Verify Your OTP
          </h2>
        </div>
        <div className="top-[185px] w-[470px] left-[107px] h-[36px] opacity-100 mb-12 flex justify-start">
          <h3 className="font-semibold text-xl leading-7 tracking-normal text-gray-900">
            Enter the 6 digit code which has been sent to your email.
          </h3>
        </div>

        {errors.general && (
          <p className="text-red-600 mb-2">{errors.general}</p>
        )}
        <form onSubmit={handleSubmit} className="w-[462px] h-[155px] opacity-100 flex flex-col">
          {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
          <InputField
            label="Enter Your OTP"
            type="text"
            placeholder="Enter Your OTP"
            value={form.otp}
            onChange={handleChange}
            name="otp"
          />
          {errors.otp && <p className="text-red-500 text-sm mt-1">{errors.otp}</p>}

          <Button type="submit">Verify OTP</Button>

        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
