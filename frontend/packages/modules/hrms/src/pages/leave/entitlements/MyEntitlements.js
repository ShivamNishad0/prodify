"use client";
import {
  Button,
  DateRangePicker,
  Divider,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import React, { useState } from "react";
import { parseDate } from "@internationalized/date";
import CustomTable from "@/components/tables/Table";
import { useRouter } from "next/navigation";

const initialState = {
  status: new Set([]),
  type: new Set([]),
};

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
export default function MyEntitlements() {
  const [leave, setLeave] = useState(initialState);
  const [value, setValue] = useState({
    start: parseDate("2024-04-01"),
    end: parseDate("2024-04-08"),
  });
  const router = useRouter();
  return (
    <div className="flex flex-col gap-5">
      <div className="p-6 bg-white rounded-[1.2rem] flex flex-col gap-4">
        <div className="text-[#8896af] text-lg font-bold">My Entitlements</div>
        <Divider />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Select
            label="Leave Type"
            name="leaveType"
            placeholder="--Select--"
            labelPlacement="outside"
            variant="bordered"
            selectedKeys={leave.status}
            className="max-w-xs"
            // onChange={handleStatusChange}
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
          <DateRangePicker
            label="Leave Period"
            isRequired
            value={value}
            onChange={setValue}
            variant="bordered"
            showMonthAndYearPickers
            labelPlacement="outside"
            classNames={{
              wrapper: "text-[#ffffff]",
            }}
          />
        </div>
        <Divider />
        <div className="flex justify-end gap-4">
          <Button className="bg-[#76bc21] rounded-full h-8 min-w-24 text-white text-sm">
            Search
          </Button>
        </div>
      </div>
      <div className="p-6 bg-white rounded-[1.2rem] flex flex-col gap-4">
        <div className="flex justify-start gap-4">
          <Button
            className="bg-[#76bc21] rounded-full h-8 min-w-24 text-white text-sm"
            onClick={() => router.push("/head-office/leave/add-entitlements")}
          >
            + Add
          </Button>
        </div>
        <Divider />
        <CustomTable
          columns={columns}
          data={[]}
          //   actionButtons={actionButtons}
        />
      </div>
    </div>
  );
}
