import ComponentNavbar from "@/components/ComponentNavbar";
import React from "react";

export default function layout({ children }) {
  const navbarData = {
    route: "/prodify/hrms/suda/attendance",
    menu: [
      { href: "", label: "Upload" },
      { href: "/view", label: "View" },
    ],
  };
  return (
    <div className="flex flex-col h-full w-full">
      <ComponentNavbar NavbarData={navbarData} className="w-full" />
      <div className="flex-1 w-full max-h-full">{children}</div>
    </div>
  );
}
