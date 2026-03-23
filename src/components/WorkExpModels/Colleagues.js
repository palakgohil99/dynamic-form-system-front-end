import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { addColleagueNames } from '../../api/CredentialingApi'
import toast from "react-hot-toast";

const inputBase =
    "w-full h-[44px] rounded-[12px] border border-[#E5E7EB] bg-white px-4 text-sm text-[#111928] placeholder:text-[#6A7282] focus:outline-none focus:ring-2 focus:ring-[#1447E6]/20 focus:border-[#1447E6]";

const labelBase = "text-sm font-medium text-[#111928]";

const Colleagues = ({ open, onClose, onSave, initialData }) => {
    const blankForm = () => ({
        id: crypto.randomUUID(),
        name: "",
        specialty: "",
    });

    const [form, setForm] = useState(blankForm());

    useEffect(() => {
        if (!open) return;
        if (initialData) {
            setForm({
                ...blankForm(),
                ...initialData,
                id: initialData.id ?? initialData._id ?? crypto.randomUUID(),
            });
        } else {
            setForm(blankForm());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, initialData]);

    const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

    const isValid = useMemo(() => {
        return String(form.name).trim() && String(form.specialty).trim();
    }, [form]);

    const submit = async () => {
        try {
            let result = await addColleagueNames({ details: form, user_id: localStorage.getItem("user_id") });
            toast.success(result.message);
            onSave?.(form);
            onClose?.();
        } catch (err) {
            toast.error(err.response.data.message);
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999]">
            {/* Overlay */}
            <div className="absolute inset-0 bg-[#111928]/50" onClick={onClose} />

            {/* Center panel */}
            <div className="absolute inset-0 flex items-center justify-center px-4">
                <div className="w-full max-w-[420px] bg-white rounded-[12px] shadow-[0px_16px_40px_rgba(17,24,40,0.18)] overflow-hidden">
                    {/* Header (blank bar like screenshot) */}
                    <div className="h-[56px] px-6 flex items-center justify-end border-b border-[#E5E7EB]">
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
                    <div className="px-6 py-6">
                        <div className="space-y-5">
                            {/* Name */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <label className={labelBase}>Name</label>
                                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#E5E7EB] text-[10px] text-[#6A7282]">
                                        i
                                    </span>
                                </div>
                                <input
                                    className={inputBase}
                                    placeholder="Enter here"
                                    value={form.name}
                                    onChange={(e) => setField("name", e.target.value)}
                                />
                            </div>

                            {/* Specialty */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <label className={labelBase}>Specialty</label>
                                    <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-[#E5E7EB] text-[10px] text-[#6A7282]">
                                        i
                                    </span>
                                </div>
                                <input
                                    className={inputBase}
                                    placeholder="Enter here"
                                    value={form.specialty}
                                    onChange={(e) => setField("specialty", e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-[#E5E7EB] bg-white px-6 py-4">
                        <div className="flex items-center justify-start gap-3">
                            <button
                                type="button"
                                onClick={submit}
                                disabled={!isValid}
                                className={
                                    isValid
                                        ? "h-[40px] px-4 rounded-[12px] bg-[#1447E6] text-white text-sm font-medium shadow-[0px_1px_0.5px_0.05px_#1D293D05]"
                                        : "h-[40px] px-4 rounded-[12px] bg-[#1447E6] text-white text-sm font-medium shadow-[0px_1px_0.5px_0.05px_#1D293D05]"
                                }
                            >
                                Confirm and add
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
        </div>
    );
};

export default Colleagues;
