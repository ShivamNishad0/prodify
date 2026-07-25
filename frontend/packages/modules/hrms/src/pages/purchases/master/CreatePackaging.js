"use client";
import React, { useEffect, useState } from "react";
import { Input, Button } from "@nextui-org/react";
import AsyncPaginateTable from "@/components/tables/AcyncPaginateTable";
import { GrEdit } from "react-icons/gr";
import { getCookie } from "@/utils/cookieUtils";
import { getData, postData } from "@/utils/api";
import toast from "react-hot-toast";

// Table Columns for displaying product details
const columns = [
  { key: "packagingType", value: "Name" },
  { key: "action", value: "Action" },
];

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const CreateProduct = () => {
  const [page, setPage] = useState(1);
  const [packagingType, setPackagingType] = useState("");
  const [errors, setErrors] = useState({});
  const [data, setData] = useState([]);

  useEffect(() => {
    getPackagingList();
  }, []);

  async function getPackagingList() {
    try {
      const token = await getCookie("accessToken");
      const resposne = await getData(
        `${baseUrl}/api/spsm/product-packaging`,
        token
      );
      if (Array.isArray(resposne)) setData({ results: resposne });
    } catch (err) {
      console.error("Error fetching vendor list:", err);
    }
  }

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate packaging type
    if (!packagingType) {
      newErrors.packagingType = "Packaging Type is required.";
    }

    setErrors(newErrors);

    // If there are errors, do not proceed with the submission
    if (Object.keys(newErrors).length > 0) return;
    try {
      const token = await getCookie("accessToken");
      const response = await postData(
        `${baseUrl}/api/spsm/product-packaging/new`,
        {
          packagingType: packagingType,
        },
        token
      );

      if (!response) {
        throw new Error("Failed to add vendor");
      }
      setPackagingType("");
      toast.success("Vendor added successfully!");
      getPackagingList();
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  const actionButtons = [
    {
      name: "Edit",
      action: async (row) => {
        // Perform edit action
        onOpen();
        const token = await getCookie("accessToken");
        const response = await fetch(
          `${baseUrl}/api/spshrm/${
            baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
          }/attendance/employee/${row.empNo}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const responseData = await response.json();
          setUserData(responseData);
        }
      },
      iconOnly: true,
      icon: <GrEdit size={25} color="#F7E027" />,
    },
  ];

  return (
    <div className="flex flex-col p-5 gap-4 h-full overflow-y-scroll">
      <form
        className="flex flex-col bg-white rounded-lg shadow-lg p-5"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-4 gap-5">
          <Input
            label="Packaging Type"
            aria-label="Packaging Type"
            placeholder="Enter packaging type"
            value={packagingType}
            onChange={(e) => setPackagingType(e.target.value)}
            fullWidth
            variant="bordered"
            labelPlacement="outside"
            helperText={errors.packagingType} // Display error message
            status={errors.packagingType ? "error" : "default"} // Change status based on error
          />
          <div className="flex justify-start items-center mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-[#9C0E5C] to-[#0077A3] text-white font-semibold rounded-md hover:bg-opacity-90"
            >
              Create Packaging
            </button>
          </div>
        </div>
      </form>
      <div className="overflow-y-scroll scrollbar-hide">
        <AsyncPaginateTable
          columns={columns}
          actionButtons={actionButtons}
          resourceUrl={`${baseUrl}/api/v1/spsm/view/STAFF_DOC/`}
          page={page}
          data={data} // Assuming `filteredData` should come from API
          setPage={setPage}
          loadingState={true}
        />
      </div>
    </div>
  );
};

export default CreateProduct;
