"use client";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import * as XLSX from "xlsx";
import FileUpload from "@/components/FileUpload";
import {
  Button,
  Input,
  Pagination,
  Select,
  SelectItem,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
  getKeyValue,
} from "@nextui-org/react";
import { createNestedStructure, months } from "@/utils/constant";
import { getCookie } from "@/utils/cookieUtils";
import toast from "react-hot-toast";
import { getHolidayList } from "@/utils/getHolidayList";
import { usePathname } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/utils/fetcher";
import { FaSearch } from "react-icons/fa";
import { getAllArea } from "@/utils/getDesgnData";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

const excelAttdStatus = {
  A: "ABSENT",
  P: "PRESENTS",
  WOP: "PRESENTS",
  WO: "WO",
  "1/2P": "HALFDAY",
};

const columns = [
  { key: "empName", value: "Name" },
  { key: "empNo", value: "Employee No" },
  {
    key: "present",
    value: "No. Of Days Present",
  },
  { key: "target", value: "No of Days" },
];

const currentDate = new Date();
currentDate.setMonth(currentDate.getMonth() - 1);
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate
  .toLocaleString("default", { month: "long" })
  .toUpperCase();

export default function Attendance() {
  const pathName = usePathname();
  const [jsonData, setJsonData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Set([currentMonth]));
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [uploadedDoc, setUploadedDoc] = useState("");
  const [holidayList, setHolidayList] = useState("");
  const [areas, setAreas] = useState("");
  const [areaIdList, setAreaIdList] = useState([]);
  const [user, setUser] = useState("");
  const [attendancePayload, setAttendancePayload] = useState([]);
  const [initialPayload, setInitialPayload] = useState([]);
  const [page, setPage] = useState(1);
  const [selection, setSelection] = useState({
    area: "",
    circle: "",
    division: "",
    subDivision: "",
  });
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      const userCookie = await getCookie("user");
      setUser((userCookie && JSON.parse(userCookie)) || "");
      setHolidayList(await getHolidayList(pathName));
    })();
    areaList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resourceUrl = useMemo(() => {
    if (
      selectedYear.toString().length === 4 &&
      [...selectedMonth][0] &&
      pathName.split("/")[pathName.includes("/hrms") ? 3 : 1] !== "head-office"
    ) {
      return `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/attendance/att/manual?month=${
        [...selectedMonth][0]
      }&year=${selectedYear}&emp_no=${
        search.length > 3 ? search : ""
      }&areaIds=${areaIdList}&size=20&page=${page - 1}`;
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear, selectedMonth, search, page, areaIdList]);

  const { data, isLoading } = useSWR(resourceUrl, fetcher, {
    keepPreviousData: true,
  });

  useEffect(() => {
    if (data?.results?.length) {
      // Create a new object with staffId as keys and corresponding objects as values
      const newAttendance = data.results.reduce((acc, ele) => {
        const present = parseFloat(ele.present).toString();
        if (present && present !== "0") {
          acc[ele.staffId] = {
            ...ele,
            year: parseInt(selectedYear),
            monthName: [...selectedMonth][0],
            createdBy: user.id,
            present,
          };
        }
        return acc;
      }, {});

      setAttendancePayload((prevPayload) => ({
        ...prevPayload,
        ...newAttendance,
      }));
      setInitialPayload((prevPayload) => ({
        ...prevPayload,
        ...data.results,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const areaList = useCallback(
    () => getAllArea(setAreas, pathName, setAreas),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const loadingState = isLoading || data?.length === 0 ? "loading" : "idle";
  isLoading || data?.length === 0 ? "loading" : "idle";

  const handleFileUpload = async (file) => {
    const userCookie = await getCookie("user");
    const user = JSON.parse(userCookie);

    if (!file) return;
    setUploadedDoc(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      let lastDate = "";

      // Determine the last date in the sheet
      for (let i = json[5].length - 1; i >= 0; i--) {
        if (json[5][i]) {
          lastDate = json[5][i].split(" ")[0];
          break;
        }
      }

      const monthIndex = months[[...selectedMonth][0].toUpperCase()];
      const daysInMonth = new Date(selectedYear, monthIndex + 1, 0).getDate();
      if (parseFloat(lastDate) !== parseFloat(daysInMonth)) {
        toast.error("Date mismatch. Check month.");
        setUploadedDoc("");
        return;
      }

      // Handle merged cells
      for (let rowIndex = 0; rowIndex < json.length; rowIndex++) {
        const row = json[rowIndex];
        let lastValue = null;
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
          if (row[colIndex] === "" && lastValue !== null) {
            row[colIndex] = lastValue;
          } else {
            lastValue = row[colIndex];
          }
        }
      }

      const arrayData = [];

      for (let i = 9; i < json.length; i += 6) {
        const empNoRow = json[i];
        const statusRow = json[i + 1];
        const inTimeRow = json[i + 2];
        const outTimeRow = json[i + 3];

        if (!empNoRow || !statusRow || !inTimeRow || !outTimeRow) continue;

        const empNo = empNoRow[3];
        if (!empNo) continue;

        const attendance = [];
        let count = 1;
        for (let j = 2; j < parseFloat(statusRow.length); j++) {
          if (!statusRow[j]) continue;

          const inTimeStr = inTimeRow[j] || "";
          const outTimeStr = outTimeRow[j] || "";

          let status = "ABSENT";

          // Convert time strings to Date objects
          const inTime = new Date(`1970-01-01T${inTimeStr}:00`);
          const outTime = new Date(`1970-01-01T${outTimeStr}:00`);

          // Calculate the difference in hours
          const diffInMs = outTime - inTime;
          const diffInHours = diffInMs / (1000 * 60 * 60);

          // Set status based on time difference
          if (statusRow[j].toLowerCase() === "wo") {
            status = "WO";
          } else if (diffInHours > 0 && diffInHours < 8) {
            status = "HALFDAY";
          } else if (diffInHours >= 8) {
            status = excelAttdStatus[statusRow[j]] || "PRESENTS";
          }

          // Check if the date matches any holiday date
          const currentDate = `${selectedYear}-${String(
            monthIndex + 1
          ).padStart(2, "0")}-${String(count).padStart(2, "0")}`;
          const isHoliday = holidayList?.some(
            (holiday) =>
              holiday.holidayStart <= currentDate &&
              holiday.holidayEnd >= currentDate
          );

          if (isHoliday) {
            status = "HOLIDAY";
          }

          attendance.push({
            day: `d${count}`,
            inTime: inTimeStr,
            outTime: outTimeStr,
            status: status,
          });
          count++;
        }

        arrayData.push({
          empNo: empNo,
          monthName: [...selectedMonth][0],
          year: selectedYear,
          createdBy: user.id,
          zoneId: "",
          attendance,
        });
      }

      setJsonData(arrayData);
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async (type) => {
    const finalPayload1 = Object.values(attendancePayload).filter((newItem) => {
      const oldItem = Object.values(initialPayload).find(
        (item) => item.salaryId === newItem.salaryId // Use a unique identifier to match objects
      );
      return oldItem && oldItem.present !== newItem.present; // Check if the `present` field is altered
    });
    const finalPayload =
      type === "manual"
        ? JSON.stringify(finalPayload1)
        : JSON.stringify(jsonData);

    const token = await getCookie("accessToken");
    const response = await fetch(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/attendance/add${type === "manual" ? "/manual" : ""}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: finalPayload,
      }
    );

    if (response.status === 403) toast.error(response.text());

    if (response.status === 404 || response.ok) {
      setUploadedDoc("");

      let responseData;

      // Check if the response is JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        responseData = await response.json();
      } else {
        // If it's not JSON, treat it as plain text
        responseData = await response.text();
      }

      const updateJson = [...jsonData];
      setJsonData([]);

      if (Array.isArray(responseData) && responseData.length > 0) {
        responseData.map((ele) => {
          if (!ele.toLowerCase().includes("success"))
            toast.error(`Wrong Employee Id ${ele}`);
        });
      } else {
        toast.success(responseData || "Saved Succesfully");
      }

      updateJson.forEach((ele) => {
        if (responseData.includes(ele.empNo.toString())) {
          ele.error = true;
        }
      });
      // toast.success(responseData || "Saved Succesfully");
      setJsonData(updateJson);
    }
  };

  const filteredData = useMemo(() => {
    if (!data?.results?.length) return { ...data, results: [] };

    const filteredResults = data.results
      .sort((a, b) => a.empNo.localeCompare(b.empNo))
      .map((ele) => ({
        ...ele,
        present: (parseFloat(ele.present) || 0).toString(),
      })); // Sort the filtered results

    return { ...data, results: filteredResults };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  function isValidDay(day, month, year) {
    // Convert the month to a 0-based index for JavaScript's Date object
    const zeroBasedMonth = month;

    // Create a date with the given year, month, and day 0 to get the last day of the previous month
    const lastDayOfMonth = new Date(year, zeroBasedMonth + 1, 0).getDate();

    // Check if the input day is within the valid range
    return day <= lastDayOfMonth;
  }

  const handleTarget = (e, item) => {
    let value = e.target.value;

    // Retain only numeric and decimal characters
    const numericValue = value.replace(/[^0-9.]/g, "");

    // Prevent multiple decimal points
    if ((numericValue.match(/\./g) || []).length > 1) {
      return;
    }

    // Parse the numeric value or set it to an empty string
    const parsedValue = numericValue === "" ? "" : parseFloat(numericValue);

    // Check whether the number of days is valdi for the selected month
    if (
      !isValidDay(
        parsedValue,
        months[selectedMonth.values().next().value],
        selectedYear
      )
    ) {
      toast.error(
        `Please enter a valid number of days for ${
          selectedMonth.values().next().value
        }`
      );
      return;
    }

    // Update the attendancePayload immutably
    setAttendancePayload((prevPayload) => ({
      ...prevPayload,
      [item.staffId]: {
        ...item, // Copy the entire object for this staffId
        year: parseInt(selectedYear),
        monthName: [...selectedMonth][0],
        createdBy: user.id,
        present: parsedValue.toString(), // Override only the present field
      },
    }));
  };

  const rowsPerPage = 20;
  const pages = useMemo(() => {
    return data?.count ? Math.ceil(data.count / rowsPerPage) : 0;
  }, [data?.count]);

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

  const getOptions = (data) =>
    data
      ? Object.keys(data).map((key) => (
          <SelectItem key={key} value={key}>
            {key}
          </SelectItem>
        ))
      : null;

  const { area, circle, division, subDivision } = selection;

  return (
    <div className="flex flex-col gap-4 p-4 scrollbar-hide">
      <div className="p-3 rounded-lg bg-white flex items-center justify-between">
        <div className="flex gap-4">
          <Select
            aria-label="Select Year"
            name="status"
            variant="bordered"
            labelPlacement="outside"
            selectedKeys={[selectedYear]}
            placeholder="Year"
            className="col-span-2"
            onChange={(e) => {
              setSelectedYear(e.target.value);
            }}
            classNames={{
              base: "max-w-full sm:min-w-32 sm:max-w-[10rem] h-8",
              mainWrapper: "h-full",
              input: "text-small",
              value: "text-black",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            size="sm"
          >
            <SelectItem key={2024}>2024</SelectItem>
            <SelectItem key={2025}>2025</SelectItem>
          </Select>
          <Select
            aria-label="Select Month"
            className="col-span-2"
            name="month"
            variant="bordered"
            labelPlacement="outside"
            selectedKeys={selectedMonth}
            placeholder="Month"
            onSelectionChange={setSelectedMonth}
            classNames={{
              base: "max-w-full sm:min-w-32 sm:max-w-[10rem] h-8",
              mainWrapper: "h-full",
              input: "text-small",
              value: "text-black",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            size="sm"
          >
            {Object.keys(months).map((ele) => (
              <SelectItem key={ele}>{ele}</SelectItem>
            ))}
          </Select>
          <div className="h-8">
            <FileUpload
              fileKey={"ABCD"}
              fileData={uploadedDoc}
              file={uploadedDoc}
              // title={"Upload Excel File"}
              setFile={handleFileUpload}
              handleDocDelete={() => {
                setUploadedDoc(null);
                setJsonData([]);
              }}
              resourceUrl={`${baseUrl}/api/v1/spsm/view/`}
              description={"Accepts up to 1MB"}
              disabled={!selectedMonth.size || !selectedYear}
            />
          </div>
        </div>
        <div className="flex justify-center items-center">
          <Button
            onClick={() => {
              if (jsonData.length > 0) handleSubmit();
              else handleSubmit("manual");
            }}
            className="h-7 bg-[#76bc21] text-white rounded-full max-w-20"
          >
            Submit
          </Button>
        </div>
      </div>
      <div className="rounded-lg bg-white flex items-center gap-3 p-3">
        <Input
          classNames={{
            base: "max-w-48 sm:min-w-48 h-8",
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper: "h-full font-normal text-default-500 h-8",
          }}
          variant="bordered"
          placeholder="Type To Search..."
          aria-label="Employee Number"
          size="sm"
          value={search}
          onValueChange={setSearch}
          startContent={<FaSearch size={18} />}
          type="search"
        />
        {pathName.split("/")[pathName.includes("/hrms") ? 3 : 1] === "bijli" && (
          <>
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
                base: "max-w-full sm:min-w-32 sm:max-w-[10rem] h-8",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper:
                  "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
              }}
              size="sm"
              bordered
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
                base: "max-w-full  sm:min-w-32 sm:max-w-[10rem] h-8",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper:
                  "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
              }}
              size="sm"
            >
              {areas.length && getOptions(createNestedStructure(areas)[area])}
            </Select>
            <Tooltip
              isDisabled={!!circle}
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
                  base: "max-w-full  sm:min-w-32 sm:max-w-[10rem] h-8",
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
              isDisabled={!!division}
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
                  base: "max-w-full  sm:min-w-32 sm:max-w-[10rem] h-8",
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
          </>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <Suspense fallback={<div>Loading...</div>}>
          <Table
            aria-label="Target Table"
            isHeaderSticky
            isStriped
            bottomContent={
              page && pages > 0 ? (
                <div className="flex w-full justify-center">
                  <Pagination
                    isCompact
                    page={page}
                    total={pages}
                    onChange={(page) => setPage(page)}
                  />
                </div>
              ) : null
            }
          >
            <TableHeader columns={columns}>
              {(column) => <TableColumn>{column.value}</TableColumn>}
            </TableHeader>
            <TableBody
              emptyContent="No Record Found"
              loadingState={loadingState}
            >
              {filteredData.results.map((item, index) => (
                <TableRow key={item.staffId || item.ssId}>
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.key === "sno" ? (
                        (page - 1) * rowsPerPage + index + 1
                      ) : column.key === "target" ? (
                        <input
                          type="text"
                          className="border px-2 py-1 rounded w-full"
                          value={
                            attendancePayload[item.staffId]?.present ??
                            (parseFloat(
                              attendancePayload[item.staffId]?.present
                            ) ||
                              0)
                          }
                          onChange={(e) => handleTarget(e, item)}
                        />
                      ) : (
                        getKeyValue(item, column.key)
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Suspense>
      </div>
    </div>
  );
}
