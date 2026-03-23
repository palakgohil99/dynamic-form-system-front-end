import React, { useEffect, useMemo, useState } from "react";
import { X, CalendarDays, ChevronDown } from "lucide-react";
import { addPrevMalpractice } from '../../api/CredentialingApi'
import toast from "react-hot-toast";

const inputBase =
    "w-full h-[40px] px-3 py-[10px] gap-2 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] shadow-[0px_1px_0.5px_0.05px_rgba(29,41,61,0.02)] placeholder:font-normal placeholder:text-sm placeholder:leading-5 placeholder:tracking-normal placeholder:text-[#6A7282]";

const labelBase = "text-sm font-medium text-[#111928]";

const PrevMalpractice = ({
    open,
    onClose,
    onSave,
    initialData,
}) => {
    const blankForm = () => ({
        id: crypto.randomUUID(),

        carrier_name: "",
        address: "",
        city: "",
        state_country: "",
        postal_code: "",

        phone_country_code: "+12",
        phone_number: "",

        privilege_types: "",
        policy_number: "",

        effective_date: "",
        expiration_date: "",

        coverage_per_occurrence: "",
        coverage_aggregate: "",

        coverage_type: "",
        length_with_carrier: "",
    });

    const [form, setForm] = useState(blankForm());

    useEffect(() => {
        if (!open) return;
        setForm(initialData ? { ...blankForm(), ...initialData } : blankForm());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, initialData]);

    const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

    const isValid = useMemo(() => {
        const required = [
            "carrier_name",
            "address",
            "city",
            "state_country",
            "postal_code",
            "phone_number",
            "privilege_types",
            "policy_number",
            "coverage_per_occurrence",
            "coverage_aggregate",
            "coverage_type",
            "length_with_carrier",
        ];
        return required.every((k) => String(form[k] ?? "").trim());
    }, [form]);

    if (!open) return null;

    const save = async () => {
        try {
            let result = await addPrevMalpractice({ details: form, user_id: localStorage.getItem("user_id") });
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

            {/* Right drawer */}
            <div className="absolute right-0 top-0 h-screen w-[520px] bg-white shadow-[0px_16px_40px_rgba(17,24,40,0.18)] flex flex-col">
                {/* Header */}
                <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between">
                    <h2 className="text-[16px] font-semibold text-[#111928]">
                        Add previous malpractice insurance information
                    </h2>

                    <button
                        onClick={onClose}
                        className="h-9 w-9 rounded-[10px] hover:bg-[#F9FAFB] flex items-center justify-center"
                    >
                        <X size={18} className="text-[#6A7282]" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
                    {/* Carrier name */}
                    <div className="space-y-2">
                        <label className={`${labelBase} inline-flex items-center gap-1`}>
                            Name of previous malpractice insurance carrier
                            <span className="text-red-500">*</span>
                        </label>
                        <input
                            className={inputBase}
                            placeholder="Enter the hospital name"
                            value={form.carrier_name}
                            onChange={(e) => setField("carrier_name", e.target.value)}
                        />
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                        <label className={`${labelBase} inline-flex items-center gap-1`}>
                            Address <span className="text-red-500">*</span>
                        </label>
                        <input
                            className={inputBase}
                            placeholder="Enter your street address"
                            value={form.address}
                            onChange={(e) => setField("address", e.target.value)}
                        />
                    </div>

                    {/* City / State */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className={`${labelBase} inline-flex items-center gap-1`}>
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
                            <label className={`${labelBase} inline-flex items-center gap-1`}>
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
                        <label className={`${labelBase} inline-flex items-center gap-1`}>
                            Postal Code <span className="text-red-500">*</span>
                        </label>
                        <input
                            className={inputBase}
                            placeholder="Enter your postal/zip code"
                            value={form.postal_code}
                            onChange={(e) => setField("postal_code", e.target.value)}
                        />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                        <label className={`${labelBase} inline-flex items-center gap-1`}>
                            Phone number <span className="text-red-500">*</span>
                        </label>

                        <div className="flex gap-3">
                            <div className="relative w-[104px] shrink-0">
                                <select
                                    className={`${inputBase} appearance-none pl-10 pr-9`}
                                    value={form.phone_country_code}
                                    onChange={(e) =>
                                        setField("phone_country_code", e.target.value)
                                    }
                                >
                                    <option value="+12">+12</option>
                                    <option value="+1">+1</option>
                                    <option value="+91">+91</option>
                                </select>

                                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                                    🇺🇸
                                </div>

                                <ChevronDown
                                    size={16}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
                                />
                            </div>

                            <input
                                className={inputBase}
                                placeholder="123-456-7890"
                                value={form.phone_number}
                                onChange={(e) => setField("phone_number", e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Types of privileges */}
                    <div className="space-y-2">
                        <label className={`${labelBase} inline-flex items-center gap-1`}>
                            Types of privileges <span className="text-red-500">*</span>
                        </label>
                        <input
                            className={inputBase}
                            placeholder="(Provisional, Limited, Conditional, etc.)"
                            value={form.privilege_types}
                            onChange={(e) => setField("privilege_types", e.target.value)}
                        />
                    </div>

                    {/* Policy number */}
                    <div className="space-y-2">
                        <label className={`${labelBase} inline-flex items-center gap-1`}>
                            Policy number <span className="text-red-500">*</span>
                        </label>
                        <input
                            className={inputBase}
                            placeholder="Enter your postal/zip code"
                            value={form.policy_number}
                            onChange={(e) => setField("policy_number", e.target.value)}
                        />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className={labelBase}>Effective date</label>
                            <div className="relative">
                                <CalendarDays
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
                                />
                                <input
                                    className={`${inputBase} pl-10`}
                                    placeholder="MM/YYYY"
                                    value={form.effective_date}
                                    onChange={(e) => setField("effective_date", e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className={labelBase}>Expiration date</label>
                            <div className="relative">
                                <CalendarDays
                                    size={16}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
                                />
                                <input
                                    className={`${inputBase} pl-10`}
                                    placeholder="MM/YYYY"
                                    value={form.expiration_date}
                                    onChange={(e) => setField("expiration_date", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Coverage per occurrence */}
                    <div className="space-y-2">
                        <label className={`${labelBase} inline-flex items-center gap-1`}>
                            Amount of coverage per occurrence <span className="text-red-500">*</span>
                        </label>
                        <input
                            className={inputBase}
                            placeholder="Enter the maximum amount covered for each individual claim"
                            value={form.coverage_per_occurrence}
                            onChange={(e) =>
                                setField("coverage_per_occurrence", e.target.value)
                            }
                        />
                    </div>

                    {/* Coverage aggregate */}
                    <div className="space-y-2">
                        <label className={`${labelBase} inline-flex items-center gap-1`}>
                            Amount of coverage aggregate <span className="text-red-500">*</span>
                        </label>
                        <input
                            className={inputBase}
                            placeholder="Enter the total maximum coverage limit"
                            value={form.coverage_aggregate}
                            onChange={(e) =>
                                setField("coverage_aggregate", e.target.value)
                            }
                        />
                    </div>

                    {/* Type of coverage */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <label className={`${labelBase} inline-flex items-center gap-1`}>
                                Type of coverage <span className="text-red-500">*</span>
                            </label>
                            <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#E5E7EB] text-[10px] text-[#6A7282]">
                                i
                            </span>
                        </div>

                        <div className="flex gap-10 text-sm text-[#4A5565]">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    className="h-4 w-4 accent-[#1447E6]"
                                    checked={form.coverage_type === "Individual"}
                                    onChange={() => setField("coverage_type", "Individual")}
                                />
                                Individual
                            </label>

                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    className="h-4 w-4 accent-[#1447E6]"
                                    checked={form.coverage_type === "Shared"}
                                    onChange={() => setField("coverage_type", "Shared")}
                                />
                                Shared
                            </label>
                        </div>
                    </div>

                    {/* Length */}
                    <div className="space-y-2">
                        <label className={`${labelBase} inline-flex items-center gap-1`}>
                            Length of time with carrier <span className="text-red-500">*</span>
                        </label>
                        <input
                            className={inputBase}
                            placeholder="Specify how long you’ve been insured with this carrier"
                            value={form.length_with_carrier}
                            onChange={(e) =>
                                setField("length_with_carrier", e.target.value)
                            }
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="border-t border-[#E5E7EB] bg-white px-6 py-4 flex justify-center gap-3">
                    <button
                        disabled={!isValid}
                        onClick={save}
                        className={
                            isValid
                                ? "h-[44px] px-6 rounded-[12px] bg-[#1447E6] text-white text-sm font-medium"
                                : "h-[44px] px-6 rounded-[12px] bg-[#1447E6] text-white text-sm font-medium"
                        }
                    >
                        Add insurance coverage information
                    </button>

                    <button
                        onClick={onClose}
                        className="h-[40px] px-4 rounded-[12px] border border-[#E5E7EB] text-sm font-medium text-[#9CA3AF]"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PrevMalpractice;
