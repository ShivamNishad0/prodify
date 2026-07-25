"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  Spacer,
  Input,
  Button,
  Avatar,
  CardBody,
  Switch,
  Divider,
  SelectItem,
  Select,
  Tooltip,
} from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import { getCookie } from "@/utils/cookieUtils";
import { postData } from "@/utils/api";
import toast from "react-hot-toast";
import { createNestedStructure } from "@/utils/constant";
import { getAllArea } from "@/utils/getDesgnData";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

const initialForm = {
  firstName: "",
  middleName: "",
  lastName: "",
  employeeId: "",
  contactNo: "",
  email: "",
  password: "",
  cnfPassword: "",
  status: "FALSE",
  location: "",
  areaId: "",
};
export default function AddEmployee() {
  const [formData, setFormData] = useState(initialForm);
  const [createLogin, setCreateLogin] = useState(false);
  const [image, setImage] = useState("");
  const [user, setUser] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const pathName = usePathname();
  const [selections, setSelections] = useState({
    area: "",
    circle: "",
    division: "",
    subDivision: "",
  });
  const [area, setArea] = useState("");
  const [location, setLocation] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 1048576) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
      setImageFile(file);
    } else {
      alert("File is too large or not an image!");
    }
  };

  useEffect(() => {
    areaData();
    (async () => {
      const userCookie = await getCookie("user");
      setUser(JSON.parse(userCookie));
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const selectedArea =
      area.length &&
      area?.find(
        (ele) => ele.subDivision.toLowerCase() === "OFFICE".toLowerCase()
      );
    setFormData((prevData) => ({
      ...prevData,
      areaId: selectedArea?.areaId || "",
    }));
  }, [area]);

  useEffect(() => {
    setFormData(initialForm);
  }, [createLogin]);

  const validateEmail = (value) =>
    value.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);

  const areaData = useCallback(
    () => getAllArea(setArea, pathName, setLocation),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const zoneCookie = await getCookie("zone");
    const currentZone = JSON.parse(zoneCookie);

    if (!formData.location) newErrors.location = "Location is required";
    if (formData.location === "a" && !selections?.subDivision)
      newErrors.location = "Please Correct Area";
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.employeeId) newErrors.employeeId = "Employee ID is required";
    if (!formData.contactNo) newErrors.contactNo = "Mobile Number is required";
    if (createLogin) {
      if (!formData.email) newErrors.email = "Email is required";
      else if (!validateEmail(formData.email))
        newErrors.email = "Please enter a valid email";
      if (!formData.password) newErrors.password = "Password is required";
      if (formData.password !== formData.cnfPassword)
        newErrors.cnfPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      const submissionData = {
        filledBy: user.id,
        name: `${formData.firstName} ${formData.middleName} ${formData.lastName}`,
        ...(createLogin && {
          user: {
            email: formData.email,
            name: `${formData.firstName} ${formData.middleName} ${formData.lastName}`,
            mobile: formData.contactNo,
            password: formData.password,
            zoneId: currentZone,
            roleName: "ROLE_STAFF",
          },
        }),
        zoneId: currentZone,
        areaId: formData.areaId,
        tempEmp: formData.employeeId,
        contactNo: formData.contactNo,
      };
      const token = await getCookie("accessToken");
      const response = await postData(
        `${baseUrl}/api/spshrm/${
          baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
        }/staff/new-staff`,
        submissionData,
        token
      );
      if (response) {
        if (
          response === "USER ALREADY EXISTS" ||
          response === "CONTACT_NO_ALREADY_EXIST"
        ) {
          toast.error(response);
          return;
        } else if (imageFile) {
          const fileData = new FormData();
          fileData.append("file", imageFile);
          fileData.append("empNo", response.replace("staffId=", ""));
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
              const responsedata = await response.text();
            } catch (error) {
              console.error(`Error uploading file ${fileOf}:`, error);
            }
          })();
        }

        toast.success("Saved Successfully");
        router.push(
          `${pathName.replace(
            "/add-employee",
            ""
          )}/edit?empNumber=${response.replace("staffId=", "")}`
        );
      }
    }
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setErrors({});
    setFormData((prevData) => ({
      ...prevData,
      [name]: value.toUpperCase(),
    }));
  }

  const handleSelectionChange = (e) => {
    const { name, value } = e.target;
    setSelections((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    const selectedArea = area.find(
      (ele) => ele.subDivision.toLowerCase() === value.toLowerCase()
    );
    if (name === "subDivision") {
      setFormData((prevData) => ({
        ...prevData,
        areaId: selectedArea?.areaId || "",
      }));
    }
  };

  const getOptions = (data) =>
    data &&
    Object.keys(data).map((key) => (
      <SelectItem key={key} value={key}>
        {key}
      </SelectItem>
    ));

  return (
    <div className="p-4 h-auto">
      <div className="flex flex-col relative gap-4 w-full h-full shadow-small rounded-large bg-white p-5">
        <div className="flex">
          <div className="w-1/4 flex flex-col items-center sm:space-x-4">
            <div className="relative">
              <Avatar
                isBordered
                src={image}
                alt="Employee Image"
                style={{
                  borderRadius: "50%",
                  border: "1px solid #eaeaea",
                  width: "96px",
                  height: "96px",
                }}
              />
              <button
                className="absolute bottom-0 right-0 h-8 w-8 flex justify-center items-center bg-blue-500 text-white rounded-full p-1 border-3 border-white"
                onClick={() => document.getElementById("image-upload").click()}
              >
                +
              </button>
              <input
                type="file"
                id="image-upload"
                style={{ display: "none" }}
                accept=".jpg, .png, .gif"
                onChange={handleImageChange}
              />
            </div>
            <p className="pt-2 text-gray-500 text-xs sm:mt-0">
              Accepts .jpg, .png, .gif up to 1MB. Recommended dimensions: 200px
              X 200px
            </p>
          </div>
          <Spacer y={1} />
          <div className="flex flex-col w-3/4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1">
                <Input
                  label="First Name"
                  placeholder="First Name"
                  labelPlacement="outside"
                  variant="bordered"
                  required
                  fullWidth
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  color={errors.firstName ? "danger" : ""}
                  isInvalid={errors.firstName}
                  errorMessage={errors.firstName}
                />
                <Input
                  label="Middle Name"
                  placeholder="Middle Name"
                  labelPlacement="outside"
                  variant="bordered"
                  fullWidth
                  value={formData.middleName}
                  name="middleName"
                  onChange={handleChange}
                  color={errors.middleName ? "danger" : ""}
                  isInvalid={errors.middleName}
                  errorMessage={errors.middleName}
                />
                <Input
                  label="Last Name"
                  placeholder="Last Name"
                  labelPlacement="outside"
                  variant="bordered"
                  required
                  fullWidth
                  value={formData.lastName}
                  name="lastName"
                  color={errors.lastName ? "danger" : ""}
                  onChange={handleChange}
                  isInvalid={errors.lastName}
                  errorMessage={errors.lastName}
                />
                <Input
                  label="Employee Id"
                  placeholder="Employee Id"
                  labelPlacement="outside"
                  variant="bordered"
                  initialValue="0007"
                  required
                  fullWidth
                  value={formData.employeeId}
                  name="employeeId"
                  onChange={handleChange}
                  color={errors.employeeId ? "danger" : ""}
                  isInvalid={errors.employeeId}
                  errorMessage={errors.employeeId}
                />
                <Input
                  label="Mobile"
                  labelPlacement="outside"
                  required
                  variant={"bordered"}
                  fullWidth
                  value={formData.contactNo}
                  name="contactNo"
                  onChange={handleChange}
                  color={errors.contactNo ? "danger" : ""}
                  isInvalid={errors.contactNo}
                  errorMessage={errors.contactNo}
                />
                <div className="flex flex-col gap-3 text-sm">
                  <Select
                    label="Location"
                    name="location"
                    variant="bordered"
                    labelPlacement="outside"
                    placeholder="--Select--"
                    selectedKeys={[formData.location?.toString()]}
                    className="max-w-xs"
                    color={errors.location ? "danger" : ""}
                    isInvalid={errors.location}
                    errorMessage={errors.location}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      setErrors({});
                      setFormData((prevData) => ({
                        ...prevData,
                        [name]: value,
                      }));
                      if (value && value !== "a") {
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

                {formData.location.toLowerCase() === "a" && (
                  <>
                    <Select
                      label="Area"
                      name="area"
                      variant="bordered"
                      labelPlacement="outside"
                      placeholder="--Select--"
                      value={selections.area}
                      selectedKeys={[selections.area]}
                      onChange={handleSelectionChange}
                      bordered
                    >
                      {area.length && getOptions(createNestedStructure(area))}
                    </Select>
                    <Tooltip
                      isDisabled={!!selections.area}
                      color="danger"
                      content="Please Select Area"
                    >
                      <Select
                        label="Circle"
                        variant="bordered"
                        name="circle"
                        labelPlacement="outside"
                        placeholder="--Select--"
                        value={selections.circle}
                        selectedKeys={[selections.circle]}
                        onChange={handleSelectionChange}
                        disabled={!selections.area}
                      >
                        {area.length &&
                          getOptions(
                            createNestedStructure(area)[selections?.area]
                          )}
                      </Select>
                    </Tooltip>
                    <Tooltip
                      isDisabled={!!selections.circle}
                      color="danger"
                      content="Please Select Circle"
                    >
                      <Select
                        label="Division"
                        variant="bordered"
                        name="division"
                        labelPlacement="outside"
                        placeholder="--Select--"
                        value={selections.division}
                        selectedKeys={[selections.division]}
                        onChange={handleSelectionChange}
                        disabled={!selections.circle}
                      >
                        {area.length &&
                          getOptions(
                            createNestedStructure(area)[selections?.area]?.[
                              selections?.circle
                            ]
                          )}
                      </Select>
                    </Tooltip>
                    <Tooltip
                      isDisabled={!!selections.division}
                      color="danger"
                      content="Please Select Division"
                    >
                      <Select
                        label="Sub Division"
                        labelPlacement="outside"
                        name="subDivision"
                        placeholder="--Select--"
                        value={selections.subDivision}
                        selectedKeys={[selections.subDivision]}
                        onChange={handleSelectionChange}
                        variant="bordered"
                        disabled={!selections.division}
                      >
                        {createNestedStructure(area)[selections?.area]?.[
                          selections?.circle
                        ]?.[selections?.division]?.map((sub) => (
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
              <Switch
                size="sm"
                isSelected={createLogin}
                onValueChange={setCreateLogin}
              >
                Create Login Details
              </Switch>
              {createLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Email"
                    name="email"
                    labelPlacement="outside"
                    variant={"bordered"}
                    required
                    fullWidth
                    value={formData.email}
                    onChange={handleChange}
                    color={errors.email ? "danger" : ""}
                    isInvalid={errors.email}
                    errorMessage={errors.email}
                  />
                  <Input
                    label="Password"
                    required
                    labelPlacement="outside"
                    variant={"bordered"}
                    fullWidth
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    color={errors.password ? "danger" : ""}
                    isInvalid={errors.password}
                    errorMessage={errors.password}
                  />
                  <Input
                    label="Confirm Password"
                    required
                    labelPlacement="outside"
                    variant={"bordered"}
                    fullWidth
                    name="cnfPassword"
                    value={formData.cnfPassword}
                    onChange={handleChange}
                    color={errors.cnfPassword ? "danger" : ""}
                    isInvalid={errors.cnfPassword}
                    errorMessage={errors.cnfPassword}
                  />
                  <p className="col-span-2 w-1/2 text-xs p-4">
                    For a strong password, please use a hard to guess
                    combination of text with upper and lower case characters,
                    symbols and numbers
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
        <Divider />
        <div className="flex justify-end space-x-4">
          <Button
            className="bg-[#84d225] text-white font-bold h-8 rounded-full"
            type="submit"
            onClick={handleSubmit}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
