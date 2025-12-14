
import { useNavigate } from "react-router-dom";
import { FaHome, FaBox, FaListAlt, FaShoppingCart, FaUsers, FaChartLine, FaCog, FaQuestionCircle, FaInfoCircle } from "react-icons/fa";
import { useState } from "react";

function Sidebar({ isOpen }) {
    const navigate = useNavigate();
    const [hoveredItem, setHoveredItem] = useState(null);


    const menuItems = [
        { name: "Dashboard", icon: <FaHome />, path: "/" },
        { name: "Inventory", icon: <FaBox />, path: "/inventory" },
        { name: "Orders", icon: <FaShoppingCart />, path: "/orders" },
        { name: "Products", icon: <FaListAlt />, path: "/products" },
        { name: "Customers", icon: <FaUsers />, path: "/customers" },
        { name: "Reports", icon: <FaChartLine />, path: "/reports" },
        { name: "Analytics", icon: <FaChartLine />, path: "/analytics" },
        { name: "About", icon: <FaInfoCircle />, path: "/about" },
        { name: "Support", icon: <FaQuestionCircle />, path: "/support" },
        { name: "Settings", icon: <FaCog />, path: "/settings" },
    ];

    const sideBarStyle = {
        height: "85vh",
        width: isOpen ? "150px" : "40px",
        marginTop: "10px",
        background: "#222121ff",
        display: "flex",
        flexDirection: "column",
        borderRadius: "15px",
        padding: "20px 10px",
        transition: "0.3s ease",
    };

    return (
        <div style={sideBarStyle}>
            {/* USER INFO */}
            <div 
                onClick={() => navigate("/profile")} 
                style={{
                    cursor: "pointer",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    color: "#fff"
                }}
            >
                <FaUsers size={22} />
                {isOpen && (
                    <div>
                        <div><b>username</b></div>
                        <div style={{ fontSize: "14px", color: "gray" }}>email</div>
                    </div>
                )}
            </div>

            {/* MENU ITEMS */}
            {menuItems.map((item) => (
                <div
                    key={item.name}
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => navigate(item.path)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        padding: "12px 10px",
                        cursor: "pointer",
                        borderRadius: "8px",
                        fontSize: "16px",
                        transition: "0.2s",
                        color: "#fff",
                        background: hoveredItem === item.name ? "#3cb2a8" : "transparent",
                        borderLeft: hoveredItem === item.name ? "4px solid #00867aff" : "none",
                    }}
                >
                    {item.icon}
                    {isOpen && <span>{item.name}</span>}
                </div>
            ))}
        </div>
    );
}

export default Sidebar;
