import React, { useState, useEffect } from "react";
import { X, CalendarDays } from "lucide-react";
import { addPrevHospitalPrivileges } from '../../api/CredentialingApi'
import toast from "react-hot-toast";

const inputBase =
  "w-full h-[44px] rounded-[12px] border border-[#E5E7EB] bg-white px-4 text-sm text-[#111928] placeholder:text-[#6A7282] focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6]";

const labelBase = "text-sm font-medium text-[#111928]";

const PrevHospitalPrivileg = ({ open, onClose, onSave, initialData }) => {
  const blankForm = () => ({
    id: crypto.randomUUID(),
    previous_hospital_name: "",
    affiliation_start: "",
    affiliation_end: "",
    address: "",
    city: "",
    state_country: "",
    postal_code: "",
    full_unrestricted_privileges: null, // true/false
    types_of_privileges: "",
    privileges_temporary: null, // true/false
    reason_for_discontinuance: "",
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

  const words = (s) =>
    (s || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

  const reasonWordCount = words(form.reason_for_discontinuance);

  const save = async () => {
    try {
      console.log('form: ', form);
      let result = await addPrevHospitalPrivileges({ details: form, user_id: localStorage.getItem("user_id") });
      toast.success(result.message);
      onSave?.(form);
      onClose?.();
    } catch (err) {
      toast.error(err.response.data.message);
    }
  }

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#111928]/50" onClick={onClose} />

      {/* Panel */}
      <div className="absolute right-0 top-0 h-screen w-[520px] bg-white shadow-[0px_16px_40px_rgba(17,24,40,0.18)] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[#111928]">
            Add previous hospital privileges
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
            {/* Previous hospital name */}
            <div className="space-y-2">
              <label className={labelBase}>
                Previous hospital where you have had privileges{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                className={inputBase}
                placeholder="Enter the hospital name"
                value={form.previous_hospital_name}
                onChange={(e) => setField("previous_hospital_name", e.target.value)}
              />
            </div>

            {/* Affiliation dates */}
            <div className="space-y-2">
              <label className={labelBase}>
                Affiliation dates <span className="text-red-500">*</span>
              </label>

              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <CalendarDays
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
                  />
                  <input
                    className={`${inputBase} pl-10`}
                    placeholder="From[DD/MM/YYYY]"
                    value={form.affiliation_start}
                    onChange={(e) => setField("affiliation_start", e.target.value)}
                  />
                </div>

                <span className="text-[#6A7282]">-</span>

                <div className="relative flex-1">
                  <CalendarDays
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
                  />
                  <input
                    className={`${inputBase} pl-10`}
                    placeholder="To[DD/MM/YYYY]"
                    value={form.affiliation_end}
                    onChange={(e) => setField("affiliation_end", e.target.value)}
                  />
                </div>
              </div>
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
                  placeholder="Enter your city"
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
                  placeholder="Enter your state or country"
                  value={form.state_country}
                  onChange={(e) => setField("state_country", e.target.value)}
                />
              </div>
            </div>

            {/* Postal code */}
            <div className="space-y-2">
              <label className={labelBase}>
                Postal Code <span className="text-red-500">*</span>
              </label>
              <input
                className={inputBase}
                placeholder="Enter your postal/zip code"
                value={form.postal_code}
                onChange={(e) => setField("postal_code", e.target.value)}
              />
            </div>

            {/* Full unrestricted privileges */}
            <div className="space-y-2">
              <p className={labelBase}>Full unrestricted privileges?</p>
              <div className="flex items-center gap-8 text-sm text-[#4A5565]">
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

            {/* Were privileges temporary */}
            <div className="space-y-2">
              <p className={labelBase}>Were privileges temporary?</p>
              <div className="flex items-center gap-8 text-sm text-[#4A5565]">
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

            {/* Reason for discontinuance */}
            <div className="space-y-2">
              <label className={labelBase}>Reason for discontinuance</label>
              <textarea
                rows={4}
                className="w-full rounded-[12px] border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-[#111928] placeholder:text-[#6A7282] focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6]"
                placeholder="Enter explanation (e.g., refer to affiliated hospitalist group)"
                value={form.reason_for_discontinuance}
                onChange={(e) => setField("reason_for_discontinuance", e.target.value)}
              />
              <p className="text-xs text-[#6A7282]">{reasonWordCount}/100 words</p>
            </div>

            <p className="text-[13px] text-[#6A7282]">{/* spacer like screenshot */}</p>
          </div>
        </div>

        {/* Footer (disabled style like screenshot) */}
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
              className="h-[40px] px-4 rounded-[12px] border border-[#E5E7EB] bg-white text-sm font-medium text-[#9CA3AF]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrevHospitalPrivileg;
