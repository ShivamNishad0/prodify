"use client";
import React, { useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import Calendar from "react-calendar";
import AsyncPaginateTable from "@/components/tables/AcyncPaginateTable";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useDisclosure,
  Select,
  SelectItem,
  Input,
} from "@nextui-org/react";
import { GrEdit } from "react-icons/gr";
import { usePathname } from "next/navigation";
import useSWR, { mutate } from "swr";
import { postData } from "@/utils/api";
import { fetcher } from "@/utils/fetcher";
import { months } from "@/utils/constant";
import { getCookie } from "@/utils/cookieUtils";

const columns = [
  { key: "empName", value: "Name" },
  { key: "empNo", value: "Employee No" },
  { key: "noOfDayAbsent", value: "Absent Count" },
  { key: "noOfDayHalfPresent", value: "Half Day Count" },
  { key: "noOfDayPresent", value: "Present Count" },
  { key: "noOfWO", value: "Week-Off Count" },
  { key: "noOfHoliday", value: "Holiday Count" },
  { key: "action", value: "Action" },
];

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

const attdStatus = {
  PRESENTS: "PR",
  ABSENT: "AB",
  HALFDAY: "HD",
  HOLIDAY: "HL",
  LWP: "LWP",
  PL: "PL",
  WO: "WO",
};

const currentDate = new Date();
currentDate.setMonth(currentDate.getMonth() - 1);
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate
  .toLocaleString("default", { month: "long" })
  .toUpperCase();

const statusColor = (status) => {
  switch (status) {
    case "ABSENT":
      return "bg-[#E57373]"; // Soft Red
    case "PRESENTS":
      return "bg-[#4CAF50]"; // Fresh Green
    case "WO":
      return "bg-[#FFEB3B]"; // Bright Yellow
    case "PL":
      return "bg-[#00BCD4]"; // Calm Cyan
    case "HALFDAY":
      return "bg-[#FF9800]"; // Vibrant Orange
    case "HOLIDAY":
      return "bg-[#2196F3]"; // Soothing Blue
    default:
      return "bg-[#B0BEC5]"; // Neutral Gray
  }
};

export default function ViewAttendance() {
  const pathName = usePathname();
  const [userData, setUserData] = useState([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [search, setSearch] = useState("");
  const [selection, setSelection] = useState({
    month: currentMonth,
    year: currentYear,
  });
  const [page, setPage] = useState(1);
  const resourceUrl = useMemo(() => {
    if (selection.month && selection.year) {
      return `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/attendance/details-all?size=20&page=${page - 1}&emp_no=${
        search.length > 3 ? search : ""
      }&month=${selection.month}&year=${selection.year}`;
    }
    return null; // Return null if conditions are not met
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection, search, page]);

  const { data, isLoading } = useSWR(
    resourceUrl ? resourceUrl : null,
    fetcher,
    {
      keepPreviousData: true,
    }
  );
  const loadingState = isLoading || data?.length === 0 ? "loading" : "idle";
  isLoading || data?.results?.length === 0 ? "loading" : "idle";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelection((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleStatusChange = async (day, newStatus) => {
    const token = await getCookie("accessToken");
    const response = await postData(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/attendance/edit/${userData.attendanceId}`,
      { day: day, status: newStatus ? newStatus : "ABSENT" },
      token,
      "PUT"
    );

    if (response) {
      // Trigger revalidation for the SWR key to get the latest data
      mutate(
        `${baseUrl}/api/spshrm/${
          baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
        }/attendance/details-all?size=20&page=${page - 1}&month=${
          selection.month
        }&year=${selection.year}`
      );
      setUserData((prevData) => ({
        ...prevData,
        attendance: prevData.attendance.map((entry) =>
          entry.day === day
            ? { ...entry, status: newStatus ? newStatus : "ABSENT" }
            : entry
        ),
      }));
    }
  };
  const tileContent = ({ date, view }) => {
    if (view === "month" && userData) {
      const day = `d${date.getDate()}`; // Get the day of the month (1-31) as `d1`, `d2`, etc.
      const attendanceEntry = userData?.attendance?.find(
        (entry) => entry.day === day
      );

      const status = attendanceEntry?.status || "ABSENT";
      const colorClass = statusColor(status);

      return (
        <div className="tile-content">
          {status && typeof status === "string" && (
            <div
              className={`date-status flex justify-center mb-2 ${status.toLowerCase()}`}
            >
              <Popover placement="right">
                <PopoverTrigger>
                  <div
                    className={`${colorClass} rounded-full text-white aspect-square h-6 px-0 min-w-0 flex justify-center items-center w-min`}
                  >
                    {status[0]}
                  </div>
                </PopoverTrigger>
                <PopoverContent className="bg-slate-200">
                  {(titleProps) => (
                    <div className="px-1 py-2">
                      <h3 className="text-small font-bold" {...titleProps}>
                        Select Status
                      </h3>
                      <Select
                        aria-label="Select Status"
                        name="status"
                        variant="bordered"
                        labelPlacement="outside"
                        selectedKeys={[status]}
                        placeholder="--Select--"
                        onChange={async (e) => {
                          handleStatusChange(day, e.target.value);
                        }}
                        classNames={{
                          base: "max-w-full sm:min-w-32 sm:max-w-[10rem] h-8",
                          mainWrapper: "h-full",
                          input: "text-small",
                          value: "text-black",
                          trigger: "border-black",
                          inputWrapper:
                            "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
                        }}
                        size="sm"
                      >
                        {Object.keys(attdStatus).map((ele) => (
                          <SelectItem key={ele}>{ele}</SelectItem>
                        ))}
                      </Select>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      );
    }
    return null;
  };
  const actionButtons = [
    {
      name: "Edit",
      action: async (row) => {
        onOpen();
        const token = await getCookie("accessToken");
        const response = await fetch(
          `${baseUrl}/api/spshrm/${
            baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
          }/attendance/employee/${row.empNo}?month=${selection.month}&year=${
            selection.year
          }`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const responseData = await response.json();
          const attendance = Object.keys(responseData)
            .filter((key) => key.startsWith("d"))
            .map((day) => ({
              day,
              status: responseData[day],
            }));

          const transformedData = {
            ...responseData,
            attendance,
          };

          Object.keys(responseData)
            .filter((key) => key.startsWith("d"))
            .forEach((key) => delete transformedData[key]);
          setUserData(transformedData);
          onOpen();
        }
      },
      iconOnly: true,
      icon: <GrEdit size={25} color="#F7E027" />,
    },
  ];

  const filteredData = useMemo(() => {
    if (!data?.results?.length) return { ...data, results: [] };

    const filteredResults = data.results.sort((a, b) =>
      a.empNo.localeCompare(b.empNo)
    );

    return { ...data, results: filteredResults };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return (
    <div>
      <div className="flex flex-col gap-2 p-4 scrollbar-hide rounded-md">
        <div className="flex items-center bg-white rounded-md gap-3 p-3">
          <Input
            classNames={{
              base: "max-w-48 sm:min-w-48 h-8",
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
          <Select
            variant="bordered"
            placeholder="Select Year"
            labelPlacement="outside"
            aria-label="Select Year"
            name="year"
            selectedKeys={[selection.year.toString()]}
            onChange={handleChange}
            classNames={{
              base: "max-w-full sm:min-w-32 sm:max-w-[10rem] h-8",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            size="sm"
          >
            <SelectItem key="2024">2024</SelectItem>
            <SelectItem key="2025">2025</SelectItem>
          </Select>
          <Select
            aria-label="Select Month"
            name="month"
            variant="bordered"
            labelPlacement="outside"
            selectedKeys={[selection.month]}
            placeholder="--Select--"
            onChange={handleChange}
            classNames={{
              base: "max-w-full sm:min-w-32 sm:max-w-[10rem] h-8",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            size="sm"
          >
            {Object.keys(months).map((ele) => (
              <SelectItem key={ele}>{ele}</SelectItem>
            ))}
          </Select>
        </div>
        <AsyncPaginateTable
          columns={columns}
          actionButtons={actionButtons}
          resourceUrl={`${baseUrl}/api/v1/spsm/view/STAFF_DOC/`}
          page={page}
          data={filteredData}
          setPage={setPage}
          loadingState={loadingState}
        />
      </div>
      <Modal
        backdrop="opaque"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          backdrop:
            "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20",
        }}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 py-2 text-center">
                {userData.empName + " (" + userData.empNo + ")"}
              </ModalHeader>
              <ModalBody className="py-0 pb-4">
                <Calendar
                  tileContent={tileContent}
                  className="custom-calendar text-center"
                  showNeighboringMonth={false}
                  activeStartDate={
                    new Date(selection.year, months[selection.month])
                  }
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
