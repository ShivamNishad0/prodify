"use client";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Tooltip,
  Pagination,
  getKeyValue,
} from "@nextui-org/react";
import { getCookie } from "@/utils/cookieUtils";
import { FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";
import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { createNestedStructure, months } from "@/utils/constant";
import { postData } from "@/utils/api";
import { usePathname } from "next/navigation";
import { getAllArea } from "@/utils/getDesgnData";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

const currentDate = new Date();
currentDate.setMonth(currentDate.getMonth() - 1);
const currentYear = currentDate.getFullYear();
const currentMonth = currentDate
  .toLocaleString("default", { month: "long" })
  .toUpperCase();

export default function FixedSalary() {
  const [columns, setColumns] = useState([
    { key: "sno", value: "S.No" },
    { key: "staffName", value: "Name" },
    { key: "empNo", value: "Employee No" },
    { key: "structureGross", value: "Gross" },
    { key: "dateOfJoining", value: "Joining Date" },
    { key: "target", value: "Amount" },
  ]);

  const pathName = usePathname();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState(new Set([currentMonth]));
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());
  const [staffData, setStaffData] = useState({
    count: 0,
    results: [],
  });
  const [areas, setAreas] = useState("");
  const [areaIdList, setAreaIdList] = useState("");
  const [initialTargets, setInitialTargets] = useState({});
  const [targetPayload, setTargetPayload] = useState({
    targets: {},
    year: "",
    month: "",
    zoneId: "",
  });
  const [selection, setSelection] = useState({
    area: "",
    circle: "",
    division: "",
    subDivision: "",
  });

  useEffect(() => {
    getArea();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getArea = useCallback(
    () => getAllArea(setAreas, pathName, setAreas),
    [pathName]
  );

  const resourceUrl = useMemo(() => {
    if (![...selectedMonth][0] || !selectedYear) return null; // Return null if conditions are not met

    const basePath = `${baseUrl}/api/spshrm/${
      baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
    }`;
    const commonParams = `?month=${[...selectedMonth][0]}&year=${selectedYear}`;

    // Handle cases based on zone and search length
    if (search.length > 3) {
      if (baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]] === "bijli") {
        return `${basePath}/targets/details-fixed?areaId=${areaIdList}&month=${
          [...selectedMonth][0]
        }&year=${selectedYear}&emp_no=${search}&page=${page - 1}&size=20`;
      }
      return `${basePath}/targets/details-fixed${commonParams}&emp_no=${search}&page=${
        page - 1
      }&size=20`;
    }

    // Default URL when search length is less than or equal to 3
    const targetDetailsUrl = `${basePath}/targets/details-fixed${commonParams}&page=${
      page - 1
    }&size=20`;
    return `${targetDetailsUrl}&areaId=${areaIdList}&emp_no=${search}`;
  }, [selectedYear, selectedMonth, search, areaIdList, page, pathName]);

  const { data, isLoading } = useSWR(resourceUrl, fetcher, {
    keepPreviousData: true,
    onSuccess: (data) =>
      setStaffData({
        count: data?.count || 0,
        results: data?.results || [],
      }),
  });

  useEffect(() => {
    if (data?.results?.length) {
      const newTargets = data.results.reduce((acc, ele) => {
        if (ele.target) {
          if (pathName.split("/")[pathName.includes("/hrms") ? 3 : 1] === "suda") {
            acc[ele.ssId] = {
              assignTarget: parseFloat(ele.assignTarget || 0),
              achieveTarget: parseFloat(ele.target || 0),
            };
          } else {
            acc[ele.ssId] =
              parseFloat(ele.target || 0) + parseFloat(ele.extraTarget || 0) ||
              0;
          }
        }
        return acc;
      }, {});

      setInitialTargets({ ...initialTargets, ...newTargets });

      setTargetPayload((prevPayload) => ({
        ...prevPayload,
        targets: { ...prevPayload.targets, ...newTargets },
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const loadingState = isLoading || data?.length === 0 ? "loading" : "idle";

  const filteredData = useMemo(() => {
    if (!staffData.results.length) return { count: 0, results: [] };

    const sortedResults = staffData.results.sort((a, b) =>
      a.empNo.localeCompare(b.empNo)
    );

    return {
      count: staffData.count,
      results: sortedResults,
    };
  }, [staffData]);

  const handletarget = (e, item, name) => {
    const { value } = e.target;

    // Allow only numeric input with one decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");
    if ((numericValue.match(/\./g) || []).length > 1) return;

    const parsedValue = numericValue === "" ? "" : parseFloat(numericValue);

    setTargetPayload((prevPayload) => ({
      ...prevPayload,
      targets: {
        ...prevPayload.targets,
        [item.ssId]:
          pathName.split("/")[pathName.includes("/hrms") ? 3 : 1] === "suda"
            ? {
                achieveTarget: parsedValue || 0,
                assignTarget: parsedValue || 0, // Dynamically assign based on 'name'
              }
            : parsedValue,
      },
    }));
  };

  async function handleSave() {
    if (!selectedYear) {
      toast.error("Please Enter Year");
      return;
    }
    if (selectedYear.toString().length !== 4) {
      toast.error("Please Enter Correct Year");
      return;
    }
    if (![...selectedMonth][0]) {
      toast.error("Please Select Month");
      return;
    }

    const token = await getCookie("accessToken");
    const payload = { ...targetPayload };

    // Only include targets that have changed
    payload.targets = Object.fromEntries(
      Object.entries(targetPayload.targets).filter(
        ([key, value]) => value !== initialTargets[key] && value !== ""
      )
    );

    payload.month = [...selectedMonth][0];
    payload.year = selectedYear;
    payload.zoneId = await getCookie("zone");

    const response = await postData(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/targets/create-fixed`,
      payload,
      token
    );
    if (response) {
      toast.success("Saved Successfully");
      // Update initialTargets with the new values
      setInitialTargets((prev) => ({ ...prev, ...payload.targets }));
    }
  }

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
    <div className="flex p-4 flex-col gap-3">
      <div className="flex justify-between w-full items-center p-3 bg-white shadow-small rounded-large overflow-x-scroll scrollbar-hide gap-2">
        <div className="flex items-center gap-3">
          <Select
            aria-label="Year"
            selectedKeys={[selectedYear]}
            onChange={(e) => setSelectedYear(e.target.value)}
            placeholder="Year"
            variant="bordered"
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
          <Tooltip
            color="warning"
            content="Please Select Year"
            isDisabled={selectedYear.toString().length > 3}
          >
            <Select
              aria-label="Month"
              selectedKeys={selectedMonth}
              onSelectionChange={setSelectedMonth}
              placeholder="Month"
              variant="bordered"
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
              {selectedYear.toString().length > 3 &&
                Object.keys(months).map((month) => (
                  <SelectItem key={month}>{month}</SelectItem>
                ))}
            </Select>
          </Tooltip>
          {baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]] === "bijli" && (
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
                  base: "max-w-full sm:min-w-32 sm:max-w-[10rem] h-8",
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
                    base: "max-w-full  sm:min-w-32 sm:max-w-[10rem] h-8",
                    mainWrapper: "h-full",
                    input: "text-small",
                    inputWrapper:
                      "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
                  }}
                  size="sm"
                >
                  {createNestedStructure(areas)[area]?.[circle]?.[
                    division
                  ]?.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </Select>
              </Tooltip>
            </>
          )}
          {(baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]] === "rmc" ||
            baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]] === "suda") && (
            <Select
              variant="bordered"
              color="primary"
              labelPlacement="outside"
              placeholder="Select Area"
              aria-label="Area"
              name="area"
              value={areaIdList}
              selectedKeys={[areaIdList]}
              onChange={(e) => {
                const { value } = e.target;
                setAreaIdList(value);
              }}
              classNames={{
                base: "sm:min-w-40 sm:max-w-40 h-8",
                popover: "w-full",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper:
                  "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
              }}
              size="sm"
              bordered
              isDisabled={!selectedYear || !selectedMonth}
            >
              {areas.length &&
                areas.map((key) => (
                  <SelectItem key={key.areaId} value={key.areaId}>
                    {key.location}
                  </SelectItem>
                ))}
            </Select>
          )}
          <Input
            placeholder="Search Employee No..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startContent={<FaSearch />}
            size="sm"
            classNames={{
              base: "max-w-56 sm:min-w-48 h-8",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper: "h-full font-normal text-default-500 h-8",
            }}
            variant="bordered"
          />
        </div>

        <Button
          className="h-8 rounded-full"
          color="primary"
          onClick={handleSave}
        >
          Save
        </Button>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <div className="flex flex-col relative gap-4 w-full h-full shadow-small rounded-large">
          <div className="p-4 z-0 flex flex-col relative justify-between gap-4 bg-content1 overflow-auto rounded-large w-full scrollbar-hide shadow-none">
            <table className="min-w-full h-auto table-auto w-full">
              <thead className="[&>tr]:first:rounded-lg sticky top-0 z-20 [&>tr]:first:shadow-small">
                <tr className="group outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 cursor-default">
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className="group px-3 h-10 align-middle bg-default-100 whitespace-nowrap text-tiny first:rounded-s-lg last:rounded-e-lg data-[sortable=true]:cursor-pointer data-[hover=true]:text-foreground-400 outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 text-start font-bold text-black"
                    >
                      {column.value}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="rowgroup">
                {filteredData.results.length > 0 ? (
                  filteredData.results.map((item, index) => (
                    <tr
                      className="group outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 cursor-default"
                      key={item.staffId || item.ssId}
                    >
                      {columns.map((column) => {
                        let cellContent;
                        switch (column.key) {
                          case "sno":
                            cellContent = (page - 1) * rowsPerPage + index + 1;
                            break;
                          case "assignTarget":
                            cellContent = (
                              <input
                                type="text"
                                className="border px-2 py-1 rounded w-full"
                                value={
                                  pathName.split("/")[pathName.includes("/hrms") ? 3 : 1] !== "suda"
                                    ? targetPayload.targets[item.ssId] ??
                                      (parseFloat(item.target) || 0)
                                    : targetPayload.targets[item.ssId]
                                        ?.assignTarget ??
                                      (parseFloat(item.assignTarget) || 0)
                                }
                                onChange={(e) =>
                                  handletarget(e, item, "assignTarget")
                                }
                              />
                            );
                            break;
                          case "target":
                            cellContent = (
                              <input
                                type="text"
                                className="border px-2 py-1 rounded w-full"
                                value={
                                  pathName.split("/")[pathName.includes("/hrms") ? 3 : 1] !== "suda"
                                    ? targetPayload.targets[item.ssId] ??
                                      (parseFloat(item.target) || 0)
                                    : targetPayload.targets[item.ssId]
                                        ?.achieveTarget ??
                                      (parseFloat(item.achieveTarget) || 0)
                                }
                                onChange={(e) =>
                                  handletarget(e, item, "achieveTarget")
                                }
                              />
                            );
                            break;
                          default:
                            cellContent = getKeyValue(item, column.key);
                        }
                        return (
                          <td
                            key={column.key}
                            className="py-2 px-3 relative align-middle whitespace-normal text-small font-normal [&>*]:z-1 [&>*]:relative outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 before:content-[''] before:absolute before:z-0 before:inset-0 before:opacity-0 data-[selected=true]:before:opacity-100 group-data-[disabled=true]:text-foreground-300 group-data-[disabled=true]:cursor-not-allowed before:bg-default/60 data-[selected=true]:text-default-foreground group-data-[odd=true]:before:bg-default-100 group-data-[odd=true]:before:opacity-100 group-data-[odd=true]:before:-z-10 group-aria-[selected=false]:group-data-[hover=true]:before:bg-default-100 group-aria-[selected=false]:group-data-[hover=true]:before:opacity-70 group-data-[first=true]:first:before:rounded-ts-lg group-data-[first=true]:last:before:rounded-te-lg group-data-[middle=true]:before:rounded-none group-data-[last=true]:first:before:rounded-bs-lg group-data-[last=true]:last:before:rounded-be-lg text-start group-data-[odd=true]:data-[selected=true]:before:bg-default/60"
                          >
                            {cellContent}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="text-center border border-gray-300 px-4 py-2"
                    >
                      No Record Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {page && pages > 0 && (
              <div className="flex w-full justify-center mt-4">
                <Pagination
                  isCompact
                  page={page}
                  total={pages}
                  onChange={(page) => setPage(page)}
                />
              </div>
            )}
          </div>
        </div>
      </Suspense>
    </div>
  );
}
