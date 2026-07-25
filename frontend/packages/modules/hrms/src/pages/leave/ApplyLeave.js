"use client";
import {
  Button,
  DateRangePicker,
  Divider,
  Select,
  SelectItem,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { parseDate } from "@internationalized/date";
import CustomTable from "@/components/tables/Table";
import { usePathname, useRouter } from "next/navigation";
import { todayDateString } from "@/utils/getPimData";
import { getCookie } from "@/utils/cookieUtils";
import { getData, postData } from "@/utils/api";
import { formatDate } from "@/utils/formatDate";
import { Textarea } from "@nextui-org/react";
import toast from "react-hot-toast";

const columns = [
  { key: "fromDate", value: "From Date" },
  { key: "toDate", value: "To date" },
  { key: "leaveType", value: "Leave Type" },
  { key: "leaveStatus", value: "Status" },
  { key: "comments", value: "Comments" },
];

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

export default function ApplyLeave() {
  const pathName = usePathname();
  const [leave, setLeave] = useState(new Set([]));
  const [leaveDate, setLeaveDate] = React.useState({
    start: parseDate(todayDateString()),
    end: parseDate(todayDateString()),
  });
  const [comment, setComment] = useState("");
  const [leaveList, setLeaveList] = useState("");

  const router = useRouter();

  useEffect(() => {
    getLeaveList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const userData = {
    staffId: 69,
    empNo: "ER-2400069",
  };

  async function handleLeaveApplication() {
    const token = await getCookie("accessToken");
    const userDataCookie = await getCookie("userData");
    const zoneCookie = await getCookie("zone");
    // const userData = await JSON.parse(userDataCookie || "");

    const payload = {
      staffId: userData.staffId,
      zoneId: zoneCookie,
      empNo: userData.empNo,
      fromDate: formatDate(leaveDate.start),
      toDate: formatDate(leaveDate.end),
      leaveType: [...leave][0],
      createdBy: userData.staffId,
      comments: comment,
    };
    const response = await postData(
      `${baseUrl}/api/spshrm/${baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]}/leave/apply`,
      payload,
      token
    );
    if (response) {
      toast.success(response);
      getLeaveList();
    }
  }

  async function getLeaveList() {
    const token = await getCookie("accessToken");
    const response = await getData(
      `${baseUrl}/api/spshrm/${baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]}/leave/staff/${
        userData.staffId
      }`,
      token
    );
    if (Array.isArray(response)) {
      setLeaveList(response);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="p-6 bg-white rounded-[1.2rem] flex flex-col gap-4">
        <div className="text-[#8896af] text-lg font-bold">My Leave</div>
        <Divider />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="flex w-full max-w-xs flex-col gap-2">
            <Select
              label="Leave with Status"
              name="type"
              placeholder="--Select--"
              labelPlacement="outside"
              variant="bordered"
              selectedKeys={leave}
              className="max-w-xs"
              onSelectionChange={setLeave}
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
          <DateRangePicker
            label="Leave Period"
            autoCapitalize="off"
            isRequired
            value={leaveDate}
            onChange={setLeaveDate}
            variant="bordered"
            showMonthAndYearPickers
            labelPlacement="outside"
            classNames={{
              wrapper: "text-[#ffffff]",
            }}
          />
        </div>
        <Textarea
          variant="bordered"
          label="Message"
          labelPlacement="outside"
          placeholder="Enter your Message"
          value={comment}
          onValueChange={setComment}
        />
        <Divider />
        <div className="flex justify-end gap-4">
          <Button
            onClick={handleLeaveApplication}
            className="bg-[#76bc21] rounded-full h-8 min-w-24 text-white text-sm"
          >
            Apply
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
        <CustomTable columns={columns} data={leaveList || []} />
      </div>
    </div>
  );
}
