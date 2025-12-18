import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Rightsidebar from "./Rightsidebar";

function Layout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Navbar />

      {/* LEFT SIDEBAR */}
      <div
        style={{
          position: "fixed",
          top: "70px",
          left: 0,
          zIndex: 1000,
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <Sidebar isOpen={isOpen} />
      </div>


      {/* RIGHT SIDEBAR */}
      <div
        style={{
          position: "fixed",
          top: "70px",
          right: 0,
          zIndex: 1000,
        }}
      >
        <Rightsidebar isOpen={isOpen} />
      </div>

      {/* PAGE CONTENT */}
      <div style={{ 
        marginLeft: "60px", 
        marginRight: isOpen ? "170px" : "60px",
        transition: "0.3s ease"
      }}>
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
