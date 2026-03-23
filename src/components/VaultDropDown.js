import { useState, useRef, useEffect } from "react";
import { Ellipsis } from 'lucide-react';

export default function VaultDropDown({ onReplace, onDownload, onDelete, buttonClass, buttonLabel = null }) {
    const [open, setOpen] = useState(false);
    const menuRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left" ref={menuRef}>
            <button
                onClick={() => setOpen(!open)}
                className={buttonClass}
            >
                {/* <Ellipsis /> */}
                {buttonLabel ? (
                    <span>{buttonLabel}</span>
                ) : (
                    <Ellipsis />
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-white shadow-lg border border-[#D9D9D9] rounded-md z-50 shadow-[0px_1px_0.5px_0.05px_#1D293D05]">
                    <ul className="text-sm text-gray-700">
                        {!buttonLabel && (
                            <li
                                onClick={() => { setOpen(false); onReplace(); }}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            >
                                Replace
                            </li>
                        )}
                        <li
                            onClick={() => { setOpen(false); onDownload(); }}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                            Download
                        </li>
                        <li
                            onClick={() => { setOpen(false); onDelete(); }}
                            className="px-4 py-2 hover:bg-gray-100 text-red-500 cursor-pointer"
                        >
                            Delete
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}
