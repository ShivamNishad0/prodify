"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
} from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import { usePathname } from "next/navigation";
import { salaryExcelHeaders } from "@/utils/constant";
import { GrEdit } from "react-icons/gr";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import { getCookie } from "@/utils/cookieUtils";
import dynamic from "next/dynamic";
import { getData } from "@/utils/api";
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

export default function Salary() {
  const pathName = usePathname();
  const [search, setSearch] = useState("");
  const [zone, setZone] = useState("");
  const [page, setPage] = useState(1);
  const [selectedSatff, setSelectedStaff] = useState({
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
  const [allEmpList, setAllEmpList] = useState("");
  const [userRoles, setUserRoles] = useState("");

  useEffect(() => {
    (async () => {
      const zone = await getCookie("zone");
      const userData = await getCookie("user");
      setUserRoles(JSON.parse(userData).roles);
      setZone(zone);
    })();
    getAllempList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getAllempList() {
    const token = await getCookie("accessToken");
    const response = await getData(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/payroll/removed-salary/all`,
      token
    );

    if (Array.isArray(response) && response.length) {
      response.map(async (ele) => {
        const response = await getData(
          `${baseUrl}/api/spshrm/${
            baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
          }/salary/by-staff/${ele.staffId}`,
          token
        );
        ele.strcBasic = response.basic;
        ele.strcDa = response.da;
        ele.strcHRA = response.hra;
        ele.strcConv_oth = response.conv_oth;
        ele.strcGross = response.gross;
        ele.esiPercent = response.esiPercent;
        ele.pfPercent = response.pfPercent;
        ele.pfStatus = response.pfStatus;
        ele.pfUAN_NO = response.pfUAN_NO;
        ele.esiNo = response.esiNo;
        const response1 = await getData(
          `${baseUrl}/api/spshrm/${
            baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
          }/staff/${btoa(ele.staffId)}`,
          token
        );
        ele.accountNumber = response1.accountNumber;
        ele.bankName = response1.bankName;
        ele.branch = response1.branch;
        ele.ifscCode = response1.ifscCode;
      });
    }
    setAllEmpList(response);
  }

  const resourceUrl = useMemo(() => {
    if (search.length > 3) {
      return `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/payroll/removed-salary?emp_no=${search}`;
    }
    return `${baseUrl}/api/spshrm/${
      baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
    }/payroll/removed-salary/all`;

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, zone, page]);

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

    const filteredResults = data.results.sort((a, b) =>
      a.empNo.localeCompare(b.empNo)
    ); // Sort the filtered results

    return { ...data, results: filteredResults };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  async function mutateData() {
    mutate(resourceUrl);
  }

  const exportToExcel = async (option, sheetData) => {
    const isAccountant = !!(
      Array.isArray(userRoles) &&
      userRoles.find((ele) => ele.name === "ACCOUNTANT")
    );

    salaryExcelHeaders[0][0] = `Nature of work: ${Object.entries(baseZone)
      .find((ele) => ele[0] === pathName.split("/")[pathName.includes("/hrms") ? 3 : 1])[0]
      .toUpperCase()
      .replace("-", " ")}`;
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
        if (i === 0) {
          // For the first row, place the first element in the middle cell
          const middleIndex = Math.floor(row.length / 2);
          // Create a copy of the row
          const newRow = [...row];
          // Place the first element in the middle
          newRow[middleIndex] = row[0];
          // Replace the first element with an empty string
          newRow[0] = "";
          return newRow;
        } else if (i === 2) {
          return row.filter((_, index) => ![6, 7, 8].includes(index));
        } else {
          return row.filter((_, index) => ![3, 4, 5, 6, 7, 8].includes(index));
        }
      });

      worksheetData = [
        ...modifiedHeaders,
        ...sheetData.map((item, index) => [
          index + 1,
          item.staffName,
          item.empNo,
          parseFloat(item.basic),
          item.hra,
          item.conv_or_Other,
          item.gross,
          item.empPF,
          item.empESI,
          item.advance,
          item.tds,
          item.other,
          item.dedOfEmpShare,
          item.deduction,
          item.deductionRemark,
          null, // ADDITION
          item.netPaid,
          item.additionalRemark,
          item.pfUAN_NO, // PF UAN No.
          item.esiNo, // ESI No.
          null, // REMARK
          null, // REMARK
        ]),
      ];

      merges = [
        { start: { row: 1, col: 1 }, end: { row: 1, col: 18 } },
        { start: { row: 2, col: 3 }, end: { row: 2, col: 5 } },
        { start: { row: 2, col: 6 }, end: { row: 2, col: 7 } },
        { start: { row: 3, col: 3 }, end: { row: 3, col: 5 } },
        { start: { row: 3, col: 6 }, end: { row: 3, col: 7 } },
        { start: { row: 4, col: 2 }, end: { row: 4, col: 3 } },
        { start: { row: 4, col: 4 }, end: { row: 4, col: 7 } },
        { start: { row: 4, col: 8 }, end: { row: 4, col: 13 } },
      ];
      sheetName = `${[...selectedMonth][0]}_${selectedYear}_Salary_Sheet.xlsx`;
    } else {
      excelHeaders[1][9] = daysInMonth.toString();
      excelHeaders[1].splice(2, 4); // Adjust headers for details

      worksheetData = [
        ...excelHeaders,
        ...sheetData.map((item, index) => [
          index + 1,
          item.staffName,
          item.empNo,
          parseFloat(item.strcBasic) + parseFloat(item.strcDa),
          item.strcHRA,
          item.strcConv_oth,
          item.strcGross,
          parseFloat(item.noOfDayPresent),
          parseFloat(item.noOfHalfDay),
          parseFloat(item.basic),
          item.hra,
          item.conv_or_Other,
          item.gross,
          item.empPF,
          item.empESI,
          item.advance,
          item.tds,
          item.other,
          item.dedOfEmpShare,
          item.deduction,
          item.deductionRemark,
          null, // ADDITION
          item.netPaid,
          item.additionalRemark,
          item.pfUAN_NO, // PF UAN No.
          item.esiNo, // ESI No.
          null, // REMARK
          null, // REMARK
        ]),
      ];

      merges = [
        { start: { row: 1, col: 1 }, end: { row: 1, col: 28 } },
        { start: { row: 2, col: 3 }, end: { row: 2, col: 5 } },
        { start: { row: 2, col: 6 }, end: { row: 2, col: 7 } },
        { start: { row: 3, col: 3 }, end: { row: 3, col: 5 } },
        { start: { row: 3, col: 6 }, end: { row: 3, col: 7 } },
        { start: { row: 4, col: 2 }, end: { row: 4, col: 3 } },
        { start: { row: 4, col: 4 }, end: { row: 4, col: 7 } },
        { start: { row: 4, col: 8 }, end: { row: 4, col: 9 } },
        { start: { row: 4, col: 10 }, end: { row: 4, col: 13 } },
        { start: { row: 4, col: 14 }, end: { row: 4, col: 19 } },
      ];
      sheetName = `${
        [...selectedMonth][0]
      }_${selectedYear}_Salary_Sheet_With_Details.xlsx`;
    }

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
          const cellValue = cell.value ? cell.value.toString() : ""; // Ensure we get string length
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

    // Apply merges
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

    const dataForPdf = [...worksheetData];
    const middleIndex = Math.floor(dataForPdf[0].length / 2);
    const newRow = [...dataForPdf[0]];
    newRow[middleIndex] = dataForPdf[0][0];
    newRow[0] = "";
    dataForPdf[0] = newRow;
    generatePdfFromSheetData(
      dataForPdf,
      sheetName.replace(".xlsx", ".pdf"),
      false
    );
  };

  const generatePdfFromSheetData = (worksheetData, pdfFileName, rtgs) => {
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "pt",
      format: "a4",
    }); // Initialize in landscape orientation

    // Extract headers and body from worksheet data
    const [headers, ...body] = worksheetData;

    // Set font size for headers and body
    const fontSize = 6;
    doc.setFontSize(fontSize);

    // Calculate maximum widths for each column based on the rtgs flag
    const columnWidths = headers.map((header, index) => {
      let maxWidth = rtgs ? doc.getTextWidth(header) : 0; // Start with header width

      // Check each row for the maximum width, including headers if rtgs is true
      body.forEach((row, rowIndex) => {
        if (rtgs || rowIndex > 2) {
          // Include headers and start from row 1 if rtgs is true
          const cellText = String(row[index] || "").trim();
          const cellWidth = doc.getTextWidth(cellText);
          maxWidth = Math.max(maxWidth, cellWidth); // Get max width for each column
        }
      });

      return maxWidth + 4; // Add padding
    });

    const startX = 10; // X position for the first column
    const padding = 2; // Padding for text inside cells
    const pageHeight = doc.internal.pageSize.height; // Total height of the page (landscape)
    const rowHeight = 10; // Height of each row
    const marginBottom = 20; // Set a bottom margin to avoid cutting off rows

    // Function to draw headers and the first four rows without borders
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
          const cellText = String(cell || "").trim();
          const cellX =
            startX +
            columnWidths.slice(0, cellIndex).reduce((a, b) => a + b, 0);
          doc.text(cellText, cellX + padding, rowY);
        });
      }
    };

    // Helper function to add a new page with landscape orientation
    const addNewPageWithLandscape = () => {
      doc.addPage("a4", "landscape"); // Ensure landscape mode for every new page
      drawHeadersAndFirstFourRows(20); // Draw headers and first four rows again for the new page
    };

    // Draw headers and the first four rows on the first page
    drawHeadersAndFirstFourRows(20);

    let currentRow = rtgs ? 1 : 4; // Start from the fifth row
    let currentPageRowIndex = 0; // Track the row index for the current page

    // Add body to PDF with pagination, starting from the fifth row
    while (currentRow < body.length) {
      // Calculate Y position for the current row
      const nextRowY = 20 + (currentPageRowIndex + (rtgs ? 1 : 5)) * rowHeight; // Adjust for the first four rows

      // Check if adding this row exceeds the page height
      if (nextRowY + rowHeight > pageHeight - marginBottom) {
        // If the row will exceed the page, add a new page
        addNewPageWithLandscape();
        currentPageRowIndex = 0; // Reset for the new page

        // Update nextRowY for the new page
        continue; // Skip this row to ensure the new page is ready before drawing
      }

      // Draw the current row
      const row = body[currentRow];
      row.forEach((cell, cellIndex) => {
        const cellText = String(cell || "").trim();
        const cellX =
          startX + columnWidths.slice(0, cellIndex).reduce((a, b) => a + b, 0);

        doc.text(cellText, cellX + padding, nextRowY); // Draw text

        // Draw rectangle around cell only for rows after the first four
        if (currentRow >= (rtgs ? 1 : 4)) {
          const rectWidth = columnWidths[cellIndex];
          const rectHeight = rowHeight; // Adjust as necessary

          // Validate the rectangle dimensions
          if (rectWidth > 0 && rectHeight > 0) {
            // Ensure all parameters are valid numbers before drawing
            doc.rect(
              cellX,
              nextRowY - rowHeight + 2,
              rectWidth,
              rectHeight,
              "S"
            ); // Draw rectangle around cell
          }
        }
      });

      currentRow++; // Move to the next row
      currentPageRowIndex++; // Move to the next row index for the current page
    }

    const signatureY = pageHeight - marginBottom - 40; // Position above the bottom margin
    const signatureStartX = 100; // Starting X position for the signatures
    const signatureEndX = doc.internal.pageSize.width - signatureStartX; // Ending X position

    const signatures = ["ACCOUNTANT", "MANAGING DIRECTOR", "HUMAN RESOURCE"];

    // Calculate the spacing between each signature
    const signatureSpacing =
      (signatureEndX - signatureStartX) / (signatures.length - 1);

    // Add signatures and their underlines at the bottom of the last page
    signatures.forEach((text, index) => {
      const signatureX = signatureStartX + index * signatureSpacing;

      // Calculate the width of the signature text to center it
      const textWidth = doc.getTextWidth(text);

      // Add the signature text, centered over the signature line
      doc.text(text, signatureX - textWidth / 2, signatureY);

      // Draw the signature line below the text
      doc.line(
        signatureX - 30, // Start the line 30pt to the left of the signature center
        signatureY + 10, // Line 10pt below the signature text
        signatureX + 30, // End the line 30pt to the right of the signature center
        signatureY + 10
      );
    });

    // Save the PDF with the specified file name
    doc.save(pdfFileName);
  };

  function exportRTGS(sheetData, selectedMonth, selectedYear) {
    const isAccountant = !!(
      Array.isArray(userRoles) &&
      userRoles.find((ele) => ele.name === "ACCOUNTANT")
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Salary Sheet");

    const headers = [
      "Account Number",
      "AMOUNT",
      "IFSC CODE",
      "BENEFICIARY A/C NO.",
      "BENEFICIARY NAME",
      "BANK ADDRESS",
      "BANK NAME",
    ];

    // Add headers
    const headerRow = worksheet.addRow(headers);
    headerRow.font = { bold: true }; // Make the first row bold

    // Add data rows
    sheetData.forEach((item) => {
      worksheet.addRow([
        zoneEntry[1] === "bijli" ? "708205010000115" : "708205010000111",
        item.netPaid,
        item.ifscCode,
        item.accountNumber,
        item.staffName,
        item.branch,
        item.bankName,
      ]);
    });

    // Set column widths based on maximum length of cells from row 6 onwards
    worksheet.columns.forEach((column) => {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
        if (rowNumber > 1) {
          // Start from row 6
          const cellValue = cell.value ? cell.value.toString() : ""; // Ensure we get string length
          maxLength = Math.max(maxLength, cellValue.length);
        }
      });
      column.width = maxLength + 2; // Adding extra padding for better visibility
    });

    // Apply border to each cell
    worksheet.eachRow((row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    if (isAccountant) {
      // Write the Excel file to a buffer and trigger download
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Trigger download in the browser
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${selectedMonth}_${selectedYear}_RTGT_Report.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up the link element
      });
    }

    // Prepare data for PDF
    const dataForPdf = sheetData.map((item) => [
      zoneEntry[1] === "bijli" ? "708205010000115" : "708205010000111",
      item.netPaid,
      item.ifscCode,
      item.accountNumber,
      item.staffName,
      item.branch,
      item.bankName,
    ]);

    //Insert headers
    dataForPdf.unshift(headers);

    generatePdfFromSheetData(dataForPdf, "rtgs.pdf", true);
  }
  return (
    <div>
      <div className="flex justify-between items-center mb-3 px-5 bg-white  shadow-small rounded-large">
        <div className="flex items-center gap-3 p-3">
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
          />
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
                All Employee RTGS Report
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
      <AsyncPaginateTable
        columns={columns}
        actionButtons={actionButtons}
        resourceUrl={`${baseUrl}/api/v1/spsm/view/STAFF_DOC/`}
        page={search.length > 3 ? false : page}
        data={filteredData}
        setPage={setPage}
        loadingState={loadingState}
      />
    </div>
  );
}
