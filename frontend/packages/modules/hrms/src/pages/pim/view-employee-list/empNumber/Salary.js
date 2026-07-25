"use client";
import PIMContext from "@/context/PIMProvider";
import { getData, postData } from "@/utils/api";
import { getCookie } from "@/utils/cookieUtils";
import { getPimdata } from "@/utils/getPimData";
import { Button, Divider, Input, Select, SelectItem } from "@nextui-org/react";
import { usePathname } from "next/navigation";
import React, { useContext, useEffect } from "react";
import toast from "react-hot-toast";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);
export default function Salary() {
  const pathName = usePathname();
  const { formData, setFormData, empNumber, salary, setSalary, setDocs } =
    useContext(PIMContext);

  useEffect(() => {
    getSalarydata();
    setSalary((prevData) => ({
      ...prevData,
      staffId: parseFloat(formData.staffId),
      empNo: formData.tempEmp,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getSalarydata() {
    const token = await getCookie("accessToken");
    const response = await getData(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/salary/by-staff-data/${formData.staffId}`,
      token
    );

    if (response !== "No Data Found" && response) {
      const updateData = { ...response };
      for (const key in updateData) {
        if (updateData[key] === null || updateData[key] === undefined) {
          updateData[key] = "";
        }
      }
      updateData.staffId = parseFloat(formData.staffId);
      updateData.empNo = formData.tempEmp;
      setSalary(updateData);
    }
  }

  function handleGross(e) {
    const { value } = e.target;
    const gross = isNaN(parseFloat(value)) ? value : parseFloat(value);
    const basic = isNaN(gross) ? value : (gross * 2) / 5;
    const da = isNaN(gross) ? value : gross / 50;
    const hra = isNaN(gross) ? value : (gross * 21) / 125;

    setSalary((prevData) => ({
      ...prevData,
      gross,
      basic,
      da,
      hra,
      conv_oth: isNaN(gross) ? value : gross - (basic + da + hra),
    }));
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setSalary((prevData) => ({
      ...prevData,
      [name]: isNaN(parseFloat(value)) ? value : parseFloat(value),
    }));
  }

  function handleChange1(e) {
    const { name, value } = e.target;

    // Check if the input is a valid number or decimal
    const isValidNumber = /^\d*\.?\d*$/.test(value);

    setSalary((prevData) => ({
      ...prevData,
      [name]:
        value === "."
          ? "0."
          : isValidNumber
          ? value.replace(/^0+(\d)/, "$1")
          : prevData[name],
    }));
  }

  async function handleSave() {
    const requiredFields = {
      gross: "Gross is a mandatory field.",
    };

    // if (salary.pfStatus === "TRUE" && !salary.pfUAN_NO) {
    //   toast.error("PF UAN Number is a mandatory field");
    //   return;
    // }
    if (salary.pfStatus === "TRUE" && !salary.pfPercent) {
      toast.error("PF Percent is a mandatory field");
      return;
    }
    // if (salary.esiStatus === "TRUE" && !salary.esiNo) {
    //   toast.error("ESI Number is a mandatory field");
    //   return;
    // }
    if (salary.esiStatus === "TRUE" && !salary.esiPercent) {
      toast.error("ESI Percent is a mandatory field");
      return;
    }

    for (const [field, message] of Object.entries(requiredFields)) {
      if (!salary[field]) {
        toast.error(message);
        return; // Exit function after showing the first error
      }
    }

    const payload = { ...salary };
    payload.pfPercent = 0.12;
    payload.esiPercent = 0.75;
    payload.targetBased = payload.targetBased || "FALSE";
    if (!salary.ssId) {
      payload.staffName = formData.name;
    }
    const removeFalsyValues = (obj) => {
      return Object.fromEntries(
        Object.entries(obj).filter(([key, value]) => Boolean(value))
      );
    };

    const cleanedPayload = removeFalsyValues(payload);

    try {
      const token = await getCookie("accessToken");
      const response = await postData(
        `${baseUrl}/api/spshrm/${baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]}/salary/${
          salary.ssId ? `update/${salary.ssId}` : "new"
        }`,
        cleanedPayload,
        token,
        salary.ssId && "PUT"
      );
      if (response === "SUCCESS") {
        await getPimdata(setFormData, btoa(empNumber), setDocs, pathName);
        toast.success("Save Successfully");
      } else {
        toast.error(response || "Failed to save data.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      toast.error("Failed to save data.");
    }
  }

  return (
    <div className="flex flex-col justify-between h-full gap-4 overflow-y-scroll scrollbar-hide">
      <div>
        <div className="text-[#8896af] text-lg font-bold">Salary Structure</div>
        <Divider />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1">
          <Input
            label="Gross"
            labelPlacement="outside"
            variant="bordered"
            required
            fullWidth
            name="gross"
            value={salary.gross}
            onChange={handleGross}
          />
          <Input
            label="Basic"
            labelPlacement="outside"
            variant="bordered"
            required
            fullWidth
            name="basic"
            value={salary.basic}
            onChange={handleChange}
            isDisabled
          />
          <Input
            label="DA"
            labelPlacement="outside"
            variant="bordered"
            required
            fullWidth
            name="da"
            value={salary.da}
            onChange={handleChange}
            isDisabled
          />
          <Input
            label="HRA"
            labelPlacement="outside"
            variant="bordered"
            required
            fullWidth
            name="hra"
            value={salary.hra}
            onChange={handleChange}
            isDisabled
          />
          <Input
            label="Conveyance/Others"
            labelPlacement="outside"
            variant="bordered"
            required
            fullWidth
            name="conv_oth"
            value={salary.conv_oth}
            onChange={handleChange}
            isDisabled
          />
          <Select
            label="Salary Payment Type"
            name="pfStatus"
            variant="bordered"
            labelPlacement="outside"
            selectedKeys={[salary.targetBased || "FALSE"]}
            placeholder="--Select--"
            isRequired
            onChange={(e) => {
              setSalary((prevData) => ({
                ...prevData,
                targetBased: e.target.value,
              }));
            }}
            classNames={{
              base: "",
              mainWrapper: "h-full",
              input: "text-small",
              value: "text-black",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
          >
            <SelectItem key={"TRUE"}>Target-Based</SelectItem>
            <SelectItem key={"FALSE"}>Salaried</SelectItem>
            <SelectItem key={"FIXED"}>Fixed Salary</SelectItem>
          </Select>
        </div>
        <div className="text-[#8896af] text-lg font-bold mt-2">
          PF / ESI Structure
        </div>
        <Divider />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1">
          <Select
            label="Provident Fund Status"
            name="pfStatus"
            variant="bordered"
            labelPlacement="outside"
            selectedKeys={[salary.pfStatus]}
            placeholder="--Select--"
            isRequired
            onChange={(e) => {
              setSalary((prevData) => ({
                ...prevData,
                pfStatus: e.target.value,
                pfPercent: e.target.value === "TRUE" ? 12 : 0,
              }));
            }}
            classNames={{
              base: "",
              mainWrapper: "h-full",
              input: "text-small",
              value: "text-black",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
          >
            {["TRUE", "FALSE"].map((ele) => (
              <SelectItem key={ele}>{ele}</SelectItem>
            ))}
          </Select>
          <Input
            label="PF/UAN Number"
            labelPlacement="outside"
            variant="bordered"
            required
            fullWidth
            name="pfUAN_NO"
            value={salary.pfUAN_NO}
            onChange={handleChange}
            isDisabled={salary.pfStatus !== "TRUE"}
          />
          <Input
            label="Provident Fund"
            labelPlacement="outside"
            variant="bordered"
            required
            fullWidth
            name="pfPercent"
            value={salary.pfPercent}
            onChange={handleChange}
            isRequired
            isDisabled
          />
          <Select
            label="ESI Status"
            name="pfStatus"
            variant="bordered"
            labelPlacement="outside"
            selectedKeys={[salary.esiStatus]}
            placeholder="--Select--"
            onChange={(e) => {
              setSalary((prevData) => ({
                ...prevData,
                esiStatus: e.target.value,
                esiPercent: e.target.value === "TRUE" ? 0.75 : 0,
              }));
            }}
            classNames={{
              base: "",
              mainWrapper: "h-full",
              input: "text-small",
              value: "text-black",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            isRequired
          >
            {["TRUE", "FALSE"].map((ele) => (
              <SelectItem key={ele}>{ele}</SelectItem>
            ))}
          </Select>
          <Input
            label="ESI Number"
            labelPlacement="outside"
            variant="bordered"
            required
            fullWidth
            name="esiNo"
            value={salary.esiNo}
            onChange={handleChange}
            isDisabled={salary.esiStatus !== "TRUE"}
          />
          <Input
            label="ESI"
            labelPlacement="outside"
            variant="bordered"
            required
            fullWidth
            name="esiPercent"
            value={salary.esiPercent}
            onChange={handleChange1}
            isDisabled
          />
          <Select
            label="TDS Status"
            name="tdsStatus"
            variant="bordered"
            labelPlacement="outside"
            selectedKeys={[salary.tdsStatus]}
            placeholder="--Select--"
            onChange={(e) => {
              setSalary((prevData) => ({
                ...prevData,
                tdsStatus: e.target.value,
              }));
            }}
            classNames={{
              base: "",
              mainWrapper: "h-full",
              input: "text-small",
              value: "text-black",
              inputWrapper:
                "h-full font-normal text-default-500 bg-default-400/20 dark:bg-default-500/20",
            }}
            isRequired
          >
            {["TRUE", "FALSE"].map((ele) => (
              <SelectItem key={ele}>{ele}</SelectItem>
            ))}
          </Select>
          <Input
            label="TAN Number"
            labelPlacement="outside"
            variant="bordered"
            required
            fullWidth
            name="tanNo"
            value={salary.esiNo}
            onChange={handleChange}
            isDisabled={salary.tdsStatus !== "TRUE"}
          />
          <Input
            label="TDS"
            labelPlacement="outside"
            variant="bordered"
            required
            fullWidth
            name="tdsPercent"
            value={salary.tdsPercent}
            onChange={handleChange1}
            isDisabled={salary.tdsStatus !== "TRUE"}
          />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Divider />
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            className="bg-[#76bc21] rounded-full h-8 min-w-24 text-white text-sm"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
