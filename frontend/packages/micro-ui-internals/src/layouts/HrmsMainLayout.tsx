'use client';

import { useState } from "react";
import { usePathname } from 'next/navigation';
import Navbar from "@/shared/components/Navbar";
import Sidebar from "@/shared/components/Sidebar";
import { FaRegCalendarAlt, FaUserTie } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import { HiUserGroup } from "react-icons/hi";
import { SiAwsorganizations } from "react-icons/si";
import { PiMapPinAreaBold } from "react-icons/pi";
import { MdBusiness, MdAssignmentAdd, MdGroupRemove, MdAccountBalance } from "react-icons/md";
import { GiWallet } from "react-icons/gi";
import { TbReportSearch } from "react-icons/tb";

export default function HrmsMainLayout({ children }: { children: React.ReactNode }) {
    const [isLeftOpen, setIsLeftOpen] = useState(false);
    const pathName = usePathname();
    
    // Extract department from path: e.g. /prodify/hrms/head-office -> head-office
    const pathParts = pathName.split('/');
    const dept = pathParts[3] || "head-office";
    const basePath = `/prodify/hrms/${dept}`;

    const hrmsMenuItems = [
        { name: "Dashboard", icon: <LuLayoutDashboard />, path: basePath },
        { name: "PIM", icon: <HiUserGroup />, path: `${basePath}/pim` },
        { name: "Attendance", icon: <FaRegCalendarAlt />, path: `${basePath}/attendance` },
        { name: "Leave", icon: <FaRegCalendarAlt />, path: `${basePath}/leave` },
        ...(dept === "head-office" ? [{ name: "Company Profile", icon: <SiAwsorganizations />, path: `${basePath}/company-profile` }] : []),
        { name: "Area", icon: <PiMapPinAreaBold />, path: `${basePath}/area` },
        { name: "Department", icon: <MdBusiness />, path: `${basePath}/department` },
        { name: "Designation", icon: <FaUserTie />, path: `${basePath}/designation` },
        { name: "Assets", icon: <MdAssignmentAdd />, path: `${basePath}/assets` },
        { name: "Salary", icon: <GiWallet />, path: `${basePath}/salary` },
        { name: "Account", icon: <MdAccountBalance />, path: "#" },
        { 
            name: "Report", 
            icon: <TbReportSearch />, 
            path: "#",
            hasDropdown: true,
            subItems: [
                { name: "Individual", path: `${basePath}/report/individual` },
                { name: "Postwise", path: `${basePath}/report/postwise` },
                { name: "Monthly Deductions", path: `${basePath}/report/monthly-deductions` }
            ]
        },
        { name: "Summary Report", icon: <TbReportSearch />, path: `${basePath}/summary-report` },
        { name: "Former Employees", icon: <MdGroupRemove />, path: `${basePath}/former-employees` },
    ];

    return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden">
            <Navbar />

            {/* LEFT SIDEBAR */}
            <div
                className="fixed top-[70px] left-0 z-[1000]"
                onMouseEnter={() => setIsLeftOpen(true)}
                onMouseLeave={() => setIsLeftOpen(false)}
            >
                <Sidebar isOpen={isLeftOpen} customMenuItems={hrmsMenuItems} />
            </div>

            {/* PAGE CONTENT */}
            <main
                className="transition-all duration-300 ease-in-out p-4"
                style={{
                    marginLeft: isLeftOpen ? "170px" : "60px",
                }}
            >
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[85vh]">
                    {children}
                </div>
            </main>
        </div>
    );
}
