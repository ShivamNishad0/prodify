import { useNavigate } from "react-router-dom";
import { FaStickyNote, FaBell, FaBolt, FaCommentDots } from "react-icons/fa";
import { TbMessageChatbotFilled } from "react-icons/tb";
import { useState } from "react";
import colorPalette from "../colors";

function Rightsidebar({ isOpen }) {
    const navigate = useNavigate();
    const [hoveredItem, setHoveredItem] = useState(null);

    const rightMenuItems = [
        { name: "Sticky Notes", icon: <FaStickyNote />, path: "/notes" },
        { name: "Feedback", icon: <FaCommentDots />, path: "/feedback" },
        { name: "Chatbot", icon: <TbMessageChatbotFilled />, path: "/chatbot" },
    ];

    const rightSideBarStyle = {
        height: "85vh",
        width: isOpen ? "150px" : "40px",
        marginTop: "10px",
        background: colorPalette.secondaryBackground.hex,
        display: "flex",
        flexDirection: "column",
        borderRadius: "15px",
        padding: "20px 10px",
        transition: "0.3s ease",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    };

    return (
        <div style={rightSideBarStyle}>
            {rightMenuItems.map((item) => (
                <div
                    key={item.name}
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => navigate(item.path)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        marginBottom: "10px",
                        marginTop: "20px",
                        padding: "12px 10px",
                        cursor: "pointer",
                        borderRadius: "8px",
                        fontSize: "16px",
                        transition: "0.2s",
                        color: colorPalette.primaryText.hex,
                        background: hoveredItem === item.name ? colorPalette.primaryAccent.hex : "transparent",
                        borderRight: hoveredItem === item.name ? `4px solid ${colorPalette.darkerAccent.hex}` : "none",
                        justifyContent: isOpen ? "flex-start" : "center",
                    }}
                >
                    {item.icon}
                    {isOpen && <span>{item.name}</span>}
                </div>
            ))}
        </div>
    );
}

export default Rightsidebar;
