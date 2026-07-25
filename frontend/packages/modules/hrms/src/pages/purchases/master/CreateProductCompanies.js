"use client";
import React, { useEffect, useState } from "react";
import AsyncPaginateTable from "@/components/tables/AcyncPaginateTable";
import { Input } from "@nextui-org/react";
import { GrEdit } from "react-icons/gr";
import { getCookie } from "@/utils/cookieUtils";
import { getData, postData } from "@/utils/api";
import toast from "react-hot-toast";

const columns = [
  { key: "companyName", value: "Name" },
  { key: "action", value: "Action" },
];

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default function CreateProductCompanies() {
  const [page, setPage] = useState(1);
  const [companyName, setcompanyName] = useState("");
  const [data, setData] = useState("");
  const [errors, setErrors] = useState({});

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

  useEffect(() => {
    getProductList();
  }, []);

  async function getProductList() {
    try {
      const token = await getCookie("accessToken");
      const resposne = await getData(`${baseUrl}/api/spsm/companies`, token);
      if (Array.isArray(resposne)) setData({ results: resposne });
    } catch (err) {
      console.error("Error fetching vendor list:", err);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!companyName) newErrors.companyName = "Product Company is required.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;
    try {
      const token = await getCookie("accessToken");
      const response = await postData(
        `${baseUrl}/api/spsm/companies/new`,
        companyName,
        token
      );

      if (!response) {
        throw new Error("Failed to add Product");
      }

      toast.success("Product added successfully!");
      getProductList();
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const filteredData = [];

  return (
    <div className="flex flex-col justify-center p-5 gap-4 h-full">
      <form
        className="flex justify-between bg-white rounded-large shadow-lg p-5 flex-col flex-grow"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-4 gap-5">
          <Input
            label="Product Company"
            aria-label="Product Company"
            placeholder="Enter product company"
            value={companyName}
            onChange={(e) => setcompanyName(e.target.value)}
            fullWidth
            variant="bordered"
            labelPlacement="outside"
            helperText={errors.company}
            status={errors.company ? "error" : "default"}
          />
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
}
