import React, { useState, useEffect, useRef } from "react";
// import DashboardLayout from "../layouts/DashboardLayout";
import InputField from '../../components/InputField';
import { userDetails, updateUserProfile, imageUpload, deleteAccount } from '../../api/UsersApi';
import { useNavigate } from "react-router-dom"
import ConfirmDialog from "../../components/ConfirmDialog";
import toast from "react-hot-toast";

const SettingsPage = () => {
  const [user, setUser] = useState(null);
  const fileInputRef = useRef(null);
  const baseUrl = process.env.REACT_APP_FILE_BASE_URL
  const navigate = useNavigate();
  const [showDeleteAccountPopup, setShowDeleteAccountPopup] = useState(false);
  const [showRemoveImagePopup, setShowRemoveImagePopup] = useState(false);

  const [form, setForm] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    job_title: "",
    show_job_title: "",
    profile_pic: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        let userId = localStorage.getItem('user_id');
        let result = await userDetails({ 'id': userId });
        setUser(result.data);

        if (result.data) {
          setForm({
            id: result.data._id || "",
            first_name: result.data.first_name || "",
            last_name: result.data.last_name || "",
            email: result.data.email || "",
            job_title: result.data.job_title || "",
            show_job_title: result.data.show_job_title || "",
            profile_pic: result.data.profile_pic ? `${baseUrl}uploads/${result.data.profile_pic}` : ""
          })
        }
      } catch {
        setUser(null)
      }
    }
    fetchUserData()
  }, [])

  const handleFileUpload = () => {
    fileInputRef.current.click();
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      let formdata = new FormData()
      formdata.append('image', file)
      formdata.append('id', form.id)
      try {
        let result = await imageUpload(formdata)
        if (result && result.fileUrl) {
          setForm(prev => ({
            ...prev,
            profile_pic: `${baseUrl}uploads/${result.fileUrl}`
          }));
        }
        toast.success(result.message);
      } catch (err) {
        toast.error(err.response.data.message);
      }
    }
  }

  const onSave = async (e) => {
    e.preventDefault();

    let formDataToSend = { ...form };
    delete formDataToSend.profile_pic;

    // call API
    try {
      let result = await updateUserProfile(formDataToSend);
      if (result.data) {
        setForm(prev => ({
          ...prev,
          ...result.data,
          profile_pic: prev.profile_pic, // keep same image
        }));
        toast.success(result.message);
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  const handleConfirmDeleteAccount = async () => {
    try {
      let result = await deleteAccount({ id: form.id });
      if (result) {
        navigate('/');
      }
      setShowDeleteAccountPopup(false);
      toast.success(result.message);
    } catch (err) {
      toast.error(err.response.data.message);
    } 

  };

  const handleConfirmRemoveImage = async () => {
    try {
      let result = await imageUpload({ remove_image: 1, id: form.id });
      if (result) {
        setForm({ ...form, profile_pic: "" });
      }
      setShowRemoveImagePopup(false);
      toast.success(result.message);
    } catch (err) {
      toast.error(err.response.data.message);
    }
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
            <img src={form.profile_pic ? form.profile_pic : '/assets/user.png'} alt="Avatar" className="w-full h-auto" />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }} // 👈 Hide the input
          />
          <div className="flex gap-4">
            <button className="w-[106px] h-[40px] flex items-center justify-center gap-2 px-4 py-2 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] shadow-sm text-sm text-[#4A5565] font-medium hover:bg-gray-100 transition" onClick={handleFileUpload}>
              Change
            </button>
            <button className="w-[106px] h-[40px] flex items-center justify-center gap-2 px-4 py-2 rounded-[12px] border border-[#E5E7EB] bg-white shadow-sm text-sm text-[#4A5565] font-medium hover:bg-gray-100 transition" onClick={() => setShowRemoveImagePopup(true)}>
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

          <button className="px-5 py-3 rounded-[12px] border border-[#FBD5D5] bg-[#FDF2F2] text-[#C81E1E] text-[16px] font-medium shadow-sm hover:bg-[#FEE2E2] hover:text-[#991B1B] transition" onClick={() => setShowDeleteAccountPopup(true)}>
            Delete account
          </button>
        </div>
      </div>
      <ConfirmDialog
        show={showDeleteAccountPopup}
        title="Delete Account?"
        message="Once deleted, your account cannot be recovered."
        onConfirm={handleConfirmDeleteAccount}
        onCancel={() => setShowDeleteAccountPopup(false)}
      />

      <ConfirmDialog
        show={showRemoveImagePopup}
        title="Remove Profile Image?"
        message="Your profile will display a default avatar."
        onConfirm={handleConfirmRemoveImage}
        onCancel={() => setShowRemoveImagePopup(false)}
      />
    </div>

    // </DashboardLayout>
  );
};

export default SettingsPage;
