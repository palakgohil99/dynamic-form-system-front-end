import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { addBillingCompany } from '../../api/CredentialingApi'
import toast from "react-hot-toast";

const inputBase =
  "w-full h-[44px] rounded-[12px] border border-[#E5E7EB] bg-white px-4 text-sm text-[#111928] placeholder:text-[#6A7282] focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6]";

const labelBase = "text-sm font-medium text-[#111928]";

const BilingDetail = ({ open, onClose, onSave, initialData }) => {
  const blankForm = () => ({
    id: crypto.randomUUID(),
    billing_company_name: "",
    billing_representative: "",
    address: "",
    city: "",
    state_country: "",
    postal_code: "",
    phone_country_code: "+12",
    phone_number: "",
    fax_number: "",
    email: "",
    department_name: "",
    check_payable_to: "",
    can_bill_electronically: null,
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
  const save = async () => {
    try {
      let result = await addBillingCompany({ details: form, user_id: localStorage.getItem("user_id") });
      toast.success(result.message);
      onSave?.(form);
      onClose?.();
    } catch (err) {
      toast.error(err.response.data.message);
    }
  }

  const setField = (name, value) => setForm((p) => ({ ...p, [name]: value }));

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#111928]/50" onClick={onClose} />

      {/* Right panel */}
      <div className="absolute right-0 top-0 h-screen w-[520px] bg-white shadow-[0px_16px_40px_rgba(17,24,40,0.18)] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[#111928]">
            Billing company details
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
            {/* Billing company’s name */}
            <div className="space-y-2">
              <label className={labelBase}>
                Billing company’s name <span className="text-red-500">*</span>
              </label>
              <input
                className={inputBase}
                placeholder="Enter billing company name"
                value={form.billing_company_name}
                onChange={(e) => setField("billing_company_name", e.target.value)}
              />
            </div>

            {/* Billing representative */}
            <div className="space-y-2">
              <label className={labelBase}>
                Billing representative <span className="text-red-500">*</span>
              </label>
              <input
                className={inputBase}
                placeholder="Enter representative’s name"
                value={form.billing_representative}
                onChange={(e) => setField("billing_representative", e.target.value)}
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <label className={labelBase}>
                Address <span className="text-red-500">*</span>
              </label>
              <input
                className={inputBase}
                placeholder="Enter your street address"
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

            {/* Phone number */}
            <div className="space-y-2">
              <label className={labelBase}>
                Phone number <span className="text-red-500">*</span>
              </label>

              <div className="flex items-center gap-3">
                {/* Prefix box */}
                <div className="h-[44px] w-[120px] rounded-[12px] border border-[#E5E7EB] bg-white px-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[16px] leading-none">🇺🇸</span>
                    <span className="text-sm text-[#111928]">{form.phone_country_code}</span>
                  </div>
                  <ChevronDown size={16} className="text-[#6A7282]" />
                </div>

                {/* Phone input */}
                <input
                  className={inputBase}
                  placeholder="123-456-7890"
                  value={form.phone_number}
                  onChange={(e) => setField("phone_number", e.target.value)}
                />
              </div>
            </div>

            {/* Fax number */}
            <div className="space-y-2">
              <label className={labelBase}>
                Fax number <span className="text-red-500">*</span>
              </label>
              <input
                className={inputBase}
                placeholder="Enter fax number"
                value={form.fax_number}
                onChange={(e) => setField("fax_number", e.target.value)}
              />
            </div>

            {/* E-Mail */}
            <div className="space-y-2">
              <label className={labelBase}>
                E-Mail <span className="text-red-500">*</span>
              </label>
              <input
                className={inputBase}
                placeholder="Enter contact email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
              />
            </div>

            {/* Department name if hospital-based */}
            <div className="space-y-2">
              <label className={labelBase}>
                Department name if hospital-based <span className="text-red-500">*</span>
              </label>
              <input
                className={inputBase}
                placeholder="Enter department name"
                value={form.department_name}
                onChange={(e) => setField("department_name", e.target.value)}
              />
            </div>

            {/* Check payable to */}
            <div className="space-y-2">
              <label className={labelBase}>
                Check payable to <span className="text-red-500">*</span>
              </label>
              <input
                className={inputBase}
                placeholder="Enter recipient name"
                value={form.check_payable_to}
                onChange={(e) => setField("check_payable_to", e.target.value)}
              />
            </div>

            {/* Can you bill electronically? */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <p className={labelBase}>Can you bill electronically?</p>
                <span className="text-red-500 text-sm">*</span>
                <span className="text-[#6A7282] text-sm">ⓘ</span>
              </div>

              <div className="flex items-center gap-8 text-sm text-[#4A5565]">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="can_bill_electronically"
                    className="h-4 w-4 accent-[#1447E6]"
                    checked={form.can_bill_electronically === true}
                    onChange={() => setField("can_bill_electronically", true)}
                  />
                  Yes
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="can_bill_electronically"
                    className="h-4 w-4 accent-[#1447E6]"
                    checked={form.can_bill_electronically === false}
                    onChange={() => setField("can_bill_electronically", false)}
                  />
                  No
                </label>
              </div>
            </div>
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
              Add billing company details
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

export default BilingDetail;
