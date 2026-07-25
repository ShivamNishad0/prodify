"use client";
import React, { useState } from "react";
import {
  Button,
  DatePicker,
  Divider,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
import CustomTable from "@/components/tables/Table";
import { todayDateString } from "@/utils/getPimData";

const initialState = {
  status: new Set([]),
  type: new Set([]),
  fromDate: parseDate(todayDateString()),
  toDate: parseDate(todayDateString()),
};

export default function MyLeave() {
  const [leave, setLeave] = useState(initialState);
  const columns = [
    { key: "name", value: "Date" },
    { key: "postOf", value: "Employee Name" },
    { key: "contactNo", value: "Leave Type" },
    { key: "tempEmp", value: "Leave Balance (Days)" },
    { key: "verified", value: "Number of Days" },
    { key: "status", value: "Status" },
    { key: "comments", value: "Comments" },
    { key: "action", value: "Actions" },
  ];

  const handleDateChange = (name, value) => {
    setLeave((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStatusChange = (e) => {
    const { name, value } = e.target;
    setLeave((prevData) => ({
      ...prevData,
      [name]: new Set(e.target.value.split(",")),
    }));
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="p-6 bg-white rounded-[1.2rem] flex flex-col gap-4">
        <div className="text-[#8896af] text-lg font-bold">My Leave List</div>
        <Divider />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <DatePicker
            label="From"
            variant="bordered"
            showMonthAndYearPickers
            labelPlacement="outside"
            value={leave.fromDate}
            classNames={{
              label: "text-[#f50000] text-3xl",
              timeInputLabel: "text-[#f50000] text-3xl",
              wrapper: "text-[#ffffff]",
            }}
            onChange={(date) => handleDateChange("fromDate", date)}
          />
          <DatePicker
            label="To"
            variant="bordered"
            showMonthAndYearPickers
            labelPlacement="outside"
            value={leave.toDate}
            classNames={{
              label: "text-[#f50000] text-3xl",
              timeInputLabel: "text-[#f50000] text-3xl",
              wrapper: "text-[#ffffff]",
            }}
            onChange={(date) => handleDateChange("toDate", date)}
          />
          <div className="flex w-full max-w-xs flex-col gap-2">
            <Select
              label="Show Leave with Status"
              name="status"
              isRequired
              selectionMode="multiple"
              placeholder="--Select--"
              labelPlacement="outside"
              variant="bordered"
              selectedKeys={leave.status}
              className="max-w-xs"
              onChange={handleStatusChange}
            >
              {[
                "Cancelled",
                "Pending Approval",
                "Scheduled",
                "Taken",
                "Rejected",
              ].map((leaveType) => (
                <SelectItem key={leaveType}>{leaveType}</SelectItem>
              ))}
            </Select>

            <div className="text-xs text-default-500 flex flex-wrap gap-2">
              {Array.from(leave.status).map((ele) => (
                <span
                  key={ele}
                  className="bg-slate-100 w-fit rounded-full px-2"
                >
                  {ele}
                </span>
              ))}
            </div>
          </div>
          <div className="flex w-full max-w-xs flex-col gap-2">
            <Select
              label="Show Leave with Status"
              name="type"
              placeholder="--Select--"
              labelPlacement="outside"
              variant="bordered"
              selectedKeys={leave.type}
              className="max-w-xs"
              onChange={handleStatusChange}
            >
              {[
                "Earned Leave",
                "Unpaid Leave",
                "Sick Leave",
                "Casual Leave",
              ].map((leaveType) => (
                <SelectItem key={leaveType}>{leaveType}</SelectItem>
              ))}
            </Select>
          </div>
        </div>
        <Divider />
        <div className="flex justify-end gap-4">
          <Button
            variant="bordered"
            className="rounded-full h-8 min-w-24 border-[#76bc21] border-1 text-[#76bc21] text-sm"
            onClick={() => setLeave(initialState)}
          >
            Reset
          </Button>
          <Button className="bg-[#76bc21] rounded-full h-8 min-w-24 text-white text-sm">
            Search
          </Button>
        </div>
      </div>
      <CustomTable
        columns={columns}
        data={[]}
        //   actionButtons={actionButtons}
      />
    </div>
  );
}
