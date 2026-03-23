import React from "react";

const RadioGroup = ({
  label,
  name,
  value,
  onChange,
  required = false,
  helperText,
  options = [
    { label: "Yes", value: 1 },
    { label: "No", value: 0 }
  ],
}) => {
  return (
    <div className="flex flex-col gap-2 w-[443px]">
      <label className="font-medium text-sm leading-5 tracking-normal text-[#111928]">
        {label}
        {required && <span className="text-red-500">*</span>}
        {helperText && (
          <span
            title={helperText}
            className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full border border-gray-300 text-xs text-gray-500 cursor-pointer"
          >
            ?
          </span>
        )}
      </label>

      <div className="flex items-center gap-6">
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 cursor-pointer font-medium text-sm text-[#111928]"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={Number(value) === Number(option.value)}  // ✅ safe compare
              onChange={() => onChange(option.value)}          // ✅ fixed
              className="h-[16px] w-[16px] cursor-pointer"
            />
            {option.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default RadioGroup;
