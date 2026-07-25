"use client";
import AsyncPaginateTable from "@/components/tables/AcyncPaginateTable";
import { months } from "@/utils/constant";
import { fetcher } from "@/utils/fetcher";
import { Input, Select, SelectItem, Switch, Tooltip } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import React, { useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import useSWR from "swr";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

const columns = [
  { key: "staffName", value: "Name" },
  { key: "empNo", value: "Employee No" },
  { key: "advance", value: "Advance" },
  { key: "advanceRemark", value: "Advance Remark" },
  { key: "deduction", value: "Deduction" },
  { key: "deductionRemark", value: "Deduction Remark" },
  { key: "gross", value: "Gross" },
];

export default function Deductions() {
  const pathName = usePathname();
  const [selectedMonth, setSelectedMonth] = useState(new Set([]));
  const [selectedYear, setSelectedYear] = useState("");
  const [search, setSearch] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [page, setPage] = useState(1);

  const resourceUrl = useMemo(() => {
    if (selectedYear.toString().length === 4 && [...selectedMonth][0]) {
      return `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/payroll/salary-on-type?month=${
        [...selectedMonth][0]
      }&year=${selectedYear}&type=${isVerified ? "ded" : "adv"}&page=${
        page - 1
      }&size=20`;
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear, selectedMonth, search, page]);

  const { data, isLoading } = useSWR(resourceUrl, fetcher, {
    keepPreviousData: true,
  });

  const loadingState = isLoading || data?.length === 0 ? "loading" : "idle";
  isLoading || data?.length === 0 ? "loading" : "idle";

  const filteredData = useMemo(() => {
    if (!data?.results?.length) return { ...data, results: [] };

    const filteredResults = data.results.sort((a, b) =>
      a.empNo.localeCompare(b.empNo)
    ); // Sort the filtered results

    return { ...data, results: filteredResults };
  }, [data]);

  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex justify-between w-full items-center p-3 bg-white shadow-small rounded-large overflow-x-scroll scrollbar-hide gap-2">
        <div className="flex items-center gap-3">
          <Input
            aria-label="Year"
            placeholder="Enter Year"
            labelPlacement="outside"
            variant="bordered"
            required
            fullWidth
            name="year"
            size="sm"
            classNames={{
              base: "max-w-full sm:min-w-48 h-8",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper: "h-full font-normal text-default-500 h-8",
            }}
            value={selectedYear}
            onChange={(e) =>
              setSelectedYear((prevYear) => {
                const value = e.target.value;
                if (value === "" || /^\d{1,4}$/.test(value)) {
                  return value === "" ? "" : parseFloat(value);
                }
                return prevYear;
              })
            }
          />
          <Tooltip
            isDisabled={selectedYear.toString().length > 3}
            color="danger"
            content="Please Enter Year First"
            classNames={{
              base: ["before:bg-neutral-400 dark:before:bg-white"],
              content: [
                "px-4 shadow-xl",
                "text-black bg-gradient-to-br from-white to-neutral-400",
              ],
            }}
          >
            <Select
              aria-label="Select Month"
              className=""
              name="month"
              variant="bordered"
              labelPlacement="outside"
              selectedKeys={selectedMonth}
              placeholder="Month"
              onSelectionChange={setSelectedMonth}
              size="sm"
              classNames={{
                base: "max-w-full sm:min-w-48 h-8",
                mainWrapper: "h-full",
                input: "text-small",
                inputWrapper: "h-full font-normal text-default-500 h-8",
              }}
            >
              {selectedYear.toString().length > 3 &&
                Object.keys(months).map((ele) => (
                  <SelectItem key={ele}>{ele}</SelectItem>
                ))}
            </Select>
          </Tooltip>
          <Input
            classNames={{
              base: "max-w-56 sm:min-w-48 h-8",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper: "h-full font-normal text-default-500 h-8",
            }}
            variant="bordered"
            placeholder="Search Employee No..."
            aria-label="Employee Number"
            size="sm"
            value={search}
            onValueChange={setSearch}
            startContent={<FaSearch size={18} />}
            type="search"
            isDisabled={
              selectedYear.toString().length < 4 || ![...selectedMonth][0]
            }
          />
        </div>
        <div className="flex flex-col gap-2">
          <Switch
            isSelected={isVerified}
            color={isVerified ? "primary" : "secondary"}
            onValueChange={setIsVerified}
            size="sm"
            isDisabled={
              selectedYear.toString().length < 4 || ![...selectedMonth][0]
            }
          >
            {isVerified ? "Deduction" : "Advance"}
          </Switch>
        </div>
      </div>
      <AsyncPaginateTable
        columns={columns}
        page={search.length > 3 ? false : page}
        data={filteredData}
        setPage={setPage}
        loadingState={loadingState}
      />
    </div>
  );
}
