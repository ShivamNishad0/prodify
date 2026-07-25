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
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import toast from "react-hot-toast";
import { getDesgnData } from "@/utils/getDesgnData";
import ThemeContext from "@/context/ThemeContext";
import AsyncPaginateTable from "@/components/tables/AcyncPaginateTable";
import { usePathname } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

export default function Designation() {
  const pathName = usePathname();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { themeColor } = useContext(ThemeContext);
  const [user, setUser] = useState("");
  const [newDesgn, setNewDesgn] = useState({
    desigId: "",
    zoneId: "",
    desigName: "",
    status: "",
  });
  const [desgn, setDesgn] = useState([]);
  const [zone, setZone] = useState("");

  useEffect(() => {
    desgnData();
    (async () => {
      const cook = await getCookie("user");
      setUser(JSON.parse(cook));
      const zoneCookie = await getCookie("zone");
      setZone(zoneCookie);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const desgnData = useCallback(() => getDesgnData(setDesgn, pathName), []);

  const addDesignation = useCallback(
    async (onClose) => {
      const token = await getCookie("accessToken");
      const url = newDesgn.desigId
        ? `${baseUrl}/api/spshrm/${
            baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
          }/designations/edit/${newDesgn.desigId}`
        : `${baseUrl}/api/spshrm/${
            baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
          }/designations/create`;
      try {
        const response = await fetch(url, {
          method: newDesgn.desigId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            zoneId: zone,
            desigName: newDesgn.desigName,
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
          `Designation ${newDesgn.desigId ? "Updated" : "Added"} Successfully`
        );
        setNewDesgn({ desigId: "", zoneId: "", depName: "", status: "" });
        desgnData();
        onClose();
      } catch (err) {
        console.error(err);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [desgnData, newDesgn.desigId, newDesgn.desigName, zone]
  );

  const columns = [
    { key: "desigName", value: "Designation" },
    { key: "status", value: "Status" },
    { key: "action", value: "Action" },
  ];

  const actionButtons = useMemo(() => {
    const buttons = [];

    // If the user has ROLE_ADMIN, include the Edit and Delete buttons
    if (user?.roles?.some((ele) => ele.name === "ROLE_ADMIN")) {
      buttons.push({
        name: "Edit",
        action: (row) => {
          setNewDesgn(row);
          onOpen();
        },
        color: "#ffdb18",
      });
    }

    // Update Status button, available for all users
    buttons.push({
      name: "Update Status",
      action: async (row) => {
        const token = await getCookie("accessToken");
        const response = await fetch(
          `${baseUrl}/api/spshrm/${
            baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
          }/designations/status/${row.desigId}?action=${
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
          desgnData();
        }
      },
      variant: "solid",
      color: "#4dabd9",
    });

    if (user?.roles?.some((ele) => ele.name === "ROLE_ADMIN")) {
      buttons.push({
        name: "Delete",
        action: async (row) => {
          const userConfirmed = window.confirm(
            `Are you sure you want to Delete ${row.desigName}?`
          );
          if (!userConfirmed) return;
          const token = await getCookie("accessToken");
          const response = await fetch(
            `${baseUrl}/api/spshrm/${
              baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
            }/designations/remove/${row.desigId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            toast.success("Deleted");
            desgnData();
          }
        },
        variant: "solid",
        color: "#f50000",
      });
    }

    return buttons;
  }, [user, pathName, desgnData, onOpen]);

  const filteredData = useMemo(() => {
    return {
      count: desgn.length,
      results: desgn,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zone, desgn]);

  return (
    <>
      <div className="p-5 h-full flex flex-col">
        <div className="flex w-full justify-end pb-2">
          <Button
            className={`h-8 rounded-full ${themeColor} text-white`}
            onClick={() => {
              setNewDesgn((prevData) => ({
                ...prevData,
                zoneId: zone,
              }));
              onOpen();
            }}
          >
            Add Designation
          </Button>
        </div>
        <div className="flex-grow h-inherit mb-4">
          <AsyncPaginateTable
            columns={columns}
            data={filteredData}
            actionButtons={actionButtons}
          />
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={() => {
          setNewDesgn({ desigId: "", zoneId: "", depName: "", status: "" });
          onOpenChange();
        }}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex justify-center gap-1">
                Add Designation
              </ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  aria-label="Designation"
                  placeholder="Enter designation"
                  variant="bordered"
                  value={newDesgn.desigName}
                  onChange={(e) => {
                    setNewDesgn((prevData) => ({
                      ...prevData,
                      desigName: e.target.value.toUpperCase(),
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
                  onPress={() => addDesignation(onClose)}
                >
                  {newDesgn.desigId ? "Save" : "Add"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
