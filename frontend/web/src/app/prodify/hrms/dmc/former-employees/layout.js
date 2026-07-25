import React from "react";
import { PIMProvider } from "@/context/PIMProvider";
import ComponentNavbar from "@/components/ComponentNavbar";

export default function Layout({ children }) {
  const navbarData = {
    route: "/prodify/hrms/dmc/former-employees",
    menu: [
      { href: "", label: "Employee List" },
      { href: "/report", label: "Report" },
      { href: "/salary", label: "Salary" },
    ],
  };
  return (
    <div className="flex flex-col h-full w-full">
      <ComponentNavbar NavbarData={navbarData} className="w-full" />
      <div className="w-full h-fit overflow-auto scrollbar-hide p-4">
        <PIMProvider>{children}</PIMProvider>
      </div>
    </div>
  );
}
