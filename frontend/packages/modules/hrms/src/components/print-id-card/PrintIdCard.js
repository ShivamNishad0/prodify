"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@nextui-org/react";
import { getCookie } from "@/utils/cookieUtils";
import { useReactToPrint } from "react-to-print";
import { toPng } from "html-to-image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import "./PrintIdCard.css";
import { getDesgnData } from "@/utils/getDesgnData";
import IDCard from "./IDCard";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

export default function PrintIdCard() {
  const pathName = usePathname();
  const printRef = useRef();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState([]);
  const [desgn, setDesgn] = useState([]);

  useEffect(() => {
    getUserData();
    desgnData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const desgnData = useCallback(
    () => getDesgnData(setDesgn, pathName),
    [pathName]
  );

  async function getUserData() {
    try {
      const token = await getCookie("accessToken");
      const dataParam = JSON.parse(searchParams.get("data"));
      const url = new URL(
        `${baseUrl}/api/spshrm/${
          baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
        }/id/emp-idcards/${dataParam.join(",")}`
      );

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });
      const data = await response.json();
      setData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const exportToPng = async () => {
    const idCards = document.querySelectorAll(".idCard");
    const scale = 2; // Scale factor for higher resolution

    idCards.forEach(async (card, index) => {
      try {
        // Temporarily adjust the line-height for the `.post` class
        const postElements = card.querySelectorAll(".post");
        postElements.forEach((post) => {
          post.style.lineHeight = "1.2"; // Adjust the value as needed
        });

        const width = card.offsetWidth;
        const height = card.offsetHeight;

        const dataUrl = await toPng(card, {
          quality: 1,
          canvasWidth: width * scale,
          canvasHeight: height * scale,
          pixelRatio: scale, // Ensures a higher DPI rendering
        });

        // Reset the line-height for `.post` after generating the PNG
        postElements.forEach((post) => {
          post.style.lineHeight = ""; // Reset to default or remove inline style
        });

        // Create and download the image
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `id_card_${index + 1}.png`;
        link.click();
      } catch (error) {
        console.error("Failed to export ID card as PNG:", error);
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4 items-center">
      <div className="flex justify-evenly w-full">
        <Button
          onPress={() => router.back()}
          color="warning"
          className="h-8 rounded-full text-white"
        >
          Back
        </Button>
        <Button
          onPress={handlePrint}
          color="primary"
          className="h-8 rounded-full"
        >
          Print ID Cards
        </Button>
        <Button
          onPress={exportToPng}
          color="success"
          className="h-8 rounded-full"
        >
          Export as PNG
        </Button>
      </div>
      <div
        id="printArea"
        ref={printRef} // Attach the ref to the root element
        className="printable grid grid-cols-2 gap-4 mx-auto w-full"
      >
        <IDCard data={data} desgn={desgn} />
      </div>
    </div>
  );
}
