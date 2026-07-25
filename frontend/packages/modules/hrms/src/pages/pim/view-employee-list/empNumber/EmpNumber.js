"use client";
import React, {
  Suspense,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Avatar,
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import Post from "./Post";
import { getCookie } from "@/utils/cookieUtils";
import { getPimdata } from "@/utils/getPimData";
import { usePathname, useSearchParams } from "next/navigation";
import PIMContext from "@/context/PIMProvider";
import PersonalDetails from "./PersonalDetails";
import ContactDetails from "./ContactDetails";
import Qualification from "./Qualification";
import OfferLetter from "./OfferLetter";
import Salary from "./Salary";
import GenerateIdCard from "./GenerateIdCard";
import UploadDoc from "./UploadDoc";
import AssetAllocation from "./asset-allocation/AssetAllocation";
import FileUpload from "@/components/FileUpload";
import toast from "react-hot-toast";
import BankDetails from "./BankDetails";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);
export default function EmpNumber() {
  const pathName = usePathname();
  const [selectedComponent, setSelectedComponent] =
    useState("Personal Details");
  const searchParams = useSearchParams();
  const { setEmpNumber } = useContext(PIMContext);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [file, setFile] = useState("");
  const saveImgRef = useRef(null);

  useEffect(() => {
    const srchprms = searchParams.get("empNumber");
    getPimdata(setFormData, btoa(srchprms), setDocs, pathName);
    setEmpNumber(srchprms);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const menus = {
    "Personal Details": <PersonalDetails />,
    "Contact Details": <ContactDetails />,
    Post: <Post />,
    Salary: <Salary />,
    "Bank Details": <BankDetails />,
    Qualifications: <Qualification />,
    "Offer Letter": (
      <Suspense fallback={<div>Loading...</div>}>
        <OfferLetter />
      </Suspense>
    ),
    "Generate Id Card": <GenerateIdCard />,
    "Asset Allocation": <AssetAllocation />,
    "Upload Documents": <UploadDoc />,
  };

  const { formData, setFormData, setDocs, empNumber } = useContext(PIMContext);

  useEffect(() => {
    if (empNumber) {
      getPimdata(setFormData, btoa(empNumber), setDocs, pathName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empNumber]);

  async function handleImageSave(file, onClose) {
    if (file && file.size <= 1048576) {
      const token = await getCookie("accessToken");
      const fileData = new FormData();
      fileData.append("file", file);
      fileData.append("empNo", formData.staffId);
      fileData.append("fileOf", "USER_IMG");
      (async () => {
        try {
          const response = await fetch(
            `${baseUrl}/api/spshrm/${
              baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
            }/staff/upload/file`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: fileData,
            }
          );
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
          }
          const responsedata = await response.text();
          setFormData((prevData) => ({
            ...prevData,
            staffImg: responsedata,
          }));
          toast.success("Saved Successfully");
          onClose();
        } catch (error) {
          console.error(`Error uploading file`, error);
        }
      })();
    } else {
      toast.error("File is too large or not an image!");
    }
  }

  const getTooltipContent = (ele) => {
    switch (true) {
      case [
        "Offer Letter",
        "Generate Id Card",
        "Asset Allocation",
        "Upload Documents",
      ].includes(ele) && formData.verified === "UNVERIFIED":
        return "Staff Is Not Approved.";
      case [
        "Offer Letter",
        "Generate Id Card",
        "Asset Allocation",
        "Upload Documents",
      ].includes(ele) && !formData?.area?.area:
        return "Area is not selected.";
      case [
        "Offer Letter",
        "Generate Id Card",
        "Asset Allocation",
        "Upload Documents",
      ].includes(ele) && !formData?.desigId:
        return "Designation is not selected.";
      case [
        "Generate Id Card",
        "Asset Allocation",
        "Upload Documents",
      ].includes(ele) && formData.isOfferGenrated === "FALSE":
        return "Offer Letter not Generated";
      case ["Salary"].includes(ele) && formData.isOfferGenrated === "FALSE":
        return "Offer Letter not Generated";
      default:
        return false;
    }
  };

  const isDisabled = (ele) => {
    return (
      [
        "Offer Letter",
        "Generate Id Card",
        "Asset Allocation",
        "Upload Documents",
      ].includes(ele) &&
      (formData.verified === "UNVERIFIED" ||
        !formData?.area?.area ||
        !formData?.desigId ||
        (["Generate Id Card", "Asset Allocation", "Upload Documents"].includes(
          ele
        ) &&
          formData.isOfferGenrated === "FALSE"))
    );
  };

  const handleSaveClick = () => {
    if (saveImgRef.current) {
      saveImgRef.current.savePhoto();
    }
  };

  function handleDocDelete() {
    setFile("");
  }

  return (
    <div className="flex bg-white rounded-2xl h-full">
      <div className="w-1/5 flex flex-col items-center h-inherit gap-5 md:p-4">
        <span className="text-[#8896af] text-base sm:text-sm md:text-lg text-center font-bold">
          {formData.name}
        </span>
        <div className="relative w-2/3">
          <Avatar
            src={
              formData.staffImg
                ? `${baseUrl}/api/v1/spsm/view/STAFF_IMG/${formData.staffImg}`
                : ""
            }
            // src={
            //   formData.staffImg
            //     ? `${baseUrl}/api/spshrm/${
            //         baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
            //       }/spsm/view/STAFF_IMG/${formData.staffImg}`
            //     : ""
            // }
            classNames={{
              img: "absolute top-0 h-fit",
            }}
            style={{ boxShadow: "1px 1px 18px 11px rgba(186,186,202,.6" }}
            className="w-full h-inherit aspect-square shadow-2xl shadow-black"
          />
          <button
            className="absolute bottom-[10px] right-[10px] h-6 w-6 pb-[10px] flex justify-center items-center bg-[#ff7b1d] text-white rounded-full p-[6px] border-2 border-white text-2xl"
            onClick={onOpen}
          >
            {/* <FaSync /> */}+
          </button>
          {/* <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept=".jpg, .png, .gif"
            onChange={handleImageChange}
          /> */}
        </div>
        <aside className="flex flex-col overflow-y-scroll scrollbar-hide h-inherit max-lg:gap-3 w-full">
          {Object.keys(menus).map((ele, i) => {
            return (
              <button
                key={i}
                className={`flex justify-start rounded-lg px-4 items-center lg:py-2 text-xs md:text-[0.85rem] md:font-semibold cursor-pointer text-[#64728c] w-full ${
                  ele === selectedComponent ? "bg-[#e4e1ef]" : "bg-white"
                } ${isDisabled(ele) ? "disabled:text-slate-400" : ""}`}
                onClick={() => setSelectedComponent(ele)}
                disabled={isDisabled(ele)}
              >
                <Tooltip
                  showArrow
                  placement="right"
                  content={getTooltipContent(ele)}
                  classNames={{
                    base: ["before:bg-neutral-400 dark:before:bg-white"],
                    content: [
                      "py-2 px-4 shadow-xl",
                      "text-black bg-gradient-to-br from-white to-[#f50000]",
                    ],
                  }}
                  isDisabled={!getTooltipContent(ele)}
                >
                  {ele}
                </Tooltip>
              </button>
            );
          })}
        </aside>
      </div>
      <Divider orientation="vertical" className="h-inherit" />
      <hr />
      <div className="w-4/5 p-6 h-inherit overflow-y-scroll scrollbar-hide">
        {menus[selectedComponent]}
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex justify-center">
                Upload Image
              </ModalHeader>
              <Divider />
              <ModalBody>
                <FileUpload
                  ref={saveImgRef}
                  buttonText={"Upload from your device"}
                  modalOnClose={onClose}
                  handleDocCapture={() => handleImageSave(file, onClose)}
                  resourceUrl={`${baseUrl}/api/v1/spsm/view/`}
                  description={"Accepts up to 1MB"}
                  file={file}
                  setFile={setFile}
                  handleDocDelete={handleDocDelete}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  className="h-7 rounded-full"
                  color="success"
                  onClick={handleSaveClick}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
