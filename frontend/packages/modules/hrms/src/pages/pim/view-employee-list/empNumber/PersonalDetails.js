"use client";
import React, { useContext } from "react";
import {
  Button,
  cn,
  DatePicker,
  Divider,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
  Switch,
} from "@nextui-org/react";
import PIMContext from "@/context/PIMProvider";
import toast from "react-hot-toast";
import { getCookie } from "@/utils/cookieUtils";
import { formatDate } from "@/utils/formatDate";
import { getPimdata } from "@/utils/getPimData";
import { usePathname } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

export default function PersonalDetails() {
  const pathName = usePathname();
  const { formData, setFormData, userData, empNumber, setDocs } =
    useContext(PIMContext);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value.toUpperCase(),
    }));
  }

  const handleDateChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  async function handleSave() {
    const submissionData = { ...formData };
    submissionData.name = `${formData.firstName} ${formData.middleName} ${formData.lastName}`;
    submissionData.dlExpDate = formatDate(formData.dlExpDate);
    submissionData.dob = formatDate(formData.dob);
    submissionData.dateOfJoining = formatDate(formData.dateOfJoining);
    submissionData.contractStartDate = formatDate(formData.contractStartDate);
    submissionData.contractEndDate = formatDate(formData.contractEndDate);
    submissionData.filledBy = userData.id;
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
      if (responseData === "TEMP_EMP_ALREADY_EXIST")
        toast.error("Employee Number Already Exist");
    }
  }

  async function handleApprove() {
    const token = await getCookie("accessToken");
    const user = await getCookie("user");
    const base64staffId = btoa(formData.staffId);
    const base64Id = btoa(JSON.parse(user).id);
    const response = await fetch(
      `${baseUrl}/api/spshrm/${baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]}/staff/${
        formData.verified === "VERIFIED"
          ? "reject-candidate"
          : "approve-candidate"
      }/${base64staffId}/${base64Id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const responseData = await response.text();
      if (responseData === "SUCCESS") {
        getPimdata(setFormData, btoa(empNumber), setDocs, pathName);
        toast.success("Updated Successfully");
      }
    }
  }

  return (
    <div className="flex flex-col justify-between h-full gap-4 overflow-y-scroll scrollbar-hide">
      <div>
        <div className="text-[#8896af] text-lg font-bold">Personal Details</div>
        <Divider />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1">
          <Input
            label="First Name"
            variant="bordered"
            labelPlacement="outside"
            required
            fullWidth
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <Input
            label="Middle Name"
            variant="bordered"
            labelPlacement="outside"
            fullWidth
            value={formData.middleName}
            name="middleName"
            onChange={handleChange}
          />
          <Input
            label="Last Name"
            variant="bordered"
            labelPlacement="outside"
            required
            fullWidth
            value={formData.lastName}
            name="lastName"
            onChange={handleChange}
          />
          <Input
            label="Father's Name"
            variant="bordered"
            labelPlacement="outside"
            required
            fullWidth
            name="fname"
            value={formData.fname}
            onChange={handleChange}
          />

          <Input
            label="Employee Id"
            variant="bordered"
            labelPlacement="outside"
            required
            fullWidth
            value={formData.tempEmp}
            name="tempEmp"
            onChange={handleChange}
          />
          <Select
            label="Blood group"
            name="bloodGroup"
            variant="bordered"
            labelPlacement="outside"
            selectedKeys={[formData.bloodGroup]}
            placeholder="--Select--"
            className="max-w-xs"
            onChange={handleChange}
          >
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((ele) => (
              <SelectItem key={ele}>{ele}</SelectItem>
            ))}
          </Select>
          <Input
            label="PAN Number"
            placeholder=""
            variant="bordered"
            labelPlacement="outside"
            required
            fullWidth
            value={formData.panCard}
            name="panCard"
            onChange={handleChange}
          />
          <Input
            label="Aadhar Number"
            variant="bordered"
            placeholder=""
            labelPlacement="outside"
            required
            fullWidth
            value={formData.aadharNo}
            name="aadharNo"
            onChange={handleChange}
          />
          <Input
            label="Driver's License Number"
            variant="bordered"
            placeholder=""
            labelPlacement="outside"
            required
            fullWidth
            value={formData.dlNo}
            name="dlNo"
            onChange={handleChange}
          />
          <DatePicker
            showMonthAndYearPickers
            label="License Expiry Date"
            variant="bordered"
            labelPlacement="outside"
            value={formData.dlExpDate}
            classNames={{
              label: "text-[#f50000] text-3xl",
              timeInputLabel: "text-[#f50000] text-3xl",
              wrapper: "text-[#ffffff]",
            }}
            onChange={(date) => handleDateChange("dlExpDate", date)}
          />
          <DatePicker
            showMonthAndYearPickers
            name="dob"
            label="Date Of Birth"
            variant="bordered"
            labelPlacement="outside"
            value={formData.dob}
            onChange={(date) => handleDateChange("dob", date)}
          />
          <Input
            label="Nationality"
            variant="bordered"
            labelPlacement="outside"
            required
            fullWidth
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
          />
          <div className="flex w-full max-w-xs flex-col gap-2">
            <Select
              label="Ex-Employee"
              name="exEmp"
              variant="bordered"
              labelPlacement="outside"
              selectedKeys={[formData.exEmp]}
              className="max-w-xs"
              onChange={handleChange}
            >
              {["YES", "NO"].map((ele) => (
                <SelectItem key={ele}>{ele}</SelectItem>
              ))}
            </Select>
          </div>
          <div className="flex w-full max-w-xs flex-col gap-2">
            <Select
              label="Marital Status"
              name="maritalStatus"
              variant="bordered"
              labelPlacement="outside"
              selectedKeys={[formData.maritalStatus]}
              className="max-w-xs"
              onChange={handleChange}
            >
              {["MARRIED", "UNMARRIED", "OTHER"].map((ele) => (
                <SelectItem key={ele}>{ele}</SelectItem>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <RadioGroup
              label="Gender"
              orientation="horizontal"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={{ label: ["flex", "justify-evenly"] }}
            >
              <Radio value={"MALE"}>Male</Radio>
              <Radio value={"FEMALE"}>Female</Radio>
              <Radio value={"OTHER"}>Other</Radio>
            </RadioGroup>
          </div>
          <Switch
            isSelected={formData.verified === "VERIFIED"}
            onChange={handleApprove}
            size="sm"
            classNames={{
              base: cn(
                "inline-flex flex-row-reverse w-full max-w-md bg-content1 items-center",
                "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent"
              ),
              wrapper: "p-0 h-4 overflow-visible",
              thumb: cn(
                "w-6 h-6 border-2 shadow-lg",
                "group-data-[hover=true]:border-primary",
                //selected
                "group-data-[selected=true]:ml-6",
                // pressed
                "group-data-[pressed=true]:w-7",
                "group-data-[selected]:group-data-[pressed]:ml-4"
              ),
            }}
          >
            Approval Status
          </Switch>
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
