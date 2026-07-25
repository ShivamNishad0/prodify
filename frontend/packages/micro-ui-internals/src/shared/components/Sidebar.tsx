'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaHome, FaBox, FaListAlt, FaShoppingCart, FaUsers, FaChartLine, FaCog, FaQuestionCircle, FaInfoCircle, FaUserShield, FaTasks } from "react-icons/fa";
import { SiMarketo } from "react-icons/si";
import { useAuth } from '@/providers/AuthProvider';

interface SidebarProps {
    isOpen: boolean;
    customMenuItems?: Array<{ name: string; icon: React.ReactNode; path: string; hasDropdown?: boolean; subItems?: Array<{name: string; path: string}> }>;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, customMenuItems }) => {
    const router = useRouter();
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [expandedItem, setExpandedItem] = useState<string | null>(null);
    const { user } = useAuth();

    const baseMenuItems = customMenuItems || [
        { name: "Dashboard", icon: <FaHome />, path: "/prodify/crm" },
        { name: "Inventory", icon: <FaBox />, path: "/prodify/crm/inventory" },
        { name: "Orders", icon: <FaShoppingCart />, path: "/prodify/crm/orders" },
        { name: "Tenders", icon: <SiMarketo />, path: "/prodify/crm/tenders" },
        { name: "Products", icon: <FaListAlt />, path: "/prodify/crm/products" },
        { name: "Tasks", icon: <FaTasks />, path: "/prodify/crm/tasks" },
        { name: "Customers", icon: <FaUsers />, path: "/prodify/crm/customers" },
        { name: "Reports", icon: <FaChartLine />, path: "/prodify/crm/reports" },
        { name: "Analytics", icon: <FaChartLine />, path: "/prodify/crm/analytics" },
        { name: "About", icon: <FaInfoCircle />, path: "/prodify/crm/about" },
        { name: "Support", icon: <FaQuestionCircle />, path: "/support" },
        { name: "Settings", icon: <FaCog />, path: "/prodify/crm/settings" },
    ];

    const menuItems = (user?.role === 'admin' && !customMenuItems)
        ? [...baseMenuItems, { name: "Admin Panel", icon: <FaUserShield />, path: "/admin" }]
        : baseMenuItems;

    return (
        <div
            className="flex flex-col bg-[#222121] rounded-2xl py-5 px-2.5 transition-all duration-300 ease-in-out mt-2.5"
            style={{
                height: "85vh",
                width: isOpen ? "150px" : "40px"
            }}
        >
            {/* USER INFO */}
            <div
                onClick={() => router.push("/profile")}
                className="cursor-pointer mb-7.5 flex items-center gap-3 text-white p-1.25 rounded-lg transition-colors hover:bg-white/5"
            >
                {user?.avatar ? (
                    <img
                        src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:5001${user.avatar}`}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border-2 border-brand-primary"
                    />
                ) : (
                    <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center text-sm font-bold">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                )}

                {isOpen && (
                    <div className="overflow-hidden">
                        <div className="font-bold text-sm whitespace-nowrap overflow-hidden text-ellipsis">
                            {user?.name || "User"}
                        </div>
                        <div className="text-[11px] text-zinc-400 whitespace-nowrap overflow-hidden text-ellipsis">
                            {user?.email || "Guest"}
                        </div>
                    </div>
                )}
            </div>

            {/* MENU ITEMS */}
            {menuItems.map((item) => (
                <div key={item.name} className="flex flex-col">
                    <div
                        onMouseEnter={() => setHoveredItem(item.name)}
                        onMouseLeave={() => setHoveredItem(null)}
                        onClick={() => {
                            if (item.hasDropdown || item.subItems) {
                                setExpandedItem(expandedItem === item.name ? null : item.name);
                            } else {
                                router.push(item.path);
                            }
                        }}
                        className={`flex items-center gap-3.5 p-3 cursor-pointer rounded-lg text-base transition-all duration-200 text-white
                            ${hoveredItem === item.name ? 'bg-brand-primary border-l-4 border-l-brand-primary-dark/50' : 'bg-transparent border-l-0'}`}
                    >
                        {item.icon}
                        {isOpen && (
                            <span className="whitespace-nowrap flex-grow">
                                {item.name}
                            </span>
                        )}
                        {isOpen && (item.hasDropdown || item.subItems) && (
                            <span className="ml-auto text-xs">
                                {expandedItem === item.name ? '▼' : '▶'}
                            </span>
                        )}
                    </div>
                    {/* Sub Items */}
                    {isOpen && expandedItem === item.name && item.subItems && (
                        <div className="flex flex-col ml-8 mt-1 space-y-1">
                            {item.subItems.map((sub) => (
                                <div
                                    key={sub.name}
                                    onClick={() => router.push(sub.path)}
                                    className="text-gray-300 hover:text-white text-sm cursor-pointer py-1.5 px-2 hover:bg-white/5 rounded transition-colors"
                                >
                                    {sub.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Sidebar;
