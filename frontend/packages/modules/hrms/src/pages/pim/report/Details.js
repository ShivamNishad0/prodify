"use client";
import { Divider, Image, Input } from "@nextui-org/react";
import React, { useContext, useEffect, useState } from "react";
import PIMReport from "@/context/PIMReport";
import CustomTable from "@/components/tables/Table";
import { FaSearch } from "react-icons/fa";
import { getData } from "@/utils/api";
import { getCookie } from "@/utils/cookieUtils";
import { months } from "@/utils/constant";
import { usePathname } from "next/navigation";

const attendanceColumn = [
  { key: "month", value: "Month" },
  { key: "totalWorkingDays", value: "Total Working Days" },
  { key: "noOfDayPresent", value: "Present" },
  { key: "noOfDayHalfPresent", value: "Half Day" },
  { key: "noOfPaidLeave", value: "Paid Leave" },
  { key: "noOfWO", value: "Week Off" },
  { key: "noOfHoliday", value: "Holidays" },
  { key: "noOfDayAbsent", value: "Absent" },
  // { key: "empName5", value: "Leave" },
];

const salaryColumn = [
  { key: "month", value: "Month" },
  { key: "basic", value: "Basic/Da" },
  { key: "hra", value: "HRA" },
  { key: "conv_or_Other", value: "Conveyance/Others" },
  { key: "gross", value: "Gross" },
  { key: "empESI", value: "ESI" },
  { key: "empPF", value: "PF" },
  { key: "advance", value: "Advance" },
  { key: "advanceRemark", value: "Advance Remark" },
  { key: "deduction", value: "Deduction" },
  { key: "deductionRemark", value: "Deduction Remark" },
  { key: "netPaid", value: "Net Paid" },
];

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);
export default function Details() {
  const pathName = usePathname();
  const { user, salary } = useContext(PIMReport);
  const [salaryYear, setSalaryYear] = useState(currentYear);
  const [attdYear, setAttdYear] = useState(currentYear);
  const [attendance, setAttendance] = useState("");
  const [salaryDetails, setSalaryDetails] = useState("");

  useEffect(() => {
    getAllAttendance();
    getAllSalary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getAllAttendance() {
    const token = await getCookie("accessToken");
    const response = await getData(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/attendance/details/${user.tempEmp}/${attdYear}`,
      token
    );
    if (response) {
      response.forEach((ele) => {
        const monthIndex = months[ele.month.toUpperCase()];
        const daysInMonth = new Date(attdYear, monthIndex + 1, 0).getDate();
        ele.totalWorkingDays = daysInMonth;
      });

      const totalCalc = {
        totalWorkingDays: 0,
        noOfDayPresent: 0,
        noOfDayHalfPresent: 0,
        noOfDayAbsent: 0,
        noOfPaidLeave: 0,
        noOfWO: 0,
        noOfHoliday: 0,
      };

      response.forEach((ele) => {
        for (const key in totalCalc) {
          if (totalCalc.hasOwnProperty(key)) {
            totalCalc[key] += parseFloat(ele[key] || 0);
          }
        }
      });

      const finalTotalCalc = {
        tableTitle: "Total",
        month: "Total",
        ...totalCalc,
      };

      response.push(finalTotalCalc);
      setAttendance(response);
    }
  }

  async function getAllSalary() {
    const token = await getCookie("accessToken");
    const zoneCookie = await getCookie("zone");
    const response = await getData(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/payroll/emp-annual-details?empNo=${user.tempEmp}&zoneId=${JSON.parse(
        zoneCookie
      )}&year=${salaryYear}`,
      token
    );
    if (response) {
      Array.isArray(response) &&
        response.forEach((ele) => {
          const monthIndex = months[ele.month.toUpperCase()];
          const daysInMonth = new Date(salaryYear, monthIndex + 1, 0).getDate();
          ele.totalWorkingDays = daysInMonth;
        });
      const totalCalc = {
        basic: 0,
        hra: 0,
        conv_or_Other: 0,
        gross: 0,
        empESI: 0,
        empPF: 0,
        advance: 0,
        advanceRemark: "",
        deduction: 0,
        gross: 0,
        netPaid: 0,
      };
      Array.isArray(response) &&
        response.forEach((ele) => {
          for (const key in totalCalc) {
            if (totalCalc.hasOwnProperty(key)) {
              totalCalc[key] = parseFloat(totalCalc[key]) || 0;
              const value = parseFloat(ele[key]) || 0;
              totalCalc[key] = parseFloat((totalCalc[key] + value).toFixed(2));
            }
          }
        });

      const finalTotalCalc = {
        tableTitle: "Total",
        month: "Total",
        ...totalCalc,
        advanceRemark: "",
      };

      Array.isArray(response) && response.push(finalTotalCalc);
      Array.isArray(response) && setSalaryDetails(response);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex rounded-md justify-center bg-white max-h-min w-full text-xl font-bold">
        Profile Of {user.name}
      </div>
      <div className="flex rounded-large justify-evenly bg-white max-h-min w-full">
        <div className="h-inherit flex items-center">
          <div className="flex flex-col gap-2 w-full pr-4">
            <span className="w-full text-center text-lg font-semibold">
              Personal Details
            </span>
            <div className="flex gap-3">
              <Image
                alt="Card background"
                className="object-cover rounded-xl"
                src={
                  user.staffImg
                    ? `${baseUrl}/api/v1/spsm/view/STAFF_IMG/${user.staffImg}`
                    : ""
                }
                width={150}
              />
              <div className="flex flex-col">
                <span className="font-bold text-center">{user.name}</span>
                <span>
                  <span className="font-bold">Employee No - </span>{" "}
                  {user.tempEmp}
                </span>
                <span>
                  <span className="font-bold">DOB - </span> {user.dob}
                </span>
                <span>
                  <span className="font-bold">Phone - </span> {user.contactNo}
                </span>
                <span>
                  <span className="font-bold">Location - </span>
                  {user?.area?.subDivision}
                </span>
                <span>
                  <span className="font-bold">Date Of Joining - </span>
                  {user.dateOfJoining}
                </span>
                <span>
                  <span className="font-bold">Designation - </span>
                  {user.designation}
                </span>
                <span>
                  <span className="font-bold">Blood Group - </span>
                  {user.bloodGroup}
                </span>
              </div>
            </div>
          </div>
        </div>
        <Divider className="h-inherit" orientation="vertical" />
        <div className="h-auto">
          <div className="flex flex-col gap-2 w-full h-full pr-4">
            <span className="w-full text-center text-lg font-semibold">
              Documents
            </span>
            <div className="flex flex-col">
              <span>
                <span className="font-bold">Aadhar Number - </span>
                {user.aadharNo}{" "}
                {user.addharBackDoc && user.addharFrontDoc
                  ? ""
                  : "(Not Uploaded)"}
              </span>
              <span>
                <span className="font-bold">PAN - </span> {user.panCard}{" "}
                {user.addharFrontDoc ? "" : "(Not Uploaded)"}
              </span>
              <span>
                <span className="font-bold">Driving Licence - </span>{" "}
                {user.dlNo} {user.addharFrontDoc ? "" : "(Not Uploaded)"}
              </span>
              <span>
                <span className="font-bold">Character Verification - </span>
                {user.isCharaterVerified === "TRUE"
                  ? "Verified"
                  : "Not Verified"}
              </span>
            </div>
          </div>
        </div>
        <Divider className="h-inherit" orientation="vertical" />
        <div className="h-auto">
          <div className="flex flex-col gap-2 w-full h-full pr-4">
            <span className="w-full text-center text-lg font-semibold">
              Payment Details
            </span>
            <div className="flex flex-col">
              <span>
                <span className="font-bold">Bank - </span>
                {user.bankName}
              </span>
              <span>
                <span className="font-bold">Branch - </span>
                {user.branch}
              </span>
              <span>
                <span className="font-bold">Account Number - </span>
                {user.accountNumber}
              </span>
              <span>
                <span className="font-bold">IFSC - </span>
                {user.ifscCode}
              </span>
              <span>
                <span className="font-bold">Gross - </span>₹ {salary?.gross}
              </span>
              <span>
                <span className="font-bold">Basic - </span>₹{" "}
                {parseFloat(salary?.basic) + parseFloat(salary?.da)}
              </span>
              <span>
                <span className="font-bold">HRA - </span>₹ {salary?.hra}
              </span>
              <span>
                <span className="font-bold">Conveyance/Other - </span>₹{" "}
                {salary?.conv_oth}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 rounded-large justify-evenly bg-white max-h-min w-full">
        <div className="flex justify-between p-2 px-5 items-center">
          <h1 className="text-center font-semibold text-xl">
            Attendance Details
          </h1>
          <Input
            classNames={{
              base: "max-w-[160px] sm:min-w-48 h-8",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper: "h-full font-normal text-default-500 h-8",
            }}
            variant="bordered"
            placeholder="Search Year..."
            aria-label="Employee Number"
            size="sm"
            value={attdYear}
            onValueChange={setAttdYear}
            startContent={<FaSearch size={18} />}
            type="search"
          />
        </div>
        <div className="p-4 pt-0">
          <CustomTable columns={attendanceColumn} data={attendance || []} />
        </div>
      </div>
      <div className="flex flex-col gap-2 rounded-large justify-evenly bg-white max-h-min w-full">
        <div className="flex justify-between p-2 px-5 items-center">
          <h1 className="text-center font-semibold text-xl">Salary Details</h1>
          <Input
            classNames={{
              base: "max-w-[160px] sm:min-w-48 h-8",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper: "h-full font-normal text-default-500 h-8",
            }}
            variant="bordered"
            placeholder="Search Year..."
            aria-label="Employee Number"
            size="sm"
            value={salaryYear}
            onValueChange={setSalaryYear}
            startContent={<FaSearch size={18} />}
            type="search"
          />
        </div>
        <div className="p-4 pt-0">
          <CustomTable columns={salaryColumn} data={salaryDetails || []} />
        </div>
      </div>
    </div>
  );
}
