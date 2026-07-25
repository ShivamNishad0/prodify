"use client";
import React from "react";
import { Avatar } from "@nextui-org/react";
import { usePathname } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

export default function Bijli({ formData = {}, designation = {} }) {
  const pathName = usePathname();

  // Calculate the validUpto date (90 days from today)
  const today = new Date();
  const validUptoDate = new Date(today.setDate(today.getDate() + 90));
  const formattedValidUpto = validUptoDate
    .toLocaleDateString("en-GB") // Format as dd/MM/yyyy
    .split("/")
    .join("/");

  // Destructure the formData safely with default values
  const {
    staffImg = "",
    name = "No Name",
    contactNo = "N/A",
    tempEmp = "N/A",
  } = formData;
  const { desigName = "Designation not found" } = designation;

  return (
    <>
      <div className="w-[590px] h-[913px]">
        <div
          className="relative bg-white dark:bg-zinc-800 bg-cover bg-center shadow-lg rounded-lg aspect-[11/17] overflow-hidden"
          id="idCardFront"
          style={{
            backgroundImage: `url("/IDCardFront.png")`,
          }}
        >
          {/* Avatar section */}
          <div className="top-[58.2%] left-[5%] relative w-[40.8%] h-[27%]">
            <Avatar
              id="avatar"
              className="w-full h-full"
              classNames={{
                img: "absolute top-0 h-fit",
              }}
              radius="none"
              src={
                staffImg
                  ? `${baseUrl}/api/v1/spsm/view/STAFF_IMG/${staffImg}`
                  : ""
              }
            />
          </div>

          {/* Name section */}
          <div className="top-[58%] left-[53.9%] absolute flex justify-center items-center p-1 w-[46.1%] font-bold text-[14px] text-white uppercase leading-[14px]">
            <p>{name}</p>
          </div>

          {/* Designation section */}
          <div className="top-[71.5%] left-[53.9%] absolute flex justify-center items-center bg-white ml-1 w-[46.1%] h-[6.2%] font-bold text-[12px] text-black uppercase leading-[8px]">
            <p>{desigName}</p>
          </div>

          {/* Contact details section */}
          <div className="top-[87.4%] left-[3%] absolute flex flex-col justify-center bg-white p-1 w-[61.5%] h-[7.7%] font-bold text-[9px] text-black capitalize leading-[10px]">
            <p>Contact No: {contactNo}</p>
            <p>Valid Upto: {formattedValidUpto}</p>
            <p>Employee ID: {tempEmp}</p>
          </div>
        </div>
      </div>
      <div className="w-[590px] h-[913px]">
        <div
          className="relative bg-white dark:bg-zinc-800 bg-cover bg-center shadow-lg rounded-lg aspect-[11/17] overflow-hidden"
          id="idCardBack"
          style={{
            backgroundImage: `url(${
              baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]] === "bijli"
                ? "/IDCardBack.png"
                : "/rmc-ho-idcard-back.svg"
            })`,
          }}
        ></div>
      </div>
    </>
  );
}
