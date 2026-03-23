import React from 'react';

const FormInputField = ({ label, type, placeholder, value, onChange, name, inputClass}) => (
  <div className="flex flex-col mb-4">
    <label className="font-medium text-sm leading-5 tracking-normal text-[#111928]" for={name}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={inputClass}
        name={name}
      />   
  </div>
);

export default FormInputField;
