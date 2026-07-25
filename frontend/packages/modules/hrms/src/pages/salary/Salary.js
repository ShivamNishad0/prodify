"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Select,
  SelectItem,
  Switch,
  Tooltip,
  useDisclosure,
  Modal,
  ModalContent,
  ModalBody,
} from "@nextui-org/react";

import { getCookie } from "@/utils/cookieUtils";
import { FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";
import { GrEdit } from "react-icons/gr";
import SalaryModal from "./SalaryModal";
import { fetcher } from "@/utils/fetcher";
import useSWR, { mutate } from "swr";
import {
  createNestedStructure,
  months,
  salaryExcelHeaders,
} from "@/utils/constant";
import { getData, postData } from "@/utils/api";
import ExcelJS from "exceljs";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import jsPDF from "jspdf";
import RTGSLetter from "./RTGSLetter";
import { getDesgnData } from "@/utils/getDesgnData";
const AsyncPaginateTable = dynamic(
  () => import("@/components/tables/AcyncPaginateTable"),
  {
    ssr: false,
  }
);

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

const columns = [
  { key: "staffName", value: "Name" },
  { key: "empNo", value: "Employee No" },
  { key: "basic", value: "Basic & DA" },
  { key: "hra", value: "HRA" },
  { key: "conv_or_Other", value: "Convinence/Others" },
  { key: "gross", value: "Gross" },
];

const currentDate = new Date();
currentDate.setMonth(currentDate.getMonth() - 1);
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate
  .toLocaleString("default", { month: "long" })
  .toUpperCase();

export default function Salary() {
  const pathName = usePathname();
  const [search, setSearch] = useState("");
  const [zone, setZone] = useState("");
  const [page, setPage] = useState(1);
  const [selectedStaff, setSelectedStaff] = useState({
    basic: 0.0,
    zoneId: "",
    hra: 0.0,
    conv_oth: 0.0,
    da: 0.0,
    gross: 0.0,
    staffId: "",
    scale: 0.0,
    pfStatus: "FALSE",
    pfPercent: 0.0,
    esiStatus: "FALSE",
    esiPercent: 0.0,
    pfUAN_NO: "",
    esiNo: "",
  });
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [selectedMonth, setSelectedMonth] = useState(new Set([currentMonth]));
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [isVerified, setIsVerified] = useState(false);
  const [allEmpList, setAllEmpList] = useState("");
  const [loading, setLoading] = useState(false);
  const [userRoles, setUserRoles] = useState("");
  const [selection, setSelection] = useState({
    area: "",
    circle: "",
    division: "",
    subDivision: "",
  });
  const [areas, setAreas] = useState("");
  const [areaIdList, setAreaIdList] = useState([]);
  const [desgn, setDesgn] = useState([]);
  const [desigId, setDesigId] = useState("");

  const {
    isOpen: isFirstModalOpen,
    onOpen: onFirstModalOpen,
    onClose: onFirstModalClose,
    onOpenChange: onFirstOpenChange,
  } = useDisclosure();
  const {
    isOpen: isSecondModalOpen,
    onOpen: onSecondModalOpen,
    onClose: onSecondModalClose,
    onOpenChange: onSecondOpenChange,
  } = useDisclosure();

  useEffect(() => {
    (async () => {
      const zone = await getCookie("zone");
      const userData = await getCookie("user");
      setUserRoles(JSON.parse(userData).roles);
      setZone(zone);
    })();
    areaList();
    getDesgnData(setDesgn, pathName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const areaList = useCallback(
    // () => getAllArea(setAreas, pathName, setAreas),
    async () => {
      const zoneCookie = await getCookie("zone");
      const token = await getCookie("accessToken");
      const response = await fetch(
        `${baseUrl}/api/spshrm/${
          baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
        }/area/all?zoneId=${JSON.parse(zoneCookie)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const contentType = response.headers.get("Content-Type");
        if (contentType && contentType.includes("application/json")) {
          const responseData = await response.json();
          if (Array.isArray(responseData) && responseData.length > 0) {
            setAreas(responseData);
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (isVerified) {
      // Remove the "action" column if present
      const actionIndex = columns.findIndex(
        (column) => column.key === "action"
      );
      if (actionIndex !== -1) {
        columns.splice(actionIndex, 1);
      }
    } else {
      // Add the "action" column only if it doesn't already exist
      const actionExists = columns.some((column) => column.key === "action");
      if (!actionExists) {
        columns.push({ key: "action", value: "Action" });
      }
    }
    setSelectedKeys(new Set([]));
  }, [isVerified]);

  useEffect(() => {
    if (selectedYear.toString().length === 4 && [...selectedMonth][0]) {
      getAllempList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear, selectedMonth, isVerified, desigId, areaIdList, search]);

  async function getAllempList() {
    const token = await getCookie("accessToken");
    const zoneCookie = await getCookie("zone");
    const response = await getData(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/payroll/emp-salary-details?month=${
        [...selectedMonth][0]
      }&year=${selectedYear}&type=${isVerified ? "VERIFIED" : "UNVERIFIED"}${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]] === "bijli"
          ? `&desigId=${[...desigId][0] || 0}`
          : ""
      }&req=${"SLR"}&zoneId=${JSON.parse(zoneCookie)}${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]] === "suda" ||
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]] === "rmc" ||
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]] === "bijli"
          ? `&area_id=${areaIdList}`
          : ""
      }`,
      token
    );

    if (Array.isArray(response) && response.length) {
      response?.sort((a, b) => a.empNo.localeCompare(b.empNo));
      setAllEmpList(response);
    }
  }

  const resourceUrl = useMemo(() => {
    if (selectedYear.toString().length === 4 && [...selectedMonth][0]) {
      if (search.length > 3) {
        return `${baseUrl}/api/spshrm/${
          baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
        }/payroll/search-details?emp_no=${search}&month=${
          [...selectedMonth][0]
        }&year=${selectedYear}&type=SLR`;
      }
      return `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/payroll/all-salary-list?zoneId=1&month=${
        [...selectedMonth][0]
      }&year=${selectedYear}&type=${
        isVerified ? "VERIFIED" : "UNVERIFIED"
      }&desigId=${[...desigId][0] || 0}&req=${"SLR"}${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]] === "bijli"
          ? `&area_id=${areaIdList}`
          : ""
      }&page=${page - 1}&size=20`;
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedYear,
    selectedMonth,
    search,
    zone,
    desigId,
    areaIdList,
    isVerified,
    page,
  ]);

  const { data, isLoading } = useSWR(resourceUrl, fetcher, {
    keepPreviousData: true,
  });

  const loadingState = isLoading || data?.length === 0 ? "loading" : "idle";
  isLoading || data?.length === 0 ? "loading" : "idle";

  const actionButtons = [
    {
      name: "Edit",
      action: (row) => {
        onFirstModalOpen();
        const modifiedRow = { ...row };
        for (const key in modifiedRow) {
          if (modifiedRow[key] === null) {
            modifiedRow[key] = "";
          }
        }
        setSelectedStaff(modifiedRow);
      },
      iconOnly: true,
      icon: <GrEdit size={25} color="#F7E027" />,
    },
  ];

  const filteredData = useMemo(() => {
    if (!data?.results?.length) return { ...data, results: [] };

    const filteredResults = data.results
      .filter((item) => {
        // Filter based on the isVerified state
        return isVerified
          ? item.status === "VERIFIED"
          : item.status === "UNVERIFIED";
      })
      .sort((a, b) => a.empNo.localeCompare(b.empNo)); // Sort the filtered results

    return { ...data, results: filteredResults };
  }, [data, isVerified]);

  async function handleApproveSalary() {
    const userCookie = await getCookie("user");
    const token = await getCookie("accessToken");
    const user = await JSON.parse(userCookie);
    let payload = [];

    if (selectedKeys === "all") {
      // Map the results to convert elements to integers
      payload = filteredData.results.map((ele) => parseInt(ele.ssdId, 10));
    } else {
      payload = [...selectedKeys].map((ele) => parseInt(ele, 10));
    }

    const response = await postData(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/payroll/verify?userId=${user.id}`,
      { salaryDetId: payload },
      token
    );

    if (response) {
      mutateData();
      if (selectedKeys === "all") setIsVerified(true);
      toast.success("Save Successfully");
    }
  }

  async function mutateData() {
    mutate(resourceUrl);
  }

  const exportToExcel = async (option, sheetData) => {
    const filteredOnHoldData = sheetData.filter((ele) => {
      return ele.onHold.toLowerCase() === "false";
    });
    const isAccountant = !!(
      Array.isArray(userRoles) &&
      userRoles.find((ele) => ele.name === "ACCOUNTANT")
    );

    const location = areas?.find(
      (ele) => ele.areaId.toString() === areaIdList.toString()
    )?.location;

    const region =
      pathName.split("/")[pathName.includes("/hrms") ? 3 : 1] === "bijli"
        ? (selection.subDivision ||
            selection.division ||
            selection.circle ||
            selection.area) +
          ((desgn.length &&
            [...desigId][0] &&
            +" " +
              desgn.find(
                (ele) => ele.desigId.toString() === [...desigId][0]?.toString()
              )?.desigName) ||
            "")
        : location
        ? location
        : "";

    salaryExcelHeaders[0][0] = `Nature of work: ${Object.entries(baseZone)
      .find((ele) => ele[0] === pathName.split("/")[pathName.includes("/hrms") ? 3 : 1])[0]
      .toUpperCase()
      .replace("-", " ")} ${region ? "(" + region + ")" : ""}`;

    salaryExcelHeaders[2][5] = `${[...selectedMonth][0]}-${selectedYear}`;

    let sheetName = "";
    const monthIndex = months[[...selectedMonth][0].toUpperCase()];
    const daysInMonth = new Date(selectedYear, monthIndex + 1, 0).getDate();

    let worksheetData = [];
    let merges = [];

    const excelHeaders = JSON.parse(JSON.stringify(salaryExcelHeaders));

    if (option === "withoutDetails") {
      excelHeaders[1][2] = "No. of Days during Month:";
      excelHeaders[1][11] = daysInMonth.toString();

      const modifiedHeaders = excelHeaders.map((row, i) => {
        if (i === 2) {
          return row.filter((_, index) => ![6, 7, 8].includes(index));
        } else {
          return row.filter((_, index) => ![3, 4, 5, 6].includes(index));
        }
      });

      if (baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]] === "bhilai") {
        const deductionIndex = modifiedHeaders[4].indexOf("Prev Settl Amt");
        modifiedHeaders[4].splice(deductionIndex + 1, 0, "Mobile Allowance");
        modifiedHeaders[4].splice(
          deductionIndex + 1,
          0,
          "Incentive Field Staff"
        );
      }

      worksheetData = [
        ...modifiedHeaders,
        ...filteredOnHoldData.map((item, index) => {
          const row = [
            index + 1,
            item.staffName,
            item.empNo,
            parseFloat(item.noOfDayPresent || 0) +
              Math.floor(parseFloat(item.noOfHalfDay) / 2 || 0) +
              parseFloat(item.noOfHoliday || 0) +
              parseFloat(item.noOfPaidLeave || 0) +
              parseFloat(item.noOfWO || 0),
            parseFloat(item.basic),
            item.hra,
            item.conv_or_Other,
            item.gross,
            item.empPF,
            item.empESI,
            item.tds,
            item.other,
            item.otherRemark,
            item.dedOfEmpShare,
            item.deduction,
            parseFloat(item.setteled_Adv_Amt || 0),
            item.prevSetldAmt,
            parseFloat(item.netPaid) -
              parseFloat(item.setteled_Adv_Amt || 0) +
              parseFloat(item.prevSetldAmt || 0) || 0,
            item.pfUAN_NO, // PF UAN No.
            item.esiNo, // ESI No.
          ];
          // Add `item.security` after `item.Prev Settl Amt` if the path matches "bhilai"
          if (pathName.split("/")[pathName.includes("/hrms") ? 3 : 1] === "bhilai") {
            const deductionIndex = modifiedHeaders[4].indexOf("Prev Settl Amt");
            row.splice(deductionIndex + 1, 0, item.mobileAllowances); // Insert `mobileAllowances` after `item.Prev Settl Amt`
            row.splice(deductionIndex + 1, 0, item.incentive); // Insert `item.incentive` after `item.Prev Settl Amt`
          }

          return row;
        }),
      ];

      merges = [
        { start: { row: 1, col: 1 }, end: { row: 1, col: 18 } },
        { start: { row: 2, col: 3 }, end: { row: 2, col: 5 } },
        { start: { row: 2, col: 6 }, end: { row: 2, col: 7 } },
        { start: { row: 3, col: 3 }, end: { row: 3, col: 5 } },
        { start: { row: 3, col: 6 }, end: { row: 3, col: 7 } },
        { start: { row: 4, col: 2 }, end: { row: 4, col: 3 } },
        { start: { row: 4, col: 5 }, end: { row: 4, col: 8 } },
        { start: { row: 4, col: 9 }, end: { row: 4, col: 13 } },
      ];
      sheetName = `${region.toUpperCase() ?? "_"}${
        [...selectedMonth][0]
      }_${selectedYear}_Salary_Sheet.xlsx`;
    } else {
      excelHeaders[1][9] = daysInMonth.toString();
      excelHeaders[1].splice(2, 4); // Adjust headers for details
      if (baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]] === "bhilai") {
        const deductionIndex = excelHeaders[4].indexOf("Prev Settl Amt");
        excelHeaders[4].splice(deductionIndex + 1, 0, "Mobile Allowance");
        excelHeaders[4].splice(deductionIndex + 1, 0, "Incentive Field Staff");
      }
      worksheetData = [
        ...excelHeaders,
        ...filteredOnHoldData.map((item, index) => {
          const row = [
            index + 1,
            item.staffName,
            item.empNo,
            parseFloat(item.strcBasic) + parseFloat(item.strcDa),
            item.strcHRA,
            item.strcConv_oth,
            item.strcGross,
            parseFloat(item.noOfDayPresent || 0) +
              Math.floor(parseFloat(item.noOfHalfDay) / 2 || 0) +
              parseFloat(item.noOfHoliday || 0) +
              parseFloat(item.noOfPaidLeave || 0) +
              parseFloat(item.noOfWO || 0),
            parseFloat(item.basic),
            item.hra,
            item.conv_or_Other,
            item.gross,
            item.empPF,
            item.empESI,
            item.tds,
            item.other,
            item.otherRemark,
            item.dedOfEmpShare,
            item.deduction,
            parseFloat(item.setteled_Adv_Amt || 0),
            item.prevSetldAmt,
            parseFloat(item.netPaid) -
              parseFloat(item.setteled_Adv_Amt || 0) +
              parseFloat(item.prevSetldAmt || 0) || 0,
            item.pfUAN_NO, // PF UAN No.
            item.esiNo, // ESI No.
          ];

          // Add `item.security` after `item.Prev Settl Amt` if the path matches "bhilai"
          if (pathName.split("/")[pathName.includes("/hrms") ? 3 : 1] === "bhilai") {
            const deductionIndex = excelHeaders[4].indexOf("Prev Settl Amt");
            row.splice(deductionIndex + 1, 0, item.mobileAllowances); // Insert `mobileAllowances` after `item.Prev Settl Amt`
            row.splice(deductionIndex + 1, 0, item.incentive); // Insert `item.incentive` after `item.Prev Settl Amt`
          }

          return row;
        }),
      ];

      merges = [
        { start: { row: 1, col: 1 }, end: { row: 1, col: 23 } },
        { start: { row: 2, col: 3 }, end: { row: 2, col: 5 } },
        { start: { row: 2, col: 6 }, end: { row: 2, col: 7 } },
        { start: { row: 3, col: 3 }, end: { row: 3, col: 5 } },
        { start: { row: 3, col: 6 }, end: { row: 3, col: 7 } },
        { start: { row: 4, col: 2 }, end: { row: 4, col: 3 } },
        { start: { row: 4, col: 4 }, end: { row: 4, col: 7 } },
        { start: { row: 4, col: 9 }, end: { row: 4, col: 12 } },
        { start: { row: 4, col: 13 }, end: { row: 4, col: 19 } },
      ];
      sheetName = `${region.toUpperCase() ?? "_"}${
        [...selectedMonth][0]
      }_${selectedYear}_Salary_Sheet_With_Details.xlsx`;
    }

    // Compute the totals for each numeric column
    const totalsRow = new Array(worksheetData[0].length).fill(null);
    totalsRow[1] = "Total"; // Label the total row

    worksheetData.forEach((row, rowIndex) => {
      if (rowIndex >= 5) {
        // Adjust according to the option
        row.forEach((value, index) => {
          if (index > 2) {
            // Assuming numeric columns start from index 3
            const numValue = parseFloat(value);
            if (!isNaN(numValue)) {
              if (totalsRow[index] === null) {
                totalsRow[index] = 0;
              }
              totalsRow[index] += numValue;
            }
          }
        });
      }
    });

    if (option === "withoutDetails") totalsRow[3] = "";
    else totalsRow[7] = "";
    worksheetData.push(totalsRow); // Add total row to worksheet data

    // Create a new workbook and add a worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Salary Sheet");

    // Add worksheet data
    worksheetData.forEach((row, rowIndex) => {
      const newRow = worksheet.addRow(row);

      // Ensure all cells are initialized, even null ones
      for (let colNumber = 1; colNumber <= row.length; colNumber++) {
        let cell = newRow.getCell(colNumber);

        // If cell is null or undefined, it will still get a border
        if (cell.value === null || cell.value === undefined) {
          cell.value = null; // Ensure it gets initialized
        }

        // Apply border to each cell
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      }
    });

    // Set the width of columns to fit the content
    worksheet.columns.forEach((column, i) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
        if (rowNumber > 5) {
          let cellValue = cell.value;
          if (typeof cellValue === "number") {
            // Convert to string with 2 decimal places if it's a number
            cellValue = cellValue.toFixed(2);
          } else {
            cellValue = cellValue ? cellValue.toString() : ""; // Ensure we get string length
          }
          maxLength = Math.max(maxLength, cellValue.length);
        }
      });
      column.width = maxLength + 2; // Adding extra padding for better visibility
    });

    // Apply center alignment and bold font to rows 1 to 5
    for (let rowIndex = 1; rowIndex <= 5; rowIndex++) {
      worksheet.getRow(rowIndex).eachCell((cell) => {
        cell.alignment = { vertical: "middle", horizontal: "center" };
        cell.font = { bold: true }; // Apply bold font to cells in rows 1-5
        if (rowIndex === 5) {
          cell.alignment = {
            textRotation: 90,
            vertical: "middle",
            horizontal: "center",
          }; // 90 degrees rotation for vertical text
        }
      });
    }

    // Set merges for the worksheet
    merges.forEach((merge) => {
      worksheet.mergeCells(
        merge.start.row,
        merge.start.col,
        merge.end.row,
        merge.end.col
      );
    });

    // Export to Excel if isAccountant is true
    if (isAccountant) {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = sheetName;
      link.click();
    }

    // Prepare data for PDF generation
    const dataForPdf = [...worksheetData];

    // Find the index of the 'Remark' column in the header row
    const remarkColumnIndices = dataForPdf[4]
      .map((ele, i) => {
        if (ele === "Remark") return i;
      })
      .filter((index) => index !== undefined);

    if (remarkColumnIndices.length > 0) {
      // Remove the 'Remark' columns from each row starting from row 5
      for (let rowIndex = 4; rowIndex < dataForPdf.length; rowIndex++) {
        const row = dataForPdf[rowIndex];

        // Loop through remarkColumnIndices in reverse to avoid index shifting issues
        remarkColumnIndices.reverse().forEach((index) => {
          row.splice(index, 1); // Remove the 'Remark' column at this index
        });
      }
    }

    // Generate PDF from the modified sheet data
    dataForPdf[0][0] = "";
    generatePdfFromSheetData(
      dataForPdf,
      sheetName.replace(".xlsx", ".pdf"),
      "landscape",
      false,
      "Salary Sheet"
    );
  };

  const generatePdfFromSheetData = (
    worksheetData,
    pdfFileName,
    pageOrientation,
    rtgs,
    title // Adding the title argument
  ) => {
    const doc = new jsPDF({
      orientation: pageOrientation,
      unit: "pt",
      format: "a4",
    });

    // Helper function to format cell values
    const formatCellValue = (cell) => {
      // if (typeof cell === "number" || !isNaN(parseFloat(cell))) {
      //   const num = parseFloat(cell);
      //   return num % 1 === 0 ? num.toString() : num.toFixed(2);
      // }
      return String(cell || "").trim();
    };

    const location = areas?.find(
      (ele) => ele.areaId.toString() === areaIdList.toString()
    )?.location;

    const region =
      pathName.split("/")[pathName.includes("/hrms") ? 3 : 1] === "bijli"
        ? (selection.subDivision ||
            selection.division ||
            selection.circle ||
            selection.area) +
          ((desgn.length &&
            [...desigId][0] &&
            +" " +
              desgn.find(
                (ele) => ele.desigId.toString() === [...desigId][0]?.toString()
              )?.desigName) ||
            "")
        : location
        ? location
        : "";

    const natureOfWork = `Nature of work: ${Object.entries(baseZone)
      .find((ele) => ele[0] === pathName.split("/")[pathName.includes("/hrms") ? 3 : 1])[0]
      .toUpperCase()
      .replace("-", " ")} ${region ? "(" + region + ")" : ""}`;

    // Extract headers and body
    const [headers, ...body] = worksheetData;

    // Set font size for headers and body
    const fontSize = 6;
    doc.setFontSize(fontSize);

    const titleY = 30; // Y position for the title
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    const titleWidth = doc.getTextWidth(natureOfWork);
    const titleX = (doc.internal.pageSize.width - titleWidth) / 2; // Centering
    doc.text(natureOfWork, titleX, titleY);

    // Add "Month and Year" centered
    const monthYearY = 50; // Y position for the month/year
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const monthYearText = `${title} (${
      [...selectedMonth][0]
    }-${selectedYear}) `;
    const monthYearWidth = doc.getTextWidth(monthYearText);
    const monthYearX = (doc.internal.pageSize.width - monthYearWidth) / 2; // Centering
    doc.text(monthYearText, monthYearX, monthYearY);

    // Reset font size for the table content
    doc.setFontSize(fontSize);

    // Calculate maximum widths for each column
    const columnWidths = headers.map((header, index) => {
      let maxWidth = rtgs ? doc.getTextWidth(header) : 0;
      body.forEach((row, rowIndex) => {
        if (rtgs || rowIndex > 2) {
          const cellText = String(row[index] || "").trim();
          const formattedCellText = formatCellValue(cellText);
          const cellWidth = doc.getTextWidth(formattedCellText);
          maxWidth = Math.max(maxWidth, cellWidth);
        }
      });
      return maxWidth + 4;
    });

    const startX =
      (doc.internal.pageSize.width - columnWidths.reduce((a, b) => a + b, 0)) /
      2; // Center the table
    const padding = 2;
    const pageHeight = doc.internal.pageSize.height;
    const rowHeight = 10;
    const marginBottom = 20;

    // Function to draw headers and the first four rows
    const drawHeadersAndFirstFourRows = (pageStartY) => {
      headers.forEach((header, index) => {
        const cellX =
          startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0);
        doc.text(header, cellX + padding, pageStartY);
      });

      for (let i = 0; i < Math.min(rtgs ? 0 : 4, body.length); i++) {
        const row = body[i];
        const rowY = pageStartY + (i + 1) * rowHeight;
        row.forEach((cell, cellIndex) => {
          const cellText = formatCellValue(cell);
          const cellX =
            startX +
            columnWidths.slice(0, cellIndex).reduce((a, b) => a + b, 0);
          doc.text(cellText, cellX + padding, rowY);
        });
      }
    };

    const addNewPageWithLandscape = () => {
      doc.addPage("a4", pageOrientation);
      drawHeadersAndFirstFourRows(20);
    };

    drawHeadersAndFirstFourRows(90);

    let currentRow = rtgs ? 1 : 4;
    let currentPageRowIndex = 0;

    // Add body to PDF with pagination
    while (currentRow < body.length) {
      const nextRowY = 90 + (currentPageRowIndex + (rtgs ? 1 : 5)) * rowHeight;

      if (nextRowY + rowHeight > pageHeight - marginBottom) {
        addNewPageWithLandscape();
        currentPageRowIndex = 0;
        continue;
      }

      const row = body[currentRow];
      row.forEach((cell, cellIndex) => {
        const cellText = formatCellValue(cell);
        const cellX =
          startX + columnWidths.slice(0, cellIndex).reduce((a, b) => a + b, 0);
        doc.text(cellText, cellX + padding, nextRowY);
        if (currentRow >= (rtgs ? 1 : 4)) {
          const rectWidth = columnWidths[cellIndex];
          const rectHeight = rowHeight;
          if (rectWidth > 0 && rectHeight > 0) {
            doc.rect(
              cellX,
              nextRowY - rowHeight + 2,
              rectWidth,
              rectHeight,
              "S"
            );
          }
        }
      });

      currentRow++;
      currentPageRowIndex++;
    }

    // Signatures
    const signatureY = pageHeight - marginBottom - 40;
    const signatureStartX = 100;
    const signatureEndX = doc.internal.pageSize.width - signatureStartX;
    const signatures = ["ACCOUNTANT", "HUMAN RESOURCE", "MANAGING DIRECTOR"];
    const signatureSpacing =
      (signatureEndX - signatureStartX) / (signatures.length - 1);

    signatures.forEach((text, index) => {
      const signatureX = signatureStartX + index * signatureSpacing;
      const textWidth = doc.getTextWidth(text);
      doc.text(text, signatureX - textWidth / 2, signatureY);
      doc.line(
        signatureX - 30,
        signatureY + 10,
        signatureX + 30,
        signatureY + 10
      );
    });

    // Save the PDF
    doc.save(pdfFileName);
  };

  async function exportRTGS(sheetData) {
    const filteredOnHoldData = sheetData.filter((ele) => {
      return ele.onHold.toLowerCase() === "false";
    });

    const isAccountant = !!(
      Array.isArray(userRoles) &&
      userRoles.find((ele) => ele.name === "ACCOUNTANT")
    );

    const location = areas?.find(
      (ele) => ele.areaId.toString() === areaIdList.toString()
    )?.location;

    const region =
      pathName.split("/")[pathName.includes("/hrms") ? 3 : 1] === "bijli"
        ? (selection.subDivision ||
            selection.division ||
            selection.circle ||
            selection.area) +
          ((desgn.length &&
            [...desigId][0] &&
            +" " +
              desgn.find(
                (ele) => ele.desigId.toString() === [...desigId][0]?.toString()
              )?.desigName) ||
            "")
        : location
        ? location
        : "";

    const workbook = new ExcelJS.Workbook();

    // Define headers
    const headers = [
      "Account Number",
      "AMOUNT",
      "IFSC CODE",
      "BENEFICIARY A/C NO.",
      "BENEFICIARY NAME",
      "BANK ADDRESS",
      "BANK NAME",
    ];

    // Create Union Bank and Other Banks worksheets
    const unionBankWorksheet = workbook.addWorksheet("Union Bank");
    const otherBankWorksheet = workbook.addWorksheet("Other Banks");

    // Map "head-office" to the correct value, "ho"
    let zoneEntry = Object.entries(baseZone).find(
      (ele) => ele[0] === pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]
    );

    if (pathName.split("/")[pathName.includes("/hrms") ? 3 : 1] === "head-office") {
      zoneEntry = ["head-office", "ho"];
    }

    if (!zoneEntry) {
      console.error("Zone entry not found for path:", pathName);
    }

    const natureOfWork = `Nature of work: ${
      zoneEntry ? zoneEntry[1].toUpperCase().replace("-", " ") : "Unknown"
    } ${region ? "(" + region + ")" : ""}`;

    const natureOfWorkRow = unionBankWorksheet.addRow([natureOfWork]);
    unionBankWorksheet.mergeCells(`A1:G1`);
    natureOfWorkRow.getCell(1).font = { bold: true };
    natureOfWorkRow.getCell(1).alignment = { horizontal: "center" };

    const monthYearRow = unionBankWorksheet.addRow([
      `Month and Year: ${[...selectedMonth][0]} ${selectedYear}`,
    ]);
    unionBankWorksheet.mergeCells(`A2:G2`);
    monthYearRow.getCell(1).font = { bold: true };
    monthYearRow.getCell(1).alignment = { horizontal: "center" };

    const rtgsUnionBankRow = unionBankWorksheet.addRow([
      "RTGS Details Sheet (Union Bank)",
    ]);
    unionBankWorksheet.mergeCells(`A3:G3`);
    rtgsUnionBankRow.getCell(1).font = { bold: true };
    rtgsUnionBankRow.getCell(1).alignment = { horizontal: "center" };

    const unionBankHeaderRow = unionBankWorksheet.addRow(
      headers.map((h) => (typeof h === "string" ? h : h.header))
    );
    unionBankHeaderRow.eachCell((cell, colNumber) => {
      if (headers[colNumber - 1].bold) {
        cell.font = { bold: true };
      }
    });

    const unionBankData = filteredOnHoldData
      .filter((item) => item.bankName === "UNION BANK OF INDIA")
      .map((item) => {
        return [
          zoneEntry[1] === "bijli" ? "708205010000115" : "708205010000111",
          parseFloat(item.netPaid) -
            parseFloat(item.setteled_Adv_Amt || 0) +
            parseFloat(item.prevSetldAmt || 0) || 0,
          item.ifscCode,
          item.accountNumber,
          item.staffName,
          item.branch,
          item.bankName,
        ];
      });

    unionBankData.forEach((row) => unionBankWorksheet.addRow(row));

    const totalUnionBank = unionBankData.reduce(
      (sum, item) => sum + item[1],
      0
    );
    unionBankWorksheet.addRow(["", totalUnionBank, "", "", "", "", "Total"]);

    const natureOfWorkRowOther = otherBankWorksheet.addRow([natureOfWork]);
    otherBankWorksheet.mergeCells(`A1:G1`);
    natureOfWorkRowOther.getCell(1).font = { bold: true };
    natureOfWorkRowOther.getCell(1).alignment = { horizontal: "center" };

    const monthYearRowOther = otherBankWorksheet.addRow([
      `Month and Year: ${[...selectedMonth][0]} ${selectedYear}`,
    ]);
    otherBankWorksheet.mergeCells(`A2:G2`);
    monthYearRowOther.getCell(1).font = { bold: true };
    monthYearRowOther.getCell(1).alignment = { horizontal: "center" };

    const rtgsOtherBanksRow = otherBankWorksheet.addRow([
      "RTGS Details Sheet (Other Banks)",
    ]);
    otherBankWorksheet.mergeCells(`A3:G3`);
    rtgsOtherBanksRow.getCell(1).font = { bold: true };
    rtgsOtherBanksRow.getCell(1).alignment = { horizontal: "center" };

    const otherBankHeaderRow = otherBankWorksheet.addRow(
      headers.map((h) => (typeof h === "string" ? h : h.header))
    );
    otherBankHeaderRow.eachCell((cell, colNumber) => {
      if (headers[colNumber - 1].bold) {
        cell.font = { bold: true };
      }
    });

    const otherBankData = filteredOnHoldData
      .filter((item) => item.bankName !== "UNION BANK OF INDIA")
      .map((item) => {
        return [
          zoneEntry[1] === "bijli" ? "708205010000115" : "708205010000111",
          parseFloat(item.netPaid) -
            parseFloat(item.setteled_Adv_Amt || 0) +
            parseFloat(item.prevSetldAmt || 0) || 0,
          item.ifscCode,
          item.accountNumber,
          item.staffName,
          item.branch,
          item.bankName,
        ];
      });

    otherBankData.forEach((row) => otherBankWorksheet.addRow(row));

    const totalOtherBank = otherBankData.reduce(
      (sum, item) => sum + item[1],
      0
    );
    otherBankWorksheet.addRow(["", totalOtherBank, "", "", "", "", "Total"]);

    if (isAccountant) {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "rtgs.xlsx";
      link.click();
    }

    // Add Total to PDF data before passing it to PDF generator
    if (unionBankData.length > 0) {
      unionBankData.unshift(
        headers.map((h) => (typeof h === "string" ? h : h.header))
      ); // Add headers for Union Bank
      unionBankData.push(["Total", totalUnionBank, "", "", "", "", ""]); // Add total row
      unionBankData.unshift(["", "", "", "", "", "", ""]);
      unionBankData[0] = unionBankData[1];
      generatePdfFromSheetData(
        unionBankData,
        "rtgs_union_bank.pdf",
        "portrait",
        true,
        "RTGS Report For Union Bank"
      );
    }

    if (otherBankData.length > 0) {
      otherBankData.unshift(
        headers.map((h) => (typeof h === "string" ? h : h.header))
      ); // Add headers for Other Banks
      otherBankData.push(["Total", totalOtherBank, "", "", "", "", ""]); // Add total row
      otherBankData.unshift(["", "", "", "", "", "", ""]);
      otherBankData[0] = otherBankData[1];
      generatePdfFromSheetData(
        otherBankData,
        "rtgs_other_banks.pdf",
        "portrait",
        true,
        "RTGS Report For Other Bank"
      );
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelection((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    const filterProperty = {
      area: "area",
      circle: "circle",
      division: "division",
      subDivision: "subDivision",
    }[name];

    if (filterProperty) {
      setAreaIdList(
        areas
          .filter(
            (ele) => ele[filterProperty].toLowerCase() === value.toLowerCase()
          )
          .map((ele) => ele.areaId)
      );
    }
  };

  async function handleExportSelectedEmp(type) {
    if (![...selectedKeys].length) return;
    if (type === "rtgs") {
      if (selectedKeys === "all") {
        exportRTGS(allEmpList);
      } else {
        const selectedEmp = [...selectedKeys];
        const selectedStaffkeys = allEmpList.filter((ele) =>
          selectedEmp.includes(ele.ssdId.toString())
        );
        exportRTGS(selectedStaffkeys);
      }
    }
    if (type === "salaryWithProfile") {
      if (selectedKeys === "all") {
        exportToExcel("withDetails", allEmpList);
      } else {
        const selectedEmp = [...selectedKeys];
        const selectedStaffkeys = allEmpList.filter((ele) =>
          selectedEmp.includes(ele.ssdId.toString())
        );
        exportToExcel("withDetails", selectedStaffkeys);
      }
    }
    if (type === "salaryWithoutProfile") {
      if (selectedKeys === "all") {
        exportToExcel("withoutDetails", allEmpList);
      } else {
        const selectedEmp = [...selectedKeys];
        const selectedStaffkeys = allEmpList.filter((ele) =>
          selectedEmp.includes(ele.ssdId.toString())
        );
        exportToExcel("withoutDetails", selectedStaffkeys);
      }
    }
  }

  const getOptions = (data) =>
    data
      ? Object.keys(data).map((key) => (
          <SelectItem key={key} value={key}>
            {key}
          </SelectItem>
        ))
      : null;

  const { area, circle, division, subDivision } = selection;

  const hanldeSelectKeys = (e) => {
    if (e === "all") {
      const abc = new Set(allEmpList.map((ele) => ele.ssdId.toString()));
      setSelectedKeys(abc); // Set with unique ssdId values
    } else if (e instanceof Set && e.size === 0) {
      setSelectedKeys(new Set()); // Empty Set
    } else {
      setSelectedKeys(new Set(e));
    }
  };

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex justify-between w-full items-center p-3 bg-white shadow-small rounded-large gap-2 overflow-x-scroll scrollbar-hide">
        <div className="flex items-center gap-3">
          <Select
            aria-label="Select Year"
            name="status"
            variant="bordered"
            labelPlacement="outside"
            selectedKeys={[selectedYear]}
            placeholder="Year"
            onChange={(e) => {
              setSelectedYear(e.target.value);
            }}
            classNames={{
              base: "max-w-full sm:min-w-32 sm:max-w-[10rem] h-8",
              mainWrapper: "h-full",
              input: "text-small",
              value: "text-black",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            size="sm"
          >
            <SelectItem key={2024}>2024</SelectItem>
            <SelectItem key={2025}>2025</SelectItem>
          </Select>
          <Tooltip
            isDisabled={selectedYear.toString().length > 3}
            color="danger"
            content="Please Enter Year First"
            classNames={{
              base: ["before:bg-neutral-400 dark:before:bg-white"],
              content: [
                "px-4 shadow-xl",
                "text-black bg-gradient-to-br from-white to-neutral-400",
              ],
            }}
          >
            <Select
              aria-label="Select Month"
              className=""
              name="month"
              variant="bordered"
              labelPlacement="outside"
              selectedKeys={selectedMonth}
              placeholder="Month"
              onSelectionChange={setSelectedMonth}
              size="sm"
              classNames={{
                base: "max-w-full sm:min-w-32 sm:max-w-[10rem] h-8",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper:
                  "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
              }}
            >
              {selectedYear.toString().length > 3 &&
                Object.keys(months).map((ele) => (
                  <SelectItem key={ele}>{ele}</SelectItem>
                ))}
            </Select>
          </Tooltip>
          <Input
            classNames={{
              base: "max-w-56 sm:min-w-48 h-8",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper: "h-full font-normal text-default-500 h-8",
            }}
            variant="bordered"
            placeholder="Search Employee No..."
            aria-label="Employee Number"
            size="sm"
            value={search}
            onValueChange={setSearch}
            startContent={<FaSearch size={18} />}
            type="search"
            isDisabled={
              selectedYear.toString().length < 4 || ![...selectedMonth][0]
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Switch
            isSelected={isVerified}
            color={isVerified ? "primary" : "secondary"}
            onValueChange={setIsVerified}
            size="sm"
            isDisabled={
              selectedYear.toString().length < 4 || ![...selectedMonth][0]
            }
          >
            {isVerified ? "VERIFIED" : "UNVERIFIED"}
          </Switch>
        </div>
        <div className="flex gap-4">
          <Dropdown isDisabled={!filteredData.results.length || loading}>
            <DropdownTrigger>
              <Button
                className="h-8 rounded-full"
                color="primary"
                variant="bordered"
              >
                Export To excel
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem
                key="withDetails"
                onClick={() =>
                  exportToExcel("withDetails", filteredData.results)
                }
              >
                Current Page With Profile
              </DropdownItem>
              <DropdownItem
                key="withoutDetails"
                onClick={() =>
                  exportToExcel("withoutDetails", filteredData.results)
                }
              >
                Current Page Without Profile
              </DropdownItem>
              <DropdownItem
                key="AllEmpWithDetails"
                onClick={() => exportToExcel("withDetails", allEmpList)}
              >
                All Employee With Profile
              </DropdownItem>
              <DropdownItem
                key="AllEmpWithoutDetails"
                onClick={() => exportToExcel("withoutDetails", allEmpList)}
              >
                All Employee Without Profile
              </DropdownItem>
              <DropdownItem
                key="rtgsReport"
                onClick={() => {
                  onSecondModalOpen();
                  exportRTGS(filteredData.results);
                }}
              >
                Current Page RTGS Report
              </DropdownItem>
              <DropdownItem
                key="AllEmpRtgsReport"
                onClick={() => {
                  onSecondModalOpen();
                  exportRTGS(allEmpList);
                }}
              >
                All Employee RTGS Report
              </DropdownItem>
              <DropdownItem
                key="SelctedEmpSalaryWithDetail"
                onClick={() => handleExportSelectedEmp("salaryWithProfile")}
              >
                Selected Emp With Details
              </DropdownItem>
              <DropdownItem
                key="SelctedEmpSalaryWithoutDetail"
                onClick={() => handleExportSelectedEmp("salaryWithoutProfile")}
              >
                Selected Emp Without Details
              </DropdownItem>
              <DropdownItem
                key="SelctedEmpRtgsReport"
                onClick={() => handleExportSelectedEmp("rtgs")}
              >
                Selected Employee RTGS
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          <Button
            className="h-8 rounded-full"
            color="primary"
            // isDisabled={true}
            isDisabled={![...selectedKeys].length}
            onClick={handleApproveSalary}
          >
            Approve
          </Button>
        </div>
      </div>
      {baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]] === "bijli" && (
        <div className="rounded-large shadow-small bg-white flex items-center gap-3 p-3 overflow-x-scroll scrollbar-hide">
          <Select
            variant="bordered"
            color="primary"
            labelPlacement="outside"
            placeholder="Select Area"
            aria-label="Area"
            name="area"
            value={area}
            selectedKeys={[area]}
            onChange={handleChange}
            classNames={{
              base: "max-w-full sm:min-w-32 sm:max-w-[10rem] h-8",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            size="sm"
            bordered
          >
            {areas.length && getOptions(createNestedStructure(areas))}
          </Select>
          <Select
            variant="bordered"
            color="primary"
            placeholder="Select Circle"
            aria-label="Circle"
            name="circle"
            value={circle}
            selectedKeys={[circle]}
            onChange={handleChange}
            labelPlacement="outside"
            classNames={{
              base: "max-w-full  sm:min-w-32 sm:max-w-[10rem] h-8",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            size="sm"
          >
            {areas.length && getOptions(createNestedStructure(areas)[area])}
          </Select>
          <Tooltip
            isDisabled={!!circle}
            color="danger"
            content="Please Select Circle"
          >
            <Select
              aria-label="Division"
              variant="bordered"
              name="division"
              labelPlacement="outside"
              placeholder="Select Division"
              value={division}
              selectedKeys={[division]}
              onChange={handleChange}
              disabled={!circle}
              classNames={{
                base: "max-w-full  sm:min-w-32 sm:max-w-[10rem] h-8",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper:
                  "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
              }}
              size="sm"
            >
              {areas.length &&
                getOptions(createNestedStructure(areas)[area]?.[circle])}
            </Select>
          </Tooltip>
          <Tooltip
            isDisabled={!!division}
            color="danger"
            content="Please Select Division"
          >
            <Select
              aria-label="Sub Division"
              labelPlacement="outside"
              name="subDivision"
              placeholder="Select Subdivision"
              value={subDivision}
              selectedKeys={[subDivision]}
              onChange={handleChange}
              variant="bordered"
              disabled={!division}
              classNames={{
                base: "max-w-full  sm:min-w-32 sm:max-w-[10rem] h-8",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper:
                  "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
              }}
              size="sm"
            >
              {createNestedStructure(areas)[area]?.[circle]?.[division]?.map(
                (sub) => (
                  <SelectItem key={sub} value={sub}>
                    {sub}
                  </SelectItem>
                )
              )}
            </Select>
          </Tooltip>
          <Select
            aria-label="Job Title"
            name="desigId"
            variant="bordered"
            labelPlacement="outside"
            placeholder="Select Designation"
            selectedKeys={desigId}
            classNames={{
              base: "max-w-full  sm:min-w-32 sm:max-w-[10rem] h-8",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            size="sm"
            onSelectionChange={setDesigId}
          >
            {desgn.length &&
              desgn.map((ele) => {
                return (
                  <SelectItem key={ele.desigId}>{ele.desigName}</SelectItem>
                );
              })}
          </Select>
        </div>
      )}
      <AsyncPaginateTable
        columns={columns}
        actionButtons={isVerified ? "" : actionButtons}
        selectedKeys={selectedKeys}
        setSelectedKeys={setSelectedKeys}
        hanldeSelectKeys={hanldeSelectKeys}
        selectButton={"multiple"}
        resourceUrl={`${baseUrl}/api/v1/spsm/view/STAFF_DOC/`}
        page={search.length > 3 ? false : page}
        data={filteredData}
        setPage={setPage}
        loadingState={loadingState}
      />
      <SalaryModal
        isOpen={isFirstModalOpen}
        onOpen={onFirstModalOpen}
        onClose={onFirstModalClose}
        onOpenChange={onFirstOpenChange}
        selectedStaff={selectedStaff}
        setSelectedStaff={setSelectedStaff}
        mutateData={mutateData}
        zone={zone}
        month={[...selectedMonth][0]}
        year={selectedYear}
        getAllempList={getAllempList}
      />
      <Modal size="4xl" isOpen={isSecondModalOpen} onClose={onSecondModalClose}>
        <ModalContent>
          {() => (
            <>
              <ModalBody>
                <RTGSLetter />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
