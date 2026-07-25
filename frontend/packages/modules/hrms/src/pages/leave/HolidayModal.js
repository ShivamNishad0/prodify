import React, { useEffect, useState } from "react";
import {
  Button,
  DateRangePicker,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import { postData } from "@/utils/api";
import { getCookie } from "@/utils/cookieUtils";
import toast from "react-hot-toast";
import { formatDate } from "@/utils/formatDate";
import { usePathname } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

export default function HolidayModal({
  isOpen,
  onOpenChange,
  getHolidayList,
  initialValue,
  holiday,
  setHoliday,
  setHolidayList,
}) {
  const pathName = usePathname();
  function calculateDays(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Calculate the difference in time
    const timeDifference = endDate.getTime() - startDate.getTime();

    // Convert time difference from milliseconds to days
    const daysDifference = timeDifference / (1000 * 3600 * 24);

    return daysDifference + 1; // Include the start day
  }

  async function handleSave(onClose) {
    const token = await getCookie("accessToken");
    const payload = {
      holidayName: holiday.holidayName,
      holidayStart: formatDate(holiday.holidayStart),
      holidayEnd: formatDate(holiday.holidayEnd),
      totalHoliday: calculateDays(holiday.holidayStart, holiday.holidayEnd),
    };

    const response = await postData(
      `${baseUrl}/api/spshrm/${baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]}/holiday/${
        holiday.holidayId ? "update/" + holiday.holidayId : "create"
      }`,
      payload,
      token,
      holiday.holidayId ? "PUT" : "POST"
    );
    if (response) {
      toast.success(response);
      setHoliday(initialValue);
      setHolidayList(await getHolidayList(pathName));
      onClose();
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="xl"
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex justify-center">
              Add Holiday
            </ModalHeader>
            <Divider />
            <ModalBody>
              <Input
                label="Holiday"
                variant="bordered"
                labelPlacement="outside"
                value={holiday.holidayName}
                onChange={(e) => {
                  setHoliday((prevData) => ({
                    ...prevData,
                    holidayName: e.target.value,
                  }));
                }}
                classNames={{
                  wrapper: "text-[#ffffff]",
                }}
              />
              <div className="flex gap-4">
                <DateRangePicker
                  label="Holiday Period"
                  autoCapitalize="off"
                  isRequired
                  value={{
                    start: holiday.holidayStart,
                    end: holiday.holidayEnd,
                  }}
                  onChange={(e) => {
                    setHoliday((prevData) => ({
                      ...prevData,
                      holidayStart: e.start,
                      holidayEnd: e.end,
                    }));
                  }}
                  variant="bordered"
                  showMonthAndYearPickers
                  labelPlacement="outside"
                  classNames={{
                    wrapper: "text-[#ffffff]",
                  }}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                className="h-7 rounded-full"
                color="danger"
                variant="light"
                onPress={onClose}
              >
                Close
              </Button>
              <Button
                className="h-7 rounded-full"
                color="primary"
                onPress={() => handleSave(onClose)}
              >
                Save
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
