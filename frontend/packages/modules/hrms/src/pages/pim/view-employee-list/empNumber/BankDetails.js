"use client";
import React, { useContext } from "react";
import PIMContext from "@/context/PIMProvider";
import { getCookie } from "@/utils/cookieUtils";
import { Button, Divider, Input } from "@nextui-org/react";
import toast from "react-hot-toast";
import { formatDate } from "@/utils/formatDate";
import { usePathname } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);
export default function BankDetails() {
  const pathName = usePathname();
  const { formData, setFormData } = useContext(PIMContext);

  async function handleSave() {
    const submissionData = { ...formData };
    submissionData.dlExpDate = formatDate(formData.dlExpDate);
    submissionData.dob = formatDate(formData.dob);
    submissionData.dateOfJoining = formatDate(formData.dateOfJoining);
    submissionData.contractStartDate = formatDate(formData.contractStartDate);
    submissionData.contractEndDate = formatDate(formData.contractEndDate);
    submissionData.location = formData.location.toString();
    if (baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]] !== "bijli")
      submissionData.areaId = formData.location?.toString();
    delete submissionData.exp;
    delete submissionData.quali;
    delete submissionData.area;
    const token = await getCookie("accessToken");
    const response = await fetch(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/staff/change-in/${btoa(formData.staffId)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submissionData),
      }
    );
    if (response.ok) {
      toast.success("Save Successfully");
    } else {
      const responseData = await response.text();
      if (responseData === "ACCOUNT_NO_ALREADY_EXIST")
        toast.error(responseData.replaceAll("_", " "));
    }
  }

  async function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  return (
    <div className="flex flex-col justify-between h-full gap-4">
      <div>
        <div className="text-[#8896af] text-lg font-bold">Bank Details</div>
        <Divider />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
          <Input
            label="IFSC CODE"
            labelPlacement="outside"
            variant="bordered"
            required
            fullWidth
            name="ifscCode"
            value={formData.ifscCode}
            onChange={handleChange}
          />
          <Input
            label="Account Number"
            variant="bordered"
            placeholder=""
            labelPlacement="outside"
            required
            fullWidth
            name="accountNumber"
            value={formData.accountNumber}
            onChange={handleChange}
          />
          <Input
            label="BANK ADDRESS"
            variant="bordered"
            placeholder=""
            labelPlacement="outside"
            required
            fullWidth
            name="branch"
            value={formData.branch}
            onChange={handleChange}
          />
          <Input
            label="BANK NAME"
            variant="bordered"
            placeholder=""
            labelPlacement="outside"
            required
            fullWidth
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Divider />
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            className="bg-[#76bc21] rounded-full h-8 min-w-24 text-white text-sm"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
