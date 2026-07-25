'use client';

import { useState } from "react";
import Navbar from "@/shared/components/Navbar";
import Sidebar from "@/shared/components/Sidebar";
import RightSidebar from "@/shared/components/RightSidebar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const [isLeftOpen, setIsLeftOpen] = useState(false);
    const [isRightOpen, setIsRightOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 overflow-x-hidden">
            <Navbar />

            {/* LEFT SIDEBAR */}
            <div
                className="fixed top-[70px] left-0 z-[1000]"
                onMouseEnter={() => setIsLeftOpen(true)}
                onMouseLeave={() => setIsLeftOpen(false)}
            >
                <Sidebar isOpen={isLeftOpen} />
            </div>

            {/* RIGHT SIDEBAR */}
            <div
                className="fixed top-[70px] right-0 z-[1000]"
                onMouseEnter={() => setIsRightOpen(true)}
                onMouseLeave={() => setIsRightOpen(false)}
            >
                <RightSidebar isOpen={isRightOpen} />
            </div>

            {/* PAGE CONTENT */}
            <main
                className="transition-all duration-300 ease-in-out p-4"
                style={{
                    marginLeft: isLeftOpen ? "170px" : "60px",
                    marginRight: isRightOpen ? "170px" : "60px",
                }}
            >
                {children}
            </main>
        </div>
    );
}
