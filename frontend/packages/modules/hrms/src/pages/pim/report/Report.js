"use client";
import React, { useContext, useEffect, useState } from "react";
import { Input } from "@nextui-org/react";
import { FaSearch } from "react-icons/fa";
import AsyncPaginateTable from "@/components/tables/AcyncPaginateTable";
import { fetcher } from "@/utils/fetcher";
import useSWR from "swr";
import { getCookie } from "@/utils/cookieUtils";
import PIMReport from "@/context/PIMReport";
import Details from "./Details";
import { usePathname } from "next/navigation";

const columns = [
  { key: "name", value: "Name" },
  { key: "postOf", value: "Post" },
  { key: "contactNo", value: "Mobile No." },
  { key: "tempEmp", value: "Employee No" },
];

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

export default function Report() {
  const pathName = usePathname();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedKeys, setSelectedKeys] = useState("default");
  const { setUser, user } = useContext(PIMReport);

  const { data, isLoading } = useSWR(
    search.length > 3 &&
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/staff/search/staff?tempEmp=${search}&type=${
        pathName.split("/")[pathName.includes("/hrms") ? 4 : 2] === "report" ? "active" : "inactive"
      }`,
    fetcher,
    {
      keepPreviousData: false,
    }
  );

  const loadingState = isLoading || data?.length === 0 ? "loading" : "idle";
  isLoading || data?.results?.length === 0 ? "loading" : "idle";

  useEffect(() => {
    const firstSelectedKey = [...selectedKeys]?.[0];
    if (firstSelectedKey && data?.results) {
      const foundUser = data.results.find(
        (ele) => ele.staffId.toString() === firstSelectedKey.toString()
      );

      setUser(foundUser);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKeys, data?.results]);

  return (
    <div className="h-full p-4">
      <div className="mb-3">
        <div className="flex items-center gap-3">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Type To Search..."
            startContent={<FaSearch size={18} />}
            classNames={{
              base: "max-w-full sm:min-w-48 h-8",
              mainWrapper: "h-full",
              input: "text-small",
              inputWrapper: "h-full font-normal text-default-500 h-8 bg-white",
            }}
            size="sm"
            value={search}
            onValueChange={setSearch}
            type="search"
          />
        </div>
      </div>
      {user ? (
        <Details />
      ) : (
        <div className="flex-grow h-inherit">
          <AsyncPaginateTable
            columns={columns}
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
            selectButton={"single"}
            resourceUrl={`${baseUrl}/api/v1/spsm/view/STAFF_DOC/`}
            page={search.length > 3 ? false : page}
            data={data}
            setPage={setPage}
            loadingState={loadingState}
          />
        </div>
      )}
    </div>
  );
}
