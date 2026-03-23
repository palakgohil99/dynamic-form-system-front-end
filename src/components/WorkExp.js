import React, { useState, useRef, useEffect } from "react";
import { CalendarDays, Trash2Icon } from 'lucide-react'
import { deleteCurrentHospitalPrivileges, deletePrevHospitalPrivileges, deleteBillingCompanyDetail, viewCurrentHospitalPrivileges, viewPrevHospitalPrivileges, viewCompanyBillingDetails, deleteCurrentMalpractice, viewCurrentMalpractice, deletePrevMalpractice, fetchPrevMalpractice, deleteColleagueName, fetchColleagueName } from '../api/CredentialingApi'
import toast from "react-hot-toast";

const WorkExp = ({
    data,
    onChange,
    openCurrentHospitalPrivilegPopup,
    openPrevHospitalPrivilegPopup,
    openBillingdetailPopup,
    openCurrentMalPracticePopup,
    openPrevMalPracticePopup,
    openColleaguePopup,
    workExperience,
    onProgressChange
}) => {
    console.log('workExperience: ', workExperience);
    console.log('data: ', data);
    const [value, setValue] = useState(null);
    const scrollContainerRef = useRef(null);
    const [formData, setFormData] = useState({});
    const didHydrate = useRef(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRef = useRef(null);

    const currentEmploymentRef = useRef(null);
    const previousEmploymentRef = useRef(null);
    const employmentGapsRef = useRef(null);
    const hospitalAffiliationsRef = useRef(null);
    const referencesRef = useRef(null);
    const liabilityRef = useRef(null);
    const practiceLocationRef = useRef(null);
    const credentialingRef = useRef(null);

    const selectedGroups = formData.practice_location_info?.group_names || [];
    const selectedPhoneCoverage = formData.credentialling_contact?.phone_coverage || [];
    const selectedPracticeLocationAccepts = formData.credentialling_contact?.practice_location_accepts || [];
    const selectedPracticeLimitations = formData.credentialling_contact?.practice_limitations || [];
    const selectedHandicappedFacilities = formData.credentialling_contact?.handicapped_accessible_facilities || [];
    const selectedServicesForDisabled = formData.credentialling_contact?.other_services_for_disabled || [];
    const selectedPublicTranportations = formData.credentialling_contact?.accessible_by_public_transportation || [];
    const selectedOtherServiceProvider = formData.credentialling_contact?.other_services_provider || [];

    const emitToParent = (updatedWorkExp) => {
        onChange(updatedWorkExp);
    };

    const [deletedIds, setDeletedIds] = useState({
        currentHosp: new Set(),
        prevHosp: new Set(),
        colleagues: new Set(),
    });

    useEffect(() => {
        const isFilledPrimitive = (v) => {
            if (v === null || v === undefined) return false;

            if (typeof v === "string") return v.trim() !== "";
            if (typeof v === "number") return true;   // 0 counts
            if (typeof v === "boolean") return true;  // false counts

            return false; // objects/arrays
        };

        const countFields = (obj) => {
            let total = 0;
            let filled = 0;

            const walk = (val) => {
                if (Array.isArray(val)) return; // ❌ ignore arrays completely

                if (val !== null && typeof val === "object") {
                    // object container → go deeper
                    Object.values(val).forEach(walk);
                    return;
                }

                // primitive leaf field
                total += 1;
                if (isFilledPrimitive(val)) filled += 1;
            };

            walk(obj);
            return { total, filled };
        };

        const { total, filled } = countFields(data || {});

        console.log("progress:", { filled, total });
        onProgressChange?.(filled, total);
    }, [data, onProgressChange]);

    const getId = (x) => x?.id ?? x?._id;

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpenMenuId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const hasUI =
            data && Object.keys(data).length > 0;

        const initial = hasUI
            ? data
            : (workExperience?.work_experience ?? workExperience ?? {});

        setFormData(initial);

        if (didHydrate.current) return;

        const parentEmpty =
            !data ||
            Object.keys(data).length === 0 ||
            Object.keys(data?.work_experience ?? {}).length === 0;

        const hasDb = initial && Object.keys(initial).length > 0;

        if (hasDb && parentEmpty) {
            didHydrate.current = true;
            emitToParent(initial); // ✅ always same shape
        }
    }, [workExperience, data]);

    useEffect(() => {
        // when popup saves, parent updates `data`
        // so reflect that in local formData immediately
        if (data?.billing_company_details !== undefined) {
            setFormData((prev) => ({
                ...prev,
                billing_company_details: data.billing_company_details,
            }));
        }
    }, [data?.billing_company_details]);

    useEffect(() => {
        // when popup saves, parent updates `data`
        // so reflect that in local formData immediately
        if (data?.current_malpractice_insurence_currier !== undefined) {
            setFormData((prev) => ({
                ...prev,
                current_malpractice_insurence_currier: data.current_malpractice_insurence_currier,
            }));
        }
    }, [data?.current_malpractice_insurence_currier]);

    useEffect(() => {
        // when popup saves, parent updates `data`
        // so reflect that in local formData immediately
        if (data?.prev_malpractice_insurence_currier !== undefined) {
            setFormData((prev) => ({
                ...prev,
                prev_malpractice_insurence_currier: data.prev_malpractice_insurence_currier,
            }));
        }
    }, [data?.prev_malpractice_insurence_currier]);

    const dbListCurrentHospitalPrevilege =
        workExperience?.current_hospital_privileges || [];

    const uiListCurrentHospitalPrevilege =
        data?.current_hospital_privileges || [];

    const dbListPrevHospitalPrevilege =
        workExperience?.prev_hospital_privileges || [];

    const uiListPrevHospitalPrevilege =
        data?.prev_hospital_privileges || [];

    const dbListColleagues =
        workExperience?.colleague_names || [];

    const uiListColleagues =
        data?.colleague_names || [];

    const mergeById = (a = [], b = []) => {
        const map = new Map();
        [...a, ...b].forEach((item) => {
            const key = item?.id ?? item?._id ?? JSON.stringify(item);
            map.set(key, item);
        });
        return Array.from(map.values());
    };

    const currentHospitals = formData?.current_hospital_privileges || [];;

    const prevHospitals = formData?.prev_hospital_privileges || [];

    const colleagueNames = formData?.colleague_names || [];

    const billingDetails =
        formData?.billing_company_details ??
        workExperience?.billing_company_details?.[0] ??
        null;

    const billingId = billingDetails?.[0]?.id ?? billingDetails?.id ?? null

    const hasBillingDetails = Array.isArray(billingDetails)
        ? billingDetails.length > 0
        : !!billingDetails && Object.keys(billingDetails).length > 0;

    const currentMalPractice =
        formData?.current_malpractice_insurence_currier ??
        workExperience?.current_malpractice_insurence_currier?.[0] ??
        null;

    const currentMalPracticeId = currentMalPractice?.[0]?.id ?? currentMalPractice?.id ?? null

    const hasCurrentMalPractice = Array.isArray(currentMalPractice)
        ? currentMalPractice.length > 0
        : !!currentMalPractice && Object.keys(currentMalPractice).length > 0;

    const prevMalPractice =
        formData?.prev_malpractice_insurence_currier ??
        workExperience?.prev_malpractice_insurence_currier?.[0] ??
        null;

    const prevMalPracticeId = prevMalPractice?.[0]?.id ?? prevMalPractice?.id ?? null

    const hasPrevMalPractice = Array.isArray(prevMalPractice)
        ? prevMalPractice.length > 0
        : !!prevMalPractice && Object.keys(prevMalPractice).length > 0;

    const sectionMap = {
        currentEmployment: currentEmploymentRef,
        previousEmployment: previousEmploymentRef,
        employmentGaps: employmentGapsRef,
        hospitalAffiliations: hospitalAffiliationsRef,
        references: referencesRef,
        liability: liabilityRef,
        practiceLocation: practiceLocationRef,
        credentialing: credentialingRef,
    };

    const scrollToSection = (key) => {
        const container = scrollContainerRef.current;
        const target = sectionMap[key]?.current;

        if (!container || !target) return;

        const containerRect = container.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();

        const currentScroll = container.scrollTop;

        // target's top relative to container + current scroll
        const top = targetRect.top - containerRect.top + currentScroll - 16; // 16 = offset for padding/header

        container.scrollTo({
            top,
            behavior: "smooth",
        });
    };


    const [options, setOptions] = useState([
        { value: 'apple', label: 'Apple' },
        { value: 'banana', label: 'Banana' },
    ]);

    const handleChange = (newValue, actionMeta) => {
        setValue(newValue);
    };

    const handleCreate = (inputValue) => {
        const newOption = { value: inputValue, label: inputValue };
        setOptions(prev => [...prev, newOption]);
        setValue(newOption);
    };

    const setNestedValue = (obj, path, val) => {
        const keys = path.split(".");
        const newObj = structuredClone(obj); // or JSON.parse(JSON.stringify(obj)) if needed
        let temp = newObj;

        for (let i = 0; i < keys.length - 1; i++) {
            temp[keys[i]] = temp[keys[i]] || {};
            temp = temp[keys[i]];
        }
        temp[keys[keys.length - 1]] = val;
        return newObj;
    };

    const handleRadioChange = (path, val) => {
        setFormData((prev) => {
            const updated = setNestedValue(prev, path, val);
            emitToParent(updated);
            return updated;
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => {
            const updated = setNestedValue(prev, name, value);
            emitToParent(updated);
            return updated;
        });
    };

    const toDateInputValue = (val) => {
        if (!val) return "";

        // Already YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(val)) return val;

        // YYYY-MM -> make it first day of month
        if (/^\d{4}-\d{2}$/.test(val)) return `${val}-01`;

        // MM/YYYY -> convert to YYYY-MM-01
        if (/^\d{2}\/\d{4}$/.test(val)) {
            const [mm, yyyy] = val.split("/");
            return `${yyyy}-${mm}-01`;
        }

        // ISO string like 2025-01-26T00:00:00Z
        const d = new Date(val);
        if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);

        return "";
    };

    const handleCheckboxArrayChange = (path, optionValue) => {
        setFormData((prev) => {
            const keys = path.split(".");
            const updated = structuredClone(prev);
            let temp = updated;

            for (let i = 0; i < keys.length - 1; i++) {
                temp[keys[i]] = temp[keys[i]] || {};
                temp = temp[keys[i]];
            }

            const lastKey = keys[keys.length - 1];
            const existing = temp[lastKey] || [];

            temp[lastKey] = existing.includes(optionValue)
                ? existing.filter((v) => v !== optionValue)
                : [...existing, optionValue];

            emitToParent(updated);
            return updated;
        });
    };

    const deletePrivilege = async (id) => {
        setDeletedIds((prev) => ({
            ...prev,
            currentHosp: new Set([...prev.currentHosp, id]),
        }));

        let result = await deleteCurrentHospitalPrivileges({ user_id: localStorage.getItem("user_id"), previlege_id: id })
        if (result.data) {
            toast.success(result.message);
            setFormData((prev) => {
                const updatedList = (prev.current_hospital_privileges || []).filter((x) => getId(x) !== id);
                const updated = { ...prev, current_hospital_privileges: updatedList };
                emitToParent(updated);
                return updated;
            });

        } else {
            toast.error('Oops! Something went wrong');
            setDeletedIds((prev) => {
                const s = new Set(prev.currentHosp);
                s.delete(id);
                return { ...prev, currentHosp: s };
            });
        }
    }

    const viewCurrentPrivilege = async (id) => {
        let result = await viewCurrentHospitalPrivileges({ user_id: localStorage.getItem("user_id"), previlege_id: id })
        if (result.data) {
            openCurrentHospitalPrivilegPopup(result.data.work_experience.current_hospital_privileges[0]);
        } else {
            toast.error('Oops! Something went wrong');
        }
    }

    const viewPrevPrivilege = async (id) => {
        let result = await viewPrevHospitalPrivileges({ user_id: localStorage.getItem("user_id"), previlege_id: id })
        if (result.data) {
            openPrevHospitalPrivilegPopup(result.data.work_experience.prev_hospital_privileges[0]);
        } else {
            toast.error('Oops! Something went wrong');
        }
    }
    const viewBillingDetails = async (id) => {
        let result = await viewCompanyBillingDetails({ user_id: localStorage.getItem("user_id"), billing_id: id })
        if (result.data) {
            openBillingdetailPopup(result.data.work_experience.billing_company_details[0]);
        } else {
            toast.error('Oops! Something went wrong');
        }
    }

    const deletePrevPrivilege = async (id) => {
        setDeletedIds((prev) => ({
            ...prev,
            prevHosp: new Set([...prev.prevHosp, id]),
        }));

        let result = await deletePrevHospitalPrivileges({ user_id: localStorage.getItem("user_id"), previlege_id: id })
        if (result.data) {
            toast.success(result.message);
            setFormData((prev) => {
                const updatedList = (prev.prev_hospital_privileges || []).filter((x) => getId(x) !== id);
                const updated = { ...prev, prev_hospital_privileges: updatedList };
                emitToParent(updated);
                return updated;
            });
        } else {
            toast.error('Oops! Something went wrong');
            setDeletedIds((prev) => {
                const s = new Set(prev.prevHosp);
                s.delete(id);
                return { ...prev, prevHosp: s };
            });
        }
    }

    const deleteBillingDetail = async (id) => {
        let result = await deleteBillingCompanyDetail({ user_id: localStorage.getItem("user_id"), billing_id: id })
        if (result.data) {
            toast.success(result.message);
            setFormData((prev) => {
                const updated = {
                    ...prev,
                    billing_company_details: [], // ✅ empty list
                };

                emitToParent(updated); // ✅ update parent too
                return updated;
            });
        } else {
            toast.error('Oops! Something went wrong');
        }
    }

    const deleteCurrentInsurence = async (id) => {
        let result = await deleteCurrentMalpractice({ user_id: localStorage.getItem("user_id"), insurence_id: id })
        if (result.data) {
            toast.success(result.message);
            setFormData((prev) => {
                const updated = {
                    ...prev,
                    current_malpractice_insurence_currier: [], // ✅ empty list
                };
                emitToParent(updated); // ✅ update parent too
                return updated;
            });
        } else {
            toast.error('Oops! Something went wrong');
        }
    }

    const viewCurrentInsurence = async (id) => {
        let result = await viewCurrentMalpractice({ user_id: localStorage.getItem("user_id"), insurence_id: id })
        if (result.data) {
            openCurrentMalPracticePopup(result.data.work_experience.current_malpractice_insurence_currier[0]);
        } else {
            toast.error('Oops! Something went wrong');
        }
    }

    const deletePrevInsurence = async (id) => {
        let result = await deletePrevMalpractice({ user_id: localStorage.getItem("user_id"), insurence_id: id })
        if (result.data) {
            toast.success(result.message);
            setFormData((prev) => {
                const updated = {
                    ...prev,
                    prev_malpractice_insurence_currier: [], // ✅ empty list
                };
                emitToParent(updated); // ✅ update parent too
                return updated;
            });
        } else {
            toast.error('Oops! Something went wrong');
        }
    }

    const viewPrevInsurence = async (id) => {
        let result = await fetchPrevMalpractice({ user_id: localStorage.getItem("user_id"), insurence_id: id })
        if (result.data) {
            openPrevMalPracticePopup(result.data.work_experience.prev_malpractice_insurence_currier[0]);
        } else {
            toast.error('Oops! Something went wrong');
        }
    }

    const deleteColleague = async (id) => {
        setDeletedIds((prev) => ({
            ...prev,
            colleagues: new Set([...prev.colleagues, id]),
        }));
        let result = await deleteColleagueName({ user_id: localStorage.getItem("user_id"), id: id })
        if (result.data) {
            toast.success(result.message);
            setFormData((prev) => {
                const updatedList = (prev.colleague_names || []).filter((x) => getId(x) !== id);
                const updated = { ...prev, colleague_names: updatedList };
                emitToParent(updated);
                return updated;
            });
        } else {
            toast.error('Oops! Something went wrong');
            setDeletedIds((prev) => {
                const s = new Set(prev.colleagues);
                s.delete(id);
                return { ...prev, colleagues: s };
            });
        }
    }

    const viewCoulleague = async (id) => {
        let result = await fetchColleagueName({ user_id: localStorage.getItem("user_id"), id: id })
        if (result.data) {
            openColleaguePopup(result.data.work_experience.colleague_names[0]);
        } else {
            toast.error('Oops! Something went wrong');
        }
    }

    const inputClass = "w-[416px] h-[40px] opacity-100 gap-2 rounded-[12px] border border-gray-200 bg-gray-50 pt-[10px] pr-3 pb-2.5 pl-3 shadow-[0px_1px_0.5px_0.05px_#1D293D05] mt-2 placeholder:font-normal placeholder:text-sm placeholder:leading-5 placeholder:tracking-normal placeholder:text-[#6A7282]"

    const GROUP_NAME_OPTIONS = [
        { label: "Solo primary care", value: "solo_primary_care" },
        { label: "Solo specialty care", value: "solo_specialty_care" },
        { label: "Group primary care", value: "group_primary_care" },
        { label: "Group single specialty", value: "group_single_specialty" },
        { label: "Group multi-specialty", value: "group_multi_specialty" },
    ];

    const handleCurrentHospitalPrivilegPopup = () => {
        openCurrentHospitalPrivilegPopup(true); // 👈 parent ko data bheja
    };

    const handlePrevHospitalPrivilegPopup = () => {
        openPrevHospitalPrivilegPopup(true); // 👈 parent ko data bheja
    };

    const handleBillingDetailPopup = () => {
        openBillingdetailPopup(true); // 👈 parent ko data bheja
    };

    const handleCurrentMalpracticePopup = () => {
        openCurrentMalPracticePopup(true); // 👈 parent ko data bheja
    };

    const handlePrevMalpracticePopup = () => {
        openPrevMalPracticePopup(true); // 👈 parent ko data bheja
    };

    const handleColleaguePopup = () => {
        openColleaguePopup(true); // 👈 parent ko data bheja
    };

    return (
        <div className="flex-1 min-h-0">
            <div className="flex h-full bg-white">
                {/* ================= LEFT SCROLLABLE FORM ================= */}
                <div ref={scrollContainerRef} className="flex-1 min-h-0 overflow-y-auto p-8">
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <p className="font-semibold text-[20px] leading-[150%] text-[#111928]">
                            Work Experience
                        </p>
                        <div className="flex-1 border-t border-[#E5E7EB]" />
                        <p className="font-semibold text-[12px] leading-[150%] text-[#057A55]">
                            22 of 32 fields completed
                        </p>
                    </div>

                    {/* Form content */}
                    <div className="max-w-[904px] space-y-6">
                        {/* Current Employment */}
                        <div ref={currentEmploymentRef}>
                            <p className="font-semibold text-[16px] leading-[150%] text-[#111928]">
                                Current Employment
                            </p>
                        </div>
                        {/* Employer */}
                        <div>
                            <label className="font-medium text-sm leading-5 text-[#111928]">
                                Current practice/Employer name <span className="text-red-500">*</span>
                            </label>
                            <input
                                className={`${inputClass} w-full mt-2`}
                                placeholder="Enter your current employer or practice name"
                                name="current_employer.employer_name"
                                value={formData.current_employer?.employer_name || ""}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-[18px]">
                            <div>
                                <label className="font-medium text-sm leading-5 text-[#111928]">
                                    Start date <span className="text-red-500">*</span>
                                </label>
                                <div className="relative mt-2">
                                    <CalendarDays
                                        size={14}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
                                    />
                                    <input
                                        type="date"
                                        className={`${inputClass} pl-9 w-full`}
                                        placeholder="MM/YYYY"
                                        name="current_employer.start_date"
                                        value={toDateInputValue(formData.current_employer?.start_date) || ""}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="font-medium text-sm leading-5 text-[#111928]">
                                    End date <span className="text-red-500">*</span>
                                </label>
                                <div className="relative mt-2">
                                    <CalendarDays
                                        size={14}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
                                    />
                                    <input
                                        type="date"
                                        className={`${inputClass} pl-9 w-full`}
                                        placeholder="MM/YYYY"
                                        name="current_employer.end_date"
                                        value={toDateInputValue(formData.current_employer?.end_date) || ""}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="font-medium text-sm leading-5 text-[#111928]">
                                Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                className={`${inputClass} w-full mt-2`}
                                placeholder="Enter full street address"
                                name="current_employer.address"
                                value={formData.current_employer?.address || ""}
                                onChange={handleInputChange}
                            />
                        </div>

                        {/* City + State */}
                        <div className="grid grid-cols-2 gap-[18px]">
                            <div>
                                <label className="font-medium text-sm leading-5 text-[#111928]">
                                    City <span className="text-red-500">*</span>
                                </label>
                                <input
                                    className={`${inputClass} w-full mt-2`}
                                    placeholder="Enter your city"
                                    name="current_employer.city"
                                    value={formData.current_employer?.city || ""}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div>
                                <label className="font-medium text-sm leading-5 text-[#111928]">
                                    State/Country <span className="text-red-500">*</span>
                                </label>
                                <input
                                    className={`${inputClass} w-full mt-2`}
                                    placeholder="Enter your state or country"
                                    name="current_employer.state"
                                    value={formData.current_employer?.state || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        {/* Postal Code */}
                        <div className="max-w-[443px]">
                            <label className="font-medium text-sm leading-5 text-[#111928]">
                                Postal Code <span className="text-red-500">*</span>
                            </label>
                            <input
                                className={`${inputClass} w-full mt-2`}
                                placeholder="Enter your postal/zip code"
                                name="current_employer.postal_code"
                                value={formData.current_employer?.postal_code || ""}
                                onChange={handleInputChange}
                            />
                        </div>

                        <hr className="border-[#E5E7EB]" />

                        {/* ================= PREVIOUS EMPLOYMENT ================= */}
                        <div className="space-y-6 pt-6" ref={previousEmploymentRef}>
                            {/* Section title */}
                            <p className="font-semibold text-[16px] leading-[150%] text-[#111928]">
                                Previous Employment
                            </p>

                            {/* Employer */}
                            <div>
                                <label className="font-medium text-sm leading-5 text-[#111928]">
                                    Previous practice/Employer name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    className={`${inputClass} w-full mt-2`}
                                    placeholder="Enter previous employer or practice name"
                                    name="prev_employer.employer_name"
                                    value={formData.prev_employer?.employer_name || ""}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-2 gap-[18px]">
                                <div>
                                    <label className="font-medium text-sm leading-5 text-[#111928]">
                                        Start date <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative mt-2">
                                        <CalendarDays
                                            size={14}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
                                        />
                                        <input
                                            type="date"
                                            className={`${inputClass} pl-9 w-full`}
                                            placeholder="MM/YYYY"
                                            name="prev_employer.start_date"
                                            value={toDateInputValue(formData.prev_employer?.start_date) || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="font-medium text-sm leading-5 text-[#111928]">
                                        End date <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative mt-2">
                                        <CalendarDays
                                            size={14}
                                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
                                        />
                                        <input
                                            type="date"
                                            className={`${inputClass} pl-9 w-full`}
                                            placeholder="MM/YYYY"
                                            name="prev_employer.end_date"
                                            value={toDateInputValue(formData.prev_employer?.end_date) || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Address */}
                            <div>
                                <label className="font-medium text-sm leading-5 text-[#111928]">
                                    Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    className={`${inputClass} w-full mt-2`}
                                    placeholder="Enter your street address"
                                    name="prev_employer.address"
                                    value={formData.prev_employer?.address || ""}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* City + State */}
                            <div className="grid grid-cols-2 gap-[18px]">
                                <div>
                                    <label className="font-medium text-sm leading-5 text-[#111928]">
                                        City <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        className={`${inputClass} w-full mt-2`}
                                        placeholder="Enter your city"
                                        name="prev_employer.city"
                                        value={formData.prev_employer?.city || ""}
                                        onChange={handleInputChange}
                                    />
                                </div>

                                <div>
                                    <label className="font-medium text-sm leading-5 text-[#111928]">
                                        State/Country <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        className={`${inputClass} w-full mt-2`}
                                        placeholder="Enter your state or country"
                                        name="prev_employer.state"
                                        value={formData.prev_employer?.state || ""}
                                        onChange={handleInputChange}
                                    />
                                </div>
                            </div>

                            {/* Postal Code */}
                            <div className="max-w-[443px]">
                                <label className="font-medium text-sm leading-5 text-[#111928]">
                                    Postal Code <span className="text-red-500">*</span>
                                </label>
                                <input
                                    className={`${inputClass} w-full mt-2`}
                                    placeholder="Enter your postal/zip code"
                                    name="prev_employer.postal_code"
                                    value={formData.prev_employer?.postal_code || ""}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* Reason for discontinuance (FULL WIDTH textarea) */}
                            <div>
                                <label className="font-medium text-sm leading-5 text-[#111928]">
                                    Reason for discontinuance <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={3}
                                    className={`${inputClass} w-full mt-2 resize-none`}
                                    placeholder="Briefly explain reason"
                                    name="prev_employer.reason_for_discontinuance"
                                    value={formData.prev_employer?.reason_for_discontinuance || ""}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <hr className="border-[#E5E7EB]" />

                            {/* ================= EMPLOYMENT GAPS ================= */}
                            <div className="space-y-6 pt-6" ref={employmentGapsRef}>
                                <div>
                                    <p className="font-semibold text-[16px] leading-[150%] text-[#111928]">
                                        Employment Gaps
                                    </p>
                                    <p className="font-normal text-sm leading-[150%] text-[#6A7282] mt-1 max-w-[680px]">
                                        Please provide an explanation for any gaps greater than six months (MM/YYYY to MM/YYYY) in work history.
                                    </p>
                                </div>

                                {/* Gap dates */}
                                <div>
                                    <label className="font-medium text-sm leading-5 text-[#111928]">
                                        Gap dates
                                    </label>

                                    <div className="flex items-center gap-[10px] mt-2">
                                        <div className="relative w-[443px]">
                                            <CalendarDays
                                                size={14}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
                                            />
                                            <input
                                                type="date"
                                                className={`${inputClass} pl-9 w-full`}
                                                placeholder="From"
                                                name="gap_dates.start"
                                                value={toDateInputValue(formData?.gap_dates?.start) || ""}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <span className="text-[#6A7282]">-</span>

                                        <div className="relative w-[443px]">
                                            <CalendarDays
                                                size={14}
                                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
                                            />
                                            <input
                                                type="date"
                                                className={`${inputClass} pl-9 w-full`}
                                                placeholder="To"
                                                name="gap_end_date"
                                                value={toDateInputValue(formData?.gap_dates?.end) || ""}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Explanation */}
                                <div>
                                    <label className="font-medium text-sm leading-5 text-[#111928]">
                                        Explanation <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        rows={4}
                                        className={`${inputClass} w-full mt-2 resize-none`}
                                        placeholder="Enter explanation for the gap"
                                        name="gap_explaination"
                                        value={formData.gap_explaination || ""}
                                        onChange={handleInputChange}
                                    />
                                    <p className="mt-1 text-xs text-[#4A5565]">4/100 words</p>
                                </div>

                                <hr className="border-[#E5E7EB]" />
                            </div>

                            {/* ================= HOSPITAL AFFILIATIONS ================= */}
                            <div className="space-y-6 pt-6" ref={hospitalAffiliationsRef}>
                                <div>
                                    <p className="font-semibold text-[16px] leading-[150%] text-[#111928]">
                                        Hospital Affiliations
                                    </p>
                                    <p className="font-normal text-sm leading-[150%] text-[#6A7282] mt-1 max-w-[680px]">
                                        Please include all hospitals where you currently have or have previously had privileges.
                                    </p>
                                </div>

                                {/* Current hospital privileges */}
                                <div className="space-y-2">
                                    <p className="font-medium text-sm text-[#4A5565]">
                                        A. Current hospital privileges
                                    </p>
                                    <div className="space-y-3">
                                        {currentHospitals.map((item, idx) => (
                                            <div
                                                key={item?.id}
                                                className="w-full rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 flex items-center justify-between"
                                            >
                                                <p className="text-[14px] font-medium text-[#4A5565]">
                                                    {idx + 1}. {item?.primary_hospital}
                                                </p>

                                                <div className="flex items-center gap-3">
                                                    <button
                                                        className="h-[36px] px-4 rounded-[12px] border border-[#E5E7EB] text-sm font-medium text-[#4A5565] bg-white hover:bg-[#F9FAFB] flex items-center gap-2"
                                                        onClick={() => deletePrivilege(item.id)}
                                                    >
                                                        <span>Delete</span>
                                                        <Trash2Icon color="#4A5565" size={15} />
                                                    </button>

                                                    <button
                                                        className="h-[36px] px-4 rounded-[12px] border border-[#E5E7EB] text-sm font-medium text-[#4A5565] hover:bg-[#F9FAFB] bg-white"
                                                        onClick={() => viewCurrentPrivilege(item.id)}
                                                    >
                                                        View or make changes →
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        type="button"
                                        className="w-full max-w-[443px] h-[44px] flex items-center justify-between px-4 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] text-sm font-medium text-[#4A5565] mt-3"
                                        onClick={handleCurrentHospitalPrivilegPopup}
                                    >
                                        Add current hospital privileges
                                        <span className="text-lg leading-none">+</span>
                                    </button>
                                </div>

                                {/* Previous hospital privileges */}
                                <div className="space-y-2">
                                    <p className="font-medium text-sm text-[#4A5565]">
                                        B. Previous hospital privileges
                                    </p>
                                    <div className="space-y-3">
                                        {prevHospitals.map((item, idx) => (
                                            <div
                                                key={item?.id}
                                                className="w-full rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] px-4 py-3 flex items-center justify-between"
                                            >
                                                <p className="text-[14px] font-medium text-[#4A5565]">
                                                    {idx + 1}. {item?.previous_hospital_name}
                                                </p>

                                                <div className="flex items-center gap-3">
                                                    <button
                                                        className="h-[36px] px-4 rounded-[12px] border border-[#E5E7EB] text-sm font-medium text-[#4A5565] bg-white hover:bg-[#F9FAFB] flex items-center gap-2"
                                                        onClick={() => deletePrevPrivilege(item.id)}
                                                    >
                                                        <span>Delete</span>
                                                        <Trash2Icon color="#4A5565" size={15} />
                                                    </button>

                                                    <button
                                                        className="h-[36px] px-4 rounded-[12px] border border-[#E5E7EB] text-sm font-medium text-[#4A5565] hover:bg-[#F9FAFB] bg-white"
                                                        onClick={() => viewPrevPrivilege(item.id)}
                                                    >
                                                        View or make changes →
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        className="w-full max-w-[443px] h-[44px] flex items-center justify-between px-4 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] text-sm font-medium text-[#4A5565]"
                                        onClick={handlePrevHospitalPrivilegPopup}
                                    >
                                        Add previous hospital privileges
                                        <span className="text-lg leading-none">+</span>
                                    </button>
                                </div>

                                <hr className="border-[#E5E7EB]" />

                                {/* ================= REFERENCES ================= */}
                                <div className="space-y-6 pt-6" ref={referencesRef}>
                                    <div>
                                        <p className="font-semibold text-[16px] leading-[150%] text-[#111928]">
                                            References
                                        </p>
                                        <p className="font-normal text-sm leading-[150%] text-[#6A7282] mt-1 max-w-[760px]">
                                            Please provide three peer references from the same field and/or specialty who are not partners in your own group practice and are not relatives. All peer references should have firsthand knowledge of your abilities.
                                        </p>
                                    </div>

                                    {/* Reference Card */}
                                    <div className="rounded-[16px] border border-[#E5E7EB] overflow-hidden bg-white">
                                        {/* Card Header */}
                                        <div className="bg-[#F9FAFB] px-6 py-4">
                                            <p className="font-medium text-sm text-[#111928]">
                                                Reference 1
                                            </p>
                                            <p className="text-sm text-[#6A7282]">
                                                You can add multiple references as needed.
                                            </p>
                                        </div>

                                        {/* Card Body */}
                                        <div className="px-6 py-6 space-y-6">
                                            {/* Row 1 */}
                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <label className="font-medium text-sm text-[#111928]">
                                                        Name/title <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        className={`${inputClass} w-full mt-2`}
                                                        placeholder="Enter full name and title"
                                                        name="reference.name"
                                                        value={formData.reference?.name || ""}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="font-medium text-sm text-[#111928]">
                                                        Phone number <span className="text-red-500">*</span>
                                                    </label>

                                                    <div className="flex mt-2">
                                                        <div className="flex items-center gap-2 px-3 border border-r-0 border-[#E5E7EB] rounded-l-[12px] bg-white text-sm text-[#4A5565]">
                                                            🇺🇸
                                                            <span>+12</span>
                                                        </div>
                                                        <input
                                                            className="w-full h-[40px] px-4 border border-[#E5E7EB] rounded-r-[12px] text-sm placeholder:text-[#9CA3AF] focus:outline-none"
                                                            placeholder="123-456-7890"
                                                            name="reference.phone_number"
                                                            value={formData.reference?.phone_number || ""}
                                                            onChange={handleInputChange}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Address */}
                                            <div>
                                                <label className="font-medium text-sm text-[#111928]">
                                                    Address <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    className={`${inputClass} w-full mt-2`}
                                                    placeholder="Enter your street address"
                                                    name="reference.address"
                                                    value={formData.reference?.address || ""}
                                                    onChange={handleInputChange}
                                                />
                                            </div>

                                            {/* City & State */}
                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <label className="font-medium text-sm text-[#111928]">
                                                        City <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        className={`${inputClass} w-full mt-2`}
                                                        placeholder="Enter your city"
                                                        name="reference.city"
                                                        value={formData.reference?.city || ""}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="font-medium text-sm text-[#111928]">
                                                        State/Country <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        className={`${inputClass} w-full mt-2`}
                                                        placeholder="Enter your state or country"
                                                        name="reference.state"
                                                        value={formData.reference?.state || ""}
                                                        onChange={handleInputChange}
                                                    />
                                                </div>
                                            </div>

                                            {/* Postal Code */}
                                            <div className="max-w-[443px]">
                                                <label className="font-medium text-sm text-[#111928]">
                                                    Postal Code <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    className={`${inputClass} w-full mt-2`}
                                                    placeholder="Enter your postal/zip code"
                                                    name="reference.postal_code"
                                                    value={formData.reference?.postal_code || ""}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="border-[#E5E7EB]" />
                                </div>

                                {/* ================= PROFESSIONAL LIABILITY INSURANCE ================= */}
                                <div className="space-y-6 pt-6" ref={liabilityRef}>
                                    {/* Section title */}
                                    <div>
                                        <p className="font-semibold text-[16px] leading-[150%] text-[#111928]">
                                            Professional liability insurance coverage
                                        </p>
                                    </div>

                                    {/* Self-insured */}
                                    <div className="space-y-3">
                                        <label className="flex items-center gap-2 font-medium text-sm text-[#111928]">
                                            Self-insured? <span className="text-red-500">*</span>
                                            <span className="text-[#9CA3AF] cursor-pointer">ⓘ</span>
                                        </label>

                                        <div className="flex gap-6">
                                            <label className="flex items-center gap-2 text-sm text-[#111928]">
                                                <input
                                                    type="radio"
                                                    name="self_insured"
                                                    checked={formData.self_insured === true}
                                                    onChange={() => {
                                                        const updated = { ...formData, self_insured: true };
                                                        setFormData(updated);
                                                        emitToParent(updated);
                                                    }}
                                                />
                                                Yes
                                            </label>

                                            <label className="flex items-center gap-2 text-sm text-[#111928]">
                                                <input
                                                    type="radio"
                                                    name="self_insured"
                                                    checked={formData.self_insured === false}
                                                    onChange={() => {
                                                        const updated = { ...formData, self_insured: false };
                                                        setFormData(updated);
                                                        emitToParent(updated);
                                                    }}
                                                />
                                                No
                                            </label>
                                        </div>
                                    </div>

                                    {/* Card Fields */}
                                    <div className="space-y-4">
                                        {/* Field 1 */}
                                        {hasPrevMalPractice ? (
                                            // 🔹 VIEW MODE (screenshot UI)
                                            <div
                                                className="flex items-center justify-between gap-6 rounded-[16px] border border-[#E5E7EB] bg-white px-6 py-5"
                                                style={{ boxShadow: "0px 1px 0.5px 0.05px #1D293D05" }}
                                            >
                                                <p className="text-sm font-medium text-[#111928] max-w-[520px]">
                                                    Previous Insurance Converage Information
                                                </p>

                                                <div className="flex gap-2">
                                                    <button
                                                        className="h-[36px] px-4 rounded-[12px] border border-[#E5E7EB] text-sm font-medium text-[#4A5565] bg-white hover:bg-[#F9FAFB] flex items-center gap-2"
                                                        onClick={() => deletePrevInsurence(prevMalPracticeId)}
                                                    >
                                                        <span>Delete</span>
                                                        <Trash2Icon color="#4A5565" size={15} />
                                                    </button>

                                                    <button
                                                        className="h-[36px] px-4 rounded-[12px] border border-[#E5E7EB] text-sm font-medium text-[#4A5565] bg-white hover:bg-[#F9FAFB]"
                                                        onClick={() => viewPrevInsurence(prevMalPracticeId)}
                                                    >
                                                        View or make changes →
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            // 🔹 ADD MODE
                                            <div className="flex items-center justify-between border border-[#E5E7EB] rounded-[12px] px-4 py-4">
                                                <p className="text-sm font-medium text-[#111928] max-w-[520px]">
                                                    Previous malpractice insurance carrier (if with current carrier less than 5 years)
                                                </p>

                                                <input
                                                    type="button"
                                                    className="w-[173px] h-[36px] rounded-[14px] border border-[#E5E7EB] px-3 text-sm focus:outline-none bg-[#F9FAFB]"
                                                    onClick={handlePrevMalpracticePopup}
                                                />
                                            </div>
                                        )}
                                        {/* <div
                                            className="flex items-center justify-between gap-6 rounded-[16px] border border-[#E5E7EB] bg-white px-6 py-5"
                                            style={{ boxShadow: "0px 1px 0.5px 0.05px #1D293D05" }}
                                        >
                                            <p className="text-sm font-medium text-[#111928] max-w-[520px]">
                                                Previous malpractice insurance carrier (if with current carrier less than 5 years)
                                            </p>

                                            <input
                                                type="button"
                                                className="h-[36px] w-[74px] rounded-[14px] border border-[#E5E7EB] px-3 text-sm focus:outline-none bg-[#F9FAFB]"
                                                name="prev_malpractice_insurence_currier"
                                                onClick={handlePrevMalpracticePopup}
                                            />
                                        </div> */}

                                        {hasCurrentMalPractice ? (
                                            // 🔹 VIEW MODE (screenshot UI)
                                            <div
                                                className="flex items-center justify-between gap-6 rounded-[16px] border border-[#E5E7EB] bg-white px-6 py-5"
                                                style={{ boxShadow: "0px 1px 0.5px 0.05px #1D293D05" }}
                                            >
                                                <p className="text-sm font-medium text-[#111928] max-w-[520px]">
                                                    Insurance Converage Information
                                                </p>

                                                <div className="flex gap-2">
                                                    <button
                                                        className="h-[36px] px-4 rounded-[12px] border border-[#E5E7EB] text-sm font-medium text-[#4A5565] bg-white hover:bg-[#F9FAFB] flex items-center gap-2"
                                                        onClick={() => deleteCurrentInsurence(currentMalPracticeId)}
                                                    >
                                                        <span>Delete</span>
                                                        <Trash2Icon color="#4A5565" size={15} />
                                                    </button>

                                                    <button
                                                        className="h-[36px] px-4 rounded-[12px] border border-[#E5E7EB] text-sm font-medium text-[#4A5565] bg-white hover:bg-[#F9FAFB]"
                                                        onClick={() => viewCurrentInsurence(currentMalPracticeId)}
                                                    >
                                                        View or make changes →
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            // 🔹 ADD MODE
                                            <div className="flex items-center justify-between border border-[#E5E7EB] rounded-[12px] px-4 py-4">
                                                <p className="text-sm font-medium text-[#111928] max-w-[520px]">
                                                    Current malpractice insurance carrier or self-insured entity
                                                </p>

                                                <input
                                                    type="button"
                                                    className="w-[173px] h-[36px] rounded-[14px] border border-[#E5E7EB] px-3 text-sm focus:outline-none bg-[#F9FAFB]"
                                                    onClick={handleCurrentMalpracticePopup}
                                                />
                                            </div>
                                        )}

                                        {/* Field 3 - Colleague Names */}
                                        {Array.isArray(colleagueNames) && colleagueNames.length > 0 ? (
                                            // ✅ TABLE VIEW (like screenshot)
                                            <div
                                                className="w-full rounded-[16px] border border-[#E5E7EB] bg-white"
                                                style={{ boxShadow: "0px 1px 0.5px 0.05px #1D293D05" }}
                                            >
                                                {/* Title row */}
                                                <div className="px-6 py-5 flex items-start justify-between gap-6">
                                                    <p className="text-sm font-medium text-[#111928] max-w-[520px] leading-5">
                                                        Please list names of colleague(s) providing regular call coverage and his or her specialties
                                                    </p>

                                                    <button
                                                        type="button"
                                                        className="h-[40px] w-[142px] rounded-[12px] border border-[#E5E7EB] px-3 text-sm focus:outline-none bg-[#F9FAFB]"
                                                        onClick={handleColleaguePopup}
                                                    />
                                                </div>

                                                {/* Table */}
                                                <div className="border-t border-[#E5E7EB]">
                                                    {/* Header */}
                                                    <div className="grid grid-cols-[1fr_1fr_44px] bg-[#F9FAFB] px-6 py-3 text-xs font-medium text-[#6A7282]">
                                                        <div>Name</div>
                                                        <div>Specialty</div>
                                                        <div />
                                                    </div>

                                                    {/* Rows */}
                                                    {colleagueNames.map((c, idx) => (
                                                        <div
                                                            key={c?.id ?? c?._id ?? idx}
                                                            className={`grid grid-cols-[1fr_1fr_44px] px-6 py-4 text-sm text-[#111928] ${idx !== colleagueNames.length - 1 ? "border-b border-[#E5E7EB]" : ""
                                                                }`}
                                                        >
                                                            <div className="truncate">{c?.name || "-"}</div>
                                                            <div className="truncate">{c?.specialty || "-"}</div>

                                                            {/* 3 dots menu (like screenshot) */}
                                                            <div className="relative flex justify-end" ref={openMenuId === c.id ? menuRef : null}>
                                                                <button
                                                                    type="button"
                                                                    className="h-8 w-8 rounded-[10px] hover:bg-[#F9FAFB] flex items-center justify-center text-[#6A7282]"
                                                                    onClick={() =>
                                                                        setOpenMenuId(openMenuId === c.id ? null : c.id)
                                                                    }
                                                                >
                                                                    <span className="text-lg leading-none">⋮</span>
                                                                </button>

                                                                {openMenuId === c.id && (
                                                                    <div className="absolute right-0 top-9 z-20 w-[140px] rounded-[12px] border border-[#E5E7EB] bg-white shadow-[0px_8px_24px_rgba(17,24,40,0.12)] overflow-hidden">
                                                                        <button
                                                                            className="w-full px-4 py-2 text-left text-sm text-[#111928] hover:bg-[#F9FAFB]"
                                                                            onClick={() => {
                                                                                setOpenMenuId(null);
                                                                                viewCoulleague(c.id); // ✅ EDIT
                                                                            }}
                                                                        >
                                                                            Edit
                                                                        </button>

                                                                        <button
                                                                            className="w-full px-4 py-2 text-left text-sm text-[#B42318] hover:bg-[#FEF3F2]"
                                                                            onClick={() => {
                                                                                setOpenMenuId(null);
                                                                                deleteColleague(c.id)
                                                                            }}
                                                                        >
                                                                            Delete
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>

                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            // ✅ YOUR CURRENT VIEW (when no data)
                                            <div
                                                className="flex items-center justify-between gap-6 rounded-[16px] border border-[#E5E7EB] bg-white px-6 py-5"
                                                style={{ boxShadow: "0px 1px 0.5px 0.05px #1D293D05" }}
                                            >
                                                <p className="text-sm font-medium text-[#111928] max-w-[520px]">
                                                    Please list names of colleague(s) providing regular call coverage and his or her specialties
                                                </p>

                                                <input
                                                    type="button"
                                                    className="h-[40px] w-[142px] rounded-[12px] border border-[#E5E7EB] px-3 text-sm focus:outline-none bg-[#F9FAFB]"
                                                    onClick={handleColleaguePopup}
                                                />
                                            </div>
                                        )}

                                    </div>

                                    <hr className="border-[#E5E7EB]" />
                                </div>

                                {/* ================= PRACTICE LOCATION INFORMATION ================= */}
                                <div className="space-y-6 pt-6" ref={practiceLocationRef}>
                                    {/* Section title */}
                                    <div>
                                        <p className="font-semibold text-[16px] leading-[150%] text-[#111928]">
                                            Practice Location Information
                                        </p>
                                        <p className="text-sm text-[#6A7282] mt-1">
                                            Please answer the following questions for each practice location.
                                        </p>
                                    </div>

                                    {/* ===== CHECKBOX GROUP ===== */}
                                    <div className="space-y-3">
                                        <p className="font-medium text-sm text-[#111928]">
                                            Group name/practice name to appear in the directory <span className="text-red-500">*</span>
                                        </p>

                                        <div className="grid grid-cols-3 gap-4 text-sm text-[#4A5565]">
                                            {GROUP_NAME_OPTIONS.map(option => (
                                                <label key={option.value} className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedGroups.includes(option.value)}
                                                        onChange={() =>
                                                            handleCheckboxArrayChange("practice_location_info.group_names", option.value)
                                                        }
                                                    />
                                                    {option.label}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Practice name */}
                                    {/* <div>
                                        <label className="font-medium text-sm text-[#111928]">
                                            Group name/practice name to appear in the directory <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            className={`${inputClass} w-full mt-2`}
                                            placeholder="Enter your practice or clinic name as listed publicly"
                                            name="practice_location_info.reason_for_discontinuance"
                                            value={data.practice_location_info?.reason_for_discontinuance || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div> */}

                                    {/* Corporate name */}
                                    <div>
                                        <label className="font-medium text-sm text-[#111928]">
                                            Group/corporate name as it appears on IRS W-9 <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            className={`${inputClass} w-full mt-2`}
                                            placeholder="Enter your legal business or corporate name"
                                            name="practice_location_info.group_name_irs"
                                            value={formData.practice_location_info?.group_name_irs || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    {/* Practice location address */}
                                    <div className="space-y-2">
                                        <p className="font-semibold text-sm text-[#111928]">
                                            Practice location address
                                        </p>

                                        <label className="flex items-center gap-2 text-sm text-[#111928]">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 accent-[#1447E6]"
                                                checked={!!formData.practice_location_info?.primary_address}
                                                onChange={(e) => {
                                                    const checked = e.target.checked;

                                                    setFormData((prev) => {
                                                        const updated = setNestedValue(prev, "practice_location_info.is_address_primary", checked);
                                                        emitToParent(updated);
                                                        return updated;
                                                    });
                                                }}
                                            />
                                            Primary
                                        </label>
                                    </div>

                                    {/* City + State */}
                                    <div className="grid grid-cols-2 gap-[18px]">
                                        <div>
                                            <label className="font-medium text-sm text-[#111928]">
                                                City <span className="text-red-500">*</span>
                                            </label>
                                            <input className={`${inputClass} w-full mt-2`} placeholder="Enter your city"
                                                name="practice_location_info.city"
                                                value={formData.practice_location_info?.city || ""}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div>
                                            <label className="font-medium text-sm text-[#111928]">
                                                State/Country <span className="text-red-500">*</span>
                                            </label>
                                            <input className={`${inputClass} w-full mt-2`} placeholder="Enter your state or country"
                                                name="practice_location_info.state"
                                                value={formData.practice_location_info?.state || ""}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Postal + Phone */}
                                    <div className="grid grid-cols-2 gap-[18px]">
                                        <div>
                                            <label className="font-medium text-sm text-[#111928]">
                                                Postal Code <span className="text-red-500">*</span>
                                            </label>
                                            <input className={`${inputClass} w-full mt-2`} placeholder="Enter postal / ZIP code"
                                                name="practice_location_info.postal_code"
                                                value={formData.practice_location_info?.postal_code || ""}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div>
                                            <label className="font-medium text-sm text-[#111928]">
                                                Phone number <span className="text-red-500">*</span>
                                            </label>
                                            <input className={`${inputClass} w-full mt-2`} placeholder="123-456-7890"
                                                name="practice_location_info.phone_number"
                                                value={formData.practice_location_info?.phone_number || ""}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Fax + Email */}
                                    <div className="grid grid-cols-2 gap-[18px]">
                                        <div>
                                            <label className="font-medium text-sm text-[#111928]">
                                                Fax number <span className="text-red-500">*</span>
                                            </label>
                                            <input className={`${inputClass} w-full mt-2`} placeholder="Enter fax number"
                                                name="practice_location_info.fax_number"
                                                value={formData.practice_location_info?.fax_number || ""}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div>
                                            <label className="font-medium text-sm text-[#111928]">
                                                E-mail <span className="text-red-500">*</span>
                                            </label>
                                            <input className={`${inputClass} w-full mt-2`} placeholder="Enter contact email address"
                                                name="practice_location_info.email"
                                                value={formData.practice_location_info?.email || ""}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Back office + Medicaid */}
                                    <div className="grid grid-cols-2 gap-[18px]">
                                        <div>
                                            <label className="font-medium text-sm text-[#111928]">
                                                Back office phone number <span className="text-red-500">*</span>
                                            </label>
                                            <input className={`${inputClass} w-full mt-2`} placeholder="Enter alternate phone number"
                                                name="practice_location_info.back_office_number"
                                                value={formData.practice_location_info?.back_office_number || ""}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div>
                                            <label className="font-medium text-sm text-[#111928]">
                                                Site-specific Medicaid number <span className="text-red-500">*</span>
                                            </label>
                                            <input className={`${inputClass} w-full mt-2`} placeholder="Enter Medicaid site ID"
                                                name="practice_location_info.site_specific_number"
                                                value={formData.practice_location_info?.site_specific_number || ""}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Tax ID */}
                                    <div className="grid grid-cols-2 gap-[18px]">
                                        <div>
                                            <label className="font-medium text-sm text-[#111928]">
                                                Tax ID number <span className="text-red-500">*</span>
                                            </label>
                                            <input className={`${inputClass} w-full mt-2`} placeholder="Enter Tax ID (EIN)"
                                                name="practice_location_info.tax_id"
                                                value={formData.practice_location_info?.tax_id || ""}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div>
                                            <label className="font-medium text-sm text-[#111928]">
                                                Group number corresponding to Tax ID number <span className="text-red-500">*</span>
                                            </label>
                                            <input className={`${inputClass} w-full mt-2`} placeholder="Enter group number"
                                                name="practice_location_info.group_number"
                                                value={formData.practice_location_info?.group_number || ""}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Group name */}
                                    <div>
                                        <label className="font-medium text-sm text-[#111928]">
                                            Group name corresponding to Tax ID number <span className="text-red-500">*</span>
                                        </label>
                                        <input className={`${inputClass} w-full mt-2`} placeholder="Enter group name"
                                            name="practice_location_info.group_name_tax_id"
                                            value={formData.practice_location_info?.group_name_tax_id || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    {/* Yes / No */}
                                    <div className="space-y-4">
                                        <div>
                                            <p className="font-medium text-sm text-[#111928] mb-2">
                                                Are you currently practicing at this location? <span className="text-red-500">*</span>
                                            </p>
                                            <div className="flex gap-6">
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="radio"
                                                        name="practicing_here"
                                                        className="w-4 h-4 accent-[#1447E6]"
                                                        checked={formData.practice_location_info?.is_current_location === true}
                                                        onChange={() => handleRadioChange("practice_location_info.is_current_location", true)}
                                                    />
                                                    Yes
                                                </label>
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="radio"
                                                        name="practicing_here"
                                                        className="w-4 h-4 accent-[#1447E6]"
                                                        checked={formData.practice_location_info?.is_current_location === false}
                                                        onChange={() => handleRadioChange("practice_location_info.is_current_location", false)}
                                                    />
                                                    No
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="font-medium text-sm text-[#111928] mb-2">
                                                Do you want this location listed in the directory? <span className="text-red-500">*</span>
                                            </p>
                                            <div className="flex gap-6">
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="radio"
                                                        name="want_to_list"
                                                        className="w-4 h-4 accent-[#1447E6]"
                                                        checked={formData.practice_location_info?.want_to_list === true}
                                                        onChange={() => handleRadioChange("practice_location_info.want_to_list", true)}
                                                    />
                                                    Yes
                                                </label>
                                                <label className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="radio"
                                                        name="want_to_list"
                                                        className="w-4 h-4 accent-[#1447E6]"
                                                        checked={formData.practice_location_info?.want_to_list === false}
                                                        onChange={() => handleRadioChange("practice_location_info.want_to_list", false)}
                                                    />
                                                    No
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Office manager */}
                                    <div>
                                        <p className="font-semibold text-sm text-[#111928] mb-2">
                                            Office manager or staff contact
                                        </p>

                                        <div className="grid grid-cols-2 gap-[18px]">
                                            <div>
                                                <label className="font-medium text-sm text-[#111928]">
                                                    Phone number <span className="text-red-500">*</span>
                                                </label>
                                                <input className={`${inputClass} w-full mt-2`} placeholder="123-456-7890"
                                                    name="practice_location_info.office_phone"
                                                    value={formData.practice_location_info?.office_phone || ""}
                                                    onChange={handleInputChange}
                                                />
                                            </div>

                                            <div>
                                                <label className="font-medium text-sm text-[#111928]">
                                                    Fax number <span className="text-red-500">*</span>
                                                </label>
                                                <input className={`${inputClass} w-full mt-2`} placeholder="Enter fax number"
                                                    name="practice_location_info.office_fax"
                                                    value={formData.practice_location_info?.office_fax || ""}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <hr className="border-[#E5E7EB]" />
                                </div>

                                {/* ================= CREDENTIALING CONTACT ================= */}
                                <div className="space-y-8" ref={credentialingRef}>

                                    <h3 className="font-semibold text-[16px] text-[#111928]">
                                        Credentialing contact
                                    </h3>

                                    {/* Address */}
                                    <div>
                                        <label className="text-sm font-medium text-[#111928]">
                                            Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Enter your street address"
                                            className={`${inputClass} w-full mt-2`}
                                            name="credentialling_contact.address"
                                            value={formData.credentialling_contact?.address || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    {/* City / State */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm font-medium text-[#111928]">
                                                City <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                placeholder="Enter your city"
                                                className={`${inputClass} w-full mt-2`}
                                                name="credentialling_contact.city"
                                                value={formData.credentialling_contact?.city || ""}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-[#111928]">
                                                State/Country <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                placeholder="Enter your state or country"
                                                className={`${inputClass} w-full mt-2`}
                                                name="credentialling_contact.state"
                                                value={formData.credentialling_contact?.state || ""}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Postal Code / Phone */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm font-medium text-[#111928]">
                                                Postal Code <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                placeholder="Enter your city"
                                                className={`${inputClass} w-full mt-2`}
                                                name="credentialling_contact.postal_code"
                                                value={formData.credentialling_contact?.postal_code || ""}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-[#111928]">
                                                Phone number <span className="text-red-500">*</span>
                                            </label>
                                            <div className="flex mt-2">
                                                <select className="h-[44px] px-3 border border-[#E5E7EB] rounded-l-[12px] bg-[#F9FAFB]">
                                                    <option>🇺🇸 +12</option>
                                                </select>
                                                <input
                                                    placeholder="123-456-7890"
                                                    className="h-[44px] w-full px-4 border border-l-0 border-[#E5E7EB] rounded-r-[12px]"
                                                    name="credentialling_contact.phone_number"
                                                    value={formData.credentialling_contact?.phone_number || ""}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Fax / Email */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-sm font-medium text-[#111928]">
                                                Fax number <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                placeholder="Enter your city"
                                                className={`${inputClass} w-full mt-2`}
                                                name="credentialling_contact.fax_number"
                                                value={formData.credentialling_contact?.fax_number || ""}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div>
                                            <label className="text-sm font-medium text-[#111928]">
                                                E-mail <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                placeholder="Enter your state or country"
                                                className={`${inputClass} w-full mt-2`}
                                                name="credentialling_contact.email"
                                                value={formData.credentialling_contact?.email || ""}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Third-party billing */}

                                    {hasBillingDetails ? (
                                        // 🔹 VIEW MODE (screenshot UI)
                                        <div className="flex items-center justify-between border border-[#E5E7EB] rounded-[12px] px-4 py-4">
                                            <p className="text-sm font-medium text-[#111928]">
                                                Third-party billing company details
                                            </p>

                                            <div className="flex gap-2">
                                                <button
                                                    className="h-[36px] px-4 rounded-[12px] border border-[#E5E7EB] text-sm font-medium text-[#4A5565] bg-white hover:bg-[#F9FAFB] flex items-center gap-2"
                                                    onClick={() => deleteBillingDetail(billingId)}
                                                >
                                                    <span>Delete</span>
                                                    <Trash2Icon color="#4A5565" size={15} />
                                                </button>

                                                <button
                                                    className="h-[36px] px-4 rounded-[12px] border border-[#E5E7EB] text-sm font-medium text-[#4A5565] bg-white hover:bg-[#F9FAFB]"
                                                    onClick={() => viewBillingDetails(billingId)}
                                                >
                                                    View or make changes →
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        // 🔹 ADD MODE
                                        <div className="flex items-center justify-between border border-[#E5E7EB] rounded-[12px] px-4 py-4">
                                            <p className="text-sm text-[#111928]">
                                                If you use a third-party billing company, add billing company details
                                            </p>

                                            <input
                                                type="button"
                                                className="w-[173px] h-[36px] rounded-[14px] border border-[#E5E7EB] px-3 text-sm focus:outline-none bg-[#F9FAFB]"
                                                onClick={handleBillingDetailPopup}
                                            />
                                        </div>
                                    )}



                                    {/* Hours */}
                                    <div className="flex items-center justify-between border border-[#E5E7EB] rounded-[12px] px-4 py-4">
                                        <p className="text-sm text-[#111928]">
                                            Add hours patients are seen
                                        </p>
                                        <input className="w-[173px] h-[36px] rounded-[14px] border border-[#E5E7EB] px-3 text-sm focus:outline-none bg-[#F9FAFB]"
                                            name="credentialling_contact.add_patients_seen_hours"
                                            value={formData.credentialling_contact?.add_patients_seen_hours || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    {/* Phone coverage */}
                                    <div>
                                        <p className="text-sm font-medium text-[#111928] mb-3">
                                            Does this location provide 24-hour / 7-day-a-week phone coverage?
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-[#4A5565]">
                                            {[
                                                "Answering service",
                                                "Voice mail with instructions to call answering service",
                                                "Voice mail with other instructions",
                                                "None",
                                            ].map(item => (
                                                <label key={item} className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedPhoneCoverage.includes(item)}
                                                        onChange={() =>
                                                            handleCheckboxArrayChange("credentialling_contact.phone_coverage", item)
                                                        }
                                                    /> {item}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Accepts patients */}
                                    <div>
                                        <p className="text-sm font-medium text-[#111928] mb-3">
                                            This practice location accepts:
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-[#4A5565]">
                                            {[
                                                "All new patients",
                                                "Existing patients with change of payor",
                                                "New patients with referral",
                                                "New Medicare patients",
                                                "New Medicaid patients",
                                            ].map(item => (
                                                <label key={item} className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedPracticeLocationAccepts.includes(item)}
                                                        onChange={() =>
                                                            handleCheckboxArrayChange("credentialling_contact.practice_location_accepts", item)
                                                        }
                                                    /> {item}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Acceptance explanation */}
                                    <div>
                                        <label className="text-sm font-medium text-[#111928]">
                                            If new patient acceptance varies by health plan, please provide explanation.
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            rows={4}
                                            placeholder="Write text here ..."
                                            className={`${inputClass} w-full mt-2`}
                                            name="credentialling_contact.explaination_varies_path"
                                            value={formData.credentialling_contact?.explaination_varies_path || ""}
                                            onChange={handleInputChange}
                                        />
                                        <p className="text-xs text-[#6A7282] mt-1">4/100 words</p>
                                    </div>

                                    {/* Practice limitations */}
                                    <div>
                                        <p className="text-sm font-medium text-[#111928] mb-3">
                                            Practice limitations:
                                        </p>
                                        <div className="grid grid-cols-2 gap-3 text-sm text-[#4A5565]">
                                            {["Male only", "Female only", "Age", "Other"].map(item => (
                                                <label key={item} className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedPracticeLimitations.includes(item)}
                                                        onChange={() =>
                                                            handleCheckboxArrayChange("credentialling_contact.practice_limitations", item)
                                                        }
                                                    /> {item}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Non-physician providers */}
                                    <div>
                                        <p className="text-sm font-medium text-[#111928] mb-2">
                                            Do nurse practitioners, physician assistants, midwives, social workers or other
                                            non-physician providers care for patients at this practice location?
                                        </p>
                                        <div className="flex gap-6 text-sm text-[#4A5565]">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="does_non_physician_provide_care"
                                                    className="w-4 h-4 accent-[#1447E6]"
                                                    checked={formData.credentialling_contact?.does_non_physician_provide_care === true}
                                                    onChange={() => handleRadioChange("credentialling_contact.does_non_physician_provide_care", true)}
                                                /> Yes
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="does_non_physician_provide_care"
                                                    className="w-4 h-4 accent-[#1447E6]"
                                                    checked={formData.credentialling_contact?.does_non_physician_provide_care === false}
                                                    onChange={() => handleRadioChange("credentialling_contact.does_non_physician_provide_care", false)}
                                                /> No
                                            </label>
                                        </div>
                                    </div>

                                    {/* ================= Accessibility / Services ================= */}

                                    {/* Non-English languages */}
                                    <div>
                                        <label className="text-sm font-medium text-[#111928]">
                                            Non-English languages spoken by office personnel <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            className={`${inputClass} w-full mt-2`}
                                            placeholder="List all languages your administrative or front-desk staff can communicate in"
                                            name="credentialling_contact.non_english_langs_by_office_personnel"
                                            value={formData.credentialling_contact?.non_english_langs_by_office_personnel || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium text-[#111928]">
                                            Non-English languages spoken by health care providers <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            className={`${inputClass} w-full mt-2`}
                                            placeholder="Enter languages (e.g., Spanish, Arabic, French)"
                                            name="credentialling_contact.non_english_langs_by_health_care_provider"
                                            value={formData.credentialling_contact?.non_english_langs_by_health_care_provider || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    {/* Interpreters */}
                                    <div>
                                        <p className="text-sm font-medium text-[#111928] mb-2">Are interpreters available?</p>
                                        <div className="flex gap-6 text-sm text-[#4A5565]">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="interpreters_available"
                                                    className="w-4 h-4 accent-[#1447E6]"
                                                    checked={formData.credentialling_contact?.interpreters_available === true}
                                                    onChange={() => handleRadioChange("credentialling_contact.interpreters_available", true)}
                                                /> Yes
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="interpreters_available"
                                                    className="w-4 h-4 accent-[#1447E6]"
                                                    checked={formData.credentialling_contact?.interpreters_available === false}
                                                    onChange={() => handleRadioChange("credentialling_contact.interpreters_available", false)}
                                                /> No
                                            </label>
                                        </div>
                                    </div>

                                    {/* ADA */}
                                    <div>
                                        <p className="text-sm font-medium text-[#111928] mb-2">
                                            Does this practice location meet ADA accessibility standards?
                                        </p>
                                        <div className="flex gap-6 text-sm text-[#4A5565]">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="meet_ada_accessibility_stand"
                                                    className="w-4 h-4 accent-[#1447E6]"
                                                    checked={formData.credentialling_contact?.meet_ada_accessibility_stand === true}
                                                    onChange={() => handleRadioChange("credentialling_contact.meet_ada_accessibility_stand", true)}
                                                /> Yes
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="meet_ada_accessibility_stand"
                                                    className="w-4 h-4 accent-[#1447E6]"
                                                    checked={formData.credentialling_contact?.meet_ada_accessibility_stand === false}
                                                    onChange={() => handleRadioChange("credentialling_contact.meet_ada_accessibility_stand", false)}
                                                /> No
                                            </label>
                                        </div>
                                    </div>

                                    {/* Handicap accessible */}
                                    <div>
                                        <p className="text-sm font-medium text-[#111928] mb-3">
                                            Which of the following facilities are handicapped accessible?
                                        </p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-[#4A5565]">
                                            {["Building", "Parking", "Restrooms", "Other"].map(item => (
                                                <label key={item} className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedHandicappedFacilities.includes(item)}
                                                        onChange={() =>
                                                            handleCheckboxArrayChange("credentialling_contact.handicapped_accessible_facilities", item)
                                                        }
                                                    /> {item}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Services for disabled */}
                                    <div>
                                        <p className="text-sm font-medium text-[#111928] mb-3">
                                            Does this location have other services for the disabled?
                                        </p>
                                        <div className="grid grid-cols-2 md:grid-cols-2 gap-3 text-sm text-[#4A5565]">
                                            {[
                                                "Text telephony-TTY",
                                                "American Sign Language-ASL",
                                                "Mental/physical impairment services",
                                                "Other",
                                            ].map(item => (
                                                <label key={item} className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedServicesForDisabled.includes(item)}
                                                        onChange={() =>
                                                            handleCheckboxArrayChange("credentialling_contact.other_services_for_disabled", item)
                                                        }
                                                    /> {item}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Transportation */}
                                    <div>
                                        <p className="text-sm font-medium text-[#111928] mb-3">
                                            Is this location accessible by public transportation?
                                        </p>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-[#4A5565]">
                                            {["Bus", "Regional train", "Other"].map(item => (
                                                <label key={item} className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedPublicTranportations.includes(item)}
                                                        onChange={() =>
                                                            handleCheckboxArrayChange("credentialling_contact.accessible_by_public_transportation", item)
                                                        }
                                                    /> {item}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Childcare */}
                                    <div>
                                        <p className="text-sm font-medium text-[#111928] mb-2">
                                            Does this location provide childcare services?
                                        </p>
                                        <div className="flex gap-6 text-sm text-[#4A5565]">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="provide_childcare_service"
                                                    className="w-4 h-4 accent-[#1447E6]"
                                                    checked={formData.credentialling_contact?.provide_childcare_service === true}
                                                    onChange={() => handleRadioChange("credentialling_contact.provide_childcare_service", true)}
                                                /> Yes
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="provide_childcare_service"
                                                    className="w-4 h-4 accent-[#1447E6]"
                                                    checked={formData.credentialling_contact?.provide_childcare_service === false}
                                                    onChange={() => handleRadioChange("credentialling_contact.provide_childcare_service", false)}
                                                /> No
                                            </label>
                                        </div>
                                    </div>

                                    {/* Minority business */}
                                    <div>
                                        <p className="text-sm font-medium text-[#111928] mb-2">
                                            Does this location qualify as a minority business enterprise?
                                        </p>
                                        <div className="flex gap-6 text-sm text-[#4A5565]">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="qualified_as_minority_business"
                                                    className="w-4 h-4 accent-[#1447E6]"
                                                    checked={formData.credentialling_contact?.qualified_as_minority_business === true}
                                                    onChange={() => handleRadioChange("credentialling_contact.qualified_as_minority_business", true)}
                                                /> Yes
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="qualified_as_minority_business"
                                                    className="w-4 h-4 accent-[#1447E6]"
                                                    checked={formData.credentialling_contact?.qualified_as_minority_business === false}
                                                    onChange={() => handleRadioChange("credentialling_contact.qualified_as_minority_business", true)}
                                                /> No
                                            </label>
                                        </div>
                                    </div>

                                    {/* Certifications */}
                                    <div>
                                        <label className="text-sm font-medium text-[#111928]">
                                            Who at this location have the following current certifications?
                                            <span className="text-sm font-normal text-[#6A7282]">
                                                {" "} (Please list only the applicant's certification expiration dates.)
                                            </span>
                                        </label>

                                        <div className="border border-[#E5E7EB] rounded-[12px] mt-3 overflow-hidden">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-[44px] ${i % 2 === 0 ? "bg-[#F9FAFB]" : "bg-white"}`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Lab services */}
                                    <div>
                                        <p className="text-sm font-medium text-[#111928] mb-2">
                                            Does this location provide any laboratory services on site?
                                        </p>
                                        <div className="flex gap-6 text-sm text-[#4A5565]">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="provide_laboratory_service"
                                                    className="w-4 h-4 accent-[#1447E6]"
                                                    checked={formData.credentialling_contact?.provide_laboratory_service === true}
                                                    onChange={() => handleRadioChange("credentialling_contact.provide_laboratory_service", true)}
                                                /> Yes
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="provide_laboratory_service"
                                                    className="w-4 h-4 accent-[#1447E6]"
                                                    checked={formData.credentialling_contact?.provide_laboratory_service === false}
                                                    onChange={() => handleRadioChange("credentialling_contact.provide_laboratory_service", false)}
                                                /> No
                                            </label>
                                        </div>
                                    </div>

                                    {/* X-ray */}
                                    <div>
                                        <p className="text-sm font-medium text-[#111928] mb-2">
                                            Does this location provide any X-ray services on site?
                                        </p>
                                        <div className="flex gap-6 text-sm text-[#4A5565]">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="provide_xray_service"
                                                    className="w-4 h-4 accent-[#1447E6]"
                                                    checked={formData.credentialling_contact?.provide_xray_service === true}
                                                    onChange={() => handleRadioChange("credentialling_contact.provide_xray_service", true)}
                                                /> Yes
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="provide_xray_service"
                                                    className="w-4 h-4 accent-[#1447E6]"
                                                    checked={formData.credentialling_contact?.provide_xray_service === false}
                                                    onChange={() => handleRadioChange("credentialling_contact.provide_xray_service", false)}
                                                /> No
                                            </label>
                                        </div>
                                    </div>

                                    {/* Other services */}
                                    <div>
                                        <p className="text-sm font-medium text-[#111928] mb-3">
                                            Any other services the location provides:
                                        </p>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-[#4A5565]">
                                            {[
                                                "Radiology services",
                                                "Allergy injections",
                                                "EKG",
                                                "Age appropriate immunizations",
                                                "Osteopathic manipulations",
                                                "Allergy skin tests",
                                                "Flexible sigmoidoscopy",
                                                "IV hydration/treatments",
                                                "Care of minor lacerations",
                                                "Routine office gynecology",
                                                "Tympanometry/audiometry tests",
                                                "Cardiac stress tests",
                                                "Pulmonary function tests",
                                                "Drawing blood",
                                                "Asthma treatments",
                                                "Physical therapies",
                                                "Other",
                                            ].map(item => (
                                                <label key={item} className="flex items-center gap-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedOtherServiceProvider.includes(item)}
                                                        onChange={() =>
                                                            handleCheckboxArrayChange("credentialling_contact.other_services_provider", item)
                                                        }
                                                    /> {item}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Procedures */}
                                    <div>
                                        <label className="text-sm font-medium text-[#111928]">
                                            Please list any additional office procedures provided including surgical procedures.
                                            <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            rows={4}
                                            placeholder="Write text here ..."
                                            className={`${inputClass} w-full mt-2`}
                                            name="credentialling_contact.additional_procedures"
                                            value={formData.credentialling_contact?.additional_procedures || ""}
                                            onChange={handleInputChange}
                                        />
                                        <p className="text-xs text-[#6A7282] mt-1">4/100 words</p>
                                    </div>

                                    {/* Anesthesia */}
                                    <div>
                                        <p className="text-sm font-medium text-[#111928] mb-2">
                                            Is anesthesia administered at this practice location?
                                        </p>
                                        <div className="flex gap-6 text-sm text-[#4A5565]">
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="does_anesthesia_administered"
                                                    className="w-4 h-4 accent-[#1447E6]"
                                                    checked={formData.credentialling_contact?.does_anesthesia_administered === true}
                                                    onChange={() => handleRadioChange("credentialling_contact.does_anesthesia_administered", true)}
                                                /> Yes
                                            </label>
                                            <label className="flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name="does_anesthesia_administered"
                                                    className="w-4 h-4 accent-[#1447E6]"
                                                    checked={formData.credentialling_contact?.does_anesthesia_administered === false}
                                                    onChange={() => handleRadioChange("credentialling_contact.does_anesthesia_administered", false)}
                                                /> No
                                            </label>
                                        </div>
                                    </div>


                                </div>



                            </div>

                        </div>

                    </div>
                </div>

                {/* ================= RIGHT SCROLLABLE SIDEBAR ================= */}
                <div className="w-[320px] min-h-0 overflow-y-auto p-6 border-l border-[#E5E7EB]">
                    <div className="rounded-[12px] border border-[#E5E7EB] bg-white p-4">
                        <p className="font-medium text-sm text-[#6A7282] mb-3">
                            Section overview
                        </p>

                        <ul className="space-y-1">
                            <li className="rounded-[8px] bg-[#F9FAFB] px-3 py-2 text-sm font-medium text-[#1447E6]">
                                <button onClick={() => scrollToSection("currentEmployment")}>
                                    Current Employment
                                </button>

                            </li>
                            <li className="px-3 py-2 text-sm text-[#4A5565]">
                                <button onClick={() => scrollToSection("previousEmployment")}>
                                    Previous Employment
                                </button>
                            </li>
                            <li className="px-3 py-2 text-sm text-[#4A5565]">
                                <button onClick={() => scrollToSection("employmentGaps")}>
                                    Employment Gaps
                                </button>
                            </li>
                            <li className="px-3 py-2 text-sm text-[#4A5565]">
                                <button onClick={() => scrollToSection("hospitalAffiliations")}>
                                    Hospital Affiliations
                                </button>
                            </li>
                            <li className="px-3 py-2 text-sm text-[#4A5565]">
                                <button onClick={() => scrollToSection("references")}>
                                    References
                                </button>
                            </li>
                            <li className="px-3 py-2 text-sm text-[#4A5565]">
                                <button className="w-full text-left leading-5 break-words whitespace-normal" onClick={() => scrollToSection("liability")}>
                                    Professional liability insurance coverage
                                </button>
                            </li>
                            <li className="px-3 py-2 text-sm text-[#4A5565]">
                                <button onClick={() => scrollToSection("practiceLocation")}>
                                    Practice Location Information
                                </button>
                            </li>
                            <li className="px-3 py-2 text-sm text-[#4A5565]">
                                <button onClick={() => scrollToSection("credentialing")}>
                                    Credentialing contact
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WorkExp