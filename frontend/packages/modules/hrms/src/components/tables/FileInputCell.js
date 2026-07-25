"use client";
import React, { useRef } from "react";
import { getCookie } from "@/utils/cookieUtils";
import { TableCell, Avatar } from "@nextui-org/react";
import { usePathname } from "next/navigation";

const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

const FileInputCell = ({ item, baseUrl }) => {
  const pathName = usePathname();
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 1048576) {
      const token = await getCookie("accessToken");
      const fileData = new FormData();
      fileData.append("file", file);
      fileData.append("empNo", item.staffId);
      fileData.append("fileOf", "USER_IMG");
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
      } catch (error) {
        console.error("Error uploading file", error);
      }
    } else {
      alert("File is too large or not an image!");
    }
  };

  return (
    <TableCell className={`text-center ${item.error ? "text-red-500" : ""}`}>
      <div className="relative">
        <Avatar
          src={
            item.staffImg
              ? `${baseUrl}/api/v1/spsm/view/STAFF_IMG/${item.staffImg}`
              : ""
          }
          classNames={{ img: "absolute top-0 h-fit" }}
        />
        <button
          style={{ padding: "3px 5px 6px 6px" }}
          className="absolute bottom-[3px] right-[2px] h-2 w-2 flex justify-center items-center bg-[#ff7b1d] text-white rounded-full  border-2 border-white"
          onClick={handleButtonClick}
        >
          +
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept=".jpg, .png, .gif"
          onChange={handleImageChange}
        />
      </div>
    </TableCell>
  );
};

export default FileInputCell;
