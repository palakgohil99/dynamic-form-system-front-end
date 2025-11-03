// src/components/SocialLoginButton.jsx
import React from 'react';

const SocialLoginButton = ({ children, onClick }) => (
  <button
    onClick={onClick}
    className="w-[462px] h-[52px] opacity-100 gap-[6px] border-radius-12 border border-t border-gray-200 bg-[#F9FAFB] py-[14px] px-[8px] shadow-[0_1px_0.5px_0.05px_#1D293D05] mb-3 font-medium text-base leading-6 tracking-normal text-[#4A5565]"    
  >
    {children}
  </button>
);

export default SocialLoginButton;
