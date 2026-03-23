import React, { useState, useRef, useEffect } from "react";
const DisclosureQuestion = ({
    number,
    text,
    name,
    value,
    onChange,
    options = [
        { label: "Yes", value: true },
        { label: "No", value: false },
    ],
}) => {
    // Convert DB boolean -> radio number
    const normalizedValue =
        value === true ? true : value === false ? false : value; // if already 1/0, keep it

    return (
        <div className="flex gap-4 items-start mt-6">
            <p className="w-6 font-normal text-[18px] leading-[150%] tracking-[0%] text-[#000000]">
                {number}.
            </p>

            <p className="flex-1 font-normal text-[18px] leading-[150%] tracking-[0%] text-[#000000]">
                {text}
            </p>

            <div className="flex gap-6">
                {options.map((option) => (
                    <label
                        key={option.value}
                        className="flex items-center gap-2 font-medium text-sm leading-4 tracking-normal text-[#111928]"
                    >
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={normalizedValue === option.value}
                            onChange={() => onChange({ [name]: option.value })}
                            className="w-4 h-4 rounded-full border border-[#D1D5DB] bg-[#F3F4F6]"
                        />
                        {option.label}
                    </label>
                ))}
            </div>
        </div>
    );
};

export default DisclosureQuestion;
