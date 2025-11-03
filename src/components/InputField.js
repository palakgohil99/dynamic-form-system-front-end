// src/components/InputField.jsx
import React from 'react';

const InputField = ({ label, type, placeholder, value, onChange, name, icon: Icon, className = 'input-custom'}) => (
  <div className="flex flex-col mb-4">
    <label className="h-[26px] opacity-100 text-sm font-medium leading-5 text-[#101828]" for={name}>{label}</label>
    <div className="relative flex items-center">
      {Icon && (
        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
          <Icon size={14} color="#4A5565" />
        </div>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`${className} ${Icon ? "!pl-10" : ""}`}
        name={name}
      />
    </div>
  </div>
);

export default InputField;
