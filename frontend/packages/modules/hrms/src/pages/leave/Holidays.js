"use client";
import React, { useEffect, useState } from "react";
import { Button, Divider } from "@nextui-org/react";
import { useDisclosure } from "@nextui-org/react";
import { getCookie } from "@/utils/cookieUtils";
import { deleteData } from "@/utils/api";
import HolidayModal from "./HolidayModal";
import CustomTable from "@/components/tables/Table";
import { GrEdit } from "react-icons/gr";
import { BsTrash3Fill } from "react-icons/bs";
import { parseDate } from "@internationalized/date";
import { todayDateString } from "@/utils/getPimData";
import toast from "react-hot-toast";
import { getHolidayList } from "@/utils/getHolidayList";
import { usePathname } from "next/navigation";

const columns = [
  { key: "holidayName", value: "Holiday Name" },
  { key: "holidayStart", value: "Holiday From" },
  { key: "holidayEnd", value: "Holiday To" },
  { key: "action", value: "Action" },
];

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

const initialValue = {
  holidayId: "",
  holidayName: "",
  holidayStart: parseDate(todayDateString()),
  holidayEnd: parseDate(todayDateString()),
  totalHoliday: "",
};

export default function Holidays() {
  const pathName = usePathname();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedHoliday, setSelectedHoliday] = useState("");
  const [holiday, setHoliday] = useState(initialValue);
  const [user, setUser] = useState("");

  const [holidayList, setHolidayList] = useState([]);
  useEffect(() => {
    (async () => {
      const cook = await getCookie("user");
      setUser(JSON.parse(cook));
      if (JSON.parse(cook)?.roles?.find((ele) => ele.name !== "ROLE_HR")) {
        const index = columns.findIndex((column) => column.key === "action");

        // Remove the object if it exists in the array
        if (index !== -1) {
          columns.splice(index, 1);
        }
      }
      setHolidayList(await getHolidayList(pathName));
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actionButtons = [
    {
      name: "Update",
      action: (row) => {
        setSelectedHoliday(row);
        setHoliday({
          holidayId: row.holidayId,
          holidayName: row.holidayName,
          holidayStart: parseDate(row.holidayStart),
          holidayEnd: parseDate(row.holidayEnd),
          totalHoliday: "",
        });
        onOpen();
      },
      iconOnly: true,
      icon: <GrEdit size={25} color="#fc870c" />,
    },
    {
      name: "Delete",
      action: async (row) => {
        const userConfirmed = window.confirm(
          `Are you sure you want to Delete ${row.holidayName}?`
        );
        if (!userConfirmed) return;
        const token = await getCookie("accessToken");
        const response = await deleteData(
          `${baseUrl}/api/${baseUrl}/api/spshrm/${
            baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
          }/holiday/delete/${row.holidayId}`,
          token
        );
        if (response) {
          toast.success("DELETED SUCCESSFULLY");
          getHolidayList(pathName);
        }
      },
      iconOnly: true,
      icon: <BsTrash3Fill size={25} color="#f50000" />,
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="p-4 bg-white rounded-[1.2rem] flex flex-col gap-4">
        <div className="flex justify-between">
          <div className="text-[#8896af] text-lg font-bold">Holiday List</div>
          {user?.roles?.find((ele) => ele.name === "ROLE_HR") && (
            <Button
              className="h-7 rounded-full"
              color="primary"
              onPress={() => {
                setHoliday(initialValue);
                onOpen();
              }}
            >
              Add Holiday
            </Button>
          )}
        </div>
        <Divider />
        <CustomTable
          columns={columns}
          actionButtons={actionButtons}
          resourceUrl={`${baseUrl}/api/v1/spsm/view/STAFF_DOC/`}
          data={(holidayList.length && holidayList) || []}
        />
      </div>
      <HolidayModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onOpen={onOpen}
        selectedHoliday={selectedHoliday}
        getHolidayList={getHolidayList}
        setHolidayList={setHolidayList}
        holiday={holiday}
        setHoliday={setHoliday}
        initialValue={initialValue}
      />
    </div>
  );
}
