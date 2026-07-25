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
} from "@nextui-org/react";
import { getCookie } from "@/utils/cookieUtils";
import { FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";
import { GrEdit } from "react-icons/gr";
import { fetcher } from "@/utils/fetcher";
import useSWR, { mutate } from "swr";
import { months, salaryExcelHeaders } from "@/utils/constant";
import { getData, postData } from "@/utils/api";
import ExcelJS from "exceljs";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import jsPDF from "jspdf";
import TargetModal from "./TargetModal";
import AreaSelectionModal from "@/utils/SelectArea";
import { getAllArea, getDesgnData } from "@/utils/getDesgnData";
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
  { key: "status", value: "Status" },
  { key: "action", value: "Action" },
];

const currentDate = new Date();
currentDate.setMonth(currentDate.getMonth() - 1);
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate
  .toLocaleString("default", { month: "long" })
  .toUpperCase();

export default function CombinedSalary() {
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
    deductionRemark: "",
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
  const [userRoles, setUserRoles] = useState("");
  const [areas, setAreas] = useState("");
  const [resetOnClose, setResetOnClose] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [selection, setSelection] = useState({
    area: "",
    circle: "",
    division: "",
    subDivision: "",
  });
  const [desgn, setDesgn] = useState([]);
  const [desigId, setDesigId] = useState("");
  const [areaIdList, setAreaIdList] = useState("");
  const [isAreaSelectionModalOpen, setIsAreaSelectionModalOpen] =
    useState(false);

  useEffect(() => {
    (async () => {
      const zone = await getCookie("zone");
      const userData = await getCookie("user");
      setUserRoles(JSON.parse(userData).roles);
      setZone(zone);
    })();
    getArea();
    getDesgnData(setDesgn, pathName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getArea = useCallback(
    () => getAllArea(setAreas, pathName, setAreas),
    [pathName]
  );

  useEffect(() => {
    if (selectedYear.toString().length === 4 && [...selectedMonth][0]) {
      getAllempList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear, selectedMonth, areaIdList]);

  async function getAllempList() {
    const token = await getCookie("accessToken");
    const response = await getData(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/payroll/complete/emp-salary-details?month=${
        [...selectedMonth][0]
      }&year=${selectedYear}&area_id=${areaIdList ? areaIdList : ""}`,
      token
    );
    setAllEmpList(response.results);
  }

  const resourceUrl = useMemo(() => {
    if (selectedYear.toString().length === 4 && [...selectedMonth][0]) {
      if (search.length > 3) {
        return `${baseUrl}/api/spshrm/${
          baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
        }/payroll/search-details?emp_no=${search}&month=${
          [...selectedMonth][0]
        }&type=&year=${selectedYear}`;
      }
      return `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/payroll/group/all-salary-list?zoneId=${zone || 1}&month=${
        [...selectedMonth][0]
      }&year=${selectedYear}&type=${
        isVerified ? "VERIFIED" : "UNVERIFIED"
      }&area_id=${areaIdList}&page=${page - 1}&size=20`;
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear, selectedMonth, search, areaIdList, zone, isVerified, page]);

  const { data, isLoading } = useSWR(resourceUrl, fetcher, {
    keepPreviousData: true,
  });

  const loadingState = isLoading || data?.length === 0 ? "loading" : "idle";
  isLoading || data?.length === 0 ? "loading" : "idle";

  const actionButtons = [
    {
      name: "Edit",
      action: (row) => {
        onOpen();
        const modifiedRow = { ...row, deductionRemark: "" };
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, isVerified]);

  async function handleApproveSalary() {
    const userCookie = await getCookie("user");
    const token = await getCookie("accessToken");
    const user = await JSON.parse(userCookie);
    let payload = [];
    if (selectedKeys === "all") {
      payload = filteredData.results.map((ele) => ele.ssdId);
    } else payload = [...selectedKeys];

    const resposne = await postData(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/payroll/verify?userId=${user.id}`,
      { salaryDetId: payload },
      token
    );
    if (resposne) {
      mutateData();
      if (selectedKeys === "all") setIsVerified(true);
      toast.success("Save Successfully");
    }
  }

  async function mutateData() {
    mutate(resourceUrl);
  }

  const exportToExcel = async (option, sheetData, area) => {
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

    const workNature = Object.entries(baseZone)
      .find((ele) => ele[0] === pathName.split("/")[pathName.includes("/hrms") ? 3 : 1])[0]
      .toUpperCase()
      .replace("_", " ");

    salaryExcelHeaders[0][0] = `Nature of work: ${workNature} ${
      pathName.split("/")[pathName.includes("/hrms") ? 3 : 1] === "bijli" && area ? area.toUpperCase() : ""
    } ${region ? "(" + region + ")" : ""}`;
    salaryExcelHeaders[2][5] = `${[...selectedMonth][0]}-${selectedYear}`;

    let sheetName = "";
    const monthIndex = months[[...selectedMonth][0].toUpperCase()];
    const daysInMonth = new Date(selectedYear, monthIndex + 1, 0).getDate();

    let worksheetData = [];
    let merges = [];

    const excelHeaders = JSON.parse(JSON.stringify(salaryExcelHeaders));
    excelHeaders[4][7] = "Achievement";
    if (option === "withoutDetails") {
      excelHeaders[1][2] = "No. of Days during Month:";
      excelHeaders[1][11] = daysInMonth.toString();

      const modifiedHeaders = excelHeaders.map((row, i) => {
        if (i === 2) {
          // Remove specific columns from the third row
          return row.filter((_, index) => ![6, 7, 8].includes(index));
        } else {
          // Remove specific columns from other rows
          const updatedRow = row.filter(
            (_, index) => ![3, 4, 5, 6].includes(index)
          );

          // Add "Security" column if pathName contains "suda"
          if (pathName.split("/")[pathName.includes("/hrms") ? 3 : 1] === "suda" && i === 4) {
            const deductionIndex = updatedRow.indexOf("Deduction");
            if (deductionIndex !== -1) {
              updatedRow.splice(deductionIndex + 1, 0, "Security");
            }
          }

          return updatedRow;
        }
      });
      worksheetData = [
        ...modifiedHeaders,
        ...filteredOnHoldData.map((item, index) => {
          // Common row structure
          const row = [
            index + 1,
            item.staffName,
            item.empNo,
            item.target,
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

          // Add `item.security` after `item.deduction` if the path matches "suda"
          if (pathName.split("/")[pathName.includes("/hrms") ? 3 : 1] === "suda") {
            row.splice(14, 0, item.securityDeduction); // Insert `item.security` after `item.deduction`
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
      if (
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]] === "rmc" ||
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]] === "suda"
      ) {
        const deductionIndex = excelHeaders[4].indexOf("Deduction");
        excelHeaders[4].splice(deductionIndex + 1, 0, "Security");
      }
      if (baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]] === "suda") {
        const deductionIndex = excelHeaders[4].indexOf("Deduction");
        excelHeaders[4].splice(deductionIndex + 3, 0, "Rent");
        excelHeaders[4].splice(deductionIndex + 4, 0, "Cheque Inc");
        excelHeaders[4].splice(deductionIndex + 5, 0, "Travel Exp");
      }

      excelHeaders[1].splice(2, 4); // Adjust headers for details

      // Find the maximum length among the subarrays
      const maxLength = Math.max(...excelHeaders.map((arr) => arr.length));

      // Pad each array to the maximum length
      const normalizedHeaders = excelHeaders.map((arr) => {
        const padding = Array(maxLength - arr.length).fill(""); // Create padding of empty strings
        return [...arr, ...padding]; // Append padding to the array
      });
      worksheetData = [
        ...normalizedHeaders,
        ...filteredOnHoldData.map((item, index) => {
          // Common row structure]
          const row = [
            index + 1,
            item.staffName,
            item.empNo,
            parseFloat(item.strcBasic) + parseFloat(item.strcDa),
            item.strcHRA,
            item.strcConv_oth,
            item.strcGross,
            item.target,
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

          // Add `item.security` after `item.deduction` if the path matches "suda"
          if (pathName.split("/")[pathName.includes("/hrms") ? 3 : 1] === "suda") {
            row.splice(18, 0, item.securityDeduction); // Insert `item.security` after `item.deduction`
            row.splice(20, 0, item.rent); // Insert `item.security` after `item.deduction`
            row.splice(21, 0, item.check_incentive); // Insert `item.security` after `item.deduction`
            row.splice(22, 0, item.other_expenses); // Insert `item.security` after `item.deduction`
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
          if (
            option === "withoutDetails"
              ? index > 2 && index !== 17 && index !== 18
              : index > 2 && index !== 22 && index !== 23
          ) {
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

    // added by suraj
    totalsRow.forEach((value, index) => {
      if (value !== null && typeof value === "number") {
        totalsRow[index] = parseFloat(value.toFixed(0));
      }
    });

    if (option === "withoutDetails") totalsRow[3] = "";
    else totalsRow[7] = "";
    worksheetData.push(totalsRow); // Add total row to worksheet data

    //   // Create a new workbook and add a worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Salary Sheet");

    //   // Add worksheet data
    worksheetData.forEach((row) => {
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
    dataForPdf.shift();
    generatePdfFromSheetData(
      dataForPdf,
      area,
      sheetName.replace(".xlsx", ".pdf"),
      "landscape",
      false,
      "Salary Sheet"
    );
  };

  const generatePdfFromSheetData = (
    worksheetData,
    area,
    pdfFileName,
    pageOrientation,
    rtgs,
    title = ""
  ) => {
    const doc = new jsPDF({
      orientation: pageOrientation,
      unit: "pt",
      format: "a4",
    });

    const formatCellValue = (cell) => String(cell || "").trim();
    const pathSegment = pathName.split("/")[pathName.includes("/hrms") ? 3 : 1];
    const baseZoneEntry = Object.entries(baseZone).find(
      (ele) => ele[0] === pathSegment
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

    const natureOfWork = `Nature of work: ${
      baseZoneEntry ? baseZoneEntry[0].toUpperCase().replace("_", " ") : ""
    }${
      pathSegment === "bijli" && area
        ? ` ${area.toUpperCase().replaceAll("_", " ")}`
        : ""
    } ${region ? "(" + region + ")" : ""}`;

    const [headers, ...body] = worksheetData;
    const fontSize = 6;
    doc.setFontSize(fontSize);

    const titleY = 30;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    const titleWidth = doc.getTextWidth(natureOfWork);
    const titleX = (doc.internal.pageSize.width - titleWidth) / 2;
    doc.text(natureOfWork, titleX, titleY);

    const monthYearY = 50;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const monthYearText = `${title} (${
      [...selectedMonth][0]
    }-${selectedYear}) `;
    const monthYearWidth = doc.getTextWidth(monthYearText);
    const monthYearX = (doc.internal.pageSize.width - monthYearWidth) / 2;
    doc.text(monthYearText, monthYearX, monthYearY);

    doc.setFontSize(fontSize);

    const columnWidths = headers.map((header, index) => {
      let maxWidth = rtgs ? doc.getTextWidth(header) : 0;
      body.forEach((row, rowIndex) => {
        if (rtgs || rowIndex > 1) {
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
      2;
    const padding = 2;
    const pageHeight = doc.internal.pageSize.height;
    const rowHeight = 10;
    const marginBottom = 20;

    const drawHeadersAndFirstFourRows = (pageStartY, isSecondPage = false) => {
      const adjustedStartY = isSecondPage ? 20 : pageStartY;

      if (!isSecondPage) {
        headers.forEach((header, index) => {
          const cellX =
            startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0);
          doc.text(header, cellX + padding, adjustedStartY);
        });
      }

      const startRowIndex = isSecondPage && !rtgs ? 1 : 0;

      for (
        let i = startRowIndex;
        i < Math.min(rtgs ? 0 : 3, body.length);
        i++
      ) {
        const row = body[i];
        const rowY = adjustedStartY + (i + 1) * rowHeight;
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
      drawHeadersAndFirstFourRows(20, true);
    };

    drawHeadersAndFirstFourRows(90);

    let currentRow = rtgs ? 0 : 3;
    let currentPageRowIndex = 0;
    let isFirstPage = true;
    let lastRowY = 90;

    while (currentRow < body.length) {
      const nextRowY = isFirstPage
        ? 90 + (currentPageRowIndex + (rtgs ? 1 : 4)) * rowHeight
        : 20 + (currentPageRowIndex + (rtgs ? 1 : 4)) * rowHeight;

      if (nextRowY + rowHeight > pageHeight - marginBottom) {
        addNewPageWithLandscape();
        currentPageRowIndex = 0;
        isFirstPage = false;
        continue;
      }

      const row = body[currentRow];
      row.forEach((cell, cellIndex) => {
        const cellText = formatCellValue(cell);
        const cellX =
          startX + columnWidths.slice(0, cellIndex).reduce((a, b) => a + b, 0);
        doc.text(cellText, cellX + padding, nextRowY);
        if (currentRow >= (rtgs ? 0 : 3)) {
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

      lastRowY = nextRowY; // Update the last row Y position
      currentRow++;
      currentPageRowIndex++;
    }

    // Signatures immediately below the last row with spacing
    const signatureY = lastRowY + rowHeight + 20;
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

    const isAccountant =
      Array.isArray(userRoles) &&
      userRoles.some((ele) => ele.name === "ACCOUNTANT");

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
      "S. No.",
      "Account Number",
      "AMOUNT",
      "IFSC CODE",
      "BENEFICIARY A/C NO.",
      "BENEFICIARY NAME",
      "BANK ADDRESS",
      "BANK NAME",
    ];

    if (pathName.split("/")[pathName.includes("/hrms") ? 3 : 1] === "bijli")
      headers.splice(1, 0, "Employee Number");

    const zoneEntry =
      pathName.split("/")[pathName.includes("/hrms") ? 3 : 1] === "head-office"
        ? ["head-office", "ho"]
        : Object.entries(baseZone).find(
            (ele) => ele[0] === pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]
          );

    // Helper function to add data and total row to worksheet
    const addBankDataToSheet = (worksheet, data, bankFilter, totalLabel) => {
      const filteredData = data.filter(bankFilter);
      if (filteredData.length === 0) return 0;

      worksheet.addRow(headers);
      filteredData.forEach((item, index) => {
        const row = [
          index + 1,
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
        if (zoneEntry[1] === "bijli") row.splice(1, 0, item.empNo);
        worksheet.addRow(row);
      });
      const total = filteredData
        .reduce(
          (sum, item) =>
            sum +
            (parseFloat(item.netPaid) -
              parseFloat(item.setteled_Adv_Amt || 0) +
              parseFloat(item.prevSetldAmt || 0) || 0),
          0
        )
        .toFixed(2);
      worksheet.addRow([
        totalLabel,
        "",
        zoneEntry[1] === "bijli" ? "" : total,
        zoneEntry[1] === "bijli" ? total : "",
        "",
        "",
        "",
        "",
        "",
      ]);
      return total;
    };

    // Create worksheets and add data
    const unionBankWorksheet = workbook.addWorksheet("Union Bank");
    const otherBankWorksheet = workbook.addWorksheet("Other Banks");

    const unionBankTotal = addBankDataToSheet(
      unionBankWorksheet,
      filteredOnHoldData,
      (item) => item.bankName === "UNION BANK OF INDIA",
      "Total"
    );
    const otherBankTotal = addBankDataToSheet(
      otherBankWorksheet,
      filteredOnHoldData,
      (item) => item.bankName !== "UNION BANK OF INDIA",
      "Total"
    );

    // Generate Excel only if there's data
    if (isAccountant && (unionBankTotal > 0 || otherBankTotal > 0)) {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${region}_rtgs.xlsx`;
      link.click();
    }

    // Prepare data for PDFs
    const preparePdfData = (data, total) => {
      if (data.length === 0) return null;
      const pdfData = [
        headers,
        ...data.map((item, index) => {
          const row = [
            index + 1,
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
          // Add employee number for "bijli"
          if (zoneEntry[1] === "bijli") row.splice(1, 0, item.empNo);
          return row;
        }),
        [
          "Total",
          "",
          zoneEntry[1] === "bijli" ? "" : total,
          zoneEntry[1] === "bijli" ? total : "",
          "",
          "",
          "",
          "",
        ],
      ];
      return pdfData;
    };

    // Generate PDFs only if there's data
    const unionBankPdfData = preparePdfData(
      filteredOnHoldData.filter(
        (item) => item.bankName === "UNION BANK OF INDIA"
      ),
      unionBankTotal
    );
    if (unionBankPdfData) {
      generatePdfFromSheetData(
        unionBankPdfData,
        "",
        `${region}_rtgs_union_bank.pdf`,
        "portrait",
        true,
        "RTGS Report For Union Bank"
      );
    }

    const otherBankPdfData = preparePdfData(
      filteredOnHoldData.filter(
        (item) => item.bankName !== "UNION BANK OF INDIA"
      ),
      otherBankTotal
    );
    if (otherBankPdfData) {
      generatePdfFromSheetData(
        otherBankPdfData,
        "",
        `${region}_rtgs_other_banks.pdf`,
        "portrait",
        true,
        "RTGS Report For Other Bank"
      );
    }
  }

  const handleAreaSelectionComplete = async ({
    areaIdList,
    selectedType,
    selection,
  }) => {
    const token = await getCookie("accessToken");
    const reportFor =
      selectedType == "069" || selectedType == "006900" ? "WD" : "";

    const response = await getData(
      `${baseUrl}/api/spshrm/bijli/payroll/target/complete-salary-list?month=${
        [...selectedMonth][0]
      }&year=${selectedYear}&type=${
        isVerified ? "VERIFIED" : "UNVERIFIED"
      }&area_id=${areaIdList}&report_for=${reportFor}`,
      token
    );

    if (selectedType == "069" && Array.isArray(response.results)) {
      exportToExcel("withDetails", response.results, selection.subDivision);
      setIsAreaSelectionModalOpen(false);
      setResetOnClose(true);
    }
    if (selectedType == "0690" && Array.isArray(response.results)) {
      exportToExcel("withoutDetails", response.results, selection.subDivision);
      setIsAreaSelectionModalOpen(false);
      setResetOnClose(true);
    }
    if (selectedType == "006900" && Array.isArray(response.results)) {
      exportRTGS(response.results);
      setIsAreaSelectionModalOpen(false);
      setResetOnClose(true);
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
    <div className="flex p-4 flex-col gap-3">
      <div className="flex justify-between w-full items-center p-3 bg-white shadow-small rounded-large overflow-x-scroll scrollbar-hide gap-2">
        <div className="flex items-center gap-3">
          <Select
            aria-label="Select Status"
            name="status"
            variant="bordered"
            labelPlacement="outside"
            selectedKeys={[selectedYear]}
            placeholder="Year"
            onChange={(e) => {
              setSelectedYear(e.target.value);
            }}
            classNames={{
              base: "max-w-full sm:min-w-20 sm:max-w-[10rem] h-8",
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
                base: "max-w-full sm:min-w-32 h-8",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper: "h-full font-normal text-default-500 h-8",
              }}
            >
              {selectedYear.toString().length > 3 &&
                Object.keys(months).map((ele) => (
                  <SelectItem key={ele}>{ele}</SelectItem>
                ))}
            </Select>
          </Tooltip>
          {baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]] === "bijli" && (
            <>
              <Button
                variant="bordered"
                className="h-8 rounded-small"
                key="areaWise"
                onClick={() => setIsAreaSelectionModalOpen(true)}
                isDisabled={!selectedMonth || !selectedYear}
              >
                Area Wise
              </Button>
            </>
          )}
          {(baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]] === "rmc" ||
            baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]] === "suda") && (
            <Select
              variant="bordered"
              color="primary"
              labelPlacement="outside"
              placeholder="Select ULB"
              aria-label="ULB"
              name="area"
              value={areaIdList}
              selectedKeys={[areaIdList]}
              onChange={(e) => {
                const { value } = e.target;
                setAreaIdList(value);
              }}
              classNames={{
                base: "sm:min-w-32 sm:max-w-40 h-8",
                popover: "w-full",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper:
                  "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
              }}
              size="sm"
              bordered
              isDisabled={!selectedYear || !selectedMonth}
            >
              {areas.length &&
                areas.map((key) => (
                  <SelectItem key={key.areaId} value={key.areaId}>
                    {key.location}
                  </SelectItem>
                ))}
            </Select>
          )}
          <Input
            classNames={{
              base: "max-w-56 sm:min-w-20 h-8",
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
          <Dropdown isDisabled={!filteredData.results.length}>
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
                onClick={() => exportRTGS(filteredData.results)}
              >
                Current Page RTGS Report
              </DropdownItem>
              <DropdownItem
                key="AllEmpRtgsReport"
                onClick={() => exportRTGS(allEmpList)}
              >
                All Employee RTGS
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
            isDisabled={![...selectedKeys].length}
            onClick={handleApproveSalary}
          >
            Approve
          </Button>
        </div>
      </div>
      <AreaSelectionModal
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        setAreaIdList={setAreaIdList}
        areaIdList={areaIdList}
        selection={selection}
        setSelection={setSelection}
        isOpen={isAreaSelectionModalOpen}
        onClose={() => setIsAreaSelectionModalOpen(false)}
        onSelectionComplete={handleAreaSelectionComplete}
        resetOnClose={resetOnClose}
      />
      <AsyncPaginateTable
        selectButton="multiple"
        selectedKeys={selectedKeys}
        setSelectedKeys={setSelectedKeys}
        columns={columns}
        actionButtons={actionButtons}
        resourceUrl={`${baseUrl}/api/v1/spsm/view/STAFF_DOC/`}
        page={search.length > 3 ? false : page}
        data={filteredData}
        setPage={setPage}
        hanldeSelectKeys={hanldeSelectKeys}
        loadingState={loadingState}
      />
      <TargetModal
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        mutate={mutateData}
        onOpenChange={onOpenChange}
        selectedStaff={selectedStaff}
        setSelectedStaff={setSelectedStaff}
        mutateData={mutateData}
        zone={zone}
        month={[...selectedMonth][0]}
        year={selectedYear}
        getAllempList={getAllempList}
      />
    </div>
  );
}
