"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  SelectItem,
  Select,
  Tooltip,
} from "@nextui-org/react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

import CustomTable from "@/components/tables/Table";
import { getAllArea } from "@/utils/getDesgnData";
import { usePathname } from "next/navigation";
import { createNestedStructure } from "@/utils/constant";

const initialStatus = {
  circle: "",
  division: "",
  subDivision: "",
};
export default function DashboardListModal(props) {
  const { isOpen, onOpenChange, data } = props;
  const [page, setPage] = useState(1);
  const [areas, setAreas] = useState([]);
  const pathName = usePathname();
  const [areaIdList, setAreaIdList] = useState([]);
  const [selection, setSelection] = useState(initialStatus);

  const columns = [
    { key: "tempEmp", value: "Emp No." },
    { key: "name", value: "Name" },
    { key: "post", value: "Post" },
    { key: "contactNo", value: "Mobile No." },
  ];

  useEffect(() => {
    getArea();
    setSelection(initialStatus);
    setAreaIdList(
      areas
        .filter((ele) => {
          return ele.area.toLowerCase() === data.region.toLowerCase();
        })
        .map((ele) => ele.subDivision)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setAreaIdList(
      areas
        .filter((ele) => {
          return ele.area.toLowerCase() === data.region.toLowerCase();
        })
        .map((ele) => ele.subDivision)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.region]);

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
          .map((ele) => ele.subDivision)
      );
    }
  };

  const getOptions = (data) =>
    data
      ? Object.keys(data).map((key) => (
          <SelectItem key={key} value={key}>
            {key}
          </SelectItem>
        ))
      : null;

  const filteredData = useMemo(() => {
    if (!data || !data.data) return []; // Return an empty array if data is not available

    return data.data.filter((ele) =>
      areaIdList.includes(ele?.area?.subDivision)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaIdList, data?.title, data?.region]);

  const exportToExcel = async () => {
    // Create a new workbook and worksheet
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet1");

    // Add title as a merged cell in the first row
    worksheet.mergeCells(1, 1, 1, columns.length);
    const titleCell = worksheet.getCell("A1");
    titleCell.value = data?.title;
    titleCell.font = { bold: true, color: { argb: "FFFFFF" }, size: 14 };
    titleCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "0070C0" },
    };
    titleCell.alignment = { horizontal: "center" };
    titleCell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };

    // Add column headers in the second row
    columns.forEach((col, index) => {
      const headerCell = worksheet.getCell(2, index + 1);
      headerCell.value = col.value;
      headerCell.font = { bold: true };
      headerCell.alignment = { horizontal: "center" };
      headerCell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    // Add data rows starting from row 3
    filteredData.forEach((item, rowIndex) => {
      columns.forEach((col, colIndex) => {
        const cell = worksheet.getCell(rowIndex + 3, colIndex + 1);
        cell.value = item[col.key];
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    // Define the file name
    const fileName = `${data?.title?.replace(/[^a-zA-Z0-9]/g, "_")}_${
      new Date().toISOString().split("T")[0]
    }.xlsx`;

    // Save the workbook
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), fileName);
  };

  return (
    <Modal
      size="2xl"
      scrollBehavior="inside"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 text-center">
              {data?.title || ""}
            </ModalHeader>
            <ModalBody className="scrollbar-hide">
              <CustomTable
                data={filteredData}
                columns={columns}
                page={page}
                setPage={setPage}
                pagination={true}
              />
            </ModalBody>
            <ModalFooter>
              <Select
                variant="bordered"
                color="primary"
                placeholder="Select Circle"
                aria-label="Circle"
                name="circle"
                value={selection.circle}
                selectedKeys={[selection.circle]}
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
              >
                {areas.length &&
                  getOptions(createNestedStructure(areas)[data.region])}
              </Select>
              <Tooltip
                isDisabled={selection.circle}
                color="danger"
                content="Please Select Circle"
              >
                <Select
                  aria-label="Division"
                  variant="bordered"
                  name="division"
                  labelPlacement="outside"
                  placeholder="Select Division"
                  value={selection.division}
                  selectedKeys={[selection.division]}
                  onChange={handleChange}
                  disabled={!selection.circle}
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
                    getOptions(
                      createNestedStructure(areas)[data.region]?.[
                        selection.circle
                      ]
                    )}
                </Select>
              </Tooltip>
              <Tooltip
                isDisabled={selection.division}
                color="danger"
                content="Please Select Division"
              >
                <Select
                  aria-label="Sub Division"
                  labelPlacement="outside"
                  name="subDivision"
                  placeholder="Select Subdivision"
                  value={selection.subDivision}
                  selectedKeys={[selection.subDivision]}
                  onChange={handleChange}
                  variant="bordered"
                  disabled={!selection.division}
                  classNames={{
                    base: "w-full h-8",
                    mainWrapper: "h-full",
                    input: "text-small",
                    inputWrapper:
                      "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
                  }}
                  size="sm"
                >
                  {createNestedStructure(areas)[data.region]?.[
                    selection.circle
                  ]?.[selection.division]?.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </Select>
              </Tooltip>
              <Button
                className="h-7 rounded-full"
                color="primary"
                onPress={() => {
                  exportToExcel();
                  onClose();
                }}
              >
                Export to Excel
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
