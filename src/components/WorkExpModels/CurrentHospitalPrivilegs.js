import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { addCurrentHospitalPrivileges } from "../../api/CredentialingApi"
import toast from "react-hot-toast";

const inputBase =
  "w-full h-[44px] rounded-[12px] border border-[#E5E7EB] bg-white px-4 text-sm text-[#111928] placeholder:text-[#6A7282] focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6]";

const labelBase = "text-sm font-medium text-[#111928]";
const helperText = "text-sm text-[#6A7282] leading-5";

const CurrentHospitalPrivilegs = ({ open, onClose, onSubmit, initialData }) => {
  const blankForm = () => ({
    id: crypto.randomUUID(),
    admitting_arrangements: "",
    primary_hospital: "",
    start_date: "",
    address: "",
    city: "",
    state_country: "",
    postal_code: "",
    country_code: "+12",
    phone_number: "",
    fax: "",
    email: "",
    full_unrestricted_privileges: null,
    types_of_privileges: "",
    privileges_temporary: null,
    primary_hospital_percentage: "",
  });

  const [form, setForm] = useState(blankForm());

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setForm({
        ...blankForm(),
        ...initialData,             // ✅ fills fields
        id: initialData.id ?? initialData._id, // ✅ keep same id for update
      });
    } else {
      setForm(blankForm());         // ✅ reset for Add
    }
  }, [open, initialData]);
  
  if (!open) return null;

  const setField = (name, value) => setForm((p) => ({ ...p, [name]: value }));

  const save = async () => {
    try {
      let result = await addCurrentHospitalPrivileges({ details: form, user_id: localStorage.getItem("user_id") });
      toast.success(result.message);
      onSubmit?.(form);
      onClose?.();
    } catch (err) {
      toast.error(err.response.data.message);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#111928]/50" onClick={onClose} />

      {/* Right panel */}
      <div className="absolute right-0 top-0 h-screen w-[520px] bg-white shadow-[0px_16px_40px_rgba(17,24,40,0.18)] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[#111928]">
            Add current hospital privileges
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-[10px] border border-transparent hover:bg-[#F9FAFB] flex items-center justify-center"
            aria-label="Close"
          >
            <X size={18} className="text-[#6A7282]" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-5">
            {/* Intro copy */}
            <p className="text-sm text-[#111928]">
              Considering you have hospital privileges, answer the following
              questions:
            </p>

            {/* Admitting arrangements */}
            <div className="space-y-2">
              <label className={labelBase}>
                If you do not have admitting privileges, what admitting
                arrangements do you have?
              </label>
              <textarea
                rows={4}
                className="w-full rounded-[12px] border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#111928] placeholder:text-[#6A7282] focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6]"
                placeholder="Write text here ..."
                value={form.admitting_arrangements}
                onChange={(e) => setField("admitting_arrangements", e.target.value)}
              />
              <p className="text-xs text-[#6A7282]">
                {Math.min(form.admitting_arrangements.length, 100)}/100 words
              </p>
            </div>

            {/* Primary hospital */}
            <div className="space-y-2">
              <label className={labelBase}>
                Primary hospital where you have admitting privileges{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                className={inputBase}
                placeholder="Enter hospital name"
                value={form.primary_hospital}
                onChange={(e) => setField("primary_hospital", e.target.value)}
              />
            </div>

            {/* Start date */}
            <div className="space-y-2">
              <label className={labelBase}>
                Start date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                className={inputBase}
                placeholder="MM/YYYY"
                value={form.start_date}
                onChange={(e) => setField("start_date", e.target.value)}
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className={labelBase}>
                Address <span className="text-red-500">*</span>
              </label>
              <input
                className={inputBase}
                placeholder="Enter full street address"
                value={form.address}
                onChange={(e) => setField("address", e.target.value)}
              />
            </div>

            {/* City + State/Country */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelBase}>
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  className={inputBase}
                  placeholder="Enter city"
                  value={form.city}
                  onChange={(e) => setField("city", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className={labelBase}>
                  State/Country <span className="text-red-500">*</span>
                </label>
                <input
                  className={inputBase}
                  placeholder="e.g., Maryland, USA"
                  value={form.state_country}
                  onChange={(e) => setField("state_country", e.target.value)}
                />
              </div>
            </div>

            {/* Postal code + Phone */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className={labelBase}>
                  Postal Code <span className="text-red-500">*</span>
                </label>
                <input
                  className={inputBase}
                  placeholder="Enter ZIP / postal code"
                  value={form.postal_code}
                  onChange={(e) => setField("postal_code", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className={labelBase}>
                  Phone number <span className="text-red-500">*</span>
                </label>

                <div className="flex">
                  <select
                    className="h-[44px] px-3 border border-[#E5E7EB] rounded-l-[12px] bg-[#F9FAFB] text-sm text-[#111928] focus:outline-none"
                    value={form.country_code}
                    onChange={(e) => setField("country_code", e.target.value)}
                  >
                    <option value="+12">🇺🇸 +12</option>
                    <option value="+91">🇮🇳 +91</option>
                    <option value="+44">🇬🇧 +44</option>
                  </select>

                  <input
                    className="h-[44px] w-full px-4 border border-l-0 border-[#E5E7EB] rounded-r-[12px] text-sm text-[#111928] placeholder:text-[#6A7282] focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6]"
                    placeholder="(410) 955-5000"
                    value={form.phone_number}
                    onChange={(e) => setField("phone_number", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Fax */}
            <div className="space-y-2">
              <label className={labelBase}>
                Fax <span className="text-red-500">*</span>
              </label>
              <input
                className={inputBase}
                placeholder="Enter fax number"
                value={form.fax}
                onChange={(e) => setField("fax", e.target.value)}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className={labelBase}>
                E-Mail <span className="text-red-500">*</span>
              </label>
              <input
                className={inputBase}
                placeholder="Enter email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
              />
            </div>

            {/* Full unrestricted privileges */}
            <div className="space-y-2">
              <p className={labelBase}>Full unrestricted privileges?</p>
              <div className="flex items-center gap-6 text-sm text-[#4A5565]">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="full_unrestricted_privileges"
                    className="h-4 w-4 accent-[#1447E6]"
                    checked={form.full_unrestricted_privileges === true}
                    onChange={() => setField("full_unrestricted_privileges", true)}
                  />
                  Yes
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="full_unrestricted_privileges"
                    className="h-4 w-4 accent-[#1447E6]"
                    checked={form.full_unrestricted_privileges === false}
                    onChange={() => setField("full_unrestricted_privileges", false)}
                  />
                  No
                </label>
              </div>
            </div>

            {/* Types of privileges */}
            <div className="space-y-2">
              <label className={labelBase}>
                Types of privileges <span className="text-red-500">*</span>
              </label>
              <input
                className={inputBase}
                placeholder="(Provisional, Limited, Conditional, etc.)"
                value={form.types_of_privileges}
                onChange={(e) => setField("types_of_privileges", e.target.value)}
              />
            </div>

            {/* Are privileges temporary */}
            <div className="space-y-2">
              <p className={labelBase}>Are privileges temporary?</p>
              <div className="flex items-center gap-6 text-sm text-[#4A5565]">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="privileges_temporary"
                    className="h-4 w-4 accent-[#1447E6]"
                    checked={form.privileges_temporary === true}
                    onChange={() => setField("privileges_temporary", true)}
                  />
                  Yes
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="privileges_temporary"
                    className="h-4 w-4 accent-[#1447E6]"
                    checked={form.privileges_temporary === false}
                    onChange={() => setField("privileges_temporary", false)}
                  />
                  No
                </label>
              </div>
            </div>

            {/* Percentage */}
            <div className="space-y-2">
              <label className={labelBase}>
                Of the total number of admissions to all hospitals in the past
                year, what percentage is to primary hospital?
              </label>
              <input
                className={inputBase}
                placeholder="Enter approximate percentage (e.g., 60%)"
                value={form.primary_hospital_percentage}
                onChange={(e) => setField("primary_hospital_percentage", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#E5E7EB] bg-white px-6 py-4">
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={save}
              className="h-[44px] px-6 rounded-[12px] bg-[#1447E6] text-white text-sm font-medium shadow-[0px_1px_0.5px_0.05px_#1D293D05]"
            >
              Add hospital privileges
            </button>

            <button
              type="button"
              onClick={onClose}
              className="h-[44px] px-6 rounded-[12px] border border-[#E5E7EB] bg-white text-sm font-medium text-[#4A5565] hover:bg-[#F9FAFB]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentHospitalPrivilegs;
