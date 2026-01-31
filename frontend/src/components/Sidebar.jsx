
import { useNavigate } from "react-router-dom";
import { FaHome, FaBox, FaListAlt, FaShoppingCart, FaUsers, FaChartLine, FaCog, FaQuestionCircle, FaInfoCircle, FaUserShield } from "react-icons/fa";
import { SiMarketo } from "react-icons/si";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function Sidebar({ isOpen }) {
    const navigate = useNavigate();
    const [hoveredItem, setHoveredItem] = useState(null);
    const { user } = useAuth();

    const baseMenuItems = [
        { name: "Dashboard", icon: <FaHome />, path: "/" },
        { name: "Inventory", icon: <FaBox />, path: "/inventory" },
        { name: "Orders", icon: <FaShoppingCart />, path: "/orders" },
        { name: "Tenders", icon: <SiMarketo />, path: "/tenders" },
        { name: "Products", icon: <FaListAlt />, path: "/products" },
        { name: "Customers", icon: <FaUsers />, path: "/customers" },
        { name: "Reports", icon: <FaChartLine />, path: "/reports" },
        { name: "Analytics", icon: <FaChartLine />, path: "/analytics" },
        { name: "About", icon: <FaInfoCircle />, path: "/about" },
        { name: "Support", icon: <FaQuestionCircle />, path: "/support" },
        { name: "Settings", icon: <FaCog />, path: "/settings" },
    ];

    // Add admin panel for admin users only
    const menuItems = user?.role === 'admin'
        ? [...baseMenuItems, { name: "Admin Panel", icon: <FaUserShield />, path: "/admin" }]
        : baseMenuItems;

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
                    marginBottom: "30px",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    color: "#fff",
                    padding: "5px",
                    borderRadius: "10px",
                    transition: "background 0.2s"
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.05)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
            >
                {user?.avatar ? (
                    <img
                        src={user.avatar.startsWith('http') ? user.avatar : `http://localhost:5001${user.avatar}`}
                        alt="Profile"
                        style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover", border: "2px solid #3cb2a8" }}
                    />
                ) : (
                    <div style={{ width: "32px", height: "32px", background: "#3cb2a8", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", fontWeight: "bold" }}>
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                )}

                {isOpen && (
                    <div style={{ overflow: "hidden" }}>
                        <div style={{ fontWeight: "700", fontSize: "14px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {user?.name || "User"}
                        </div>
                        <div style={{ fontSize: "11px", color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {user?.email || "Guest"}
                        </div>
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
