import React, { useState } from "react";
// import DashboardLayout from "../layouts/DashboardLayout";
import InputField from '../../components/InputField';

const SettingsPage = () => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    job_title: "",
    show_job_title: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  const onSave = (e) => {
    e.preventDefault();
    // call API
    console.log("save", form);
    alert("Saved (mock)");
  };

  const onCancel = (e) => {
    e.preventDefault();
    // reset or navigate
    alert("Cancelled");
  };

  return (
    // <DashboardLayout>
    <div className="relative flex flex-col w-full h-[calc(100vh-96px)] overflow-hidden bg-white shadow-sm mt-[96px]">
      {/* Sticky Header Section */}
      <div className="sticky top-0 z-20 bg-white border-b border-[#E5E7EB] shadow-sm">
        <div className="px-6 md:px-8 py-6">
          {/* Header Title & Search */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold text-[#181D27]">Settings</h2>

            <div className="flex items-center w-full md:w-[320px] px-3 py-2 gap-2 rounded-lg border border-[#E5E7EB] bg-white shadow-[0px_1px_2px_0px_#0A0D120D]">
              <input
                placeholder="Search"
                className="w-full outline-none text-sm text-[#4A5565] placeholder:text-[#9CA3AF]"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 border border-[#E5E7EB] rounded-xl p-2 shadow-[0px_1px_0.5px_0.05px_#1D293D05] overflow-x-auto">
            <div className="flex gap-2 min-w-max">
              <button className="flex items-center gap-2 px-4 py-2 rounded-md bg-[#E0E7FF] text-[#1447E6] font-medium text-sm">
                <span className="w-3 h-3 bg-[#1447E6] rounded-sm"></span>
                Personal Information
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm text-[#4A5565] hover:bg-gray-100">
                <span className="w-3 h-3 bg-[#E4E4E4] rounded-sm"></span>
                Notifications
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm text-[#4A5565] hover:bg-gray-100">
                <span className="w-3 h-3 bg-[#E4E4E4] rounded-sm"></span>
                Security
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm text-[#4A5565] hover:bg-gray-100">
                <span className="w-3 h-3 bg-[#E4E4E4] rounded-sm"></span>
                Integrations
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content Section */}
      <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-[#181D27]">Profile</h3>
          <p className="text-sm text-[#535862]">
            Update your name, email and other personal details here.
          </p>
        </div>

        <hr className="border-[#E9EAEB]" />

        {/* Profile Picture + Buttons */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-[108px] h-[108px] rounded-full border border-gray-200 bg-[#F5F5F5] flex items-center justify-center overflow-hidden">
            <img src="/assets/user.png" alt="Avatar" className="w-full h-auto" />
          </div>
          <div className="flex gap-4">
            <button className="w-[106px] h-[40px] flex items-center justify-center gap-2 px-4 py-2 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] shadow-sm text-sm text-[#4A5565] font-medium hover:bg-gray-100 transition">
              Change
            </button>
            <button className="w-[106px] h-[40px] flex items-center justify-center gap-2 px-4 py-2 rounded-[12px] border border-[#E5E7EB] bg-white shadow-sm text-sm text-[#4A5565] font-medium hover:bg-gray-100 transition">
              Remove
            </button>
          </div>
        </div>

        <hr className="border-[#E9EAEB]" />

        {/* Profile Form */}
        <form onSubmit={onSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="First name"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              required
              placeholder="Enter your first name"
            />
            <InputField
              label="Last name"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              required
              placeholder="Enter your last name"
            />
          </div>
          <hr className="border-[#E9EAEB]" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="Email ID"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
          <hr className="border-[#E9EAEB]" />
          <InputField
            label="Job title"
            name="job_title"
            value={form.job_title}
            onChange={handleChange}
            placeholder="Enter youe job title"
          />

          <label className="flex items-center gap-2 text-sm text-[#414651]">
            <input
              type="checkbox"
              name="show_job_title"
              checked={form.show_job_title}
              onChange={handleChange}
              className="w-4 h-4 rounded border-gray-300"
            />
            Show my job title in my profile
          </label>

          {/* Buttons */}
          <div className="flex justify-end items-center gap-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-3 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] text-[#4A5565] text-[16px] font-medium shadow-sm hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-3 rounded-[12px] border border-[#1447E6] bg-[#1447E6] text-white text-[16px] font-medium shadow-sm hover:bg-[#0d3bcf] transition"
            >
              Save changes
            </button>
          </div>
        </form>

        <hr className="border-[#E9EAEB]" />

        {/* Delete Account Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-semibold text-lg text-[#181D27]">
              Delete your account
            </h4>
            <p className="text-sm text-[#4B5563]">
              Once you delete your account, there's no going back.{" "}
              <span className="text-[#535862] font-bold">
                Proceed with certainty.
              </span>
            </p>
          </div>

          <button className="px-5 py-3 rounded-[12px] border border-[#FBD5D5] bg-[#FDF2F2] text-[#C81E1E] text-[16px] font-medium shadow-sm hover:bg-[#FEE2E2] hover:text-[#991B1B] transition">
            Delete account
          </button>
        </div>
      </div>
    </div>

    // </DashboardLayout>
  );
};

export default SettingsPage;
