"use client";
import {
  Button,
  DateRangePicker,
  Divider,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectItem,
} from "@nextui-org/react";
import React, { useState } from "react";
import { parseDate } from "@internationalized/date";
import CustomTable from "@/components/tables/Table";
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

export default function AddEntitlements() {
  const [leave, setLeave] = useState(initialState);
  const [radio, setRadio] = useState("INDIVIDUAL EMPLOYEE");
  const [value, setValue] = useState({
    start: parseDate("2024-04-01"),
    end: parseDate("2024-04-08"),
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="p-6 bg-white rounded-[1.2rem] flex flex-col gap-4">
        <div className="text-[#8896af] text-lg font-bold">
          Add Leave Entitlement
        </div>
        <Divider />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <RadioGroup
            className="col-span-3"
            label="Add to"
            orientation="horizontal"
            value={radio}
            onValueChange={setRadio}
          >
            <Radio value="INDIVIDUAL EMPLOYEE">Individual Employee</Radio>
            <Radio value="MULTIPLE EMPLOYEES">Multiple Employees</Radio>
          </RadioGroup>
          <div className="col-span-3 grid grid-cols-3">
            {radio === "INDIVIDUAL EMPLOYEE" ? (
              <Input
                label="Employee Name"
                isRequired
                placeholder="Type for hints"
                variant="bordered"
                labelPlacement="outside"
                fullWidth
                // value={exp.company}
                name="company"
                // onChange={(e) => handleExpChange(e, "exp")}
              />
            ) : (
              <>
                <Select
                  label="Location"
                  name="location"
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
                <Select
                  label="Sub Unit"
                  name="subUnit"
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
              </>
            )}
          </div>
          <div className="col-span-3 grid grid-cols-3 gap-4">
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
            <Input
              label="Entitlement"
              placeholder=""
              labelPlacement="outside"
              variant="bordered"
              required
              fullWidth
              name="contactNo"
              // onChange={handleChange}
            />
          </div>
        </div>
        <Divider />
        <div className="flex justify-end gap-4">
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
