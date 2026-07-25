"use client";
import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Select,
  SelectItem,
  Tooltip,
} from "@nextui-org/react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import { months } from "@/utils/constant";
import { usePathname } from "next/navigation";
import ExcelJS from "exceljs";
import jsPDF from "jspdf";
import { getCookie } from "@/utils/cookieUtils";
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
  { key: "name", value: "Name" },
  { key: "empNo", value: "Employee No" },
  { key: "deduction", value: "Deduction" },
];

export default function MonthlyDeductions() {
  const [selectedMonth, setSelectedMonth] = useState(new Set([]));
  const [userRoles, setUserRoles] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Set([]));
  const [deducType, setDeducType] = useState(new Set([]));
  const [search, setSearch] = useState("");
  const [allEmpList, setAllEmpList] = useState("");
  const [page, setPage] = useState(1);
  const pathName = usePathname();

  useEffect(() => {
    (async () => {
      const userData = await getCookie("user");
      setUserRoles(JSON.parse(userData).roles);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if ([...selectedYear][0] && [...selectedMonth][0] && [...deducType][0]) {
      getAllempList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear, selectedMonth, deducType]);

  async function getAllempList() {
    const token = await getCookie("accessToken");
    const response = await getData(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/payroll/deduction-salary?month=${[...selectedMonth][0]}&year=${
        [...selectedYear][0]
      }&type=${
        [...deducType][0]
      }&isReport=${true}&pageNumber=${page}&pageSize=20`,
      token
    );

    if (Array.isArray(response?.results) && response?.results.length) {
      const updatedResponse = response.results.map((ele) => ({
        name: ele[0],
        empNo: ele[1],
        deduction: ele[2],
      }));
      setAllEmpList(updatedResponse);
    }
  }

  const resourceUrl = useMemo(() => {
    const year = [...selectedYear][0];
    const month = [...selectedMonth][0];
    const type = [...deducType][0];

    if (year && month && type) {
      if (search.length > 3) {
        return `${baseUrl}/api/spshrm/${
          baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
        }/payroll/search-details?emp_no=${search}&month=${month}&year=${year}`;
      }
      return `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/payroll/deduction-salary?month=${month}&year=${year}&type=${type}&isReport=${false}&pageNumber=${page}&pageSize=20`;
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear, selectedMonth, deducType, search, page]);

  const { data, isLoading } = useSWR(resourceUrl, fetcher, {
    keepPreviousData: true,
  });
  const loadingState = isLoading || !data ? "loading" : "idle";

  const filteredData = useMemo(
    () => ({
      results: data?.results?.map((ele) => {
        return {
          name: ele[0],
          empNo: ele[1],
          deduction: ele[2],
        };
      }),
      count: data?.count,
    }),
    [data]
  );

  async function exportToExcel(type, data) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Monthly Deductions");

    const natureOfWork = `Nature of work: ${Object.entries(baseZone)
      ?.find((ele) => ele[0] === pathName.split("/")[pathName.includes("/hrms") ? 3 : 1])[0]
      .toUpperCase()
      .replace("-", " ")}`;
    const nature = worksheet.addRow([natureOfWork]);
    nature.font = { bold: true, size: 14 };
    nature.alignment = { horizontal: "center" };
    // Add a custom heading row at the top (row 1)
    const monthName = [...selectedMonth][0];
    const heading = `${[...deducType][0]} Summary Report of ${monthName} (${
      [...selectedYear][0]
    })`;
    const titleRow = worksheet.addRow([heading]);
    worksheet.mergeCells("A1:C1");
    worksheet.mergeCells("A2:C2");
    titleRow.font = { bold: true, size: 14 };
    titleRow.alignment = { horizontal: "center" };

    // Add header row (row 2)
    const headerRow = worksheet.addRow(["Name", "Employee No", "Deduction"]);
    headerRow.font = { bold: true };

    // Define a border style
    const borderStyle = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    // Apply border to header row using _cells
    headerRow._cells.forEach((cell) => {
      cell.border = borderStyle;
    });

    let totalDeductions = 0;

    // Add data rows (starting from the 3rd row)
    data.forEach((item) => {
      const row = worksheet.addRow([item.name, item.empNo, item.deduction]);
      row.font = { bold: false };
      totalDeductions += parseFloat(item.deduction);

      // Apply border to each cell in the row using _cells
      row._cells.forEach((cell) => {
        cell.border = borderStyle;
      });
    });

    // Add a row for the total deduction at the end of the table
    const totalRow = worksheet.addRow([
      "Total",
      "",
      totalDeductions.toFixed(2),
    ]);
    totalRow.font = { bold: true };

    // Apply border to the total row using _cells
    totalRow._cells.forEach((cell) => {
      cell.border = borderStyle;
    });

    // Adjust column widths
    worksheet.getColumn(1).width = 30; // Name
    worksheet.getColumn(2).width = 20; // Employee No
    worksheet.getColumn(3).width = 15; // Deduction

    // Export the workbook to a file and create a Blob for download
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Trigger a download using native browser functionality
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${type}_deductions_${monthName}.xlsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function exportToPDF(data) {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const marginBottom = 20;

    // Add nature of work at the top (1st row)
    const natureOfWork = `Nature of work: ${Object.entries(baseZone)
      ?.find((ele) => ele[0] === pathName.split("/")[pathName.includes("/hrms") ? 3 : 1])[0]
      .toUpperCase()
      .replace("-", " ")}`;

    doc.setFontSize(12);
    doc.setFont("normal");

    const natureOfWorkWidth = doc.getTextWidth(natureOfWork);
    const natureOfWorkX = (pageWidth - natureOfWorkWidth) / 2; // Center the nature of work text
    doc.text(natureOfWork, natureOfWorkX, 20); // Placed in the 1st row

    // Adjust the position of the main heading to follow the nature of work
    const monthName = [...selectedMonth][0];
    const year = [...selectedYear][0];
    const heading = `${
      [...deducType][0]
    } Summary Report of ${monthName} (${year})`;

    // Set font size for the title and make it bold
    doc.setFontSize(14);
    doc.setFont("bold");

    const headingWidth = doc.getTextWidth(heading);
    const headingX = (pageWidth - headingWidth) / 2; // Center the heading
    doc.text(heading, headingX, 40); // Placed below nature of work

    doc.setFont("normal");

    // Create the header
    doc.setFontSize(12);
    const headers = ["Name", "Employee No", "Deduction"];

    // Calculate the maximum width for each column based on header and data
    const columnWidths = headers.map((header) => doc.getTextWidth(header) + 20);

    data.forEach((item) => {
      const cells = [item.name, item.empNo, item.deduction.toString()];
      cells.forEach((cell, index) => {
        const cellWidth = doc.getTextWidth(cell) + 20;
        if (cellWidth > columnWidths[index]) {
          columnWidths[index] = cellWidth;
        }
      });
    });

    const startX = (pageWidth - columnWidths.reduce((a, b) => a + b, 0)) / 2; // Center the table
    let headerY = 60; // Position for the header on the first page

    // Draw header text and borders
    headers.forEach((header, index) => {
      const x =
        startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0);
      doc.text(header, x + 5, headerY + 12);

      // Draw borders for header cells
      doc.setLineWidth(0.5);
      doc.line(x, headerY, x + columnWidths[index], headerY);
      doc.line(x, headerY, x, headerY + 20);
      doc.line(
        x + columnWidths[index],
        headerY,
        x + columnWidths[index],
        headerY + 20
      );
    });

    doc.line(
      startX,
      headerY,
      startX + columnWidths.reduce((a, b) => a + b, 0),
      headerY
    );

    let y = headerY + 20;
    let totalDeductions = 0;

    // Add data rows
    data.forEach((item, rowIndex) => {
      // Check if y exceeds the page height and add a new page if necessary
      if (y + 10 > pageHeight - marginBottom) {
        doc.addPage("a4", "portrait");
        y = 20; // Start from the top of the second page (no margin at the top)

        // Re-draw the header on the new page
        headers.forEach((header, index) => {
          const x =
            startX + columnWidths.slice(0, index).reduce((a, b) => a + b, 0);
          doc.text(header, x + 5, y + 12); // Header text

          doc.setLineWidth(0.5);
          doc.line(x, y, x + columnWidths[index], y); // Top border
          doc.line(x, y, x, y + 20); // Left border
          doc.line(x + columnWidths[index], y, x + columnWidths[index], y + 20); // Right border
        });
        doc.line(
          startX,
          y,
          startX + columnWidths.reduce((a, b) => a + b, 0),
          y
        ); // Line under header
        y += 20; // Adjust y for the new content
      }

      const cells = [item.name, item.empNo, item.deduction.toString()];

      cells.forEach((cell, cellIndex) => {
        const x =
          startX + columnWidths.slice(0, cellIndex).reduce((a, b) => a + b, 0);
        doc.text(cell, x + 5, y + 12); // Added padding for cell text

        doc.setLineWidth(0.5);
        doc.line(x, y, x + columnWidths[cellIndex], y); // Top border
        doc.line(x, y, x, y + 20); // Left border
        doc.line(
          x + columnWidths[cellIndex],
          y,
          x + columnWidths[cellIndex],
          y + 20
        ); // Right border
        doc.line(x, y + 20, x + columnWidths[cellIndex], y + 20); // Bottom border
      });

      totalDeductions += parseFloat(item.deduction);
      y += 20;
    });

    // Total deductions in first column
    doc.setFontSize(12);
    doc.setFont("bold");
    const totalText = "Total:";
    doc.text(totalText, startX + 5, y + 10);
    doc.setFont("normal");

    const totalAmountText = totalDeductions.toFixed(2);
    const totalAmountX = startX + columnWidths[0] + columnWidths[1];
    doc.text(totalAmountText, totalAmountX + 5, y + 10);

    // Signatures section (as in your original code)
    const signatureY = pageHeight - marginBottom - 40;
    const signatureStartX = 100;
    const signatureEndX = doc.internal.pageSize.width - signatureStartX;
    const signatures = ["ACCOUNTANT", "MANAGING DIRECTOR", "HUMAN RESOURCE"];
    const signatureSpacing =
      (signatureEndX - signatureStartX) / (signatures.length - 1);

    signatures.forEach((text, index) => {
      const signatureX = signatureStartX + index * signatureSpacing;
      const textWidth = doc.getTextWidth(text);
      doc.text(text, signatureX - textWidth / 2, signatureY);
      doc.line(
        signatureX - 40,
        signatureY + 10,
        signatureX + 40,
        signatureY + 10
      );
    });

    doc.save("report.pdf");
  }

  function handleExport(type) {
    const isAccountant = !!(
      Array.isArray(userRoles) &&
      userRoles.find((ele) => ele.name === "ACCOUNTANT")
    );

    if (isAccountant) {
      if (type === "allEmployee") {
        exportToExcel("withDetails", allEmpList);
        exportToPDF(allEmpList);
      } else {
        exportToExcel("withDetails", filteredData.results);
        exportToPDF(filteredData.results);
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-3 px-5 bg-white shadow-small rounded-large">
        <div className="flex items-center gap-3 p-3">
          <Select
            aria-label="Select year"
            name="year"
            variant="bordered"
            labelPlacement="outside"
            selectedKeys={selectedYear}
            placeholder="Year"
            onSelectionChange={setSelectedYear}
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
            isDisabled={selectedYear.size > 0}
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
              name="month"
              variant="bordered"
              labelPlacement="outside"
              selectedKeys={selectedMonth}
              placeholder="Month"
              onSelectionChange={setSelectedMonth}
              size="sm"
              classNames={{
                base: "max-w-full sm:min-w-48 h-8",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper: "h-full font-normal text-default-500 h-8",
              }}
            >
              {[...selectedYear].length > 0 &&
                Object.keys(months).map((ele) => (
                  <SelectItem key={ele}>{ele}</SelectItem>
                ))}
            </Select>
          </Tooltip>

          <Select
            aria-label="Select Type"
            name="type"
            variant="bordered"
            labelPlacement="outside"
            selectedKeys={deducType}
            placeholder="Type"
            onSelectionChange={setDeducType}
            size="sm"
            classNames={{
              base: "max-w-full sm:min-w-48 h-8",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper: "h-full font-normal text-default-500 h-8",
            }}
          >
            {["TDS", "PF", "ESI"].map((ele) => (
              <SelectItem key={ele}>{ele}</SelectItem>
            ))}
          </Select>

          {/* <Input
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
            isDisabled={selectedYear.size === 0 || selectedMonth.size === 0}
          /> */}
        </div>
        <div className="flex gap-4">
          <Dropdown isDisabled={!filteredData?.results?.length}>
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
                onClick={() => handleExport("current")}
              >
                Current Page
              </DropdownItem>
              <DropdownItem
                key="allEmployee"
                onClick={() => handleExport("allEmployee")}
              >
                All Employee
              </DropdownItem>
              {/* <DropdownItem
                key="AllEmpWithDetails"
                onClick={() => exportToExcel("withDetails", allEmpList)}
              >
                All Employee
              </DropdownItem> */}
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      <AsyncPaginateTable
        columns={columns}
        selectButton={"single"}
        resourceUrl={`${baseUrl}/api/v1/spsm/view/STAFF_DOC/`}
        page={search.length > 3 ? false : page}
        data={filteredData || []}
        setPage={setPage}
        loadingState={loadingState}
      />
    </div>
  );
}
