"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Switch,
  Tooltip,
  useDisclosure,
} from "@nextui-org/react";
import { getCookie } from "@/utils/cookieUtils";
import { FaCloudUploadAlt, FaIdCard, FaSearch } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import {
  createNestedStructure,
  createNestedStructureWithId,
  months,
} from "@/utils/constant";
import { getAllArea, getDesgnData } from "@/utils/getDesgnData";
import toast from "react-hot-toast";
import { GrEdit } from "react-icons/gr";
import { BsTrash3Fill } from "react-icons/bs";
import useSWR, { mutate } from "swr";
import { fetcher } from "@/utils/fetcher";
import dynamic from "next/dynamic";
import { getData } from "@/utils/api";
import DeleteModalForm from "./DeleteModalForm";
import IDCard from "@/components/print-id-card/IDCard";
import { toPng } from "html-to-image";
import path from "path";
const AsyncPaginateTable = dynamic(
  () => import("@/components/tables/AcyncPaginateTable"),
  {
    ssr: false,
  }
);
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

const columns = [
  { key: "name", value: "Name" },
  { key: "postOf", value: "Post" },
  { key: "tempEmp", value: "Employee No" },
];

export default function ViewEmployeeList() {
  const router = useRouter();
  const pathName = usePathname();
  const [search, setSearch] = useState("");
  const [selection, setSelection] = useState({
    area: "",
    circle: "",
    division: "",
    subDivision: "",
  });
  const printRef = useRef();
  const [isVerified, setIsVerified] = useState(true);
  const [desgn, setDesgn] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [areas, setAreas] = useState("");
  const [page, setPage] = useState(1);
  const fileInputRef = useRef(null);
  const [selectedUser, setSelectedUser] = useState("");
  const [user, setUser] = useState("");
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [rowData, setRowData] = useState(null); // State to hold the row data
  const [areaIdList, setAreaIdList] = useState("");
  const [allEmpList, setAllEmpList] = useState([]);
  const [idCardData, setIdCardData] = useState("");
  useEffect(() => {
    (async () => {
      const userCookie = await getCookie("user");
      setUser(JSON.parse(userCookie));
    })();
    desgnData();
    areaList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pathName.split("/")[pathName.includes("/hrms") ? 3 : 1] === "bijli") getAllempList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areaIdList]);

  const getAllempList = async () => {
    const token = await getCookie("accessToken");
    const resposne = await getData(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/staff/staff-list-area/complete?areaId=${areaIdList}&type=${
        pathName.split("/")[pathName.includes("/hrms") ? 4 : 2] === "pim" ? "active" : "inactive"
      }&verified=${isVerified ? "VERIFIED" : "UNVERIFIED"}`,
      token
    );
    if (resposne?.results?.length) {
      setAllEmpList(resposne.results);
    }
  };

  if (columns.length === 3) {
    if (pathName.split("/")[pathName.includes("/hrms") ? 4 : 2] === "pim") {
      columns.push(
        { key: "expiryDate", value: "Verification Status" },
        { key: "isIdGenrated", value: "ID Card" },
        { key: "isOfferGenrated", value: "Offer Letter" },
        { key: "action", value: "Action" }
      );
    } else {
      columns.push(
        { key: "contactNo", value: "Mobile No." },
        { key: "action", value: "Action" }
      );
    }
  }

  const areaList = useCallback(
    () => getAllArea(setAreas, pathName, setAreas),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const desgnData = useCallback(() => getDesgnData(setDesgn, pathName), []);

  const selectedArea =
    (areas.length &&
      areas.find((ele) => {
        if (ele.location) {
          if (ele.location !== "DETAILED")
            return (
              ele.location.toLowerCase() ===
              selection?.subDivision?.toLowerCase()
            );
        } else {
          return (
            ele?.subDivision?.toLowerCase() ===
            selection?.subDivision?.toLowerCase()
          );
        }
      })?.areaId) ||
    "";

  const { data, isLoading } = useSWR(
    search.length > 3
      ? `${baseUrl}/api/spshrm/${
          baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
        }/staff/search/staff?tempEmp=${search}&type=${
          pathName.split("/")[pathName.includes("/hrms") ? 4 : 2] === "pim" ? "active" : "inactive"
        }&verified=${isVerified ? "VERIFIED" : "UNVERIFIED"}`
      : `${baseUrl}/api/spshrm/${
          baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
        }/staff/staff-list-area/all?areaId=${areaIdList}&type=${
          pathName.split("/")[pathName.includes("/hrms") ? 4 : 2] === "pim" ? "active" : "inactive"
        }&verified=${isVerified ? "VERIFIED" : "UNVERIFIED"}&page=${
          page - 1
        }&size=20`,
    fetcher,
    {
      keepPreviousData: true,
    }
  );

  const loadingState = isLoading || data?.length === 0 ? "loading" : "idle";
  isLoading || data?.results?.length === 0 ? "loading" : "idle";

  async function handleApprove(row) {
    const token = await getCookie("accessToken");
    const base64staffId = btoa(row.staffId);
    const response = await fetch(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/staff/approve-candidate/${base64staffId}/${btoa(user.id)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const responseData = await response.text();
      if (responseData === "SUCCESS") {
        mutate(
          search.length > 3
            ? `${baseUrl}/api/spshrm/${
                baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
              }/staff/search/staff?tempEmp=${search}&type=${
                pathName.split("/")[pathName.includes("/hrms") ? 4 : 2] === "pim" ? "active" : "inactive"
              }&verified=${isVerified ? "VERIFIED" : "UNVERIFIED"}`
            : `${baseUrl}/api/spshrm/${
                baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
              }/staff/staff-list-area/all?areaId=${areaIdList}&type=${
                pathName.split("/")[pathName.includes("/hrms") ? 4 : 2] === "pim" ? "active" : "inactive"
              }&verified=${isVerified ? "VERIFIED" : "UNVERIFIED"}&page=${
                page - 1
              }&size=20`
        );
        toast.success("Updated Successfully");
      }
    }
  }

  const actionButtons = [
    {
      name: "Edit",
      action: (row) => {
        router.push(`${pathName}/edit?empNumber=${row.staffId}`);
      },
      iconOnly: true,
      icon: <GrEdit size={25} color="#F7E027" />,
    },
    ...(pathName.split("/")[pathName.includes("/hrms") ? 4 : 2] === "pim"
      ? [
          {
            name: "Upload",
            action: (row) => {
              setSelectedUser(row);
              if (fileInputRef.current) {
                fileInputRef.current.click();
              }
            },
            iconOnly: true,
            icon: <FaCloudUploadAlt size={25} color="#fd7e14" />,
          },
          {
            name: "Approval",
            action: (row) => handleApprove(row),
            icon: true,
            // color: row.verified === "VERIFIED" ? "#f50000" : "#76bc21",
            color: "#76bc21",
            // iconOnly: true,
            // tag: (
            //   <Switch
            //     isSelected={row.verified === "VERIFIED"}
            //     onChange={() => handleApprove(row)}
            //     size="sm"
            //     classNames={{
            //       base: cn(
            //         "inline-flex flex-row-reverse items-center",
            //         "justify-between cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent"
            //       ),
            //       wrapper: "p-0 h-4 overflow-visible",
            //       thumb: cn(
            //         "w-6 h-6 border-2 shadow-lg",
            //         "group-data-[hover=true]:border-primary",
            //         //selected
            //         "group-data-[selected=true]:ml-6",
            //         // pressed
            //         "group-data-[pressed=true]:w-7",
            //         "group-data-[selected]:group-data-[pressed]:ml-4"
            //       ),
            //     }}
            //   />
            // ),
          },
          // {
          //   name: "Gen Offer",
          //   action: async (row) => {
          //     // Gen Offer action logic
          //   },
          //   iconOnly: true,
          //   icon: <FaEnvelope size={25} color="#007bff" />,
          // },
          {
            name: "Gen Id",
            action: async (row) =>
              row.isIdGenrated === "TRUE"
                ? updateIDCard(row.staffId)
                : generateIDCard(row.staffId),
            iconOnly: true,
            icon: <FaIdCard size={25} color="#ffc107" />,
          },
          {
            name: "Delete",
            action: (row) => {
              setRowData(row);
              onOpen();
            },
            iconOnly: true,
            icon: <BsTrash3Fill size={25} color="#F50000" />,
          },
        ]
      : []),
  ];

  async function generateIDCard(staffId) {
    try {
      const token = await getCookie("accessToken");
      const userData = await getCookie("user");
      const response = await fetch(
        `${baseUrl}/api/spshrm/${
          baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
        }/id/generateIdOnly/${btoa(staffId)}/${btoa(JSON.parse(userData).id)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate ID card");
      }
      toast.success("Id Card Generated Successfully");
      // router.push(`/id-card-generattion/id-card?empno=${row.empNo}`);
    } catch (error) {
      toast.error("Error generating ID card:", error.message);
    }
  }

  async function updateIDCard(staffId) {
    try {
      const token = await getCookie("accessToken");
      const userData = await getCookie("user");
      const response = await fetch(
        `${baseUrl}/api/spshrm/${
          baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
        }/id/updateIdDetails/${btoa(staffId)}/${btoa(JSON.parse(userData).id)}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate ID card");
      }
      toast.success("Id Card Updated Successfully");
      mutate(
        search.length > 3
          ? `${baseUrl}/api/spshrm/${
              baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
            }/staff/search/staff?tempEmp=${search}&type=${
              pathName.split("/")[pathName.includes("/hrms") ? 4 : 2] === "pim" ? "active" : "inactive"
            }&verified=${isVerified ? "VERIFIED" : "UNVERIFIED"}`
          : `${baseUrl}/api/spshrm/${
              baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
            }/staff/staff-list-area/all?areaId=${areaIdList}&type=${
              pathName.split("/")[pathName.includes("/hrms") ? 4 : 2] === "pim" ? "active" : "inactive"
            }&verified=${isVerified ? "VERIFIED" : "UNVERIFIED"}&page=${
              page - 1
            }&size=20`
      );
      // router.push(`/id-card-generattion/id-card?empno=${row.empNo}`);
    } catch (error) {
      toast.error("Error generating ID card:", error.message);
    }
  }

  async function handleDelete(date) {
    onOpen();
    const token = await getCookie("accessToken");
    const salaryResponse = await getData(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/salary/by-staff-data/${rowData.staffId}`,
      token
    );
    const monthName = Object.keys(months).find(
      (key) => months[key] === parseFloat(date.month) - 1
    );
    const areaID = areas.find(
      (ele) =>
        rowData?.area?.subDivision &&
        (rowData.area.subDivision === ele.subDivision ||
          rowData.area.subDivision === ele.location)
    )?.areaId;
    const deletePayload = {
      staffId: parseFloat(rowData.staffId),
      removedBy: user.id,
      sallaryStructureId: salaryResponse.ssId,
      areaId: areaID || 0,
      month: monthName,
      year: date.year,
      empNo: rowData.tempEmp,
      lastWorkingDay: date.day,
    };
    const response = await fetch(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/staff/remove/staff`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(deletePayload),
      }
    );

    if (response.ok) {
      const responseData = await response.text();
      if (responseData === "SUCCESS") {
        mutate(
          search.length > 3
            ? `${baseUrl}/api/spshrm/${
                baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
              }/staff/search/staff?tempEmp=${search}&type=${
                pathName.split("/")[pathName.includes("/hrms") ? 4 : 2] === "pim" ? "active" : "inactive"
              }&verified=${isVerified ? "VERIFIED" : "UNVERIFIED"}`
            : `${baseUrl}/api/spshrm/${
                baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
              }/staff/staff-list-area/all?areaId=${
                selectedArea ? selectedArea : ""
              }&type=${
                pathName.split("/")[pathName.includes("/hrms") ? 4 : 2] === "pim" ? "active" : "inactive"
              }&verified=${isVerified ? "VERIFIED" : "UNVERIFIED"}&page=${
                page - 1
              }&size=20`
        );
        toast.success("Deleted Successfully");
      }
      onClose();
    }
  }

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
            (ele) => ele[filterProperty]?.toLowerCase() === value.toLowerCase()
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

  const filteredData = useMemo(() => {
    // If no results, return data with empty results array
    if (!data?.results?.length) return { ...data, results: [] };

    const filteredResults = data.results
      // Sort by tempEmp alphabetically
      .sort((a, b) => a.tempEmp.localeCompare(b.tempEmp))
      // Map the results to include postOf designation
      .map((ele) => {
        const designation = desgn.find((d) => d.desigId === ele.desigId);
        return {
          ...ele,
          postOf: designation ? designation.desigName : null,
        };
      });

    // Return the updated data with filtered and sorted results
    return { ...data, results: filteredResults };
  }, [data, desgn]);

  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (file && file.size <= 1048576) {
      const token = await getCookie("accessToken");
      const fileData = new FormData();
      fileData.append("file", file);
      fileData.append("empNo", selectedUser.staffId);
      fileData.append("fileOf", "USER_IMG");
      (async () => {
        try {
          const response = await fetch(
            `${baseUrl}/api/spshrm/${
              baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
            }/staff/upload/file`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
              },
              body: fileData,
            }
          );
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
          }

          toast.success("Uploaded Successfully");
          mutate(
            search.length > 3
              ? `${baseUrl}/api/spshrm/${
                  baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
                }/staff/search/staff?tempEmp=${search}&type=${
                  pathName.split("/")[pathName.includes("/hrms") ? 4 : 2] === "pim" ? "active" : "inactive"
                }&verified=${isVerified ? "VERIFIED" : "UNVERIFIED"}`
              : `${baseUrl}/api/spshrm/${
                  baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
                }/staff/staff-list-area/all?areaId=${
                  selectedArea ? selectedArea : ""
                }&verified=${isVerified ? "VERIFIED" : "UNVERIFIED"}&type=${
                  pathName.split("/")[pathName.includes("/hrms") ? 4 : 2] === "pim" ? "active" : "inactive"
                }&page=${page - 1}&size=20`
          );
        } catch (error) {
          console.error(`Error uploading file`, error);
        }
      })();
    } else {
      alert("File is too large or not an image!");
    }
  }

  const hanldeSelectKeys = (e) => {
    if (e === "all") {
      const abc = new Set(allEmpList.map((ele) => ele.staffId.toString()));
      setSelectedKeys(abc); // Set with unique ssdId values
    } else if (e instanceof Set && e.size === 0) {
      setSelectedKeys(new Set()); // Empty Set
    } else {
      setSelectedKeys(new Set(e));
    }
  };

  const createFolders = async () => {
    const nestedAreas = createNestedStructureWithId(areas);
    const response = await fetch("/api/create-folders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ selection, nestedAreas }),
    });

    if (response.ok) {
      alert("Folders created successfully!");
      const serializedData =
        selectedKeys === "all"
          ? allEmpList
            ? allEmpList?.map((ele) => ele.staffId)
            : null
          : [...selectedKeys];

      if (allEmpList) getUserData(serializedData);
    } else {
      alert("Error creating folders.");
    }
  };

  async function getUserData(dataParam) {
    try {
      const token = await getCookie("accessToken");
      const url = new URL(
        `${baseUrl}/api/spshrm/${
          baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
        }/id/emp-idcards/${dataParam.join(",")}`
      );

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await fetch(url, {
        method: "GET",
        headers: headers,
      });
      const data = await response.json();
      setIdCardData(data);
      // exportToPng();
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  useEffect(() => {
    if (idCardData) {
      exportToPng();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idCardData]);

  const exportToPng = async () => {
    const idCards = printRef.current.querySelectorAll(".idCard");
    const scale = 2; // Scale factor for higher resolution

    for (const card of idCards) {
      const areaDetails = areas.find(
        (ele) => card.dataset.areaid.toString() === ele.areaId.toString()
      );

      if (!areaDetails) {
        console.error(
          "Area details not found for areaId:",
          card.dataset.areaid
        );
        continue;
      }

      const folderPath = path.join(
        // "C:\\Users\\avina\\Downloads\\generated-folders",
        "/home/ubuntu/frontend_ws/generated-folders",
        areaDetails.area,
        areaDetails.circle,
        areaDetails.division,
        `${areaDetails.areaId}-${areaDetails.subDivision}`
      );

      try {
        const previousDisplay = card.style.display;
        card.style.display = "block";

        const postElements = card.querySelectorAll(".post");
        postElements.forEach((post) => {
          post.style.lineHeight = "1.2";
        });

        const width = card.offsetWidth;
        const height = card.offsetHeight;

        const dataUrl = await toPng(card, {
          quality: 1,
          canvasWidth: width * scale,
          canvasHeight: height * scale,
          pixelRatio: scale,
        });

        postElements.forEach((post) => {
          post.style.lineHeight = "";
        });
        card.style.display = previousDisplay;

        await fetch("/api/save-id-card", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            folderPath,
            fileName: `${card.dataset.empno}.png`,
            imageData: dataUrl,
          }),
        });
      } catch (error) {
        console.error("Failed to export ID card as PNG:", error);
      }
    }

    // Fetch and download the ZIP file

    fetch("/api/download-zip")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to download the zip file.");
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "generated-folders.zip";
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading zip file:", error);
      });
  };

  return (
    <>
      <div className="h-inherit flex flex-col gap-3">
        <div className="flex justify-between gap-2 items-center px-5 bg-white rounded-large shadow-small overflow-x-scroll scrollbar-hide">
          <div className="flex items-center gap-3 p-3">
            <Input
              classNames={{
                base: "max-w-full sm:min-w-48 h-8",
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
                  {areas.length &&
                    getOptions(createNestedStructure(areas)[area])}
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
            {(pathName.split("/")[pathName.includes("/hrms") ? 3 : 1] === "rmc" ||
              pathName.split("/")[pathName.includes("/hrms") ? 3 : 1] === "suda") && (
              <Select
                variant="bordered"
                color="primary"
                labelPlacement="outside"
                placeholder="Select ULB"
                aria-label="Select ULB"
                name="area"
                value={areaIdList}
                selectedKeys={[areaIdList]}
                onChange={(e) => {
                  const { value } = e.target;
                  setAreaIdList(value);
                }}
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
                {areas.length &&
                  areas?.map((key) => (
                    <SelectItem key={key.areaId} value={key.areaId}>
                      {key.location}
                    </SelectItem>
                  ))}
              </Select>
            )}
          </div>
          {pathName.split("/")[pathName.includes("/hrms") ? 4 : 2] === "pim" && (
            <div className="flex flex-col gap-2">
              <Switch
                isSelected={isVerified}
                color={isVerified ? "primary" : "secondary"}
                onValueChange={setIsVerified}
                size="sm"
              >
                {isVerified ? "VERIFIED" : "UNVERIFIED"}
              </Switch>
            </div>
          )}
          <Button
            className="h-8 rounded-full bg-[#76bc21]"
            color="primary"
            onClick={() => {
              const serializedData = encodeURIComponent(
                selectedKeys === "all"
                  ? allEmpList
                    ? JSON.stringify(allEmpList?.map((ele) => ele.staffId))
                    : null
                  : JSON.stringify([...selectedKeys])
              );
              if (allEmpList)
                router.push(`${pathName}/print-id-card?data=${serializedData}`);
            }}
          >
            Print
          </Button>
          <Button
            className="h-8 rounded-full bg-[#76bc21]"
            color="primary"
            onClick={createFolders}
            isDisabled={!selection.area}
          >
            Export
          </Button>
        </div>
        <div className="flex-grow h-inherit">
          <AsyncPaginateTable
            columns={columns}
            actionButtons={actionButtons}
            selectedKeys={selectedKeys}
            setSelectedKeys={setSelectedKeys}
            hanldeSelectKeys={hanldeSelectKeys}
            selectButton={"multiple"}
            resourceUrl={`${baseUrl}/api/v1/spsm/view/STAFF_DOC/`}
            page={search.length > 3 ? false : page}
            data={filteredData}
            setPage={setPage}
            loadingState={loadingState}
          />
        </div>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".jpg, .png, .gif"
        onChange={handleImageChange}
      />
      <DeleteModalForm
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        rowData={rowData}
        handleDelete={handleDelete}
      />
      <div
        id="printArea"
        ref={printRef} // Attach the ref to the root element
        className="printable grid grid-cols-3 gap-4 mx-auto w-full"
      >
        <IDCard data={idCardData} desgn={desgn} />
      </div>
    </>
  );
}
