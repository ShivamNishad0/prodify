"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Textarea,
  Divider,
  Input,
  Select,
  SelectItem,
  DateRangePicker,
} from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
import { todayDateString } from "@/utils/getPimData";
import { getCookie } from "@/utils/cookieUtils";
import useSWR from "swr";
import { formatDate } from "@/utils/formatDate";
import { postData } from "@/utils/api";
import toast from "react-hot-toast";
import { fetcher } from "@/utils/fetcher";
import { usePathname } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

export default function AssignLeave() {
  const pathName = usePathname();
  const [leave, setLeave] = useState(new Set([]));
  const [leaveDate, setLeaveDate] = useState({
    start: parseDate(todayDateString()),
    end: parseDate(todayDateString()),
  });
  const [comment, setComment] = useState("");
  const [empNo, setEmpNo] = useState("");
  const [zone, setZone] = useState("");
  useEffect(() => {
    (async () => {
      const zoneCookie = await getCookie("zone");
      setZone(JSON.parse(zoneCookie));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [selectedUser, setSelectedUser] = useState(new Set([]));

  const { data } = useSWR(
    empNo.length > 3 &&
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/staff/search/staff?tempEmp=${empNo}&type=active`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  async function handleLeaveApplication() {
    const token = await getCookie("accessToken");
    const userDataCookie = await getCookie("user");
    const zoneCookie = await getCookie("zone");
    const userData = await JSON.parse(userDataCookie || "");

    const payload = {
      staffId: JSON.parse([...selectedUser][0]).staffId,
      zoneId: zoneCookie,
      empNo: userData.empNo,
      fromDate: formatDate(leaveDate.start),
      toDate: formatDate(leaveDate.end),
      leaveType: [...leave][0],
      assignBy: userData.id,
      comments: comment,
    };
    const response = await postData(
      `${baseUrl}/api/spshrm/${baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]}/leave/apply`,
      payload,
      token
    );
    if (response) {
      toast.success(response);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="p-6 bg-white rounded-[1.2rem] flex flex-col gap-4">
        <div className="text-[#8896af] text-lg font-bold">Assign Leave</div>
        <Divider />
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Input
            classNames={{
              base: "max-w-full h-10",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper: "h-full font-normal text-default-500",
            }}
            variant="bordered"
            placeholder="Enter Employee Number"
            label="Employee Number"
            labelPlacement="outside"
            size="sm"
            value={empNo}
            onValueChange={setEmpNo}
            type="search"
          />
          <div className="flex w-full max-w-xs flex-col gap-2">
            <Select
              label="Select Employee"
              name="type"
              placeholder="--Select--"
              labelPlacement="outside"
              variant="bordered"
              selectedKeys={selectedUser}
              className="max-w-xs"
              onSelectionChange={setSelectedUser}
            >
              {(data?.results?.length ? data.results : []).map((ele) => {
                return (
                  <SelectItem key={JSON.stringify(ele)}>{ele.name}</SelectItem>
                );
              })}
            </Select>
          </div>
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
              isDisabled={![...selectedUser][0]}
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
            isDisabled={![...selectedUser][0]}
          />
        </div>
        <Textarea
          variant="bordered"
          label="Message"
          labelPlacement="outside"
          placeholder="Enter your Message"
          value={comment}
          onValueChange={setComment}
          isDisabled={![...selectedUser][0]}
        />
        <Divider />
        <div className="flex justify-end gap-4">
          <Button
            isDisabled={![...selectedUser][0]}
            onClick={handleLeaveApplication}
            className="bg-[#76bc21] rounded-full h-8 min-w-24 text-white text-sm"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
