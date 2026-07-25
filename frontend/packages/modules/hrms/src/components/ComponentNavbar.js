"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { getCookie } from "@/utils/cookieUtils";

export default function ComponentNavbar({ NavbarData }) {
  const pathName = usePathname();
  const router = useRouter();
  const [zone, setZone] = useState("");
  const [user, setUser] = useState("");

  const zoneMapping = {
    "head-office": "101",
    "bijli": "202",
    "rmc": "301",
    "suda": "303",
    "dmc": "404",
    "bhilai": "601"
  };
  const currentDept = pathName.split("/")[pathName.includes("/hrms") ? 3 : 1];
  const derivedZone = zoneMapping[currentDept] || "";

  useEffect(() => {
    (async () => {
      const cook = await getCookie("user");
      try {
        if (cook) setUser(JSON.parse(cook));
      } catch (e) {
        console.error("Failed to parse user cookie", e);
      }
      setZone(derivedZone);
    })();
  }, [derivedZone]);

  return (
    <nav className="flex bg-white gap-y-3 gap-x-6 p-3 px-10 w-full flex-wrap items-center">
      {NavbarData.menu.map((ele, i) => {
        return ele.drpdown ? (
          <Dropdown
            classNames={{
              trigger: `z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap subpixel-antialiased overflow-hidden tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 min-w-20 gap-2 [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none data-[hover=true]:opacity-hover p-2 text-xs font-medium h-9 px-3 rounded-[0.85rem] ${
                pathName === NavbarData.route + "/" + ele.href
                  ? "text-[#ff7b1d] bg-[#ff7b1d19]"
                  : "text-[#8896af] bg-slate-100"
              }`,
            }}
            key={i}
          >
            <DropdownTrigger>
              <Button className="min-w-fit">{ele.label}</Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Action event example"
              onAction={(key) =>
                router.push(`${NavbarData.route}/${ele.href}${key}`)
              }
            >
              {Object.keys(ele.drpdown).map((item) => (
                <DropdownItem key={item}>{ele.drpdown[item]}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        ) : (
          (ele.role
            ? user?.roles?.find((item) => item.name === ele.role)
            : true) && (
            <Button
              variant="shadow"
              className={`min-w-fit text-[#8896af] font-semibold h-8 shadow-slate-400 rounded-lg text-xs transform transition-transform duration-300 ease-in-out ${
                pathName === NavbarData.route + ele.href
                  ? (zone.toString() === "101" &&
                      "text-[#ff7b1d] border-[#ff7b1d] bg-[#ff7b1d19]") ||
                    (zone.toString() === "202" &&
                      "text-[#c94ddd] border-[#c94ddd] bg-[#c94ddd33]") ||
                    (zone.toString() === "301" &&
                      "text-[#913345bf] border-[#913345bf] bg-[#dabcc245]") ||
                    (zone.toString() === "303" &&
                      "text-[#15a8de] border-[#15a8de] bg-[#51b7cd42]") ||
                    (zone.toString() === "404" &&
                      "text-[#DC5356] border-[#DC5356] bg-[#DC535633]") ||
                    (zone.toString() === "601" &&
                      "text-[#5e3878] border-[#5e3878] bg-[#612d764b]")
                  : "bg-slate-100"
              } hover:scale-105 px-3 rounded-[0.85rem]`}
              key={i}
              onClick={() => router.push(`${NavbarData.route}${ele.href}`)}
            >
              {ele.label}
            </Button>
          )
        );
      })}
    </nav>
  );
}
