

import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { FaBell, FaEnvelope, FaUserCircle, FaCog, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navbarStyle = {
        position: "sticky",
        top: 0,
        zIndex: 1000,
        height: "70px",
        width: "flex",
        margin: "-5px",
        borderRadius: "15px",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 40px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
    };

    const logoStyle = {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#333",
        textDecoration: "none",
        cursor: "pointer",
        marginRight: "20px"
    };

    const navLinksStyle = {
        display: "flex",
        gap: "25px",
        listStyle: "none",
        alignItems: "center"
    };

    const linkStyle = {
        textDecoration: "none",
        color: "#222121ff",
        fontSize: "18px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transition: "0.3s",
        cursor: "pointer"
    };


    const profileIconStyle = {
        fontSize: "32px",
        color: "#000000ff",
        borderRadius: "50%",
        cursor: "pointer",
        position: "relative"
    };

    const dropdownStyle = {
        position: "absolute",
        top: "100%",
        right: 0,
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        minWidth: "180px",
        zIndex: 1001,
        marginTop: "10px"
    };

    const dropdownItemStyle = {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        textDecoration: "none",
        color: "#333",
        fontSize: "16px",
        transition: "0.2s",
        cursor: "pointer"
    };




    return (
        <nav style={navbarStyle}>
            <Link to="/" style={{ ...logoStyle, textDecoration: "none" }}>
                <h2 style={{ margin: 0, color: "#3cb2a8 "}}>prodify</h2>
            </Link>


            <ul style={navLinksStyle}>

                {/* Messages */}
                <li>
                    <Link style={linkStyle} to="/messages">
                        <FaEnvelope size={20} />
                    </Link>
                </li>

                {/* Notifications */}
                <li>
                    <Link style={linkStyle} to="/notification">
                        <FaBell size={20} />
                    </Link>
                </li>
        


                {/* Profile (Circle Icon with Dropdown) */}
                <li style={{ position: "relative" }}>
                    <div
                        style={profileIconStyle}
                    >

                        <FaUserCircle 
                            size={40} 
                            onClick={() => navigate('/profile')}
                            onMouseEnter={() => setIsDropdownOpen(true)}
                        />
                        
                        {/* Dropdown Menu */}
                        {isDropdownOpen && (
                            <div 
                                style={dropdownStyle}
                                onMouseEnter={() => setIsDropdownOpen(true)}
                                onMouseLeave={() => setIsDropdownOpen(false)}
                            >

                                <div 
                                    style={dropdownItemStyle}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = "#f5f5f5"}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        navigate('/profile');
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    <FaUserCircle size={16} />
                                    Profile
                                </div>
                                <div 
                                    style={dropdownItemStyle}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = "#f5f5f5"}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        logout();
                                        navigate('/login');
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    <FaSignOutAlt size={16} />
                                    Logout
                                </div>
                            </div>
                        )}
                    </div>
                </li>
            </ul>
        </nav>
    );
}

export default Navbar;
