// src/components/Button.jsx
import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary' }) => {
  const base = "py-2 px-4 font-semibold focus:outline-none mb-3";
  const styles =
    variant === 'primary'
      ? `${base} text-white font-medium text-base w-[462px] h-[52px] opacity-100 gap-[6px] py-[14px] px-[8px]`
      : `${base} bg-gray-100 text-gray-800 hover:bg-gray-200`;

  return (
    <button type={type} onClick={onClick} className={`btn-primary border-radius-12 ${styles}`}>
      {children}
    </button>
  );
};

export default Button;
