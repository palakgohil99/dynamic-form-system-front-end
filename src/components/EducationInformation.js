import React, { useState, useRef, useEffect } from "react";
import { CalendarDays, Plus, ChevronDown, ChevronUp, Trash2Icon } from "lucide-react";
import Creatable from "react-select/creatable";
import FormInputField from "./FormInputField";
import RadioGroup from "./RadioGroup";
import PostGraduate from "./EducationModels/PostGraduate";
import { deletePostGraduate, deleteOtherGraduat, deleteLicense } from '../api/CredentialingApi'
import toast from "react-hot-toast";

const EducationInformation = ({
    data,
    onChange,
    openGradPopup,
    postGadList,
    openOtherGradPopup,
    otherGradList,
    openLicensePopup,
    licenseList,
    educationInformations,
    onProgressChange
}) => {
    console.log('data: ', data);
    console.log('educationInformations: ', educationInformations);
    // ✅ Prefer educationInformations from parent
    // const mergedData = {
    //     ...(educationInformations ?? {}),
    //     ...(data ?? {}),
    //     post_graduate_educations: pgEducations,
    //     other_graduate_educations: otherEducations,
    //     licenses,


    // // ✅ arrays: prevent empty [] from overwriting filled arrays
    // post_graduate_educations:
    // (data?.post_graduate_educations?.length ? data.post_graduate_educations : null) ??
    //     (educationInformations?.post_graduate_educations?.length ? educationInformations.post_graduate_educations : null) ??
    //     [],

    //     other_graduate_educations:
    // (data?.other_graduate_educations?.length ? data.other_graduate_educations : null) ??
    //     (educationInformations?.other_graduate_educations?.length ? educationInformations.other_graduate_educations : null) ??
    //     [],

    //     licenses:
    // (data?.licenses?.length ? data.licenses : null) ??
    //     (educationInformations?.licenses?.length ? educationInformations.licenses : null) ??
    //     [],
    // };
    const getId = (x) => x?.id ?? x?._id;

    useEffect(() => {
        const totalFields = 23;

        const isFilled = (v) => {
            if (v === null || v === undefined) return false;

            // ❌ do not count arrays
            if (Array.isArray(v)) return false;

            // ❌ do not count objects
            if (typeof v === "object") return true;

            // strings must not be empty
            if (typeof v === "string") return v.trim() !== "";

            // booleans (true AND false count)
            if (typeof v === "boolean") return true;

            // numbers (0 counts)
            if (typeof v === "number") return true;

            return false;
        };

        const filledFields = Object.values(data || {}).filter(isFilled).length;

        console.log('filledFields: ', Object.values(data || {}).filter(isFilled))

        console.log('data123: ', data);
        onProgressChange?.(filledFields, totalFields);
    }, [data]);

    const [deletedIds, setDeletedIds] = useState({
        pg: new Set(),
        other: new Set(),
        lic: new Set(),
    });

    const mergeById = (a = [], b = []) => {
        const map = new Map();
        [...a, ...b].forEach((item) => {
            const key = getId(item) ?? JSON.stringify(item);
            map.set(key, item);
        });
        return Array.from(map.values());
    };

    const pgEducations = mergeById(
        educationInformations?.post_graduate_educations || [],
        data?.post_graduate_educations || []
    ).filter((x) => !deletedIds.pg.has(getId(x)));

    const otherEducations = mergeById(
        educationInformations?.other_graduate_educations || [],
        data?.other_graduate_educations || []
    ).filter((x) => !deletedIds.other.has(getId(x)));

    const licenses = mergeById(
        educationInformations?.other_licenses || [],
        data?.other_licenses || []
    ).filter((x) => !deletedIds.lic.has(getId(x)));

    const mergedData = {
        ...(educationInformations ?? {}),
        ...(data ?? {}),
        post_graduate_educations: pgEducations,
        other_graduate_educations: otherEducations,
        other_licenses: licenses,
    };
    console.log('other_licenses: ', mergedData.other_licenses);
    const YES_VALUE = 1;
    const NO_VALUE = 0;

    const [options, setOptions] = useState([
        { value: "apple", label: "Apple" },
        { value: "banana", label: "Banana" },
    ]);

    const [openDegreeIndex, setOpenDegreeIndex] = useState(0);
    const [openLicenseIndex, setOpenLicenseIndex] = useState(0);
    const lastSyncedRef = useRef("");

    const inputClass =
        "w-[416px] h-[40px] opacity-100 gap-2 rounded-[12px] border border-gray-200 bg-gray-50 pt-[10px] pr-3 pb-2.5 pl-3 shadow-[0px_1px_0.5px_0.05px_#1D293D05] mt-2 placeholder:font-normal placeholder:text-sm placeholder:leading-5 placeholder:tracking-normal placeholder:text-[#6A7282]";

    const TRAINING_OPTIONS = ["Internship", "Residency", "Fellowship", "Teaching Appointment"];

    // ✅ Ensure Creatable can display prefilled values
    const ensureOption = (val) => {
        if (!val) return;
        setOptions((prev) => {
            const exists = prev.some((o) => o.value === val);
            return exists ? prev : [...prev, { value: val, label: val }];
        });
    };

    // ✅ For <input type="date">: ISO -> YYYY-MM-DD
    const toDateInput = (iso) => {
        if (!iso) return "";
        return String(iso).slice(0, 10);
    };

    // ✅ Always attach latest lists coming from popup
    const buildEducationPayload = (patch = {}) => ({
        ...mergedData,
        post_graduate_educations: pgEducations,
        other_graduate_educations: otherGradList || [],
        licenses: licenseList || [],
        ...patch,
    });

    const handleControlledChange = (e) => {
        const { name, checked } = e.target;

        onChange({
            controlled_substances: {
                ...(data?.controlled_substances || {}),
                [name]: checked,
            },
        });
    };

    // ✅ Send event-like object to parent (works with parent expecting e.target.name/value)
    const emitChange = (name, value) => {
        onChange({ [name]: value }); // ✅ parent expects plain patch object
    };

    // ✅ Whenever popup lists change, sync into parent as full payload
    useEffect(() => {
        const signature = JSON.stringify({
            pg: postGadList || [],
            og: otherGradList || [],
            lic: licenseList || [],
        });

        if (signature === lastSyncedRef.current) return;
        lastSyncedRef.current = signature;

        // parent expects full object for lists sync
        onChange(buildEducationPayload());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [postGadList, otherGradList, licenseList]);

    // ✅ Ensure dropdown values are visible
    useEffect(() => {
        ensureOption(mergedData.city);
        ensureOption(mergedData.state);
        ensureOption(mergedData.primary_speciality);
    }, [mergedData.city, mergedData.state, mergedData.primary_speciality]);

    // ✅ Text inputs
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        emitChange(name, value);
    };

    const deleteDegree = async (id) => {
        const idStr = String(id);
        setDeletedIds((prev) => ({
            ...prev,
            pg: new Set([...prev.pg, id]),
        }));

        let result = await deletePostGraduate({ user_id: localStorage.getItem("user_id"), education_id: id })
        if (result.data) {
            toast.success(result.message);

            const updatedPg = (pgEducations || []).filter(
                (x) => String(getId(x)) !== idStr
            );

            // ✅ close accordion if needed
            setOpenDegreeIndex(-1);

            // ✅ notify parent so props refresh and accordion disappears
            onChange({ post_graduate_educations: updatedPg });
        } else {
            toast.error('Oops! Something went wrong');
            setDeletedIds((prev) => {
                const s = new Set(prev.pg);
                s.delete(id);
                return { ...prev, pg: s };
            });
        }
    }
    const deleteOtherDegree = async (id) => {
        const idStr = String(id);
        setDeletedIds((prev) => ({
            ...prev,
            other: new Set([...prev.other, id]),
        }));

        let result = await deleteOtherGraduat({ user_id: localStorage.getItem("user_id"), education_id: id })
        if (result.data) {
            toast.success(result.message);

            const updatedPg = (otherEducations || []).filter(
                (x) => String(getId(x)) !== idStr
            );

            // ✅ close accordion if needed
            setOpenDegreeIndex(-1);

            // ✅ notify parent so props refresh and accordion disappears
            onChange({ other_graduate_educations: updatedPg });
        } else {
            toast.error('Oops! Something went wrong');
            setDeletedIds((prev) => {
                const s = new Set(prev.other);
                s.delete(id);
                return { ...prev, other: s };
            });
        }
    }

    const handleDeleteLicense = async (id) => {
        const idStr = String(id);
        setDeletedIds((prev) => ({
            ...prev,
            lic: new Set([...prev.lic, id]),
        }));

        let result = await deleteLicense({ user_id: localStorage.getItem("user_id"), license_id: id })
        if (result.data) {
            toast.success(result.message);

            const updatedPg = (licenses || []).filter(
                (x) => String(getId(x)) !== idStr
            );

            // ✅ close accordion if needed
            setOpenLicenseIndex(-1);

            // ✅ notify parent so props refresh and accordion disappears
            onChange({ other_graduate_educations: updatedPg });
        } else {
            toast.error('Oops! Something went wrong');
            setDeletedIds((prev) => {
                const s = new Set(prev.lic);
                s.delete(id);
                return { ...prev, lic: s };
            });
        }
    }
    // ✅ Dates
    const handleDateChange = (e) => {
        const { name, value } = e.target; // YYYY-MM-DD
        emitChange(name, value);
    };

    // ✅ Checkbox
    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        emitChange(name, checked);
    };

    // ✅ Select (Creatable)
    const handleSelectChange = (selectedOption, meta) => {
        const name = meta?.name;
        if (!name) return;

        const val = selectedOption ? selectedOption.value : "";
        ensureOption(val);
        emitChange(name, val);
    };

    const handleAttendanceDateChange = (key) => (e) => {
        const yyyyMmDd = e.target.value;

        onChange({
            attendance_dates: {
                ...(data?.attendance_dates || {}),
                [key]: yyyyMmDd, // keep YYYY-MM-DD, or convert to ISO if needed
            },
        });
    };

    /**
     * ✅ RADIO FIX (MOST IMPORTANT)
     * Support all RadioGroup implementations:
     * - onChange(event)
     * - onChange({ [name]: value })
     * - onChange(value) (rare)
     */
    const normalizeRadioValue = (v) => {
        if (v === undefined || v === null || v === "") return "";

        // booleans
        if (typeof v === "boolean") return v ? YES_VALUE : NO_VALUE;

        // strings
        const s = String(v).trim().toLowerCase();
        if (s === "true" || s === "1" || s === "yes") return YES_VALUE;
        if (s === "false" || s === "0" || s === "no") return NO_VALUE;

        // already matches something like "Yes"/"No" - keep as is
        return v;
    };

    const handleRadioChange = (name) => (valOrEvent) => {
        let raw;

        // 1️⃣ Native input / event
        if (valOrEvent?.target && valOrEvent.target.value !== undefined) {
            raw = valOrEvent.target.value;
        }
        // 2️⃣ Patch object: { fieldName: 0 } or { fieldName: 1 }
        else if (
            valOrEvent &&
            typeof valOrEvent === "object" &&
            !Array.isArray(valOrEvent)
        ) {
            raw =
                valOrEvent[name] !== undefined
                    ? valOrEvent[name]
                    : Object.values(valOrEvent)[0];
        }
        // 3️⃣ Direct value
        else {
            raw = valOrEvent;
        }

        // 🔒 Explicit handling (this is the key fix)
        let value;
        if (raw === true) value = 1;
        else if (raw === false) value = 0;
        else if (raw === "1" || raw === 1) value = 1;
        else if (raw === "0" || raw === 0) value = 0;
        else return;

        console.log("Radio update:", name, value);

        onChange({ [name]: value });
    };



    const toggleDegree = (idx) => {
        setOpenDegreeIndex((prev) => (prev === idx ? -1 : idx));
    };

    const toggleLicense = (idx) => {
        setOpenLicenseIndex((prev) => (prev === idx ? -1 : idx));
    };

    const handlePostGraduatePopup = () => openGradPopup(true);
    const handleOtherGraduatePopup = () => openOtherGradPopup(true);
    const handleLicensePopup = () => {
        openLicensePopup(true)
    };

    return (
        <div className="w-full flex-1 min-h-0 rotate-0 opacity-100 top-[357px] left-[288px] gap-8 p-8 overflow-y-auto bg-white">
            <div className="w-[904px] rotate-0 opacity-100 gap-4 flex items-center">
                <p className="font-semibold text-[20px] leading-[150%] tracking-[0%] text-[#111928]">
                    Education & Certifications
                </p>
                <div className="flex-1 border-t-[1.5px] border-[#E5E7EB]"></div>
                <p className="font-semibold text-[12px] leading-[150%] tracking-[0%] text-center text-[#057A55]">
                    22 of 32 fields completed
                </p>
            </div>

            {/* ================= DEGREE 1 ================= */}
            <div className="flex flex-col w-[904px] h-[758px] opacity-100 gap-6 mt-3">
                <div className="flex flex-col w-[904px] h-[758px] rounded-[12px] border border-[#E5E7EB] bg-white">
                    <div className="w-[904px] h-[44px] opacity-100 gap-2.5 pt-3 pr-6 pb-3 pl-6 bg-[#F3F4F6] border-b border-b-[#E5E7EB] rounded-tl-[12px] rounded-tr-[12px]">
                        <p className="font-medium text-sm leading-5 tracking-normal text-[#111928]">
                            Professional Degree 1
                        </p>
                    </div>

                    <div className="w-full flex justify-center bg-white">
                        <div className="w-[904px] p-8 space-y-8 overflow-y-auto">

                            <div className="flex gap-[18px] mb-3">
                                <FormInputField
                                    label="Professional Degree *"
                                    type="text"
                                    placeholder="e.g., MD, DO, DDS, MBBS"
                                    value={mergedData.professional_degree || ""}
                                    onChange={handleInputChange}
                                    name="professional_degree"
                                    inputClass={inputClass}
                                />

                                <FormInputField
                                    label="Issuing Institution *"
                                    type="text"
                                    placeholder="Full official name of your college or university."
                                    value={mergedData.issuing_institution || ""}
                                    onChange={handleInputChange}
                                    name="issuing_institution"
                                    inputClass={inputClass}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="font-medium text-sm leading-5 tracking-normal text-[#111928]">
                                    Street/Address Line *
                                </label>
                                <input
                                    className={`${inputClass} w-full`}
                                    placeholder="e.g., 123 Elm Street"
                                    name="address"
                                    value={mergedData.address || ""}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="flex gap-[18px] ed-flex-rs">
                                <div className="flex flex-col w-[443px]">
                                    <label className="font-medium text-sm leading-5 tracking-normal text-[#111928]">
                                        City *
                                    </label>
                                    <Creatable
                                        placeholder="e.g., Baltimore"
                                        isClearable
                                        options={options}
                                        value={mergedData.city ? { label: mergedData.city, value: mergedData.city } : null}
                                        onChange={handleSelectChange}
                                        onCreateOption={(inputValue) =>
                                            handleSelectChange({ label: inputValue, value: inputValue }, { name: "city" })
                                        }
                                        classNamePrefix="rs"
                                        styles={{ control: (base) => ({ ...base, boxShadow: "none" }) }}
                                        name="city"
                                    />
                                </div>

                                <div className="flex flex-col w-[443px] ed-flex-rs">
                                    <label className="font-medium text-sm leading-5 tracking-normal text-[#111928]">
                                        State / Country *
                                    </label>
                                    <Creatable
                                        placeholder="e.g., Maryland or United States"
                                        isClearable
                                        options={options}
                                        value={mergedData.country ? { label: mergedData.country, value: mergedData.country } : null}
                                        onChange={handleSelectChange}
                                        onCreateOption={(inputValue) =>
                                            handleSelectChange({ label: inputValue, value: inputValue }, { name: "country" })
                                        }
                                        classNamePrefix="rs"
                                        styles={{ control: (base) => ({ ...base, boxShadow: "none" }) }}
                                        name="country"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-[18px] ed-flex-rs mb-3">
                                <div className="flex flex-col w-[443px]">
                                    <FormInputField
                                        label="Postal Code *"
                                        type="text"
                                        placeholder="e.g., 21201"
                                        value={mergedData.postal_code || ""}
                                        onChange={handleInputChange}
                                        name="postal_code"
                                        inputClass={inputClass}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col">
                                <label className="font-medium text-sm leading-5 tracking-normal text-[#111928]">
                                    Degree *
                                </label>
                                <input
                                    className={`${inputClass} w-full`}
                                    placeholder="Include the exact degree title printed on your diploma"
                                    name="degree_title"
                                    value={mergedData.degree_title || ""}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="font-medium text-sm leading-5 tracking-normal text-[#111928]">
                                    Attendance dates *
                                </label>

                                <div className="flex gap-[10px] mt-2">
                                    <div className="relative w-[443px]">
                                        <CalendarDays size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]" />
                                        <input
                                            type="date"
                                            className={`${inputClass} pl-9`}
                                            name="attendance_date_start"
                                            value={toDateInput(mergedData?.attendance_dates?.start ?? mergedData.attendance_date_start)}
                                            onChange={handleAttendanceDateChange("start")}
                                        />
                                    </div>

                                    <span className="flex items-center">-</span>

                                    <div className="relative w-[443px]">
                                        <CalendarDays size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]" />
                                        <input
                                            type="date"
                                            className={`${inputClass} pl-9`}
                                            name="attendance_date_end"
                                            value={toDateInput(mergedData?.attendance_dates?.end ?? mergedData.attendance_date_end)}
                                            onChange={handleAttendanceDateChange("end")}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 mt-3">
                                <input
                                    type="checkbox"
                                    className="mt-1 rounded border-gray-300"
                                    name="is_completed"
                                    checked={!!mergedData.is_completed}
                                    onChange={handleCheckboxChange}
                                />
                                <div>
                                    <p className="text-sm font-medium text-[#111928]">
                                        Program successfully completed
                                    </p>
                                    <p className="text-sm text-[#6A7282]">
                                        Check the box if you completed and were awarded the degree.
                                    </p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col w-[904px] opacity-100 gap-6 mt-3">
                {(mergedData.post_graduate_educations || []).map((deg, index) => {
                    const isOpen = openDegreeIndex === index;

                    return (
                        <div
                            key={deg.id}
                            className="flex flex-col w-[904px] rounded-[12px] border border-[#E5E7EB] bg-white overflow-hidden"
                        >
                            {/* Header */}
                            <div className="w-[904px] h-[44px] flex items-center justify-between px-6 bg-[#F3F4F6] border-b border-[#E5E7EB]">
                                <p className="font-medium text-sm text-[#111928]">
                                    Professional Degree {index + 1}
                                </p>

                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() => toggleDegree(index)}
                                        className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-200"
                                        aria-label="Toggle"
                                    >
                                        {isOpen ? (
                                            <ChevronUp size={18} color="#101828" />
                                        ) : (
                                            <ChevronDown size={18} color="#101828" />
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => deleteDegree(deg.id)}
                                        className="flex items-center justify-center w-8 h-8 rounded hover:bg-red-50"
                                        aria-label="Delete"
                                    >
                                        <Trash2Icon size={18} color="#101828" />
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            {isOpen && (
                                <div className="w-full flex justify-center bg-white">
                                    <div className="w-[904px] p-8 space-y-8">
                                        {/* Training Types */}
                                        <div className="flex flex-wrap gap-x-6 gap-y-3">
                                            {TRAINING_OPTIONS.map((t) => (
                                                <label key={t} className="flex items-center gap-2 text-sm">
                                                    <input
                                                        type="checkbox"
                                                        checked={(deg?.types || []).includes(t)}
                                                        disabled
                                                    />
                                                    {t}
                                                </label>
                                            ))}
                                        </div>

                                        {/* Specialty */}
                                        <div className="flex flex-col">
                                            <label className="font-medium text-sm">Specialty *</label>
                                            <input
                                                className={`${inputClass} w-full`}
                                                value={deg?.specialty || ""}
                                                disabled
                                            />
                                        </div>

                                        {/* Institution + City */}
                                        <div className="flex gap-[18px]">
                                            <FormInputField
                                                label="Institution *"
                                                type="text"
                                                value={deg?.institution || ""}
                                                disabled
                                                inputClass={inputClass}
                                            />

                                            <FormInputField
                                                label="City *"
                                                type="text"
                                                value={deg?.city || ""}
                                                disabled
                                                inputClass={inputClass}
                                            />
                                        </div>

                                        {/* State + Postal */}
                                        <div className="flex gap-[18px]">
                                            <FormInputField
                                                label="State / Country *"
                                                type="text"
                                                value={deg?.state_country || ""}
                                                disabled
                                                inputClass={inputClass}
                                            />

                                            <FormInputField
                                                label="Postal Code *"
                                                type="text"
                                                value={deg?.postal_code || ""}
                                                disabled
                                                inputClass={inputClass}
                                            />
                                        </div>

                                        {/* Program Completed */}
                                        <div className="flex items-start gap-3">
                                            <input
                                                type="checkbox"
                                                checked={!!deg?.program_completed}
                                                disabled
                                            />
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Program successfully completed
                                                </p>
                                            </div>
                                        </div>

                                        {/* Attendance Dates */}
                                        <div className="flex flex-col">
                                            <label className="font-medium text-sm">Attendance dates *</label>
                                            <div className="flex gap-3 mt-2">
                                                <input
                                                    type="date"
                                                    className={`${inputClass}`}
                                                    value={toDateInput(deg?.attendance_dates?.start)}
                                                    disabled
                                                />
                                                <span>-</span>
                                                <input
                                                    type="date"
                                                    className={`${inputClass}`}
                                                    value={toDateInput(deg?.attendance_dates?.end)}
                                                    disabled
                                                />
                                            </div>
                                        </div>

                                        {/* Program Director */}
                                        <div className="flex flex-col">
                                            <label className="font-medium text-sm">Program director</label>
                                            <input
                                                className={`${inputClass} w-full`}
                                                value={deg?.program_director || ""}
                                                disabled
                                            />
                                        </div>

                                        {/* Current Director */}
                                        <div className="flex flex-col">
                                            <label className="font-medium text-sm">
                                                Current program director (if known)
                                            </label>
                                            <input
                                                className={`${inputClass} w-full`}
                                                value={deg?.current_program_director || ""}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-col w-[904px] opacity-100 gap-6 mt-3">
                {(mergedData.other_graduate_educations || []).map((deg, index) => {
                    const isOpen = openDegreeIndex === index;

                    return (
                        <div
                            key={index}
                            className="flex flex-col w-[904px] rounded-[12px] border border-[#E5E7EB] bg-white overflow-hidden"
                        >
                            {/* Header */}
                            <div className="w-[904px] h-[44px] flex items-center justify-between pt-3 pr-6 pb-3 pl-6 bg-[#F3F4F6] border-b border-b-[#E5E7EB]">
                                <p className="font-medium text-sm leading-5 tracking-normal text-[#111928]">
                                    Other Graduation Level {index + 1}
                                </p>

                                <div className="flex items-center gap-4">
                                    <button
                                        type="button"
                                        onClick={() => toggleDegree(index)}
                                        className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-200"
                                        aria-label="Toggle"
                                    >
                                        {isOpen ? (
                                            <ChevronUp size={18} color="#101828" />
                                        ) : (
                                            <ChevronDown size={18} color="#101828" />
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => deleteOtherDegree(deg.id)}
                                        className="flex items-center justify-center w-8 h-8 rounded hover:bg-red-50"
                                        aria-label="Delete"
                                    >
                                        <Trash2Icon size={18} color="#101828" />
                                    </button>
                                </div>
                            </div>

                            {/* Body */}
                            {isOpen && (
                                <div className="w-full flex justify-center bg-white">
                                    <div className="w-[904px] p-8 space-y-8 overflow-y-auto">
                                        <div className="flex flex-col">
                                            <FormInputField
                                                label="Institution *"
                                                type="text"
                                                placeholder="e.g., Johns Hopkins University"
                                                value={deg?.issuing_institution || ""}
                                                onChange={() => { }}
                                                name="issuing_institution"
                                                inputClass={inputClass}
                                                disabled
                                            />
                                        </div>

                                        <div className="flex gap-[18px] mb-3">
                                            <FormInputField
                                                label="Address*"
                                                type="text"
                                                placeholder="e.g., 123 Elm Street"
                                                value={deg?.address || ""}
                                                onChange={() => { }}
                                                name="address"
                                                inputClass={inputClass}
                                                disabled
                                            />

                                            <FormInputField
                                                label="City *"
                                                type="text"
                                                placeholder="City where the institution is located"
                                                value={deg?.city || ""}
                                                onChange={() => { }}
                                                name="city"
                                                inputClass={inputClass}
                                                disabled
                                            />
                                        </div>

                                        <div className="flex gap-[18px] mb-3">
                                            <FormInputField
                                                label="State / country *"
                                                type="text"
                                                placeholder="e.g., Maryland or United States"
                                                value={deg?.country || ""}
                                                onChange={() => { }}
                                                name="country"
                                                inputClass={inputClass}
                                                disabled
                                            />

                                            <FormInputField
                                                label="Postal code *"
                                                type="text"
                                                placeholder="Enter ZIP or postal code"
                                                value={deg?.postal_code || ""}
                                                onChange={() => { }}
                                                name="postal_code"
                                                inputClass={inputClass}
                                                disabled
                                            />
                                        </div>

                                        <div className="flex flex-col">
                                            <label className="font-medium text-sm leading-5 tracking-normal text-[#111928]">
                                                Degree
                                            </label>
                                            <input
                                                className={`${inputClass} w-full`}
                                                value={deg?.degree || ""}
                                                name="degree"
                                                readOnly
                                            />
                                        </div>

                                        <div className="flex flex-col">
                                            <label className="font-medium text-sm leading-5 tracking-normal text-[#111928]">
                                                Attendance dates *
                                            </label>

                                            <div className="flex gap-[10px] mt-2">
                                                <div className="relative w-[443px]">
                                                    <CalendarDays
                                                        size={14}
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
                                                    />
                                                    <input
                                                        className={`${inputClass} pl-9`}
                                                        value={deg?.attendance_from || ""}
                                                        readOnly
                                                    />
                                                </div>

                                                <span className="flex items-center">-</span>

                                                <div className="relative w-[443px]">
                                                    <CalendarDays
                                                        size={14}
                                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
                                                    />
                                                    <input
                                                        className={`${inputClass} pl-9`}
                                                        value={deg?.attendance_to || ""}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            {/* ================= BUTTONS ================= */}
            <div className="flex w-[910px] h-[40px] gap-[18px] items-center justify-end py-12">
                <button
                    type="button"
                    className="w-[246px] gap-[6px] rounded-[12px] border border-[#E5E7EB] px-4 py-2.5 bg-[#F9FAFB] font-medium text-sm leading-5 tracking-normal text-[#4A5565] flex items-center"
                    onClick={handlePostGraduatePopup}
                >
                    Add postgraduate education <Plus size={14} color="#101828" />
                </button>

                <button
                    type="button"
                    className="w-[293px] gap-[6px] rounded-[12px] border border-[#E5E7EB] px-4 py-2.5 bg-[#F9FAFB] font-medium text-sm leading-5 tracking-normal text-[#4A5565] flex items-center"
                    onClick={handleOtherGraduatePopup}
                >
                    Add other graduate-level education <Plus size={14} color="#101828" />
                </button>
            </div>

            <hr className="w-[904px] h-[1px] text-[#E5E7EB] py-12" />

            {/* ================= LICENSE 1 ================= */}
            <div className="w-[904px] rotate-0 opacity-100 items-center">
                <p className="font-semibold text-[16px] leading-[150%] tracking-normal text-[#111928]">
                    Licenses and Certificates
                </p>
                <p className="font-normal text-sm leading-[150%] tracking-normal text-[#374151]">
                    Please include all license(s) and certifications in all States where you are currently or have previously been licensed.
                </p>
            </div>

            <div className="flex flex-col w-[904px] h-[455px] opacity-100 gap-6 mt-3">
                <div className="flex flex-col w-[904px] h-[455px] rounded-[12px] border border-[#E5E7EB] bg-white">
                    <div className="w-[904px] h-[44px] opacity-100 gap-2.5 pt-3 pr-6 pb-3 pl-6 bg-[#F3F4F6] border-b border-b-[#E5E7EB] rounded-tl-[12px] rounded-tr-[12px]">
                        <p className="font-medium text-sm leading-5 tracking-normal text-[#4A5565]">License 1</p>
                    </div>

                    <div className="w-full flex justify-center bg-white">
                        <div className="w-[904px] p-8 space-y-8 overflow-y-auto">

                            <div className="flex gap-[18px] mb-3">
                                <FormInputField
                                    label="License Type *"
                                    type="text"
                                    placeholder="Professional license type issued by a state board."
                                    value={mergedData.license_type || ""}
                                    onChange={handleInputChange}
                                    name="license_type"
                                    inputClass={inputClass}
                                />

                                <FormInputField
                                    label="License Number *"
                                    type="text"
                                    placeholder="e.g., TX123456"
                                    value={mergedData.license_number || ""}
                                    onChange={handleInputChange}
                                    name="license_number"
                                    inputClass={inputClass}
                                />
                            </div>

                            <div className="flex gap-[18px] mb-3">
                                <FormInputField
                                    label="Original Date of Issue *"
                                    type="date"
                                    placeholder="MM/DD/YYYY"
                                    value={toDateInput(mergedData.date_of_issue)}
                                    onChange={handleDateChange}
                                    name="date_of_issue"
                                    inputClass={inputClass}
                                />

                                <FormInputField
                                    label="Expiration Date *"
                                    type="date"
                                    placeholder="MM/DD/YYYY"
                                    value={toDateInput(mergedData.date_of_expiration)}
                                    onChange={handleDateChange}
                                    name="date_of_expiration"
                                    inputClass={inputClass}
                                />
                            </div>

                            <div className="flex flex-col">
                                <label className="font-medium text-sm leading-5 tracking-normal text-[#111928]">
                                    State of Registration
                                </label>
                                <input
                                    className={`${inputClass} w-full`}
                                    placeholder="e.g., Texas"
                                    name="registration_state"
                                    value={mergedData.registration_state || ""}
                                    onChange={handleInputChange}
                                />
                            </div>

                            {/* ✅ RADIO */}
                            <div className="flex flex-col">
                                <RadioGroup
                                    label="Do you currently practice in this state?"
                                    name="currently_practicing_state"
                                    value={Number(mergedData.board_certified) ?? ""}
                                    onChange={handleRadioChange("currently_practicing_state")}
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col w-[904px] opacity-100 gap-6 mt-3">
                {(mergedData.other_licenses || []).map((license, index) => {
                    console.log('openLicenseIndex: ', openLicenseIndex)
                    console.log('index: ', index)
                    const isOpenLicense = openLicenseIndex === index;
                    console.log('isOpen: ', isOpenLicense)
                    return (
                        <div
                            key={index}
                            className="flex flex-col w-[904px] h-[455px] rounded-[12px] border border-[#E5E7EB] bg-white"
                        >
                            <div className="w-[904px] h-[44px] flex items-center justify-between pt-3 pr-6 pb-3 pl-6 bg-[#F3F4F6] border-b border-b-[#E5E7EB] rounded-tl-[12px] rounded-tr-[12px]">
                                <p className="font-medium text-sm leading-5 tracking-normal text-[#4A5565]">
                                    License {index + 2} {isOpenLicense}
                                </p>

                                <div className="flex items-center gap-4">
                                    {/* Trash icon */}
                                    <button
                                        type="button"
                                        className="text-[#6B7280] hover:text-red-600 transition"
                                        aria-label="Delete license"
                                        onClick={() => { handleDeleteLicense(license.id) }}
                                    >
                                        <Trash2Icon size={18} color="#101828" />
                                    </button>

                                    {/* Collapse arrow */}
                                    <button
                                        type="button"
                                        onClick={() => toggleLicense(index)}
                                        className="text-[#111928] text-sm font-medium"
                                        aria-label="Toggle license"
                                    >
                                        {isOpenLicense ? (
                                            <ChevronUp size={18} color="#101828" />
                                        ) : (
                                            <ChevronDown size={18} color="#101828" />
                                        )}
                                    </button>
                                </div>
                            </div>


                            <div className="w-full flex justify-center bg-white">
                                <div className="w-[904px] p-8 space-y-8 overflow-y-auto">
                                    <div className="flex gap-[18px] mb-3">
                                        <FormInputField
                                            label="License Type *"
                                            type="text"
                                            placeholder="Professional license type issued by a state board."
                                            value={license?.license_type || ""}
                                            onChange={() => { }}
                                            name="license_type"
                                            inputClass={inputClass}
                                            disabled
                                        />

                                        <FormInputField
                                            label="License Number*"
                                            type="text"
                                            value={license?.license_number || ""}
                                            onChange={() => { }}
                                            name="license_number"
                                            inputClass={inputClass}
                                            disabled
                                        />
                                    </div>

                                    <div className="flex gap-[18px] mb-3">
                                        <FormInputField
                                            label="Original Date of Issue*"
                                            type="text"
                                            value={license?.date_of_issue || ""}
                                            onChange={() => { }}
                                            name="date_of_issue"
                                            inputClass={inputClass}
                                            disabled
                                        />

                                        <FormInputField
                                            label="Expiration Date *"
                                            type="text"
                                            value={license?.date_of_expiration || ""}
                                            onChange={() => { }}
                                            name="date_of_expiration"
                                            inputClass={inputClass}
                                            disabled
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <label className="font-medium text-sm leading-5 tracking-normal text-[#111928]">
                                            State of Registration
                                        </label>
                                        <input
                                            className={`${inputClass} w-full`}
                                            name="registration_state"
                                            value={license?.registration_state || ""}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <RadioGroup
                                            label="Do you currently practice in this state?"
                                            name="currently_practicing_state_model"
                                            value={license?.currently_practicing_state || ""}
                                            onChange={onChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="flex w-[910px] h-[40px] gap-[18px] items-center justify-end py-12">
                <button
                    type="button"
                    className="w-[275px] gap-[6px] rounded-[12px] border border-[#E5E7EB] px-4 py-2.5 bg-[#F9FAFB] font-medium text-sm leading-5 tracking-normal text-[#4A5565] flex items-center"
                    onClick={handleLicensePopup}
                >
                    Add more licenses or certificates <Plus size={14} color="#101828" />
                </button>
            </div>
            <hr className="w-[904px] h-[1px] text-[#E5E7EB] py-5" />

            {/* ================= CONTROLLED SUBSTANCES ================= */}
            <div className="w-[904px] space-y-6">
                <p className="font-semibold text-[16px] leading-[150%] text-[#111928]">
                    Controlled Substances
                </p>

                <div className="flex items-start gap-3 p-4 rounded-[8px] border border-[#E5E7EB] bg-white shadow-[0px_1px_0.5px_0.05px_#1D293D05]">
                    <input
                        type="checkbox"
                        className="mt-1 rounded border-gray-300"
                        name="dea"
                        checked={!!mergedData?.controlled_substances?.dea ?? ""}
                        onChange={handleControlledChange}
                    />
                    <div>
                        <p className="text-sm font-medium text-[#111928]">DEA</p>
                        <p className="text-sm text-[#6A7282]">
                            Enter federal registration number for prescribing controlled substances.
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-[8px] border border-[#E5E7EB] bg-white shadow-[0px_1px_0.5px_0.05px_#1D293D05]">
                    <input
                        type="checkbox"
                        className="mt-1 rounded border-gray-300"
                        name="dps"
                        checked={!!mergedData?.controlled_substances?.dps ?? ""}
                        onChange={handleControlledChange}
                    />
                    <div>
                        <p className="text-sm font-medium text-[#111928]">DPS</p>
                        <p className="text-sm text-[#6A7282]">
                            Texas-specific controlled-substance license (for older registrations).
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-[8px] border border-[#E5E7EB] bg-white shadow-[0px_1px_0.5px_0.05px_#1D293D05]">
                    <input
                        type="checkbox"
                        className="mt-1 rounded border-gray-300"
                        name="other_cds"
                        checked={!!mergedData?.controlled_substances?.other_cds ?? ""}
                        onChange={handleControlledChange}
                    />
                    <div>
                        <p className="text-sm font-medium text-[#111928]">Other CDs</p>
                        <p className="text-sm text-[#6A7282]">
                            For CDS/CSR numbers issued by states outside Texas.
                        </p>
                    </div>
                </div>

                <div className="flex gap-[18px] pt-2">
                    <FormInputField
                        label="UPIN *"
                        type="text"
                        placeholder="Unique Physician Identification Number"
                        value={mergedData.upin || ""}
                        onChange={handleInputChange}
                        name="upin"
                        inputClass={inputClass}
                    />

                    <FormInputField
                        label="National Provider Identifier (when available) *"
                        type="text"
                        placeholder="10-digit NPI assigned by CMS"
                        value={mergedData.npi || ""}
                        onChange={handleInputChange}
                        name="npi"
                        inputClass={inputClass}
                    />
                </div>

                <div className="flex flex-col gap-7 w-[443px]">
                    <RadioGroup
                        label="Are you a participating Medicare provider? *"
                        name="is_participating_provider"
                        value={Number(mergedData.is_participating_provider) ?? ""}
                        onChange={handleRadioChange("is_participating_provider")}
                    />

                    <RadioGroup
                        label="Educational Council for Foreign Medical Graduates (ECFMG) *"
                        name="educational_council"
                        value={Number(mergedData.educational_council) ?? ""}
                        onChange={handleRadioChange("educational_council")}
                    />
                </div>
            </div>

            <hr className="w-[904px] h-[1px] text-[#E5E7EB] mt-12" />

            {/* ================= PROFESSIONAL / SPECIALTY INFORMATION ================= */}
            <div className="w-[904px] mt-12 space-y-4">
                <p className="font-semibold text-[16px] leading-[150%] text-[#111928]">
                    Professional / Specialty Information
                </p>

                <div className="flex gap-[18px]">
                    <div className="flex flex-col w-[443px] flex-rs">
                        <label className="font-medium text-sm leading-5 text-[#111928]">
                            Primary specialty *
                        </label>
                        <Creatable
                            placeholder="Select your main area of medical practice or certification"
                            classNamePrefix="rs"
                            isClearable
                            options={options}
                            value={
                                mergedData.primary_speciality
                                    ? { label: mergedData.primary_speciality, value: mergedData.primary_speciality }
                                    : null
                            }
                            onChange={handleSelectChange}
                            onCreateOption={(inputValue) =>
                                handleSelectChange({ label: inputValue, value: inputValue }, { name: "primary_speciality" })
                            }
                            name="primary_speciality"
                        />
                    </div>

                    <div className="flex flex-col w-[443px]">
                        <RadioGroup
                            label="Board certified? *"
                            name="board_certified"
                            value={Number(mergedData.board_certified) ?? ""}
                            onChange={handleRadioChange("board_certified")}
                        />
                    </div>
                </div>

                <div className="flex flex-col w-full mt-7">
                    <label className="font-medium text-sm leading-5 text-[#111928]">
                        Please list other areas of professional practice interest or focus (HIV/AIDS, etc.) *
                    </label>
                    <textarea
                        className={`${inputClass} resize-none w-full`}
                        placeholder="Write text here ..."
                        name="other_interests"
                        value={mergedData.other_interests || ""}
                        onChange={handleInputChange}
                    />
                    <p className="text-xs text-[#6A7282] mt-1">4/100 words</p>
                </div>
            </div>
        </div>
    );
};

export default EducationInformation;
