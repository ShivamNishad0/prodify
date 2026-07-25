import React from "react";
import ComponentNavbar from "@/components/ComponentNavbar";

export default function Layout({ children }) {
  const navbarData = {
    route: "/prodify/hrms/bijli/salary",
    menu: [
      { href: "", label: "Salaried Staff" },
      { href: "/achieved-targets", label: "Achieved target" },
      { href: "/target-employees", label: "Target Employees" },
      { href: "/deductions", label: "Deduction Report" },
    ],
  };
  return (
    <div className="flex flex-col h-full w-full">
      <ComponentNavbar NavbarData={navbarData} className="w-full" />
      <div className="flex-1 w-full max-h-full">{children}</div>
    </div>
  );
}
