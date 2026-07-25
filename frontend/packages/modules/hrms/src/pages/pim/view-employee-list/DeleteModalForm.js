"use client";
import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  DatePicker,
} from "@nextui-org/react";
import { parseDate } from "@internationalized/date";
import { todayDateString } from "@/utils/getPimData";

export default function DeleteModalForm({
  isOpen,
  onOpenChange,
  rowData,
  handleDelete,
}) {
  const [selectedDate, setSelectedDate] = useState(
    parseDate(todayDateString())
  );
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex justify-center gap-1 ">
                Are You Sure To Remove {rowData.name}
              </ModalHeader>
              <ModalBody>
                <DatePicker
                  label="Last Working Day"
                  variant="bordered"
                  showMonthAndYearPickers
                  labelPlacement="outside"
                  value={selectedDate}
                  classNames={{
                    label: "text-[#f50000] text-3xl",
                    timeInputLabel: "text-[#f50000] text-3xl",
                    wrapper: "text-[#ffffff]",
                  }}
                  onChange={(date) => setSelectedDate(date)}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  className="h-7 rounded-full"
                  color="danger"
                  variant="flat"
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button
                  className="h-7 rounded-full"
                  color="primary"
                  onPress={() => {
                    onClose, handleDelete(selectedDate);
                  }}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
