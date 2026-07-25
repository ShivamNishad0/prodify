import React from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import CustomTable from "@/components/tables/Table";
import { FaCircleCheck } from "react-icons/fa6";
import { FaTimesCircle } from "react-icons/fa";
import { postData } from "@/utils/api";
import { getCookie } from "@/utils/cookieUtils";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);
const columns = [
  { key: "fromDate", value: "From Date" },
  { key: "toDate", value: "To date" },
  { key: "leaveType", value: "Leave Type" },
  { key: "leaveStatus", value: "Status" },
  { key: "comments", value: "Comments" },
  { key: "action", value: "Action" },
];

export default function LeaveListModal({ isOpen, onOpenChange, userLeave }) {
  const pathName = usePathname();
  const actionButtons = [
    {
      name: "Approve",
      action: async (row) => handleLeaveApproval(row, "APPROVE"),
      iconOnly: true,
      icon: <FaCircleCheck size={25} color="#28a745" />,
    },
    {
      name: "Reject",
      action: async (row) => handleLeaveApproval(row, "REJECTED"),
      iconOnly: true,
      icon: <FaTimesCircle size={25} color="#dc3545" />,
    },
  ];

  async function handleLeaveApproval(row, action) {
    const userCookie = await getCookie("user");
    const response = await postData(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/leave/action?action=${action}&leaveId=${row.leaveId}&userId=${
        JSON.parse(userCookie).id
      }`
    );
    if (response) toast.success("Action Performed Scucessfully");
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="3xl"
      backdrop="blur"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1"></ModalHeader>
            <ModalBody>
              <CustomTable
                columns={columns}
                data={userLeave}
                actionButtons={actionButtons}
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="light" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onClose}>
                Action
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
