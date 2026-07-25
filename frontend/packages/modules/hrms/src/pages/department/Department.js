"use client";
import { getCookie } from "@/utils/cookieUtils";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@nextui-org/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import CustomTable from "@/components/tables/Table";
import { getAllDept } from "@/utils/getDesgnData";
import { getBackgroundColor } from "@/utils/getBackgroundColor";
import { usePathname } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

export default function Department() {
  const pathName = usePathname();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [color, setColor] = useState("");
  const [newDept, setNewDept] = useState({
    depId: "",
    zoneId: "",
    depName: "",
    status: "",
  });
  const [dept, setDept] = useState([]);

  useEffect(() => {
    getDeptData();
    (async () => {
      const cookdata = await getCookie("zone");
      setColor(getBackgroundColor(cookdata)); // Updated to use client-side cookie access
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getDeptData = useCallback(() => getAllDept(setDept, pathName), []);

  const addDepartment = useCallback(
    async (onClose) => {
      const token = await getCookie("accessToken");
      const url = newDept.depId
        ? `${baseUrl}/api/spshrm/${
            baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
          }/department/edit/${newDept.depId}`
        : `${baseUrl}/api/spshrm/${
            baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
          }/department/create`;
      try {
        const response = await fetch(url, {
          method: newDept.depId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            zoneId: newDept.zoneId,
            depName: newDept.depName,
          }),
        });
        const responseData = await response.text();
        if (response.status === 409) {
          toast.error(responseData);
        }
        if (!response.ok) {
          throw new Error("Something Went Wrong");
        }

        toast.success(
          `${newDept.depId ? "Updated" : "Added"} Department Successfully`
        );
        setNewDept({ depId: "", zoneId: "", depName: "", status: "" });
        getAllDept(setDept, pathName);
        onClose();
      } catch (err) {
        console.error(err);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [getDeptData, newDept.depId, newDept.depName, newDept.zoneId]
  );

  const columns = [
    { key: "depName", value: "Department" },
    { key: "status", value: "Status" },
    { key: "action", value: "Action" },
  ]; //This is a test commit

  const actionButtons = useMemo(
    () => [
      {
        name: "Edit",
        action: (row) => {
          setNewDept(row);
          onOpen();
        },
        color: "#ffdb18",
      },
      {
        name: "Update Status",
        action: async (row) => {
          const token = await getCookie("accessToken");
          const response = await fetch(
            `${baseUrl}/api/spshrm/${
              baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
            }/department/action/${row.depId}?action=${
              row.status === "ACTIVE" ? "FALSE" : "TRUE"
            }`,
            {
              method: "PUT",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            toast.success("Updated Status");
            getDeptData();
          }
        },
        variant: "solid",
        color: "#4dabd9",
      },
      {
        name: "Delete",
        action: async (row) => {
          const userConfirmed = window.confirm(
            `Are you sure you want to Delete ${row.depName}?`
          );
          if (!userConfirmed) return;
          const token = await getCookie("accessToken");
          const response = await fetch(
            `${baseUrl}/api/spshrm/${
              baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
            }/department/remove/${row.depId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            toast.success("Deleted");
            getAllDept(setDept, pathName);
          }
        },
        variant: "solid",
        color: "#f50000",
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <div className="p-5">
      <div className="flex w-full justify-end pb-2">
        <Button
          className={`h-8 rounded-full text-white ${color}`}
          onClick={() => {
            setNewDept((prevData) => ({
              ...prevData,
              zoneId: 505,
            }));
            onOpen();
          }}
        >
          Add Department
        </Button>
      </div>
      <CustomTable
        columns={columns}
        data={dept}
        actionButtons={actionButtons}
      />
      <Modal
        isOpen={isOpen}
        onOpenChange={() => {
          setNewDept({ depId: "", zoneId: "", depName: "", status: "" });
          onOpenChange();
        }}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex justify-center gap-1">
                Add Department
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  aria-label="Department"
                  placeholder="Enter department"
                  variant="bordered"
                  value={newDept.depName}
                  onChange={(e) => {
                    setNewDept((prevData) => ({
                      ...prevData,
                      depName: e.target.value.toUpperCase(),
                    }));
                  }}
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
                  onPress={() => addDepartment(onClose)}
                >
                  {newDept.depId ? "Save" : "Add"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
