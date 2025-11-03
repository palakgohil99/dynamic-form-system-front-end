import React from "react";
import { Bell, LogOut } from 'lucide-react';

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full h-auto md:h-[96px] border-b border-[#E5E7EB] bg-white flex flex-col md:flex-row items-center justify-between px-4 md:px-20 py-4 md:py-6 gap-4 md:gap-0">
      {/* Left Section */}
      <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full md:w-auto">
        {/* Logo */}
        <div className="w-[112px] h-[32px]">
          <img src="/assets/logo_cacs.png" alt="Logo" className="w-full h-auto" />
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-auto flex justify-center md:justify-start">
          <input
            type="search"
            placeholder="Search"
            className="w-full md:w-[448px] h-10 md:h-12 py-2 px-[10px] rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] text-sm placeholder:text-[#4A5565] focus:outline-none"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-end gap-3 md:gap-4 w-full md:w-auto">
        {/* Bell Icon */}
        <div className="flex items-center justify-center w-8 h-8">
          <Bell size={18} color="#101828" />
        </div>

        {/* Profile Circle */}
        <div className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center">
          <span className="font-semibold text-sm leading-[14px] text-[#4A5565]">PH</span>
        </div>

        {/* Logout Button */}
        <button className="hidden sm:flex w-auto md:w-[101px] h-9 md:h-10 px-3 py-2 gap-2 rounded-[12px] border border-[#E5E7EB] bg-[#F9FAFB] shadow-[0px_1px_0.5px_0.05px_#1D293D05] items-center justify-center font-medium text-sm leading-5 text-[#4A5565]">
          <LogOut size={14} color="#4A5565" /> Logout
        </button>
      </div>
    </header>

  );
};

export default Header;
