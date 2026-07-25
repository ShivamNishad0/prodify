"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Select, SelectItem, Button, Tooltip } from "@nextui-org/react";
import { X } from "lucide-react";
import { usePathname } from "next/navigation";
import { getAllArea } from "./getDesgnData";

export default function AreaSelectionModal({
  selectedYear,
  selectedMonth,
  areaIdList,
  setAreaIdList,
  selection,
  setSelection,
  isOpen = false,
  onClose = () => {},
  onSelectionComplete,
  resetOnClose = false, // New resetOnClose prop
}) {
  const [areas, setAreas] = useState([]);
  const pathName = usePathname();
  const [selectedType, setSelectedType] = useState("");
  const [activeButton, setActiveButton] = useState(null);

  useEffect(() => {
    getArea();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getArea = useCallback(() => {
    getAllArea(setAreas, pathName);
  }, [pathName]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelection((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    const filterProperty = {
      area: "area",
      circle: "circle",
      division: "division",
      subDivision: "subDivision",
    }[name];

    if (filterProperty) {
      setAreaIdList(
        areas
          .filter(
            (ele) => ele[filterProperty].toLowerCase() === value.toLowerCase()
          )
          .map((ele) => ele.areaId)
      );
    }
  };

  const handleSelectionType = (type) => {
    const typeMap = {
      "Salary With Profile": "069",
      "Salary Without Profile": "0690",
      "RTGS Report": "006900",
    };
    setSelectedType(typeMap[type]);
    setActiveButton(type);
  };

  const resetState = () => {
    setSelection({
      area: "",
      circle: "",
      division: "",
      subDivision: "",
    });
    setSelectedType("");
    setActiveButton(null);
  };

  const handleComplete = () => {
    onSelectionComplete({ areaIdList, selectedType, selection });
    if (resetOnClose) resetState();
    onClose();
  };

  const { area, circle, division, subDivision } = selection;
  const getOptions = (data) =>
    data
      ? Object.keys(data).map((key) => (
          <SelectItem key={key} value={key}>
            {key}
          </SelectItem>
        ))
      : null;

  return (
    <div
      className={`fixed inset-0 z-50 ${
        isOpen ? "flex" : "hidden"
      } items-center justify-center bg-black/30`}
    >
      <div className="bg-white shadow-xl p-4 rounded-2xl w-full max-w-lg text-left">
        <div className="flex justify-between items-center mb-4">
          <h3 className="w-full font-semibold text-center text-gray-900 text-lg">
            Select Area
          </h3>
          <Button size="sm" variant="light" isIconOnly onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="space-y-4">
          {/* Select fields */}
          <div className="gap-4 grid grid-cols-2">
            <Select
              variant="bordered"
              color="primary"
              labelPlacement="outside"
              placeholder="Select Area"
              aria-label="Area"
              name="area"
              value={area}
              selectedKeys={[area]}
              onChange={handleChange}
              classNames={{
                base: "w-full h-8",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper:
                  "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
              }}
              size="sm"
              bordered
              isDisabled={!selectedYear || !selectedMonth}
            >
              {areas.length && getOptions(createNestedStructure(areas))}
            </Select>
            <Select
              variant="bordered"
              color="primary"
              placeholder="Select Circle"
              aria-label="Circle"
              name="circle"
              value={circle}
              selectedKeys={[circle]}
              onChange={handleChange}
              labelPlacement="outside"
              classNames={{
                base: "w-full h-8",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper:
                  "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
              }}
              size="sm"
              isDisabled={!selectedYear || !selectedMonth}
            >
              {areas.length && getOptions(createNestedStructure(areas)[area])}
            </Select>
            <Tooltip
              isDisabled={circle}
              color="danger"
              content="Please Select Circle"
            >
              <Select
                aria-label="Division"
                variant="bordered"
                name="division"
                labelPlacement="outside"
                placeholder="Select Division"
                value={division}
                selectedKeys={[division]}
                onChange={handleChange}
                disabled={!circle}
                classNames={{
                  base: "w-full h-8",
                  mainWrapper: "h-full",
                  input: "text-small",
                  inputWrapper:
                    "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
                }}
                size="sm"
              >
                {areas.length &&
                  getOptions(createNestedStructure(areas)[area]?.[circle])}
              </Select>
            </Tooltip>
            <Tooltip
              isDisabled={division}
              color="danger"
              content="Please Select Division"
            >
              <Select
                aria-label="Sub Division"
                labelPlacement="outside"
                name="subDivision"
                placeholder="Select Subdivision"
                value={subDivision}
                selectedKeys={[subDivision]}
                onChange={handleChange}
                variant="bordered"
                disabled={!division}
                classNames={{
                  base: "w-full h-8",
                  mainWrapper: "h-full",
                  input: "text-small",
                  inputWrapper:
                    "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
                }}
                size="sm"
              >
                {createNestedStructure(areas)[area]?.[circle]?.[division]?.map(
                  (sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  )
                )}
              </Select>
            </Tooltip>
          </div>
          {/* Type selection buttons */}
          {areaIdList.length ? (
            <div className="gap-2 grid grid-cols-3 mt-4">
              <Button
                variant="outline"
                onClick={() => handleSelectionType("Salary With Profile")}
                className={`
                transition-all duration-200 ease-in-out
                ${
                  activeButton === "Salary With Profile"
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
                ${
                  activeButton && activeButton !== "Salary With Profile"
                    ? "opacity-50"
                    : "hover:bg-primary hover:text-primary-foreground"
                }
              `}
              >
                Salary With Profile
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSelectionType("Salary Without Profile")}
                className={`
                transition-all duration-200 ease-in-out
                ${
                  activeButton === "Salary Without Profile"
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
                ${
                  activeButton && activeButton !== "Salary Without Profile"
                    ? "opacity-50"
                    : "hover:bg-primary hover:text-primary-foreground"
                }
              `}
              >
                Salary Without Profile
              </Button>
              <Button
                variant="outline"
                onClick={() => handleSelectionType("RTGS Report")}
                className={`
                transition-all duration-200 ease-in-out
                ${
                  activeButton === "RTGS Report"
                    ? "bg-primary text-primary-foreground"
                    : ""
                }
                ${
                  activeButton && activeButton !== "RTGS Report"
                    ? "opacity-50"
                    : "hover:bg-primary hover:text-primary-foreground"
                }
              `}
              >
                RTGS Report
              </Button>
            </div>
          ) : null}
          {/* Confirm selection button */}
          <div className="mt-4 w-full">
            <Button
              onClick={handleComplete}
              disabled={!areaIdList.length || !selectedType}
              color="warning"
              fullWidth
            >
              Confirm Selection
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function createNestedStructure(areas) {
  const structure = {};
  areas.forEach((area) => {
    if (!structure[area.area]) structure[area.area] = {};
    if (!structure[area.area][area.circle])
      structure[area.area][area.circle] = {};
    if (!structure[area.area][area.circle][area.division])
      structure[area.area][area.circle][area.division] = [];
    structure[area.area][area.circle][area.division].push(
      area.subDivision || area.location || ""
    );
  });
  return structure;
}
