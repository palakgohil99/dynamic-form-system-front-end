import React, { useState } from "react";
import { X, CalendarDays } from "lucide-react";
import { addLicense } from '../../api/CredentialingApi'
import toast from "react-hot-toast";

const inputBase =
  "w-full h-[44px] rounded-[12px] border border-[#E5E7EB] bg-white px-4 text-sm text-[#111928] placeholder:text-[#6A7282] focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6]";

const labelBase = "text-sm font-medium text-[#111928]";
const helperText = "text-sm text-[#6A7282] leading-5";

const License = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState({
    id: crypto.randomUUID(),
    license_type: "",
    license_number: "",
    date_of_issue: "",
    date_of_expiration: "",
    registration_state: "",
    currently_practicing_state_additional: "", // "yes" | "no"
  });

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleRadio = (value) => {
    setForm((p) => ({
      ...p,
      currently_practicing_state_additional: value, // 1 or 0
    }));
  };

  const handleAdd = async () => {
    // If you want boolean for backend:
    try {
      let result = await addLicense({ details: form, user_id: localStorage.getItem("user_id") });
      if (result.data) {
        onSave?.(form);
        onClose?.();
        toast.success(result.message);
      } else {
        toast.error('Oops! Something went wrong');
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#111928]/50" onClick={onClose} />

      {/* Right panel */}
      <div className="absolute right-0 top-0 h-screen w-[520px] bg-white shadow-[0px_16px_40px_rgba(17,24,40,0.18)] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[#111928]">
            Add more license
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="space-y-5">
            {/* License Type */}
            <div className="space-y-2">
              <label className={labelBase}>
                License Type <span className="text-red-500">*</span>
              </label>
              <input
                className={inputBase}
                name="license_type"
                value={form.license_type}
                onChange={handleChange}
                placeholder="Professional license type issued by a state board."
              />
            </div>

            {/* License Number */}
            <div className="space-y-2">
              <label className={labelBase}>
                License Number <span className="text-red-500">*</span>
              </label>
              <input
                className={inputBase}
                name="license_number"
                value={form.license_number}
                onChange={handleChange}
                placeholder="e.g., TX123456"
              />
            </div>

            {/* Original Date of Issue */}
            <div className="space-y-2">
              <label className={labelBase}>
                Original Date of Issue <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <CalendarDays
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
                />
                <input
                  type="date"
                  className={`${inputBase} pl-10`}
                  name="date_of_issue"
                  value={form.date_of_issue}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Expiration Date */}
            <div className="space-y-2">
              <label className={labelBase}>
                Expiration Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <CalendarDays
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
                />
                <input
                  type="date"
                  className={`${inputBase} pl-10`}
                  name="date_of_expiration"
                  value={form.date_of_expiration}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* State of Registration */}
            <div className="space-y-2">
              <label className={labelBase}>
                State of Registration <span className="text-red-500">*</span>
              </label>
              <input
                className={inputBase}
                name="registration_state"
                value={form.registration_state}
                onChange={handleChange}
                placeholder="e.g., Texas"
              />
            </div>

            {/* Radio: currently practice */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <label className={labelBase}>
                  Do you currently practice in this state?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-[#6A7282]">(i)</span>
              </div>

              <div className="flex items-center gap-8 pt-1">
                <label className="flex items-center gap-2 text-sm text-[#111928]">
                  <input
                    type="radio"
                    name="currently_practicing_state_additional"
                    checked={Number(form.currently_practicing_state_additional) === 1}
                    onChange={() => handleRadio(1)}
                    className="h-4 w-4 accent-[#1447E6]"
                  />
                  Yes
                </label>

                <label className="flex items-center gap-2 text-sm text-[#111928]">
                  <input
                    type="radio"
                    name="currently_practicing_state_additional"
                    checked={Number(form.currently_practicing_state_additional) === 0}
                    onChange={() => handleRadio(0)}
                    className="h-4 w-4 accent-[#1447E6]"
                  />
                  No
                </label>
              </div>

              <p className={helperText} />
            </div>
          </div>
        </div>

        {/* Footer (same as previous modal) */}
        <div className="border-t border-[#E5E7EB] bg-white px-6 py-4">
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleAdd}
              className="h-[44px] px-6 rounded-[12px] bg-[#1447E6] text-white text-sm font-medium shadow-[0px_1px_0.5px_0.05px_#1D293D05]"
            >
              Add more license
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

export default License;
