'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { FaBell, FaEnvelope, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/providers/AuthProvider';

const Navbar = () => {
    const router = useRouter();
    const { logout, user } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const dropdown = document.getElementById('profile-dropdown');
            if (dropdown && !dropdown.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    return (
        <nav className="sticky top-0 z-[1000] h-[70px] flex items-center justify-between px-10 bg-white shadow-sm rounded-2xl m-[-5px]">
            <Link href="/prodify/crm" className="text-2xl font-bold no-underline cursor-pointer mr-5">
                <h2 className="m-0 text-brand-primary">prodify</h2>
            </Link>

            <ul className="flex items-center gap-6 list-none">
                <li>
                    <Link href="/prodify/crm/messages" className="text-[#222121] text-lg flex items-center gap-2 transition-all cursor-pointer">
                        <FaEnvelope size={20} />
                    </Link>
                </li>
                <li>
                    <Link href="/prodify/crm/notifications" className="text-[#222121] text-lg flex items-center gap-2 transition-all cursor-pointer">
                        <FaBell size={20} />
                    </Link>
                </li>

                <li className="relative" id="profile-dropdown">
                    <div
                        className="text-[32px] text-black rounded-full cursor-pointer relative"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        onMouseEnter={() => setIsDropdownOpen(true)}
                        onMouseLeave={() => setIsDropdownOpen(false)}
                    >
                        {user?.avatar ? (
                            <img
                                src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:5001${user.avatar}`}
                                alt="Profile"
                                className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-brand-primary"
                            />
                        ) : (
                            <FaUserCircle
                                size={40}
                                className="cursor-pointer text-brand-primary"
                            />
                        )}

                        {isDropdownOpen && (
                            <div className="absolute top-full right-0 z-[1001] pt-2.5">
                                <div className="bg-white border border-gray-200 rounded-lg shadow-lg min-w-[180px] overflow-hidden">
                                    <div className="p-4 border-b border-gray-100 text-center bg-gray-50/30">
                                        <div className="font-bold text-gray-800 text-sm italic">{user?.name || "User"}</div>
                                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">{user?.email || "Guest"}</div>
                                    </div>
                                    <div
                                        className="flex items-center gap-3 p-3 text-gray-700 text-sm font-bold cursor-pointer hover:bg-brand-primary/5 hover:text-brand-primary transition-all pb-3"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push('/prodify/crm/profile');
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        <FaUserCircle size={14} className="opacity-70" />
                                        Profile Details
                                    </div>
                                    <div
                                        className="flex items-center gap-3 p-3 text-red-500 text-sm font-bold cursor-pointer hover:bg-red-50 transition-all pt-3 border-t border-gray-50"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            logout();
                                            router.push('/login');
                                            setIsDropdownOpen(false);
                                        }}
                                    >
                                        <FaSignOutAlt size={14} />
                                        Logout
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
