import React from "react";
import { PIMProvider } from "@/context/PIMProvider";
import ComponentNavbar from "@/components/ComponentNavbar";
import { dropdown } from "@nextui-org/theme";

export default function layout({ children }) {
  const leaveNavar = {
    route: "/prodify/hrms/bijli/leave",
    menu: [
      {
        label: "Apply",
        href: "/apply",
      },
      // {
      //   label: "My Leave",
      //   href: "my-leave",
      // },
      // {
      //   label: "Entitlements",
      //   href: "",
      //   drpdown: {
      //     "add-entitlements": "Add Entitlements",
      //     "employee-entitlements": "Employee Entitlements",
      //     "my-entitlements": "My Entitlements",
      //   },
      // },
      // {
      //   label: "Reports",
      //   href: "reports",
      // },
      {
        label: "Assign Leave",
        href: "/assign-leave",
      },
      {
        label: "Leave List",
        href: "/leave-list",
      },
      {
        label: "Holidays",
        href: "/holidays",
      },
    ],
  };
  return (
    <div className="flex flex-col h-full">
      <ComponentNavbar NavbarData={leaveNavar} />
      <div className="p-4 h-full">
        <PIMProvider>{children}</PIMProvider>
      </div>
    </div>
  );
}
