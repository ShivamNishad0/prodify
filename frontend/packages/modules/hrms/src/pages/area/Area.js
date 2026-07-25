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
  Select,
  SelectItem,
} from "@nextui-org/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import CustomTable from "@/components/tables/Table";
import { getAllArea } from "@/utils/getDesgnData";
import { getBackgroundColor } from "@/utils/getBackgroundColor";
import { usePathname } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

const varNames = {
  area: "Area",
  circle: "Circle",
  division: "Division",
  subDivision: "Sub Division",
};
export default function Area() {
  const pathName = usePathname();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [color, setColor] = useState("");
  const [locationType, setLocationType] = useState(new Set(["Basic"]));
  const [newLocation, setNewLocation] = useState({
    areaId: "",
    area: "",
    circle: "",
    division: "",
    subDivision: "",
  });
  const [area, setArea] = useState("");

  const [filteredData, setFilteredData] = useState("");

  useEffect(() => {
    getArea();
    (async () => {
      const cookdata = await getCookie("zone");
      setColor(getBackgroundColor(cookdata)); // Updated to use client-side cookie access
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getArea = useCallback(() => getAllArea(setArea, pathName, setArea), []);

  const addArea = async (onClose) => {
    const zoneCookie = await getCookie("zone");
    const token = await getCookie("accessToken");
    const payload = { ...newLocation };
    payload.zoneId = zoneCookie;
    if (!newLocation.areaId) delete payload.areaId;
    const url = newLocation.areaId
      ? `${baseUrl}/api/spshrm/${
          baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
        }/area/update/${newLocation.areaId}`
      : `${baseUrl}/api/spshrm/${baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]}/area/save`;
    try {
      const response = await fetch(url, {
        method: newLocation.areaId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const responseData = await response.text();
      if (response.status === 409) {
        toast.error(responseData);
      }
      if (!response.ok) {
        throw new Error("Something Went Wrong");
      }

      toast.success(
        `${newLocation.areaId ? "Updated" : "Added"} Area Successfully`
      );
      setNewLocation({
        areaId: "",
        area: "",
        circle: "",
        division: "",
        subDivision: "",
      });
      getArea();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const columns = [
    { key: "subDivision/location", value: "Area" },
    { key: "action", value: "Action" },
  ];

  const actionButtons = useMemo(
    () => [
      {
        name: "Edit",
        action: (row) => {
          if (row.division === row.division) setLocationType("Detailed");
          else setLocationType("Basic");
          setNewLocation(row);
          onOpen();
        },
        color: "#ffdb18",
      },
      {
        name: "Delete",
        action: async (row) => {
          const userConfirmed = window.confirm(
            `Are you sure you want to Delete ${row.subDivision}?`
          );
          if (!userConfirmed) return;
          const token = await getCookie("accessToken");
          const response = await fetch(
            `${baseUrl}/api/spshrm/${
              baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
            }/area/remove/${row.areaId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            toast.success("Deleted");
            getAllArea(setArea, pathName, setArea);
          }
        },
        variant: "solid",
        color: "#f50000",
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (area.length) {
      const updatedData = area.filter((ele) => ele.location !== "DETAILED");
      setFilteredData(updatedData);
    }
  }, [area]);

  return (
    <div className="p-5">
      <div className="flex w-full justify-end pb-2">
        <Button
          className={`h-8 rounded-full text-white ${color}`}
          onClick={() => {
            setNewLocation((prevData) => ({
              ...prevData,
              zoneId: 301,
            }));
            onOpen();
          }}
        >
          {baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]] === "rmc" ||
          baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]] === "suda"
            ? "ADD ULB"
            : "Add Area"}
        </Button>
      </div>
      <CustomTable
        columns={columns}
        data={filteredData || []}
        actionButtons={actionButtons}
        // pagination={true}
      />
      <Modal
        isOpen={isOpen}
        onOpenChange={() => {
          setNewLocation({
            areaId: "",
            area: "",
            circle: "",
            division: "",
            subDivision: "",
          });
          onOpenChange();
        }}
        placement="top-center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex justify-center gap-1">
                Add Area
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Location Type"
                    labelPlacement="outside"
                    variant="bordered"
                    placeholder="Select Location Type"
                    selectedKeys={locationType}
                    className="max-w-full col-span-2"
                    onSelectionChange={setLocationType}
                  >
                    {["Basic", "Detailed"].map((ele) => (
                      <SelectItem key={ele}>{ele}</SelectItem>
                    ))}
                  </Select>
                  {[...locationType][0] === "Basic" ? (
                    <Input
                      autoFocus
                      label="Location"
                      labelPlacement="outside"
                      placeholder="Enter Location"
                      variant="bordered"
                      value={newLocation.area}
                      className="col-span-2"
                      onChange={(e) => {
                        setNewLocation((prevData) => ({
                          ...prevData,
                          area: e.target.value.toUpperCase(),
                          circle: e.target.value.toUpperCase(),
                          division: e.target.value.toUpperCase(),
                          subDivision: e.target.value.toUpperCase(),
                        }));
                      }}
                    />
                  ) : (
                    Object.keys(newLocation).map((ele) => {
                      return (
                        ele !== "areaId" &&
                        ele !== "zoneId" && (
                          <Input
                            key={ele}
                            autoFocus
                            label={varNames[ele]}
                            labelPlacement="outside"
                            placeholder={`Enter department ${varNames[ele]}`}
                            variant="bordered"
                            value={newLocation[ele]}
                            onChange={(e) => {
                              setNewLocation((prevData) => ({
                                ...prevData,
                                [ele]: e.target.value.toUpperCase(),
                              }));
                            }}
                          />
                        )
                      );
                    })
                  )}
                </div>
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
                  onPress={() => addArea(onClose)}
                >
                  {newLocation.areaId ? "Save" : "Add"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
