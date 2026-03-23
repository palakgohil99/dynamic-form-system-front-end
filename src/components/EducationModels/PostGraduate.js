import React, { useEffect, useState } from "react";
import { X, CalendarDays } from "lucide-react";
import { addPostGraduateEdu } from '../../api/CredentialingApi'
import toast from "react-hot-toast";

const inputBase =
  "w-full h-[44px] rounded-[12px] border border-[#E5E7EB] bg-white px-4 text-sm text-[#111928] placeholder:text-[#6A7282] focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6]";

const labelBase = "text-sm font-medium text-[#111928]";
const helperText = "text-sm text-[#6A7282] leading-5";

const TYPE_OPTIONS = ["Internship", "Residency", "Fellowship", "Teaching Appointment"];

const PostGraduate = ({ open, onClose, onSave }) => {
  const [form, setForm] = useState({
    types: [],
    specialty: "",
    institution: "",
    city: "",
    state_country: "",
    postal_code: "",
    program_completed: false,
    attendance_from: "",
    attendance_to: "",
    program_director: "",
    current_program_director: "",
  });

  useEffect(() => {
    if (open) {
      setForm({
        id: crypto.randomUUID(),
        types: [],
        specialty: "",
        institution: "",
        city: "",
        state_country: "",
        postal_code: "",
        program_completed: false,
        attendance_from: "",
        attendance_to: "",
        program_director: "",
        current_program_director: "",
      });
    }
  }, [open]);

  if (!open) return null;

  const toggleType = (t) => {
    setForm((prev) => ({
      ...prev,
      types: prev.types.includes(t) ? prev.types.filter((x) => x !== t) : [...prev.types, t],
    }));
  };

  const handleSave = async () => {
    // (optional) minimal validation
    try {
      let result = await addPostGraduateEdu({ details: form, user_id: localStorage.getItem("user_id") });
      if(result.data) {
        console.log(result.data.education_informations.post_graduate_educations);
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
          <h2 className="text-[16px] font-semibold text-[#111928]">Add post graduate education</h2>

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
          {/* Top checkbox row */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mb-5">
            {TYPE_OPTIONS.map((t) => (
              <label key={t} className="flex items-center gap-2 text-sm text-[#111928]">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#E5E7EB] accent-[#1447E6]"
                  checked={form.types.includes(t)}
                  onChange={() => toggleType(t)}
                />
                {t}
              </label>
            ))}
          </div>

          <div className="space-y-5">
            {/* Specialty */}
            <div className="space-y-2">
              <label className={labelBase}>
                Specialty <span className="text-red-500">*</span>
              </label>
              <input
                className={inputBase}
                placeholder="Enter event title"
                value={form.specialty}
                onChange={(e) => setForm((p) => ({ ...p, specialty: e.target.value }))}
              />
            </div>

            {/* Institution */}
            <div className="space-y-2">
              <label className={labelBase}>
                Institution <span className="text-red-500">*</span>
              </label>
              <input
                className={inputBase}
                placeholder="e.g., Johns Hopkins University"
                value={form.institution}
                onChange={(e) => setForm((p) => ({ ...p, institution: e.target.value }))}
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
                value={form.city}
                onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
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
                value={form.state_country}
                onChange={(e) => setForm((p) => ({ ...p, state_country: e.target.value }))}
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
                value={form.postal_code}
                onChange={(e) => setForm((p) => ({ ...p, postal_code: e.target.value }))}
              />
            </div>

            {/* Program successfully completed */}
            <div className="flex items-start gap-3 pt-1">
              <input
                type="checkbox"
                className="mt-[2px] h-4 w-4 rounded border-[#E5E7EB] accent-[#1447E6]"
                checked={form.program_completed}
                onChange={(e) => setForm((p) => ({ ...p, program_completed: e.target.checked }))}
              />
              <div>
                <p className="text-sm font-medium text-[#111928]">Program successfully completed</p>
                <p className={helperText}>
                  Check if the program was completed and you were awarded certification or degree.
                </p>
              </div>
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
                    value={form.attendance_from}
                    onChange={(e) => setForm((p) => ({ ...p, attendance_from: e.target.value }))}
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
                    value={form.attendance_to}
                    onChange={(e) => setForm((p) => ({ ...p, attendance_to: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Program director */}
            <div className="space-y-2">
              <label className={labelBase}>Program director</label>
              <input
                className={inputBase}
                placeholder="Name of your program director or supervisor"
                value={form.program_director}
                onChange={(e) => setForm((p) => ({ ...p, program_director: e.target.value }))}
              />
            </div>

            {/* Current program director (if known) */}
            <div className="space-y-2">
              <label className={labelBase}>Current program director (if known)</label>
              <input
                className={inputBase}
                placeholder="Current program director’s name if different"
                value={form.current_program_director}
                onChange={(e) => setForm((p) => ({ ...p, current_program_director: e.target.value }))}
              />
            </div>
          </div>
        </div>

        {/* Static footer buttons */}
        <div className="border-t border-[#E5E7EB] bg-white px-6 py-4">
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleSave}
              className="h-[44px] px-6 rounded-[12px] bg-[#1447E6] text-white text-sm font-medium shadow-[0px_1px_0.5px_0.05px_#1D293D05]"
            >
              Add post graduate education
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

export default PostGraduate;
