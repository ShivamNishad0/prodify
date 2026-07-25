"use client";
import React from "react";
import { Avatar } from "@nextui-org/react";
import { usePathname } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

export default function RMC({ formData, designation }) {
  const pathName = usePathname();

  // If formData is undefined, assign default empty object
  const data = formData || {};

  return (
    <>
      <div className="w-[590px] h-[913px]">
        <div
          className="relative bg-white dark:bg-zinc-800 bg-cover bg-center shadow-lg rounded-lg overflow-hidden aspect-[11/17]"
          id="idCardFront"
          style={{
            backgroundImage: `url("/rmc_id-card_front.svg")`,
          }}
        >
          <div className="relative top-[48.2%] left-[5%] z-50 w-[40.8%] h-[30%]">
            <Avatar
              id="avatar"
              className="w-full h-full"
              classNames={{
                img: "absolute top-0 h-fit",
              }}
              radius="none"
              src={
                data.staffImg
                  ? `${baseUrl}/api/v1/spsm/view/STAFF_IMG/${data.staffImg}`
                  : ""
              }
            />
          </div>
          <div className="top-[58%] left-[53.9%] absolute flex justify-center items-center p-1 w-[46.1%] font-bold text-[14px] text-white uppercase leading-[14px]">
            <p>{data.name || "Name not available"}</p>
          </div>
          <div className="top-[71.5%] left-[43.9%] absolute flex justify-center items-center bg-white ml-1 w-[55.25%] h-[6.2%] font-bold text-[12px] text-black uppercase leading-[8px]">
            <p>{designation?.desigName || "Designation not found"}</p>
          </div>
          <div className="top-[80.4%] left-[3%] absolute flex flex-col justify-center bg-white p-1 w-[50.5%] h-[7.7%] font-bold text-[9px] text-black capitalize leading-[10px]">
            <p>Employee ID: {data.tempEmp || "N/A"}</p>{" "}
            <p>Contact No: {data.contactNo || "N/A"}</p>{" "}
            <p>Valid Upto: {"31/03/2025"}</p>{" "}
          </div>
        </div>
      </div>
      <div className="w-[590px] h-[913px]">
        <div
          className="relative bg-white dark:bg-zinc-800 bg-cover bg-center shadow-lg rounded-lg overflow-hidden aspect-[11/17]"
          id="idCardBack"
          style={{
            backgroundImage: `url("/rmc-ho-idcard-back.svg")`,
          }}
        ></div>
      </div>
    </>
  );
}
