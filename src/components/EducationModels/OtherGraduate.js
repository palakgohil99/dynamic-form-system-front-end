import React, { useState, useEffect } from "react";
import { X, CalendarDays } from "lucide-react";
import { addOtherGraduat } from '../../api/CredentialingApi'
import toast from "react-hot-toast";

const inputBase =
  "w-full h-[44px] rounded-[12px] border border-[#E5E7EB] bg-white px-4 text-sm text-[#111928] placeholder:text-[#6A7282] focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6]";

const labelBase = "text-sm font-medium text-[#111928]";

const OtherGraduate = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState({
    issuing_institution: "",
    address: "",
    city: "",
    state_country: "",
    postal_code: "",
    degree: "",
    attendance_from: "",
    attendance_to: "",
  });

  useEffect(() => {
    if (open) {
      setForm({
        id: crypto.randomUUID(),
        issuing_institution: "",
        address: "",
        city: "",
        state_country: "",
        postal_code: "",
        degree: "",
        attendance_from: "",
        attendance_to: "",
      });
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleType = (t) => {
    setForm((prev) => ({
      ...prev,
      types: prev.types.includes(t) ? prev.types.filter((x) => x !== t) : [...prev.types, t],
    }));
  };

  const handleSave = async () => {
    // (optional) minimal validation
    try {
      let result = await addOtherGraduat({ details: form, user_id: localStorage.getItem("user_id") });
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
            Add other graduate-level education
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
            {/* Issuing Institution */}
            <div className="space-y-2">
              <label className={labelBase}>
                Issuing Institution <span className="text-red-500">*</span>
              </label>
              <input
                className={inputBase}
                placeholder="e.g., Johns Hopkins University"
                name="issuing_institution"
                value={form.issuing_institution}
                onChange={handleChange}
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className={labelBase}>
                Address <span className="text-red-500">*</span>
              </label>
              <input
                className={inputBase}
                placeholder="e.g., 123 Elm Street"
                name="address"
                value={form.address}
                onChange={handleChange}
              />
            </div>

            {/* City */}
            <div className="space-y-2">
              <label className={labelBase}>
                City <span className="text-red-500">*</span>
              </label>
              <input
                className={inputBase}
                placeholder="City where the institution is located"
                name="city"
                value={form.city}
                onChange={handleChange}
              />
            </div>

            {/* State / country */}
            <div className="space-y-2">
              <label className={labelBase}>
                State / country <span className="text-red-500">*</span>
              </label>
              <input
                className={inputBase}
                placeholder="e.g., Maryland or United States"
                name="state_country"
                value={form.state_country}
                onChange={handleChange}
              />
            </div>

            {/* Postal code */}
            <div className="space-y-2">
              <label className={labelBase}>
                Postal code <span className="text-red-500">*</span>
              </label>
              <input
                className={inputBase}
                placeholder="Enter ZIP or postal code"
                name="postal_code"
                value={form.postal_code}
                onChange={handleChange}
              />
            </div>

            {/* Degree */}
            <div className="space-y-2">
              <label className={labelBase}>Degree</label>
              <input
                className={inputBase}
                placeholder="Name of your program director or supervisor"
                name="degree"
                value={form.degree}
                onChange={handleChange}
              />
            </div>

            {/* Attendance dates */}
            <div className="space-y-2">
              <label className={labelBase}>
                Attendance dates <span className="text-red-500">*</span>
              </label>

              <div className="flex items-center gap-3">
                {/* From */}
                <div className="relative flex-1">
                  <CalendarDays
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
                  />
                  <input
                    type="date"
                    className={`${inputBase} pl-10`}
                    name="attendance_from"
                    value={form.attendance_from}
                    onChange={handleChange}
                  />
                </div>

                <span className="text-[#6A7282]">-</span>

                {/* To */}
                <div className="relative flex-1">
                  <CalendarDays
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
                  />
                  <input
                    type="date"
                    className={`${inputBase} pl-10`}
                    name="attendance_to"
                    value={form.attendance_to}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer (static) */}
        <div className="border-t border-[#E5E7EB] bg-white px-6 py-4">
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              className="h-[44px] px-6 rounded-[12px] bg-[#1447E6] text-white text-sm font-medium shadow-[0px_1px_0.5px_0.05px_#1D293D05]"
              onClick={handleSave}
            >
              Add other graduate-level education
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

export default OtherGraduate;
