"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  useDisclosure,
} from "@nextui-org/react";
import { FaPeopleGroup } from "react-icons/fa6";
import { FaRegIdCard } from "react-icons/fa";
import { SlEnvolopeLetter } from "react-icons/sl";
import { MdVerified } from "react-icons/md";
import { getCookie } from "@/utils/cookieUtils";
import { getData } from "@/utils/api";
import { getAllArea, getDesgnData } from "@/utils/getDesgnData";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import DashboardListModal from "@/pages/DashboardListModal";
import { usePathname } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

export default function HOReport() {
  const pathName = usePathname();
  const [datas, setDatas] = useState([]);
  const [desgn, setDesgn] = useState([]);
  const [areas, setAreas] = useState([]);
  const [modalData, setModalData] = useState({
    title: "",
    data: [],
    region: "",
  }); // State to hold the data for the modal

  const areaList = useCallback(
    () => getAllArea(setAreas, pathName, setAreas),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const desgnData = useCallback(() => getDesgnData(setDesgn, pathName), []);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    desgnData();
    areaList();
  }, [desgnData, areaList]);

  const [area, setArea] = useState({
    area: [],
    circle: [],
    division: [],
    subDivision: [],
  });

  useEffect(() => {
    (async () => {
      const token = await getCookie("accessToken");
      const response = await getData(
        `${baseUrl}/api/spshrm/${
          baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
        }/staff/temp-api/all`,
        token
      );
      setDatas(response);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const areaSet = new Set();
    const circleSet = new Set();
    const divisionSet = new Set();
    const subDivisionSet = new Set();

    areas.forEach(({ location }) => {
      if (location !== "DETAILED") {
        areaSet.add(location);
        circleSet.add(location);
        divisionSet.add(location);
        subDivisionSet.add(location);
      }
    });

    setArea({
      area: [...areaSet],
      circle: [...circleSet],
      division: [...divisionSet],
      subDivision: [...subDivisionSet],
    });
  }, [areas]);

  const metrics = [
    {
      label: "Total Number Of Employees",
      key: "postOf",
      value: "TRUE",
      icon: FaPeopleGroup,
    },
    {
      label: "ID Cards issued",
      key: "isIdGenrated",
      value: "TRUE",
      icon: FaRegIdCard,
    },
    {
      label: "Offer Letter issued",
      key: "isOfferGenrated",
      value: "TRUE",
      icon: SlEnvolopeLetter,
    },
    {
      label: "Police Verification Completed",
      key: "isCharaterVerified",
      value: "TRUE",
      icon: MdVerified,
    },
  ];

  const counts = area.area.reduce((acc, areaName) => {
    acc[areaName] = metrics.reduce((metricAcc, metric) => {
      metricAcc[metric.label] = {
        value: [],
        postCounts: desgn.reduce((postAcc, post) => {
          postAcc[post.desigName] = [];
          return postAcc;
        }, {}),
      };
      return metricAcc;
    }, {});
    acc[areaName]["Total Number Of Employees"] = {
      value: [],
      postCounts: desgn.reduce((postAcc, post) => {
        postAcc[post.desigName] = [];
        return postAcc;
      }, {}),
    };
    return acc;
  }, {});

  Array.isArray(datas) &&
    datas.length &&
    datas.forEach((ele) => {
      const post = desgn.find(
        (item) => item.desigId.toString() === ele?.desigId?.toString()
      )?.desigName;

      if (ele.area?.area) {
        const areaName = ele.area.area;

        if (ele.desigId) {
          counts[areaName] &&
            counts[areaName]["Total Number Of Employees"].value.push(ele);
          if (post) {
            counts[areaName] &&
              counts[areaName]["Total Number Of Employees"].postCounts[
                post
              ].push(ele);
          }
        }

        metrics.forEach((metric) => {
          if (ele[metric.key] === metric.value) {
            counts[areaName] && counts[areaName][metric.label].value.push(ele);
            if (post) {
              counts[areaName] &&
                counts[areaName][metric.label].postCounts[post].push(ele);
            }
          }
        });
      }
    });

  const data = metrics.flatMap((metric) =>
    area.area.map((areaName) => {
      return {
        icon: metric.icon,
        label: `${metric.label} in ${areaName}`,
        value: counts[areaName][metric.label].value,
        ...counts[areaName][metric.label].postCounts,
      };
    })
  );

  const exportToExcel = async (item) => {
    const areaName = item.label.split(" ").pop(); // Assuming the last word of the label is the area name

    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Add Title in Row 1
    worksheet.mergeCells("A1", "B1"); // Merge cells A1 and B1
    const titleCell = worksheet.getCell("A1");
    titleCell.value = `Total Number Of Employees in ${areaName}`;
    titleCell.font = { bold: true }; // Make it bold
    titleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "0070C0" },
    };
    titleCell.alignment = { horizontal: "center" }; // Center align

    // Add Column Headers in Row 2
    worksheet.getCell("A2").value = "Metric";
    worksheet.getCell("B2").value = "Value";

    // Apply styles (bold and center alignment) to Row 2
    worksheet.getCell("A2").font = { bold: true };
    worksheet.getCell("B2").font = { bold: true };
    worksheet.getCell("A2").alignment = { horizontal: "center" }; // Center align
    worksheet.getCell("B2").alignment = { horizontal: "center" }; // Center align

    // Prepare data for rows (starting from row 3)
    const dataForSheet = [
      ...Object.entries(item)
        .filter(([key]) => {
          return (
            key !== "label" &&
            key !== "value" &&
            key !== "icon" &&
            key !== "region"
          );
        })
        .map(([key, value]) => ({
          Metric: key,
          Value: value.length,
        })),
    ];

    // Add data to the sheet from row 3 onwards
    dataForSheet.forEach((row, index) => {
      worksheet.addRow([row.Metric, row.Value]);
    });

    // Adjust column widths
    worksheet.columns = [
      { key: "Metric", width: 30 },
      { key: "Value", width: 20 },
    ];

    // Export workbook as an Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    const fileName = `${item.label.replace(/[^a-zA-Z0-9]/g, "_")}.xlsx`;
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, fileName);
  };

  const handleOpenModal = (data, title) => {
    data.forEach((ele) => {
      const post = desgn.find(
        (item) => item.desigId.toString() === ele?.desigId?.toString()
      )?.desigName;
      ele.post = post;
    });
    setModalData({ title: title, data: data });
    onOpen();
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-4 h-full">
        {data.map((item, index) => (
          <Card key={index} className="bg-gray-100 hover:shadow-lg h-full">
            <CardBody className="flex items-center justify-center">
              <div className="flex flex-col items-center w-full text-center font-semibold text-black h-64 overflow-y-scroll scrollbar-hide">
                <div className="flex gap-3 items-center">
                  <item.icon size={30} className="text-blue-500" />
                  <div className="text-md font-bold">{item.label}</div>:
                  <div className="text-md font-bold text-blue-700">
                    {item.value.length}
                  </div>
                </div>
                {desgn.map((post) => (
                  <div
                    key={post.desigName}
                    className="flex gap-3 w-full justify-between items-center"
                  >
                    <button
                      className="text-sm"
                      onClick={() =>
                        handleOpenModal(
                          item[post.desigName],
                          `Total Number Of ${post.desigName}`
                        )
                      }
                    >
                      {post.desigName}
                    </button>
                    <div className="text-sm text-blue-700 w-8 items-center flex justify-between">
                      <span>:</span>
                      <div>{item[post.desigName].length}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
            <CardFooter className="justify-evenly flex">
              <Button
                onClick={() => exportToExcel(item)}
                color="primary"
                className="h-7"
              >
                Export to Excel
              </Button>
              <Button
                color="primary"
                className="h-7"
                onClick={() => handleOpenModal(item.value, item.label)}
              >
                View
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <DashboardListModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        data={modalData} // Pass the data to the modal
      />
    </>
  );
}
