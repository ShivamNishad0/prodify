"use client";
import React, { useEffect, useState } from "react";
import { Input, RadioGroup, Radio } from "@nextui-org/react"; // Updated to use NextUI's RadioGroup and Radio
import { toast } from "react-hot-toast";
import AsyncPaginateTable from "@/components/tables/AcyncPaginateTable";
import { GrEdit } from "react-icons/gr";
import { getData, postData } from "@/utils/api";
import { getCookie } from "@/utils/cookieUtils";

const columns = [
  { key: "name", value: "Name" },
  { key: "phone", value: "Contact Number" },
  { key: "gstNumber", value: "GST Number" },
  { key: "email", value: "Email" },
  { key: "address", value: "Address" },
  { key: "bankAccountNumber", value: "Acc. No" },
  { key: "bankIFSC", value: "IFSC" },
  { key: "panNumber", value: "PAN" },
  { key: "supplierType", value: "Supplier Type" },
  { key: "action", value: "Action" },
];

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const CreateVendors = () => {
  const [vendor, setVendor] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    gstNumber: "",
    supplierType: "sundryCreditor", // Default value for supplier type
    bankAccountNumber: "",
    bankIFSC: "",
    panNumber: "",
  });
  const [page, setPage] = useState(1);
  const [data, setData] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setVendor((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    getVendorList();
  }, []);

  async function getVendorList() {
    try {
      const token = await getCookie("accessToken");
      const resposne = await getData(`${baseUrl}/api/spsm/vendors`, token);
      if (Array.isArray(resposne)) setData({ results: resposne });
    } catch (err) {
      console.error("Error fetching vendor list:", err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any mandatory fields are empty
    const mandatoryFields = [
      { field: "name", label: "Vendor Name" },
      { field: "phone", label: "Contact Number" },
      { field: "email", label: "Email" },
      { field: "address", label: "Address" },
      { field: "gstNumber", label: "GST Number" },
      { field: "bankAccountNumber", label: "Account Number" },
      { field: "bankIFSC", label: "IFSC" },
      { field: "panNumber", label: "PAN Number" },
    ];

    for (const field of mandatoryFields) {
      if (!vendor[field.field]) {
        toast.error(`${field.label} is required`);
        return;
      }
    }

    try {
      const token = await getCookie("accessToken");
      const response = await postData(
        `${baseUrl}/api/spsm/vendors/new`,
        vendor,
        token
      );

      if (!response) {
        throw new Error("Failed to add vendor");
      }

      toast.success("Vendor added successfully!");
      getVendorList();
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const actionButtons = [
    {
      name: "Edit",
      action: async (row) => {
        onOpen();
        const token = await getCookie("accessToken");
        const response = await fetch(
          `${baseUrl}/api/spshrm/${
            baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
          }/attendance/employee/${row.empNo}?month=${selection.month}&year=${
            selection.year
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const responseData = await response.json();

          const attendance = Object.keys(responseData)
            .filter((key) => key.startsWith("d"))
            .map((day) => ({
              day,
              status: responseData[day],
            }));

          const transformedData = {
            ...responseData,
            attendance,
          };

          Object.keys(responseData)
            .filter((key) => key.startsWith("d"))
            .forEach((key) => delete transformedData[key]);
          setUserData(transformedData);
          onOpen();
        }
      },
      iconOnly: true,
      icon: <GrEdit size={25} color="#F7E027" />,
    },
  ];

  return (
    <div className="flex flex-col justify-center p-5 gap-4 h-full">
      <form
        className="flex justify-between bg-white rounded-large shadow-lg p-5 flex-col flex-grow"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-4 gap-5">
          <Input
            label="Vendor Name"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter vendor name"
            name="name"
            value={vendor.name}
            onChange={handleInputChange}
            isRequired
          />
          <Input
            label="Contact Number"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter contact number"
            name="phone"
            value={vendor.phone}
            onChange={handleInputChange}
            isRequired
          />
          <Input
            label="Email"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter email address"
            name="email"
            value={vendor.email}
            onChange={handleInputChange}
            type="email"
            isRequired
          />
          <Input
            label="Address"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter address"
            name="address"
            value={vendor.address}
            onChange={handleInputChange}
            isRequired
          />
          <Input
            label="GST Number"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter GST number"
            name="gstNumber"
            value={vendor.gstNumber}
            onChange={handleInputChange}
            isRequired
          />
          <Input
            label="Account Number"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter Account number"
            name="bankAccountNumber"
            value={vendor.bankAccountNumber}
            onChange={handleInputChange}
            isRequired
          />
          <Input
            label="IFSC"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter IFSC number"
            name="bankIFSC"
            value={vendor.bankIFSC}
            onChange={handleInputChange}
            isRequired
          />
          <Input
            label="PAN"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter PAN number"
            name="panNumber"
            value={vendor.panNumber}
            onChange={handleInputChange}
            isRequired
          />
          <RadioGroup
            label="Supplier Type"
            value={vendor.supplierType}
            onValueChange={(value) =>
              setVendor((prevState) => ({
                ...prevState,
                supplierType: value,
              }))
            }
            orientation="horizontal"
            isRequired
          >
            <Radio value="sundryCreditor">Sundry Creditor</Radio>
            <Radio value="sundryDebtor">Sundry Debtor</Radio>
          </RadioGroup>
          <div className="flex items-center">
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-[#9C0E5C] to-[#0077A3] text-white font-semibold rounded-md hover:bg-opacity-90"
            >
              Add Vendor
            </button>
          </div>
        </div>
      </form>
      <AsyncPaginateTable
        columns={columns}
        actionButtons={actionButtons}
        resourceUrl={`${baseUrl}/api/v1/spsm/view/STAFF_DOC/`}
        page={page}
        data={data}
        setPage={setPage}
        loadingState={true}
      />
    </div>
  );
};

export default CreateVendors;
