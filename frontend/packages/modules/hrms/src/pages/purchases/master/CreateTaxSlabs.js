"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@nextui-org/react";
import { toast } from "react-hot-toast";
import { GrEdit } from "react-icons/gr";
import AsyncPaginateTable from "@/components/tables/AcyncPaginateTable";
import { getData, postData } from "@/utils/api";
import { getCookie } from "@/utils/cookieUtils";

// Table Columns for displaying tax slabs
const columns = [
  { key: "name", value: "Name" },
  { key: "gst", value: "GST" },
  { key: "sgst", value: "SGST" },
  { key: "cgst", value: "CGST" },
  { key: "igst", value: "IGST" },
  { key: "action", value: "Action" },
];

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const CreateTaxSlabs = () => {
  // State for holding form input data
  const [taxSlab, setTaxSlab] = useState({
    name: "", // Slab name is a string
    gst: "", // Total slab percentage (numeric)
    sgst: "",
    cgst: "",
    igst: "",
  });
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);

  useEffect(() => {
    getGstList();
  }, []);

  async function getGstList() {
    try {
      const token = await getCookie("accessToken");
      const resposne = await getData(`${baseUrl}/api/spsm/gsts`, token);
      if (Array.isArray(resposne)) setData({ results: resposne });
    } catch (err) {
      console.error("Error fetching vendor list:", err);
    }
  }

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If the slab percentage field is changed, set SGST and CGST to 50% and IGST to 100%
    if (name === "gst") {
      const parsedValue = parseFloat(value) || 0;
      setTaxSlab((prevState) => ({
        ...prevState,
        [name]: parsedValue || "", // Update gst
        sgst: parsedValue / 2 || "", // Set SGST to 50% of the gst
        cgst: parsedValue / 2 || "", // Set CGST to 50% of the gst
        igst: parsedValue || "", // Set IGST to the full gst
      }));
    } else {
      // For individual changes in name, SGST, CGST, or IGST
      setTaxSlab((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: check if all fields are filled in
    if (
      !taxSlab.name ||
      !taxSlab.gst ||
      !taxSlab.sgst ||
      !taxSlab.cgst ||
      !taxSlab.igst
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const token = await getCookie("accessToken");
      const response = await postData(
        `${baseUrl}/api/spsm/gsts/new`,
        taxSlab,
        token
      );

      if (!response) {
        throw new Error("Failed to create tax slab");
      }
      toast.success("Tax slab created successfully!");
      getGstList();
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    }
  };

  // Define the action buttons for each row (Edit button)
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
          // Process response data here if necessary
          setUserData(responseData);
        }
      },
      iconOnly: true,
      icon: <GrEdit size={25} color="#F7E027" />,
    },
  ];

  return (
    <div className="flex flex-col justify-center p-5 gap-4 h-full overflow-y-scroll">
      <form
        className="flex justify-between bg-white rounded-large shadow-lg p-5 flex-col flex-grow"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-4 gap-5">
          <Input
            label="Slab Name"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter Slab Name"
            name="name"
            value={taxSlab.name}
            onChange={handleInputChange}
            type="text"
            required
            fullWidth
          />
          <Input
            label="Total Slab (%)"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter Slab percentage"
            name="gst"
            value={taxSlab.gst}
            onChange={handleInputChange}
            type="number"
            required
            fullWidth
          />
          <Input
            label="SGST (%)"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter SGST percentage"
            name="sgst"
            value={taxSlab.sgst}
            onChange={handleInputChange}
            type="number"
            required
            fullWidth
          />
          <Input
            label="CGST (%)"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter CGST percentage"
            name="cgst"
            value={taxSlab.cgst}
            onChange={handleInputChange}
            type="number"
            required
            fullWidth
          />
          <Input
            label="IGST (%)"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Enter IGST percentage"
            name="igst"
            value={taxSlab.igst}
            onChange={handleInputChange}
            type="number"
            required
            fullWidth
          />
          <div className="flex justify-start items-center mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-[#9C0E5C] to-[#0077A3] text-white font-semibold rounded-md hover:bg-opacity-90"
            >
              Create Tax Slab
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

export default CreateTaxSlabs;
