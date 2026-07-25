"use client";
import React, { useContext, useEffect, useState } from "react";
import PIMContext from "@/context/PIMProvider";
import { Button, Checkbox, Divider, Input, Switch } from "@nextui-org/react";
import { getCookie } from "@/utils/cookieUtils";
import toast from "react-hot-toast";
import { postData } from "@/utils/api";
import { formatDate } from "@/utils/formatDate";
import { usePathname } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);
export default function ContactDetails() {
  const pathName = usePathname();
  const { formData, setFormData, userData } = useContext(PIMContext);
  const [sameaddress, setSameAddress] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  async function handleSave() {
    const submissionData = { ...formData };

    submissionData.name = `${formData.firstName} ${formData.middleName} ${formData.lastName}`;
    submissionData.dlExpDate = formatDate(formData.dlExpDate);
    submissionData.dob = formatDate(formData.dob);
    submissionData.dateOfJoining = formatDate(formData.dateOfJoining);
    submissionData.contractStartDate = formatDate(formData.contractStartDate);
    submissionData.contractEndDate = formatDate(formData.contractEndDate);
    delete submissionData.exp;
    delete submissionData.quali;
    delete submissionData.area;
    submissionData.filledBy = userData.id;
    if (baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]] !== "bijli")
      submissionData.areaId = formData.location?.toString();

    const token = await getCookie("accessToken");
    const response = await postData(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/staff/change-in/${btoa(formData.staffId)}`,
      submissionData,
      token
    );
    if (response) {
      toast.success("Save Successfully");
    }
  }

  useEffect(() => {
    if (sameaddress) {
      setFormData((prevData) => ({
        ...prevData,
        pstreet1: formData.street1,
        pstreet2: formData.street2,
        pcity: formData.city,
        pstate: formData.state,
        ppincode: formData.pincode,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sameaddress]);

  return (
    <div className="flex flex-col justify-between h-full gap-4 overflow-y-scroll scrollbar-hide">
      <div>
        <div>
          <div className="text-[#8896af] text-base font-bold">
            Communication Address
          </div>
          <Divider />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1">
            <Input
              label="Street 1"
              labelPlacement="outside"
              variant="bordered"
              required
              fullWidth
              name="street1"
              value={formData.street1}
              onChange={handleChange}
            />
            <Input
              label="Street 2"
              labelPlacement="outside"
              variant="bordered"
              fullWidth
              value={formData.street2}
              name="street2"
              onChange={handleChange}
            />
            <Input
              label="City"
              labelPlacement="outside"
              variant="bordered"
              required
              fullWidth
              value={formData.city}
              name="city"
              onChange={handleChange}
            />
            <Input
              label="State/Province"
              labelPlacement="outside"
              variant="bordered"
              required
              fullWidth
              value={formData.state}
              name="state"
              onChange={handleChange}
            />
            <Input
              label="Zip/Postal Code"
              placeholder=""
              labelPlacement="outside"
              variant="bordered"
              required
              fullWidth
              value={formData.pincode}
              name="pincode"
              onChange={handleChange}
            />
          </div>
          <div className="text-[#8896af] text-base font-bold mt-4 flex justify-between">
            Permanent Address
            <Checkbox isSelected={sameaddress} onValueChange={setSameAddress}>
              Same as Address
            </Checkbox>
          </div>
          <Divider />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1">
            <Input
              label="Street 1"
              labelPlacement="outside"
              variant="bordered"
              required
              fullWidth
              name="pstreet1"
              value={formData.pstreet1}
              onChange={handleChange}
            />
            <Input
              label="Street 2"
              labelPlacement="outside"
              variant="bordered"
              fullWidth
              value={formData.pstreet2}
              name="pstreet2"
              onChange={handleChange}
            />
            <Input
              label="City"
              labelPlacement="outside"
              variant="bordered"
              required
              fullWidth
              value={formData.pcity}
              name="pcity"
              onChange={handleChange}
            />
            <Input
              label="State/Province"
              labelPlacement="outside"
              variant="bordered"
              required
              fullWidth
              value={formData.pstate}
              name="pstate"
              onChange={handleChange}
            />
            <Input
              label="Zip/Postal Code"
              placeholder=""
              labelPlacement="outside"
              variant="bordered"
              required
              fullWidth
              value={formData.ppincode}
              name="ppincode"
              onChange={handleChange}
            />
          </div>
          <div className="text-[#8896af] text-base font-bold mt-4">
            Communication
          </div>
          <Divider />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1">
            <Input
              label="Mobile"
              placeholder=""
              labelPlacement="outside"
              variant="bordered"
              required
              fullWidth
              value={formData.contactNo}
              name="contactNo"
              onChange={handleChange}
            />
            <Input
              label="Email"
              placeholder=""
              labelPlacement="outside"
              variant="bordered"
              required
              fullWidth
              value={formData.email}
              name="email"
              onChange={handleChange}
            />
          </div>
          <div className="text-[#8896af] text-base font-bold mt-4">
            Emergency Contact
          </div>
          <Divider />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1">
            <Input
              label="Mobile"
              placeholder=""
              labelPlacement="outside"
              variant="bordered"
              required
              fullWidth
              value={formData.emergencyMobile}
              name="emergencyMobile"
              onChange={handleChange}
            />

            <Input
              label="Relationship"
              placeholder=""
              labelPlacement="outside"
              variant="bordered"
              required
              fullWidth
              value={formData.emergencyRelation}
              name="emergencyRelation"
              onChange={handleChange}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Divider />
        <div className="flex justify-end">
          <Button
            className="bg-[#76bc21] rounded-full h-8 min-w-24 text-white text-sm"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
