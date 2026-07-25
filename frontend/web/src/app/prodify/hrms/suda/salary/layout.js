import React from "react";
import ComponentNavbar from "@/components/ComponentNavbar";

export default function Layout({ children }) {
  const navbarData = {
    route: "/prodify/hrms/suda/salary",
    menu: [
      { href: "", label: "Salaried Staff" },
      { href: "/achieved-targets", label: "Achieved target" },
      { href: "/target-employees", label: "Target Employees" },
      { href: "/fixed-salary", label: "Fixed Salary" },
      { href: "/fixed-salaried-employees", label: "Fixed Salaried Employees" },
      { href: "/combined-salary", label: "Combined Salary" },
      { href: "/deductions", label: "Deduction Report" },
    ],
  };
  return (
    <div className="flex flex-col h-full w-full">
      <ComponentNavbar NavbarData={navbarData} className="w-full" />
      <div className="w-full">{children}</div>
    </div>
  );
}
