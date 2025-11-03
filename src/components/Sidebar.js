import { React, useState } from "react";
import { LayoutDashboard, User, Bell, Settings, ChartPie, FileText, BadgeQuestionMark, LogOut } from 'lucide-react';
import { NavLink, useLocation } from "react-router-dom";

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const menu = [
        { name: "Dashboard", path: "/", icon: LayoutDashboard },
        { name: "Sync Data", path: "/sync", icon: ChartPie },
        { name: "Vault", path: "/vault", icon: FileText },
        { name: "Profile", path: "/profile", icon: User },
        { name: "Notifications", path: "/notifications", icon: Bell },
        { name: "Settings", path: "/settings", icon: Settings },
    ];

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className="md:hidden fixed top-24 left-4 z-50 bg-blue-600 text-white p-2 rounded-md"
                onClick={() => setIsOpen(!isOpen)}
            >
                ☰
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed md:sticky top-[96px] left-0 h-[calc(100vh-96px)] w-[240px] md:w-[288px] bg-white border-r border-[#D9D9D9] p-5 flex flex-col justify-between transition-transform duration-300 ease-in-out z-40
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
            >
                {/* Navigation Menu */}
                <nav className="flex-1 space-y-2">
                    {menu.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 p-2 rounded-md font-medium text-[15px] leading-6 transition-all duration-200 ${isActive
                                        ? "bg-blue-50 text-blue-600"
                                        : "text-[#4A5565] hover:bg-gray-100"
                                    }`
                                }
                            >
                                <Icon
                                    size={15}
                                    color="#4A5565"

                                />
                                <span>{item.name}</span>
                            </NavLink>
                        );
                    })}
                    <hr className="text-[#E5E7EB] mt-5"></hr>
                    <NavLink
                        to="/logout"
                        className={({ isActive }) =>
                            `flex items-center gap-2 p-2 rounded-md font-medium text-[15px] ${isActive
                                ? "bg-blue-50 text-blue-600"
                                : "text-[#4A5565] hover:bg-gray-100"
                            }`
                        }
                    >
                        <LogOut size={15} color="#4A5565" />
                        <span>Logout</span>
                    </NavLink>

                    <NavLink
                        to="/help"
                        className={({ isActive }) =>
                            `flex items-center gap-2 p-2 rounded-md font-medium text-[15px] ${isActive
                                ? "bg-blue-50 text-blue-600"
                                : "text-[#4A5565] hover:bg-gray-100"
                            }`
                        }
                    >

                        <BadgeQuestionMark size={18} color="#4A5565" />

                        <span>Help</span>
                    </NavLink>
                </nav>

                {/* Bottom Section */}
                {/* <div className="border-t border-[#E5E7EB] pt-4 space-y-2">

                </div> */}
            </aside>

            {/* Overlay for Mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 md:hidden z-40"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </>
    );
}