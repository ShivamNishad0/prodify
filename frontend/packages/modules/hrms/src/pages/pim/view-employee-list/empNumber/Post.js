"use client";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Button,
  DatePicker,
  Divider,
  Select,
  SelectItem,
  Switch,
  Tooltip,
  cn,
} from "@nextui-org/react";
import PIMContext from "@/context/PIMProvider";
import { createNestedStructure } from "@/utils/constant";
import FileUpload from "@/components/FileUpload";
import { formatDate } from "@/utils/formatDate";
import { getCookie } from "@/utils/cookieUtils";
import { postData } from "@/utils/api";
import { getAllArea, getAllDept } from "@/utils/getDesgnData";
import toast from "react-hot-toast";
import { getPimdata } from "@/utils/getPimData";
import { usePathname } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);
export default function Post() {
  const pathName = usePathname();
  const {
    formData,
    setFormData,
    setDocs,
    selections,
    setSelections,
    desgn,
    empNumber,
    location,
  } = useContext(PIMContext);
  const [contract, setContract] = useState(false);
  const [errors, setErrors] = useState({});
  const [area, setArea] = useState("");
  const [dept, setDept] = useState([]);

  useEffect(() => {
    areaData();
    getDeptData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const areaData = useCallback(() => getAllArea(setArea, pathName), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getDeptData = useCallback(() => getAllDept(setDept, pathName), []);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  const handleDateChange = (name, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectionChange = (e) => {
    const { name, value } = e.target;
    const selectedArea = area.find((ele) => {
      return ele.subDivision.toLowerCase() === value.toLowerCase();
    });

    if (name === "subDivision") {
      setFormData((prevData) => ({
        ...prevData,
        area: { ...prevData.area, [name]: value },
        areaId: selectedArea?.areaId || "",
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        area: { ...prevData.area, [name]: value },
        areaId: "a",
      }));
    }
  };

  const getOptions = (data) => {
    return (
      data &&
      Object.keys(data).map((key) => (
        <SelectItem key={key} value={key}>
          {key}
        </SelectItem>
      ))
    );
  };

  const handleDoc = (file) => {
    setFormData((prevState) => ({
      ...prevState,
      contractDoc: file,
    }));
  };

  const handleDocCapture = (fileKey, file) => {
    setFormData((prevState) => ({
      ...prevState,
      [fileKey]: file,
    }));
  };

  const handleDocDelete = (fileKey) => {
    setFormData((prevState) => ({
      ...prevState,
      [fileKey]: null,
    }));
  };

  async function handleSave() {
    const newErrors = {};
    if (contract) {
      if (!formData.contractStartDate)
        newErrors.contractStartDate = "Please Enter Date";
      if (!formData.contractEndDate)
        newErrors.contractEndDate = "Please Enter Date";
      if (!formData.contractDoc)
        newErrors.contractDoc = "Please Upload document";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const submissionData = { ...formData };
      submissionData.dlExpDate = formatDate(formData.dlExpDate);
      submissionData.dob = formatDate(formData.dob);
      submissionData.dateOfJoining = formatDate(formData.dateOfJoining);
      submissionData.contractStartDate = formatDate(formData.contractStartDate);
      submissionData.contractEndDate = formatDate(formData.contractEndDate);
      if (contract) {
        submissionData.contractStartDate = formatDate(
          formData.contractStartDate
        );
        submissionData.contractEndDate = formatDate(formData.contractEndDate);
      }
      submissionData.areaId = formData.areaId || formData.location.toString();

      delete submissionData.exp;
      delete submissionData.quali;
      delete submissionData.area;
      const token = await getCookie("accessToken");

      const response = await postData(
        `${baseUrl}/api/spshrm/${
          baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
        }/staff/change-in/${btoa(formData.staffId)}`,
        submissionData,
        token
      );

      if (response) {
        if (response === "USER ALLREADY EXISTS") {
          toast.error(response);
          return;
        } else if (formData.contractDoc) {
          const fileData = new FormData();
          fileData.append("file", formData.contractDoc);
          fileData.append("empNo", response);
          fileData.append("fileOf", "DRIVING_LISCENCE");
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
            } catch (error) {
              console.error(`Error uploading file ${fileOf}:`, error);
            }
          })();
        }
        getPimdata(setFormData, btoa(empNumber), setDocs, pathName);
        toast.success("Saved Successfully");
      }
    }
  }

  return (
    <div className="flex flex-col justify-between h-full gap-4 overflow-y-scroll scrollbar-hide">
      <div className="flex flex-col gap-4">
        <div className="text-[#8896af] text-lg font-bold">Post</div>
        <Divider />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1">
          <DatePicker
            label="Joined Date"
            format="dd-mm-yyyy"
            variant="bordered"
            showMonthAndYearPickers
            labelPlacement="outside"
            value={formData.dateOfJoining}
            onChange={(date) => handleDateChange("dateOfJoining", date)}
          />
          <Select
            label="Department"
            name="departmentId"
            variant="bordered"
            labelPlacement="outside"
            selectedKeys={[formData.departmentId]}
            placeholder="--Select--"
            className="max-w-xs"
            onChange={handleChange}
          >
            {dept.length &&
              dept.map((ele) => (
                <SelectItem key={ele.depId}>{ele.depName}</SelectItem>
              ))}
          </Select>
          <Select
            label="Job Title"
            name="desigId"
            variant="bordered"
            labelPlacement="outside"
            placeholder="--Select--"
            selectedKeys={[formData.desigId]}
            className="max-w-xs"
            onChange={handleChange}
          >
            {desgn.length &&
              desgn.map((ele) => {
                return (
                  <SelectItem key={ele.desigId}>{ele.desigName}</SelectItem>
                );
              })}
          </Select>
          <div className="flex flex-col gap-3 text-sm">
            <Select
              label="Location"
              name="location"
              variant="bordered"
              labelPlacement="outside"
              placeholder="--Select--"
              className="max-w-xs"
              value={formData.location?.toString()}
              selectedKeys={[formData.location?.toString()]} // No need to stringify the selected keys
              onChange={(e) => {
                handleChange(e);
                if (e.target.value && e.target.value !== "a") {
                  setSelections((prevData) => ({
                    ...prevData,
                    area: "",
                    areaId: e.target.value,
                  }));
                  setFormData((prevData) => ({
                    ...prevData,
                    area: "",
                    areaId: e.target.value,
                  }));
                }
              }}
            >
              <SelectItem key={""}>--Select--</SelectItem>
              {location.length &&
                location?.map((ele) => (
                  <SelectItem key={ele.areaId}>{ele.location}</SelectItem>
                ))}
            </Select>
          </div>
          {formData?.location === "a" && (
            <>
              <Select
                label="Area"
                name="area"
                variant="bordered"
                labelPlacement="outside"
                placeholder="--Select--"
                value={formData?.area?.area}
                selectedKeys={[formData?.area?.area]}
                onChange={handleSelectionChange}
                bordered
              >
                <SelectItem key="" value="">
                  --Select--
                </SelectItem>
                {area.length && getOptions(createNestedStructure(area))}
              </Select>
              <Tooltip
                isDisabled={!!selections?.area}
                color="danger"
                content="Please Select Area"
              >
                <Select
                  label="Circle"
                  variant="bordered"
                  name="circle"
                  labelPlacement="outside"
                  placeholder="--Select--"
                  value={formData?.area?.circle}
                  selectedKeys={[formData?.area?.circle]}
                  onChange={handleSelectionChange}
                  disabled={!formData?.area?.area}
                >
                  {area.length &&
                    getOptions(
                      createNestedStructure(area)[formData?.area?.area]
                    )}
                </Select>
              </Tooltip>
              <Tooltip
                isDisabled={!!formData?.area?.circle}
                color="danger"
                content="Please Select Circle"
              >
                <Select
                  label="Division"
                  variant="bordered"
                  name="division"
                  labelPlacement="outside"
                  placeholder="--Select--"
                  value={formData?.area?.division}
                  selectedKeys={[formData?.area?.division]}
                  onChange={handleSelectionChange}
                  disabled={!formData?.area?.circle}
                >
                  {area.length &&
                    getOptions(
                      createNestedStructure(area)[formData?.area?.area]?.[
                        formData?.area?.circle
                      ]
                    )}
                </Select>
              </Tooltip>
              <Tooltip
                isDisabled={!!formData?.area?.division}
                color="danger"
                content="Please Select Division"
              >
                <Select
                  label="Sub Division"
                  labelPlacement="outside"
                  name="subDivision"
                  placeholder="--Select--"
                  value={formData?.area?.subDivision}
                  selectedKeys={[formData?.area?.subDivision]}
                  onChange={handleSelectionChange}
                  variant="bordered"
                  disabled={!formData?.area?.division}
                >
                  {createNestedStructure(area)[formData?.area?.area]?.[
                    formData?.area?.circle
                  ]?.[formData?.area?.division]?.map((sub) => (
                    <SelectItem key={sub} value={sub}>
                      {sub}
                    </SelectItem>
                  ))}
                </Select>
              </Tooltip>
            </>
          )}
        </div>
        <Divider />
        <div className="flex">
          <Switch
            classNames={{
              base: cn(
                "inline-flex flex-row-reverse w-full max-w-md bg-content1 hover:bg-content2 items-center",
                "justify-between cursor-pointer rounded-lg gap-2 p-2 border-2 border-transparent",
                "data-[selected=true]:border-primary"
              ),
            }}
            size="sm"
            isSelected={contract}
            onValueChange={setContract}
          >
            Include Employment Contract Details
          </Switch>
        </div>
        {contract && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1">
            <DatePicker
              variant="bordered"
              showMonthAndYearPickers
              label="Contract Start Date"
              labelPlacement="outside"
              value={formData.contractStartDate}
              onChange={(date) => handleDateChange("contractStartDate", date)}
              color={errors.contractStartDate ? "danger" : ""}
              isInvalid={errors.contractStartDate}
              errorMessage={errors.contractStartDate}
            />
            <DatePicker
              variant="bordered"
              showMonthAndYearPickers
              label="Contract End Date"
              labelPlacement="outside"
              value={formData.contractEndDate}
              onChange={(date) => handleDateChange("contractEndDate", date)}
              color={errors.contractEndDate ? "danger" : ""}
              isInvalid={errors.contractEndDate}
              errorMessage={errors.contractEndDate}
            />
            <FileUpload
              fileKey="contractDoc"
              fileData={formData.contractDoc}
              title="Contract Details"
              handleFileUpload={handleDoc}
              handleDocCapture={handleDocCapture}
              handleDocDelete={handleDocDelete}
              resourceUrl={`${baseUrl}/api/v1/spsm/view/`}
              description={"Accepts up to 1MB"}
              errorMessage={errors.contractDoc}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <Divider />
        <div className="flex justify-end">
          <Button
            className="bg-[#76bc21] rounded-full h-8 min-w-24 text-white text-sm"
            onClick={handleSave}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
