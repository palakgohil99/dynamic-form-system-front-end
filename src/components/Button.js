// src/components/Button.jsx
import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary' }) => {
  const base = "w-full py-2 px-4 rounded-md font-semibold focus:outline-none";
  const styles =
    variant === 'primary'
      ? `${base} bg-blue-600 text-white hover:bg-blue-700`
      : `${base} bg-gray-100 text-gray-800 hover:bg-gray-200`;

  return (
    <button type={type} onClick={onClick} className={styles}>
      {children}
    </button>
  );
};

export default Button;
