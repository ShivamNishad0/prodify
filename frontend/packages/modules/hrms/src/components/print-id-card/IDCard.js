import React, { useCallback, useEffect, useState } from "react";
import { Avatar } from "@nextui-org/react";
import { getAllArea } from "@/utils/getDesgnData";
import { usePathname } from "next/navigation";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
import { QRCodeSVG } from "qrcode.react"; // ✅ use SVG version

const IDCard = ({ data, desgn }) => {
  const pathName = usePathname();
  const [area, setArea] = useState("");
  const [location, setLocation] = useState("");
  const [division, setDivision] = useState("");

  const areaData = useCallback(
    () => getAllArea(setArea, pathName, setLocation),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    areaData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!data?.length || !area?.length) {
      setDivision("");
      return;
    }

    const normalize = (v) =>
      v === null || v === undefined ? "" : String(v).trim().toLowerCase();

    const locVal =
      typeof location === "object" && location !== null
        ? normalize(location.location ?? location.name ?? location)
        : normalize(location);

    const isValidLocation = locVal && locVal !== "detailed" && locVal !== "a";
    const empAreaId = Number(data[0]?.areaId);

    let matched =
      isValidLocation &&
      area.find((a) =>
        [
          String(a.circle ?? "").toLowerCase(),
          String(a.area ?? "").toLowerCase(),
          String(a.areaId),
        ].includes(locVal)
      );

    if (!matched) {
      matched = area.find((a) => Number(a.areaId) === empAreaId);
    }

    if (matched) {
      setDivision(matched.circle ?? matched.area ?? String(matched.areaId));
    } else {
      setDivision("");
    }
  }, [data, area, location]);

  return (
    data?.length > 0 &&
    data.map((ele, i) => {
      if (!ele) return null;
      return (
        <div
          key={i}
          id={`idCardFront-${i}`}
          data-areaid={ele.areaId}
          data-empno={ele.empNo}
          className="idCard bg-white dark:bg-zinc-800 shadow-lg rounded-lg overflow-hidden relative w-full aspect-[16/10]"
          style={{
            backgroundImage: `url('/BijliIDFront.png')`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center center",
            backgroundSize: "cover",
          }}
        >
          {/* Avatar */}
          <div className="absolute grid-col bg-cover bg-center w-full h-full">
            <div className="absolute top-[43.1%] left-[12.5%] w-[22%] h-[40%]">
              <Avatar
                className="profileImage h-full w-full"
                radius="none"
                src={
                  ele?.staffImg
                    ? `${baseUrl}/api/v1/spsm/view/STAFF_IMG/${ele.staffImg}`
                    : ""
                }
              />
            </div>
          </div>

          {/* Name */}
          <div className="absolute top-[62%] left-[53.2%] w-[46.8%] h-[6%] leading-[10px] flex justify-center items-center text-sm uppercase font-semibold name text-black bg-white p-1">
            <p>{ele.name}</p>
          </div>

          {/* Post + Division */}
          <div className="post absolute top-[68%] text-black bg-white left-[53.2%] w-[46.8%] h-[6%] leading-[10px] flex justify-center text-sm uppercase font-semibold">
            {(() => {
              const name = desgn?.find(
                (d) => parseFloat(d.desigId) === parseFloat(ele.post)
              )?.desigName;

              if (!name) return "";

              const words = name.trim().split(/\s+/);
              return words.length > 2
                ? words.map((w) => w[0].toUpperCase()).join("")
                : name;
            })()}{" "}
            ({division})
          </div>

          {/* Details */}
          <div className="absolute top-[85.4%] leading-[14px] left-[1.2%] flex justify-center w-[44%] h-auto">
            <div className="details flex flex-col capitalize items-center justify-center text-[12px] font-semibold text-black bg-white w-fit px-4">
              <p>Contact No: {ele.mobNo}</p>
              <p>
                Valid Upto:{" "}
                {new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
                  .toLocaleDateString("en-GB")
                  .replace(/\//g, "-")}
              </p>
              <p>Employee ID: {ele.empNo}</p>
            </div>
          </div>

          {/* QR Code (SVG) */}
          <div
            className="absolute flex justify-center items-center"
            style={{
              top: "23%",
              left: "78%",
              height: "30%",
              width: "19%",
            }}
          >
            <QRCodeSVG
              value={JSON.stringify({
                name: ele.name,
                empNo: ele.empNo,
                mobNo: ele.mobNo,
                validUpto: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
                  .toLocaleDateString("en-GB")
                  .replace(/\//g, "-"),
                division: division,
              })}
              style={{ height: "100%", width: "100%" }} // ✅ fits container
              level="H"
              bgColor="#ffffff"
              fgColor="#000000"
              marginSize={2}
              title="Employee QR Code"
            />
          </div>
        </div>
      );
    })
  );
};

export default IDCard;
