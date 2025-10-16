// src/components/SocialLoginButton.jsx
import React from 'react';

const SocialLoginButton = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="w-full py-2 px-4 rounded-md border border-gray-300 text-gray-800 hover:bg-gray-100 mb-2"
  >
    {children}
  </button>
);

export default SocialLoginButton;
