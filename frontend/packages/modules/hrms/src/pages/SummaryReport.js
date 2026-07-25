"use client";
import React, { useEffect, useState } from "react";
import { getCookie } from "@/utils/cookieUtils";
import { usePathname } from "next/navigation";
import { Select, SelectItem } from "@nextui-org/select";
import { Tooltip } from "@nextui-org/react";
import ExcelJS from "exceljs"; // Make sure to install this
import jsPDF from "jspdf"; // Make sure to install this
import "jspdf-autotable"; // Make sure to install this
import { months } from "@/utils/constant";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

const SummaryReport = () => {
  const [userRoles, setUserRoles] = useState("");
  const [distributionData, setDistributionData] = useState(null);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(new Set([]));
  const [empType, setEmpType] = useState("");
  const [error, setError] = useState("");
  const pathName = usePathname();

  useEffect(() => {
    (async () => {
      const userData = await getCookie("user");
      setUserRoles(JSON.parse(userData).roles);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async () => {
    const token = await getCookie("accessToken");

    try {
      const url = `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/payroll/emp-annual-distribuction?month=${
        [...selectedMonth][0]
      }&year=${selectedYear}&type=${empType}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setDistributionData(data);
      setError(""); // Clear error if any
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
      setDistributionData(null);
    }
  };

  const exportToExcel = () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Payroll Distribution");

    // Define columns
    worksheet.columns = [
      { header: "Field", key: "field", width: 30 },
      { header: "Amount", key: "amount", width: 20 },
    ];

    // Add data rows
    if (distributionData) {
      const dataRows = [
        { field: "Total Basic", amount: distributionData.totalBasic },
        { field: "Total HRA", amount: distributionData.totalHra },
        {
          field: "Total Conveyance & Others",
          amount: distributionData.totalConvOther,
        },
        { field: "Total Gross", amount: distributionData.totalGross },
        { field: "Total Employee PF", amount: distributionData.totalEmpPf },
        { field: "Total Employee ESI", amount: distributionData.totalEmpEsi },
        { field: "Total Advance", amount: distributionData.totalAdvance },
        { field: "Total DA", amount: distributionData.totalDa },
        { field: "Total TDS", amount: distributionData.totalTds },
        { field: "Total Others", amount: distributionData.totalOthers },
        {
          field: "Total Deduction of Employee",
          amount: distributionData.totalDedOfEmp,
        },
        { field: "Total Additional", amount: distributionData.totalAdditional },
        { field: "Total Settled", amount: distributionData.totalSetteled },
        { field: "Previous Settlement", amount: distributionData.prevSetldAmt },
        { field: "Total Deductions", amount: distributionData.totalDeduction },
        { field: "Total Net Paid", amount: distributionData.totalNetPaid },
      ];

      worksheet.addRows(dataRows);
    }

    // Save Excel file
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: "application/octet-stream" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Payroll_Distribution.xlsx";
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("Payroll Distribution", 14, 22);

    const headers = [["Field", "Amount"]];
    const dataRows = distributionData
      ? [
          ["Total Basic", distributionData.totalBasic],
          ["Total HRA", distributionData.totalHra],
          ["Total Conveyance & Others", distributionData.totalConvOther],
          ["Total Gross", distributionData.totalGross],
          ["Total Employee PF", distributionData.totalEmpPf],
          ["Total Employee ESI", distributionData.totalEmpEsi],
          ["Total Advance", distributionData.totalAdvance],
          ["Total DA", distributionData.totalDa],
          ["Total TDS", distributionData.totalTds],
          ["Total Others", distributionData.totalOthers],
          ["Total Deduction of Employee", distributionData.totalDedOfEmp],
          ["Total Additional", distributionData.totalAdditional],
          ["Total Settled", distributionData.totalSetteled],
          ["Previous Settlement", distributionData.prevSetldAmt],
          ["Total Deductions", distributionData.totalDeduction],
          ["Total Net Paid", distributionData.totalNetPaid],
        ]
      : [];

    // Combine headers and data
    const finalData = headers.concat(dataRows);

    // Generate PDF table
    const tableStartY = 30; // Start Y position for the table
    doc.autoTable({
      head: headers,
      body: dataRows,
      startY: tableStartY,
    });

    // Signature section
    const pageHeight = doc.internal.pageSize.height;
    const marginBottom = 10; // Bottom margin
    const signatureY = pageHeight - marginBottom - 20; // Position signatures closer to the bottom of the page
    const signatureStartX = 20; // Increased starting X position for the signatures
    const signatureEndX = doc.internal.pageSize.width - 20; // Increased ending X position for the signatures

    const signatures = ["ACCOUNTANT", "MANAGING DIRECTOR", "HUMAN RESOURCE"];

    // Calculate the spacing to spread signatures across the full width
    const signatureSpacing =
      (signatureEndX - signatureStartX) / (signatures.length - 1);

    // Set font size for signatures
    doc.setFontSize(6); // Set font size to 6px

    // Add signatures and their underlines at the bottom of the last page
    signatures.forEach((text, index) => {
      const signatureX = signatureStartX + index * signatureSpacing; // Evenly space signatures across the full width

      // Calculate the width of the signature text to center it
      const textWidth = doc.getTextWidth(text);

      // Add the signature text, centered
      doc.text(text, signatureX - textWidth / 2, signatureY);

      // Draw the signature line only below the text
      doc.line(
        signatureX - textWidth / 2, // Start line at the beginning of the text
        signatureY + 5, // Line 5pt below the signature text
        signatureX + textWidth / 2, // End line at the end of the text
        signatureY + 5
      );
    });

    // Save PDF
    doc.save("Payroll_Distribution.pdf");
  };

  const handleExport = () => {
    const isAccountant = !!(
      Array.isArray(userRoles) &&
      userRoles.find((ele) => ele.name === "ACCOUNTANT")
    );
    if (isAccountant) exportToExcel();
    exportToPDF();
  };

  return (
    <div className="container mx-auto p-4">
      {/* Search Form */}
      <div className="mx-auto bg-white shadow-md rounded-md p-6">
        <div className="flex gap-5">
          <Select
            aria-label="Select Year"
            name="year"
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
          <div className="max-w-40">
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
                  base: "max-w-full sm:min-w-48 h-8",
                  mainWrapper: "h-full max-w-40",
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
          </div>
          <Select
            aria-label="Select Employee Type"
            name="status"
            variant="bordered"
            labelPlacement="outside"
            selectedKeys={[empType]}
            placeholder="Type"
            onChange={(e) => {
              setEmpType(e.target.value);
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
            <SelectItem key={"active"}>Working</SelectItem>
            <SelectItem key={"inactive"}>Resigned</SelectItem>
          </Select>
          <button
            onClick={handleSubmit}
            disabled={!selectedYear || !selectedMonth.size || !empType}
            className="w-full cursor-pointer disabled:cursor-default bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-400 max-w-40 rounded-full"
          >
            Search
          </button>
          <button
            onClick={handleExport}
            disabled={
              !selectedYear ||
              !selectedMonth.size ||
              !empType ||
              !distributionData
            }
            className="w-full cursor-pointer disabled:cursor-default bg-green-500 text-white hover:bg-green-600 disabled:bg-green-400 max-w-40 rounded-full"
          >
            Export
          </button>
        </div>
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {/* Display Data */}
      {distributionData && (
        <div className="mt-6 bg-white shadow-md rounded-md p-6">
          <h3 className="text-xl font-semibold">Distribution Data</h3>
          <table className="min-w-full mt-4 border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Field</th>
                <th className="border border-gray-300 px-4 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  Total Basic
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {distributionData.totalBasic}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Total HRA</td>
                <td className="border border-gray-300 px-4 py-2">
                  {distributionData.totalHra}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  Total Conveyance & Others
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {distributionData.totalConvOther}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  Total Gross
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {distributionData.totalGross}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  Total Employee PF
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {distributionData.totalEmpPf}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  Total Employee ESI
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {distributionData.totalEmpEsi}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  Total Advance
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {distributionData.totalAdvance}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Total DA</td>
                <td className="border border-gray-300 px-4 py-2">
                  {distributionData.totalDa}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">Total TDS</td>
                <td className="border border-gray-300 px-4 py-2">
                  {distributionData.totalTds}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  Total Others
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {distributionData.totalOthers}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  Total Deduction of Employee
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {distributionData.totalDedOfEmp}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  Total Additional
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {distributionData.totalAdditional}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  Total Settled
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {distributionData.totalSetteled}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  Previous Settlement
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {distributionData.prevSetldAmt}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  Total Deductions
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {distributionData.totalDeduction}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  Total Net Paid
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {distributionData.totalNetPaid}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SummaryReport;
