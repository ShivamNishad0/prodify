"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Divider, Button, useDisclosure } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
import { getCookie } from "@/utils/cookieUtils";
import toast from "react-hot-toast";
import CustomTable from "@/components/tables/Table";
import { formatDate } from "@/utils/formatDate";
import PIMContext from "@/context/PIMProvider";
import { getAllArea } from "@/utils/getDesgnData";
import { deleteData, getData } from "@/utils/api";
import { BsTrash3Fill } from "react-icons/bs";
import { GrEdit } from "react-icons/gr";
import { formElements } from "@/utils/constant";
import AssetAllocationForm from "./AssetAllocationForm";
import AssetModal from "./AssetModal";
import { usePathname } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

const initialFormData = Object.keys(formElements).reduce((acc, key) => {
  acc[key] = "";
  return acc;
}, {});

initialFormData.dateOfIssue = parseDate(new Date().toISOString().split("T")[0]);

const columns = [
  { key: "assetName", value: "Asset" },
  { key: "leaderName", value: "Leader Name" },
  { key: "dateOfIssue", value: "Date of Issue" },
  { key: "areaOfStaff", value: "Sub Division" },
  { key: "modelNo", value: "Model Number" },
  { key: "deviceSlNo", value: "Device Serial Number" },
  { key: "action", value: "Action" },
];

export default function AssetAllocation() {
  const pathName = usePathname();
  const { formData, userData } = useContext(PIMContext);
  const [asset, setAsset] = useState("");
  const [modalData, setModalData] = useState(initialFormData);
  const [area, setArea] = useState([]);
  const [assetData, setAssetData] = useState([]);
  const [assetList, setAssetList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const areaData = useCallback(() => getAllArea(setArea, pathName), []);
  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const isFormValid = () => {
    if (!asset) return false;
    for (const key in modalData) {
      if (
        key !== "assetId" &&
        key !== "staffAssetId" &&
        key != "issuer" &&
        formElements[key].required &&
        !modalData[key]
      ) {
        return false;
      }
    }
    return true;
  };

  const handleSaveAsset = async (type) => {
    if (!isFormValid()) {
      toast.error("Please fill in all required fields.");
      return;
    }
    const selectArea = area.find(
      (ele) =>
        ele.subDivision.toLowerCase() ===
        formData?.area?.subDivision?.toLowerCase()
    )?.areaId;

    const token = await getCookie("accessToken");
    const payload = {
      ...modalData,
      areaOfStaff: selectArea,
      dateOfIssue: formatDate(modalData.dateOfIssue),
      staffId: formData.staffId,
      reciverName: formData.name,
      empNo: modalData.empNo,
      assetId: JSON.parse(asset).assetId,
    };

    const response = await fetch(
      `${baseUrl}/api/spshrm/${baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]}/staff-assets/${
        type ? btoa(modalData.staffAssetId) : "allot-new"
      }`,
      {
        method: type ? type : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );
    if (response.ok) {
      toast.success("Asset allocated");
      setModalData((prevData) => ({
        ...prevData,
        dateOfIssue: parseDate(new Date().toISOString().split("T")[0]),
        deviceSlNo: "",
        hardDisk: "",
        leaderName: "",
        modelNo: "",
        ram: "",
        remarks: "",
      }));
      getAssetData();
      onClose();
    } else {
      toast.error("Failed to allocate asset");
    }
  };

  useEffect(() => {
    getAssetList();
    getAssetData();
    setModalData((prevData) => ({
      ...prevData,
      areaOfStaff: formData?.area?.subDivision,
      empNo: formData?.tempEmp,
      issuer: userData.id,
    }));
    areaData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, userData, areaData]);

  const getAssetData = async () => {
    const token = await getCookie("accessToken");
    const response = await fetch(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/staff-assets/staff/${btoa(formData.staffId)}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) setAssetData(await response.json());
    else {
      setAssetData([]);
      setFilteredData([]);
    }
  };

  const getAssetList = async () => {
    const token = await getCookie("accessToken");
    const response = await getData(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/assets/all-asset`,
      token
    );
    setAssetList(Array.isArray(response) ? response : []);
  };

  const setAssetName = () => {
    const dataToUpdate = assetData.map((element) => ({
      ...element,
      assetName: assetList.find(
        (ele) => ele.assetId.toString() === element.assetId.toString()
      )?.assetName,
      areaOfStaff: area.find(
        (ele) => ele.areaId.toString() === element.areaOfStaff?.toString()
      )?.subDivision,
    }));
    setFilteredData(dataToUpdate);
  };

  useEffect(() => {
    if (assetList.length && assetData.length) {
      setAssetName();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assetList, assetData]);

  const actionButtons = [
    {
      name: "Edit",
      action: (row) => {
        const updateObj = {
          staffAssetId: row.id,
          assetId: row.assetId,
          areaOfStaff: row.areaOfStaff,
          deviceSlNo: row.deviceSlNo,
          empNo: row.empNo,
          hardDisk: row.hardDisk,
          issuer: userData.id,
          leaderName: row.leaderName,
          modelNo: row.modelNo,
          ram: row.ram,
          remarks: row.remarks,
        };
        updateObj.dateOfIssue = parseDate(row.dateOfIssue);
        setAsset(
          JSON.stringify(
            assetList.find((ele) => ele.assetName === row.assetName)
          )
        );
        setModalData(updateObj);
        onOpen();
      },
      iconOnly: true,
      icon: <GrEdit size={25} color="#F7E027" />,
    },
    {
      name: "Delete",
      action: (row) => handleDelete(row),
      iconOnly: true,
      icon: <BsTrash3Fill size={25} color="#F50000" />,
    },
  ];

  async function handleDelete(row) {
    const token = await getCookie("accessToken");
    const response = await deleteData(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/staff-assets/${btoa(row.id)}`,
      token
    );
    if (response) {
      getAssetData();
      toast.success("Deleted Succesfully");
    }
  }

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="text-[#8896af] text-lg font-bold">Asset Allocation</div>
      <Divider />
      <AssetAllocationForm
        asset={asset}
        setAsset={setAsset}
        assetList={assetList}
        formElements={formElements}
        modalData={modalData}
        setModalData={setModalData}
      />
      <div className="flex flex-col gap-4">
        <Divider />
        <div className="flex justify-end">
          <Button
            onClick={() => handleSaveAsset()}
            className="bg-[#76bc21] rounded-full h-8 min-w-24 text-white text-sm"
          >
            Add
          </Button>
        </div>
        <div className="pb-5">
          <CustomTable
            columns={columns}
            data={filteredData}
            actionButtons={actionButtons}
          />
        </div>
      </div>
      <AssetModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        asset={asset}
        setAsset={setAsset}
        assetList={assetList}
        formElements={formElements}
        modalData={modalData}
        setModalData={setModalData}
        handleSaveAsset={handleSaveAsset}
      />
    </div>
  );
}
