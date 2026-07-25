"use client";
import React, { useEffect, useState } from "react";
import { Divider, Input } from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
import { FaEye, FaSearch } from "react-icons/fa";
import { todayDateString } from "@/utils/getPimData";
import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { useDisclosure } from "@nextui-org/react";
import LeaveListModal from "./LeaveListModal";
import { getCookie } from "@/utils/cookieUtils";
import { getData } from "@/utils/api";
import AsyncPaginateTable from "@/components/tables/AcyncPaginateTable";
import { usePathname } from "next/navigation";

const initialState = {
  status: new Set([]),
  type: new Set([]),
  fromDate: parseDate(todayDateString()),
  toDate: parseDate(todayDateString()),
};

const columns = [
  { key: "name", value: "Employee Name" },
  { key: "tempEmp", value: "Employee Number" },
  { key: "action", value: "Actions" },
];

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

export default function LeaveList() {
  const pathName = usePathname();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [leave, setLeave] = useState(initialState);
  const [empNo, setEmpNo] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [userLeave, setUserLeave] = useState([]);
  const [zone, setZone] = useState("");
  useEffect(() => {
    (async () => {
      const zoneCookie = await getCookie("zone");
      setZone(JSON.parse(zoneCookie));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleDateChange = (name, value) => {
    setLeave((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStatusChange = (e) => {
    const { name } = e.target;
    setLeave((prevData) => ({
      ...prevData,
      [name]: new Set(e.target.value.split(",")),
    }));
  };

  const { data } = useSWR(
    empNo.length > 3 &&
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/staff/search/staff?tempEmp=${empNo}&zoneId=${zone}`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  async function getLeaveData(row) {
    const token = await getCookie("accessToken");
    const response = await getData(
      `${baseUrl}/api/spshrm/${baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]}/leave/staff/${
        row.staffId
      }`,
      token
    );
    if (response !== "No Data Found") {
      setUserLeave(response);
    }
  }

  const actionButtons = [
    {
      name: "View",
      action: (row) => {
        setSelectedUser(row);
        getLeaveData(row);
        onOpen();
      },
      iconOnly: true,
      icon: <FaEye size={25} color="#fc870c" />,
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="p-6 bg-white rounded-[1.2rem] flex flex-col gap-4">
        <div className="text-[#8896af] text-lg font-bold">Leave List</div>
        <Divider />
        <div className="flex justify-between items-center gap-4">
          <Input
            classNames={{
              base: "max-w-56 h-10",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper: "h-full font-normal text-default-500",
            }}
            variant="bordered"
            placeholder="Type to search..."
            label="Employee Number"
            labelPlacement="outside"
            value={empNo}
            onValueChange={setEmpNo}
            startContent={<FaSearch size={18} />}
            type="search"
          />
        </div>
      </div>
      <AsyncPaginateTable
        columns={columns}
        actionButtons={actionButtons}
        resourceUrl={`${baseUrl}/api/v1/spsm/view/STAFF_DOC/`}
        data={data}
      />
      <LeaveListModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onOpen={onOpen}
        userLeave={userLeave}
        selectedUser={selectedUser}
      />
    </div>
  );
}
