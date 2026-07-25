"use client";
import React, { useEffect, useState } from "react";
import { Input, Button, Select, SelectItem } from "@nextui-org/react";
import AsyncPaginateTable from "@/components/tables/AcyncPaginateTable";
import { GrEdit } from "react-icons/gr";
import { getData, postData } from "@/utils/api";
import toast from "react-hot-toast";
import { getCookie } from "@/utils/cookieUtils";

// Table Columns for displaying product details
const columns = [
  { key: "name", value: "Name" },
  { key: "price", value: "Price" },
  { key: "modelNumber", value: "Model Number" },
  { key: "packageType", value: "Packaging Type" },
  { key: "mrp", value: "MRP" },
  { key: "sgst", value: "SGST" },
  { key: "cgst", value: "CGST" },
  { key: "Igst", value: "IGST" },
  { key: "action", value: "Action" },
];

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const CreateProduct = () => {
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    modelNumber: "",
    packageType: "",
    mrp: "",
    cost: "",
    taxType: "", // "cgst", "sgst", or "igst"
    cgst: "",
    sgst: "",
    igst: "",
  });
  const [data, setData] = useState("");
  const [pkgType, setPkgType] = useState("");

  useEffect(() => {
    getProductList();
    getPackagingList();
  }, []);

  async function getPackagingList() {
    try {
      const token = await getCookie("accessToken");
      const resposne = await getData(
        `${baseUrl}/api/spsm/product-packaging`,
        token
      );
      if (Array.isArray(resposne)) setPkgType(resposne);
    } catch (err) {
      console.error("Error fetching vendor list:", err);
    }
  }

  async function getProductList() {
    try {
      const token = await getCookie("accessToken");
      const resposne = await getData(`${baseUrl}/api/spsm/vendors`, token);
      if (Array.isArray(resposne)) setData({ results: resposne });
    } catch (err) {
      console.error("Error fetching vendor list:", err);
    }
  }

  const handleTaxTypeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      taxType: value,
      cgst: value === "igst" ? "" : prev.cgst,
      sgst: value === "igst" ? "" : prev.sgst,
      igst: value === "igst" ? prev.igst : "",
    }));
  };

  // Render GST inputs based on selected tax type
  const renderGstInputs = () => {
    const { taxType, cgst, sgst, igst } = formData;
    if (taxType === "igst") {
      return (
        <Input
          label="Enter IGST Rate"
          aria-label="IGST Rate"
          placeholder="Enter IGST rate"
          value={igst}
          onChange={(e) => setFormData({ ...formData, igst: e.target.value })}
          fullWidth
          variant="bordered"
          labelPlacement="outside"
        />
      );
    } else if (taxType === "cgst" || taxType === "sgst") {
      return (
        <>
          <Input
            label="Enter CGST Rate"
            aria-label="CGST Rate"
            placeholder="Enter CGST rate"
            value={cgst}
            onChange={(e) => setFormData({ ...formData, cgst: e.target.value })}
            fullWidth
            variant="bordered"
            labelPlacement="outside"
          />
          <Input
            label="Enter SGST Rate"
            aria-label="SGST Rate"
            placeholder="Enter SGST rate"
            value={sgst}
            onChange={(e) => setFormData({ ...formData, sgst: e.target.value })}
            fullWidth
            variant="bordered"
            labelPlacement="outside"
          />
        </>
      );
    }
    return null;
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    try {
      const token = await getCookie("accessToken");
      const response = await postData(
        `${baseUrl}/api/spsm/product/new`,
        formData,
        token
      );
      if (!response) throw new Error("Failed to add vendor");

      toast.success("Product Added Sucessfully");
      getProductList();
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
    <div className="flex flex-col justify-center p-5 gap-4 h-full overflow-y-scroll">
      <form
        className="flex flex-col bg-white rounded-lg shadow-lg p-5 flex-grow"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-4 gap-5">
          <Input
            label="Product Name"
            aria-label="Product Name"
            placeholder="Enter product name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
            variant="bordered"
            labelPlacement="outside"
          />
          <Input
            label="Price"
            aria-label="Price"
            placeholder="Enter product price"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            fullWidth
            variant="bordered"
            labelPlacement="outside"
          />
          <Input
            label="Model Number"
            aria-label="Model Number"
            placeholder="Enter model number"
            value={formData.modelNumber}
            onChange={(e) =>
              setFormData({ ...formData, modelNumber: e.target.value })
            }
            fullWidth
            variant="bordered"
            labelPlacement="outside"
          />
          <Input
            label="MRP"
            aria-label="MRP"
            placeholder="Enter Maximum Retail Price"
            value={formData.mrp}
            onChange={(e) => setFormData({ ...formData, mrp: e.target.value })}
            fullWidth
            variant="bordered"
            labelPlacement="outside"
          />
          <Input
            label="Cost"
            aria-label="Cost"
            placeholder="Enter product cost"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            fullWidth
            variant="bordered"
            labelPlacement="outside"
          />
          <Select
            label="Package Type"
            aria-label="Package Type"
            placeholder="Select package type"
            value={formData.packageType}
            onChange={(e) =>
              setFormData({ ...formData, packageType: e.target.value })
            }
            fullWidth
            variant="bordered"
            labelPlacement="outside"
          >
            {Array.isArray(pkgType) &&
              pkgType.map((ele) => (
                <SelectItem key={ele.ppId} value={ele.packagingType}>
                  {ele.packagingType}
                </SelectItem>
              ))}
          </Select>
          <Select
            label="Tax Type"
            aria-label="Tax Type"
            placeholder="Select tax type"
            value={formData.taxType}
            onChange={(e) => handleTaxTypeChange(e.target.value)}
            fullWidth
            variant="bordered"
            labelPlacement="outside"
          >
            <SelectItem key="cgst" value="cgst">
              CGST & SGST
            </SelectItem>
            <SelectItem key="igst" value="igst">
              IGST
            </SelectItem>
          </Select>
          {renderGstInputs()}
          <div className="flex justify-start items-center mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-[#9C0E5C] to-[#0077A3] text-white font-semibold rounded-md hover:bg-opacity-90"
            >
              Create Product
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
          data={[]} // Assuming `filteredData` should come from API
          setPage={setPage}
          loadingState={true}
        />
      </div>
    </div>
  );
};

export default CreateProduct;
