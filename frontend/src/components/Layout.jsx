import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Rightsidebar from "./Rightsidebar";

function Layout() {
  const [isLeftOpen, setIsLeftOpen] = useState(false);
  const [isRightOpen, setIsRightOpen] = useState(false);

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
        onMouseEnter={() => setIsLeftOpen(true)}
        onMouseLeave={() => setIsLeftOpen(false)}
      >
        <Sidebar isOpen={isLeftOpen} />
      </div>

      {/* RIGHT SIDEBAR */}
      <div
        style={{
          position: "fixed",
          top: "70px",
          right: 0,
          zIndex: 1000,
        }}
        onMouseEnter={() => setIsRightOpen(true)}
        onMouseLeave={() => setIsRightOpen(false)}
      >
        <Rightsidebar isOpen={isRightOpen} />
      </div>

      {/* PAGE CONTENT */}
      <div
        style={{
          marginLeft: isLeftOpen ? "170px" : "60px",
          marginRight: isRightOpen ? "170px" : "60px",
          transition: "0.3s ease",
        }}
      >
        <Outlet />
      </div>
    </>
  );
}

export default Layout;
