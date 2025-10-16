// src/components/InputField.jsx
import React from 'react';

const InputField = ({ label, type, placeholder, value, onChange, name}) => (
  <div className="flex flex-col mb-4">
    <label className="mb-1 font-medium" for={name}>{label}</label>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      name={name}
    />
  </div>
);

export default InputField;
