'use client';

import { useRouter } from 'next/navigation';
import { FaStickyNote, FaCommentDots } from "react-icons/fa";
import { TbMessageChatbotFilled } from "react-icons/tb";
import { useState } from "react";
import colorPalette from "../constants/colors";

interface RightSidebarProps {
    isOpen: boolean;
}

const RightSidebar: React.FC<RightSidebarProps> = ({ isOpen }) => {
    const router = useRouter();
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);

    const rightMenuItems = [
        { name: "Sticky Notes", icon: <FaStickyNote />, path: "/notes" },
        { name: "Feedback", icon: <FaCommentDots />, path: "/support" },
        { name: "Chatbot", icon: <TbMessageChatbotFilled />, path: "/chatbot" },
    ];


    return (
        <div
            className="flex flex-col rounded-2xl py-5 px-2.5 transition-all duration-300 ease-in-out shadow-md mt-2.5"
            style={{
                height: "85vh",
                width: isOpen ? "150px" : "40px",
                background: colorPalette.secondaryBackground.hex
            }}
        >
            {rightMenuItems.map((item) => (
                <div
                    key={item.name}
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => router.push(item.path)}
                    className={`flex items-center gap-3.5 mb-2.5 mt-5 p-3 cursor-pointer rounded-lg text-base transition-all duration-200
                        ${hoveredItem === item.name ? 'bg-[#7bcbc4] border-r-4 border-r-[#4B8C86]' : 'bg-transparent border-r-0'}
                        ${isOpen ? 'justify-start' : 'justify-center'}`}
                    style={{ color: colorPalette.primaryText.hex }}
                >
                    {item.icon}
                    {isOpen && <span className="whitespace-nowrap">{item.name}</span>}
                </div>
            ))}
        </div>
    );
};

export default RightSidebar;