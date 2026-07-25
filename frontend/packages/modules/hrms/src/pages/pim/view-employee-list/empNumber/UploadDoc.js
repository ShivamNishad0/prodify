"use client";
import React, { useContext } from "react";
import { Button, Divider } from "@nextui-org/react";
import FileUpload from "@/components/FileUpload";
import PIMContext from "@/context/PIMProvider";
import { getCookie } from "@/utils/cookieUtils";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

export default function UploadDoc() {
  const pathName = usePathname();
  const { docs, setDocs, empNumber, formData } = useContext(PIMContext);

  const handleDoc = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      setDocs((prevState) => ({
        ...prevState,
        [name]: file,
      }));
    }
  };

  const handleDocDelete = (fileKey) => {
    setDocs((prevState) => ({
      ...prevState,
      [fileKey]: null,
    }));
  };

  const fileUploadProps = [
    {
      fileKey: "addharFrontDoc",
      title: "Aadhar Front Page",
    },
    {
      fileKey: "addharBackDoc",
      title: "Aadhar Back Page",
    },
    {
      fileKey: "bankDoc",
      title: "Bank Details",
    },
    {
      fileKey: "panFrontDoc",
      title: "Pan Card Front",
    },
    {
      fileKey: "panBackDoc",
      title: "Pan Card Back",
    },
    {
      fileKey: "characterDoc",
      title: "Character Certificate",
    },
    {
      fileKey: "dlFrontDoc",
      title: "Driving Licence Front",
    },
    {
      fileKey: "dlBackDoc",
      title: "Driving Licence Back",
    },
  ];

  const docNames = {
    bankDoc: "BANK",
    addharBackDoc: "AADHAR_BACK",
    addharFrontDoc: "AADHAR_FRONT",
    panBackDoc: "PAN_BACK",
    panFrontDoc: "PAN_FRONT",
    characterDoc: "CHARACTER",
    dlFrontDoc: "DL_FRONT",
    dlBackDoc: "DL_BACK",
  };

  async function handleSave() {
    const token = await getCookie("accessToken");
    const uploadPromises = Object.keys(docNames).map(async (fileOf) => {
      if (docs[fileOf] && typeof docs[fileOf] !== "string") {
        const fileData = new FormData();
        fileData.append("file", docs[fileOf]);
        fileData.append("empNo", empNumber);
        fileData.append("fileOf", docNames[fileOf]);

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
          return response.text();
        } catch (error) {
          console.error(`Error uploading file ${fileOf}:`, error);
          throw error;
        }
      }
    });

    try {
      await Promise.all(uploadPromises);
      toast.success("Files uploaded successfully");
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  }

  async function handleImageSave(fileKey, file) {
    if (file && file.size <= 1048576) {
      const token = await getCookie("accessToken");
      const fileData = new FormData();
      fileData.append("file", file);
      fileData.append("empNo", formData.staffId);
      fileData.append("fileOf", fileKey);
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
          setDocs((prevData) => ({
            ...prevData,
            fileKey: responsedata,
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

  return (
    <div className="flex flex-col justify-between h-full gap-4">
      <div className="flex flex-col gap-4">
        <div className="text-[#8896af] text-lg font-bold">Documents</div>
        <Divider />
        <div className="grid grid-cols-3 gap-4">
          {fileUploadProps.map((props) => (
            <FileUpload
              key={props.fileKey}
              fileKey={props.fileKey}
              fileData={docs[props.fileKey]}
              title={props.title}
              handleFileUpload={handleDoc}
              setFile={setDocs}
              handleDocDelete={handleDocDelete}
              resourceUrl={`${baseUrl}/api/v1/spsm/view/`}
              description={"Accepts up to 1MB"}
              handleDocCapture={handleImageSave}
            />
          ))}
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
