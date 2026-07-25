"use client";
import React, { useContext, useEffect, useRef } from "react";
import PIMContext from "@/context/PIMProvider";
import { getCookie } from "@/utils/cookieUtils";
import { Button } from "@nextui-org/react";
import toast from "react-hot-toast";
import { useReactToPrint } from "react-to-print";
import "./IdCardGeneration.css";
import { FiPrinter } from "react-icons/fi";
import { getPimdata } from "@/utils/getPimData";
import { usePathname } from "next/navigation";
import Bijli from "./id-cards/Bijli";
import HO from "./id-cards/HO";
import RMC from "./id-cards/RMC";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

export default function GenerateIdCard() {
  const pathName = usePathname();
  const { formData, userData, desgn, empNumber, setFormData, setDocs } =
    useContext(PIMContext);

  useEffect(() => {
    if (formData.isIdGenrated === "TRUE") {
      updateIDCard();
    } else {
      generateIDCard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function generateIDCard() {
    try {
      const token = await getCookie("accessToken");
      const response = await fetch(
        `${baseUrl}/api/spshrm/${
          baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
        }/id/generateIdOnly/${btoa(empNumber)}/${btoa(userData.id)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate ID card");
      }
      await getPimdata(setFormData, btoa(empNumber), setDocs, pathName);
      toast.success("Id Card Generated Successfully");
      // router.push(`/id-card-generattion/id-card?empno=${row.empNo}`);
    } catch (error) {
      toast.error("Error generating ID card:", error.message);
    }
  }

  async function updateIDCard() {
    try {
      const token = await getCookie("accessToken");
      const userData = await getCookie("user");

      const response = await fetch(
        `${baseUrl}/api/spshrm/${
          baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
        }/id/updateIdDetails/${btoa(empNumber)}/${btoa(
          JSON.parse(userData).id
        )}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate ID card");
      }
      await getPimdata(setFormData, btoa(empNumber), setDocs, pathName);
      toast.success("Id Card Updated Successfully");
      // router.push(`/id-card-generattion/id-card?empno=${row.empNo}`);
    } catch (error) {
      toast.error("Error generating ID card:", error.message);
    }
  }

  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const designation = desgn.length
    ? desgn.find((ele) => ele.desigId.toString() === formData.desigId)
    : null;

  const renderComponent = () => {
    switch (baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]) {
      case "bijli":
        return <Bijli formData={formData} designation={designation} />;
      case "ho":
        return <HO formData={formData} designation={designation} />;
      case "rmc":
        return <RMC formData={formData} designation={designation} />;
      default:
        return null; // In case no match is found, return nothing or a default component
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center">
        <Button
          className="rounded-full bg-[#76bc21] text-white h-8"
          onPress={handlePrint}
          endContent={<FiPrinter />}
        >
          Print ID Cards
        </Button>
      </div>
      <div className="flex gap-4 printable" ref={printRef}>
        {renderComponent()}
      </div>
    </div>
  );
}
