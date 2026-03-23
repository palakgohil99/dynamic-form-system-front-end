import React, { useState, useRef, useEffect } from "react";
import { CalendarDays } from 'lucide-react'
import Creatable from 'react-select/creatable';
import FormInputField from "./FormInputField";
import RadioGroup from "./RadioGroup";

const PersonalInformation = ({ data, onChange, personalInformations, onProgressChange }) => {
    // Prefer personalInformations (coming from parent). Fallback to data.
    console.log('personalInformations: ', data);
    const formData = personalInformations ?? data ?? {};

    const didHydrate = useRef(false);

    useEffect(() => {
        if (didHydrate.current) return;

        const hasDb = personalInformations && Object.keys(personalInformations).length > 0;
        const parentEmpty = !data || Object.keys(data).length === 0;

        if (hasDb && parentEmpty) {
            didHydrate.current = true;
            onChange(personalInformations); // ✅ fills parent data?.personal_informations
        }
    }, [personalInformations, data, onChange]);

    useEffect(() => {
        const totalFields = 25;

        const filledFields = Object.values(data || {}).filter(
            (v) => v !== null && v !== undefined && v !== ""
        ).length;
        console.log('filledFields: ', data)
        onProgressChange?.(filledFields, totalFields);
    }, [data]);


    const YES_VALUE = 1;
    const NO_VALUE = 0;

    const [options, setOptions] = useState([
        { value: "apple", label: "Apple" },
        { value: "banana", label: "Banana" },
    ]);

    // Utility: ensure current value exists in options (so Creatable can display it)
    const ensureOption = (val) => {
        if (!val) return;
        setOptions((prev) => {
            const exists = prev.some((o) => o.value === val);
            return exists ? prev : [...prev, { value: val, label: val }];
        });
    };

    // ✅ ISO -> YYYY-MM-DD (for <input type="date">)
    const toDateInput = (iso) => {
        if (!iso) return "";
        if (typeof iso === "string" && iso.length >= 10) return iso.slice(0, 10);
        return "";
    };

    // ✅ YYYY-MM-DD -> ISO
    const yyyyMmDdToISO = (yyyyMmDd) => {
        if (!yyyyMmDd) return "";
        return new Date(`${yyyyMmDd}T00:00:00.000Z`).toISOString();
    };

    // ✅ date_of_service.start/end handler (nested object)
    const handleDateOfServiceChange = (key) => (e) => {
        const yyyyMmDd = e.target.value;
        const iso = yyyyMmDd ? yyyyMmDdToISO(yyyyMmDd) : "";

        onChange({
            date_of_service: {
                ...(data?.date_of_service || {}),
                [key]: iso,
            },
        });
    };

    const handleDateRangeArrayChange = (fieldName, key) => (e) => {
        const yyyyMmDd = e.target.value;
        const iso = yyyyMmDd ? yyyyMmDdToISO(yyyyMmDd) : "";

        const currentArr = Array.isArray(data?.[fieldName]) ? data[fieldName] : [];
        const first = currentArr[0] || {};

        const nextArr = [
            {
                ...first,
                [key]: iso,
            },
            ...currentArr.slice(1),
        ];

        onChange({ [fieldName]: nextArr });
    };

    // ✅ If other date fields are ISO too, use this:
    const handleISODateFieldChange = (fieldName) => (e) => {
        const yyyyMmDd = e.target.value;
        onChange({
            [fieldName]: yyyyMmDd ? yyyyMmDdToISO(yyyyMmDd) : "",
        });
    };

    const normalizeRadioValue = (v) => {
        // only treat null/undefined as empty (NOT 0)
        if (v === undefined || v === null) return "";

        // if value is already number 0/1, keep it
        if (typeof v === "number") return v;

        // booleans
        if (typeof v === "boolean") return v ? YES_VALUE : NO_VALUE;

        // strings
        const s = String(v).trim().toLowerCase();
        if (s === "true" || s === "1" || s === "yes") return YES_VALUE;
        if (s === "false" || s === "0" || s === "no") return NO_VALUE;

        return v;
    };

    // ✅ Radio handler that works with most RadioGroup implementations expecting event
    const handleRadioChange = (name) => (valOrEvent) => {
        const raw =
            valOrEvent?.target?.value !== undefined
                ? valOrEvent.target.value
                : valOrEvent;

        const normalized = normalizeRadioValue(raw);

        // force 0/1 to be numbers (RadioGroup often returns "0"/"1")
        const value =
            normalized === "" ? "" : Number(normalized);

        onChange({ [name]: value });
    };

    // Whenever formData changes, make sure select fields are displayable in Creatable
    useEffect(() => {
        ensureOption(data?.type_of_profession);
        ensureOption(data?.cityzen_ship_status);
        ensureOption(data?.visa_status);
        ensureOption(data?.branch_of_service);
    }, [
        data?.type_of_profession,
        data?.cityzen_ship_status,
        data?.visa_status,
        data?.branch_of_service,
    ]);

    const handleSelectChange = (selectedOption, meta) => {
        const name = meta?.name;
        if (!name) return;

        const val = selectedOption ? selectedOption.value : "";
        ensureOption(val);

        // keep same payload shape you were using for text/selects
        onChange({ [name]: val });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        onChange({ [name]: value });
    };

    const inputClass =
        "w-[416px] h-[40px] opacity-100 gap-2 rounded-[12px] border border-gray-200 bg-gray-50 pt-[10px] pr-3 pb-2.5 pl-3 shadow-[0px_1px_0.5px_0.05px_#1D293D05] mt-2 placeholder:font-normal placeholder:text-sm placeholder:leading-5 placeholder:tracking-normal placeholder:text-[#6A7282]";

    // Small helper for Creatable fields
    const creatableValue = (name) =>
        data?.[name] ? { label: data[name], value: data[name] } : null;

    return (
        <div className="w-full flex-1 min-h-0 rotate-0 opacity-100 top-[357px] left-[288px] gap-8 p-8 overflow-y-auto bg-white">
            <div className="w-[904px] rotate-0 opacity-100 gap-4 flex items-center">
                <p className="font-semibold text-[20px] leading-[150%] tracking-[0%] text-[#111928]">
                    Personal Information
                </p>
                <div className="flex-1 border-t-[1.5px] border-[#E5E7EB]" />
                <p className="font-semibold text-[12px] leading-[150%] tracking-[0%] text-center text-[#057A55]">
                    22 of 32 fields completed
                </p>
            </div>

            {/* Type of Professional */}
            <div className="w-[904px] h-[70px] items-center gap-[10px] mt-5">
                <label className="font-medium text-sm leading-5 tracking-normal text-[#111928]">
                    Type of Professional
                </label>
                <Creatable
                    isClearable
                    options={options}
                    value={creatableValue("type_of_profession")}
                    onChange={handleSelectChange}
                    onCreateOption={(inputValue) =>
                        handleSelectChange(
                            { label: inputValue, value: inputValue },
                            { name: "type_of_profession" }
                        )
                    }
                    name="type_of_profession"
                    placeholder="Select or type your profession"
                    classNamePrefix="rs"
                />
            </div>

            <div className="w-[904px] opacity-100 grid grid-cols-1 grid-rows-4 gap-y-6 gap-x-[18px] mt-6">
                <div className="w-[443px] opacity-100 gap-[20px] flex flex-row">
                    <FormInputField
                        label="First Name"
                        type="text"
                        placeholder="Enter your first name"
                        value={data?.first_name || ""}
                        onChange={handleInputChange}
                        name="first_name"
                        inputClass={inputClass}
                    />

                    <FormInputField
                        label="Last Name"
                        type="text"
                        placeholder="Enter your last name"
                        value={data?.last_name || ""}
                        onChange={handleInputChange}
                        name="last_name"
                        inputClass={inputClass}
                    />
                </div>

                <div className="w-[443px] opacity-100 gap-[20px] flex flex-row">
                    <FormInputField
                        label="Middle Name"
                        type="text"
                        placeholder="Enter your middle name"
                        value={data?.middle_name || ""}
                        onChange={handleInputChange}
                        name="middle_name"
                        inputClass={inputClass}
                    />

                    <FormInputField
                        label="Suffix (e.g., Jr., Sr., etc.)"
                        type="text"
                        placeholder="e.g., Jr., Sr., III (if applicable)"
                        value={data?.suffix || ""}
                        onChange={handleInputChange}
                        name="suffix"
                        inputClass={inputClass}
                    />
                </div>

                <div className="w-[443px] opacity-100 gap-[20px] flex flex-row">
                    <FormInputField
                        label="Maiden Name"
                        type="text"
                        placeholder="Enter your maiden name"
                        value={data?.maiden_name || ""}
                        onChange={handleInputChange}
                        name="maiden_name"
                        inputClass={inputClass}
                    />

                    <div>
                        <label className="font-medium text-sm leading-5 tracking-normal text-[#111928]">
                            Years associated with maiden name
                        </label>
                        <div className="flex items-center gap-[10px]">
                            <div className="relative flex items-center">
                                <CalendarDays
                                    size={14}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
                                />
                                <input
                                    type="date"
                                    placeholder="From"
                                    value={toDateInput(data?.years_with_maiden?.[0]?.start)}
                                    className="w-[208px] h-[40px] rounded-[12px] border border-gray-200 bg-gray-50 pt-[10px] pr-3 pl-10 shadow-[0px_1px_0.5px_0.05px_#1D293D05] mt-2 placeholder:font-normal placeholder:text-sm placeholder:leading-5 placeholder:tracking-normal placeholder:text-[#6A7282]"
                                    name="years_with_maiden_start"
                                    onChange={handleDateRangeArrayChange("years_with_maiden", "start")}
                                />
                            </div>
                            <span>-</span>
                            <input
                                type="date"
                                value={toDateInput(data?.years_with_maiden?.[0]?.end)}
                                className="w-[208px] h-[40px] opacity-100 gap-2 rounded-[12px] border border-gray-200 bg-gray-50 pt-[10px] pr-3 pb-2.5 pl-3 shadow-[0px_1px_0.5px_0.05px_#1D293D05] mt-2 placeholder:font-normal placeholder:text-sm placeholder:leading-5 placeholder:tracking-normal placeholder:text-[#6A7282]"
                                name="years_with_maiden_end"
                                onChange={handleDateRangeArrayChange("years_with_maiden", "end")}
                            />
                        </div>
                    </div>
                </div>

                <div className="w-[443px] opacity-100 gap-[20px] flex flex-row">
                    <FormInputField
                        label="Other Name"
                        type="text"
                        placeholder="Enter your other name"
                        value={data?.other_name || ""}
                        onChange={handleInputChange}
                        name="other_name"
                        inputClass={inputClass}
                    />

                    <div>
                        <label className="font-medium text-sm leading-5 tracking-normal text-[#111928]">
                            Years associated with other name
                        </label>
                        <div className="flex items-center gap-[10px]">
                            <div className="relative flex items-center">
                                <CalendarDays
                                    size={14}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
                                />
                                <input
                                    type="date"
                                    placeholder="From"
                                    value={toDateInput(data?.years_with_other_name?.[0]?.start)}
                                    className="w-[208px] h-[40px] rounded-[12px] border border-gray-200 bg-gray-50 pt-[10px] pr-3 pl-10 shadow-[0px_1px_0.5px_0.05px_#1D293D05] mt-2 placeholder:font-normal placeholder:text-sm placeholder:leading-5 placeholder:tracking-normal placeholder:text-[#6A7282]"
                                    name="years_with_other_name_start"
                                    onChange={handleDateRangeArrayChange("years_with_other_name", "start")}
                                />
                            </div>
                            <span>-</span>
                            <input
                                type="date"
                                value={toDateInput(data?.years_with_other_name?.[0]?.end)}
                                className="w-[208px] h-[40px] opacity-100 gap-2 rounded-[12px] border border-gray-200 bg-gray-50 pt-[10px] pr-3 pb-2.5 pl-3 shadow-[0px_1px_0.5px_0.05px_#1D293D05] mt-2 placeholder:font-normal placeholder:text-sm placeholder:leading-5 placeholder:tracking-normal placeholder:text-[#6A7282]"
                                name="years_with_other_name_end"
                                onChange={handleDateRangeArrayChange("years_with_other_name", "end")}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <hr className="border-[#E9EAEB] w-[904px] mt-5" />
            </div>

            {/* Home Mailing Address */}
            <div className="w-[904px] rotate-0 opacity-100 gap-4 flex items-center mt-5">
                <p className="font-semibold text-[20px] leading-[150%] tracking-[0%] text-[#111928]">
                    Home Mailing Address
                </p>
            </div>

            <div className="w-[904px] h-[70px] items-center gap-[10px] mt-5">
                <div className="flex flex-col mb-4">
                    <label className="font-medium text-sm leading-5 tracking-normal text-[#111928]">
                        Street/Address Line
                    </label>
                    <input
                        type="text"
                        placeholder="Enter your street address"
                        className="w-full h-[40px] opacity-100 gap-2 rounded-[12px] border border-gray-200 bg-gray-50 pt-[10px] pr-3 pb-2.5 pl-3 shadow-[0px_1px_0.5px_0.05px_#1D293D05] mt-2 placeholder:font-normal placeholder:text-sm placeholder:leading-5 placeholder:tracking-normal placeholder:text-[#6A7282]"
                        name="address"
                        onChange={handleInputChange}
                        value={data?.address || ""}
                    />
                </div>
            </div>

            <div className="w-[443px] opacity-100 gap-[20px] flex flex-row mt-6">
                <FormInputField
                    label="City"
                    type="text"
                    placeholder="Enter your city"
                    value={data?.city || ""}
                    onChange={handleInputChange}
                    name="city"
                    inputClass={inputClass}
                />

                <FormInputField
                    label="State/Country code"
                    type="text"
                    placeholder="Enter your state or country code"
                    value={data?.state || ""}
                    onChange={handleInputChange}
                    name="state"
                    inputClass={inputClass}
                />
            </div>

            <div className="w-[443px] opacity-100 gap-[20px] flex flex-row mt-6">
                <FormInputField
                    label="Postal Code"
                    type="text"
                    placeholder="Enter your postal/zip code"
                    value={data?.postal_code || ""}
                    onChange={handleInputChange}
                    name="postal_code"
                    inputClass={inputClass}
                />
            </div>

            <div className="w-[443px] opacity-100 gap-[20px] flex flex-row mt-6">
                <FormInputField
                    label="Phone Number"
                    type="text"
                    placeholder="123-456-7890"
                    value={data?.phone_number || ""}
                    onChange={handleInputChange}
                    name="phone_number"
                    inputClass={inputClass}
                />

                <FormInputField
                    label="Email Address"
                    type="text"
                    placeholder="Enter your email address"
                    value={data?.email || ""}
                    onChange={handleInputChange}
                    name="email"
                    inputClass={inputClass}
                />
            </div>

            <div className="w-[443px] opacity-100 gap-[20px] flex flex-row mt-6">
                <FormInputField
                    label="Fax Number"
                    type="text"
                    placeholder="Enter your fax number (if any)"
                    value={data?.fax_number || ""}
                    onChange={handleInputChange}
                    name="fax_number"
                    inputClass={inputClass}
                />
            </div>

            <div className="w-[443px] opacity-100 gap-[20px] flex flex-row mt-6 flex-rs">
                <div className="flex flex-col mb-4 w-[443px]">
                    <label className="font-medium text-sm leading-5 tracking-normal text-[#111928]">
                        Cityzenship Status
                    </label>
                    <Creatable
                        isClearable
                        options={options}
                        value={creatableValue("cityzen_ship_status")}
                        onChange={handleSelectChange}
                        onCreateOption={(inputValue) =>
                            handleSelectChange(
                                { label: inputValue, value: inputValue },
                                { name: "cityzen_ship_status" }
                            )
                        }
                        placeholder="Select or type your citizenship status"
                        classNamePrefix="rs"
                        name="cityzen_ship_status"
                        styles={{ control: (base) => ({ ...base, boxShadow: "none" }) }}
                    />
                </div>

                <FormInputField
                    label="If not American citizen: Visa Number"
                    type="text"
                    placeholder="Enter your visa number"
                    value={data?.visa_number || ""}
                    onChange={handleInputChange}
                    name="visa_number"
                    inputClass={inputClass}
                />
            </div>

            <div className="w-[443px] opacity-100 gap-[20px] flex flex-row mt-6 flex-rs">
                <div className="flex flex-col mb-4 w-[443px]">
                    <label className="font-medium text-sm leading-5 tracking-normal text-[#111928]">
                        Visa Status
                    </label>
                    <Creatable
                        isClearable
                        options={options}
                        value={creatableValue("visa_status")}
                        onChange={handleSelectChange}
                        onCreateOption={(inputValue) =>
                            handleSelectChange(
                                { label: inputValue, value: inputValue },
                                { name: "visa_status" }
                            )
                        }
                        placeholder="Select or type visa status"
                        classNamePrefix="rs"
                        styles={{ control: (base) => ({ ...base, boxShadow: "none" }) }}
                        name="visa_status"
                    />
                </div>
            </div>

            <div>
                <hr className="border-[#E9EAEB] w-[904px] mt-5" />
            </div>

            {/* ✅ RADIO FIXED */}
            <div className="w-[904px] opacity-100 gap-[20px] flex flex-row mt-6">
                <RadioGroup
                    label="Are you eligible to work in the United States?"
                    name="eligible_to_work_us"
                    value={normalizeRadioValue(data?.eligible_to_work_us)}
                    onChange={handleRadioChange("eligible_to_work_us")}
                />

                <RadioGroup
                    label="US Military Service/Public Health"
                    name="us_military_health"
                    value={normalizeRadioValue(data?.us_military_health)}
                    onChange={handleRadioChange("us_military_health")}
                />
            </div>

            {/* ✅ DATE FIXED (nested object) */}
            <div className="w-[904px] opacity-100 gap-[20px] flex flex-row mt-8">
                <div className="flex items-center gap-[10px]">
                    <div className="flex flex-col mb-4">
                        <label className="font-medium text-sm leading-5 tracking-normal text-[#111928]">
                            Dates of Service from
                        </label>
                        <div className="relative flex items-center">
                            <CalendarDays
                                size={14}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
                            />
                            <input
                                type="date"
                                name="date_of_service_start"
                                className="w-[208px] h-[40px] rounded-[12px] border border-gray-200 bg-gray-50 pl-10 pr-3 shadow-[0px_1px_0.5px_0.05px_#1D293D05] mt-2"
                                value={toDateInput(data?.date_of_service?.start)}
                                onChange={handleDateOfServiceChange("start")}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-[10px]">
                    <div className="flex flex-col mb-4">
                        <label className="font-medium text-sm leading-5 tracking-normal text-[#111928]">
                            To
                        </label>
                        <div className="relative flex items-center">
                            <CalendarDays
                                size={14}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6A7282]"
                            />
                            <input
                                type="date"
                                value={toDateInput(data?.date_of_service?.end)}
                                className="w-[208px] h-[40px] rounded-[12px] border border-gray-200 bg-gray-50 pl-10 pr-3 shadow-[0px_1px_0.5px_0.05px_#1D293D05] mt-2"
                                name="date_of_service_end"
                                onChange={handleDateOfServiceChange("end")}
                            />
                        </div>
                    </div>
                </div>

                <FormInputField
                    label="Last Location"
                    type="text"
                    placeholder="Enter your last location"
                    value={data?.last_location || ""}
                    onChange={handleInputChange}
                    name="last_location"
                    inputClass={inputClass}
                />
            </div>

            <div className="w-[904px] opacity-100 gap-[20px] flex flex-row mt-6">
                <div className="flex flex-col mb-4 w-[443px] flex-rs">
                    <label className="font-medium text-sm leading-5 tracking-normal text-[#111928]">
                        Branch of Services
                    </label>
                    <Creatable
                        isClearable
                        options={options}
                        value={creatableValue("branch_of_service")}
                        onChange={handleSelectChange}
                        onCreateOption={(inputValue) =>
                            handleSelectChange(
                                { label: inputValue, value: inputValue },
                                { name: "branch_of_service" }
                            )
                        }
                        placeholder="Select or type branch"
                        classNamePrefix="rs"
                        styles={{ control: (base) => ({ ...base, boxShadow: "none" }) }}
                        name="branch_of_service"
                    />
                </div>

                {/* ✅ RADIO FIXED */}
                <RadioGroup
                    label="Are you currently on active or reserve military duty?"
                    name="on_military_duty"
                    value={normalizeRadioValue(data?.on_military_duty)}
                    onChange={handleRadioChange("on_military_duty")}
                />
            </div>
        </div>
    );
};

export default PersonalInformation