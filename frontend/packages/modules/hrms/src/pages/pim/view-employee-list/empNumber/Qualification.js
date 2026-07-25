"use client";
import React, { useContext, useState } from "react";
import {
  Button,
  DatePicker,
  Divider,
  Input,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
  Textarea,
  useDisclosure,
} from "@nextui-org/react";
import PIMContext from "@/context/PIMProvider";
import { parseDate } from "@internationalized/date";
import toast from "react-hot-toast";
import { getCookie } from "@/utils/cookieUtils";
import { deleteData, postData } from "@/utils/api";
import { formatDate } from "@/utils/formatDate";
import { getPimdata, todayDateString } from "@/utils/getPimData";
import { MdOutlineModeEdit } from "react-icons/md";
import { FaTrashCan } from "react-icons/fa6";
import CustomTable from "@/components/tables/Table";
import { usePathname } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);
const expInitialValue = {
  company: "",
  jobTitle: "",
  from: parseDate(todayDateString()),
  to: parseDate(todayDateString()),
  comment: " ",
  addexp: false,
};
const eduInitialValue = {
  level: "",
  institute: "",
  year: "",
  score: "",
  startDate: parseDate(todayDateString()),
  endDate: parseDate(todayDateString()),
  addEdu: false,
};
export default function Qualification() {
  const pathName = usePathname();
  const expcolumns = [
    { key: "companyName", value: "Company" },
    { key: "designation", value: "Job Title" },
    { key: "dateFrom", value: "From" },
    { key: "dateTo", value: "To" },
    { key: "remarks", value: "Remarks" },
    { key: "action", value: "Action" },
  ];
  const educolumns = [
    { key: "qualiFication", value: "Level" },
    { key: "univ", value: "Institute" },
    { key: "startDate", value: "From" },
    { key: "endDate", value: "To" },
    { key: "marks", value: "Score/GPA" },
    { key: "action", value: "Action" },
  ];
  const { formData, setFormData, empNumber, setDocs } = useContext(PIMContext);
  const [exp, setExp] = useState(expInitialValue);
  const [edu, setEdu] = useState(eduInitialValue);
  const { isOpen, onOpenChange } = useDisclosure();
  const [deleteRow, setDeleteRow] = useState({
    type: "",
    id: "",
  });

  function handleExpChange(e, type) {
    const { name, value } = e.target;
    if (type === "exp") {
      setExp((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    if (type === "edu") {
      setEdu((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  }

  const handleDateChange = (name, value, type) => {
    if (type === "exp") {
      setExp((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
    if (type === "edu") {
      setEdu((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const expActionButtons = [
    {
      name: "Edit",
      action: (row) => {
        setExp({
          company: row.companyName,
          jobTitle: row.designation,
          from: parseDate(row.dateFrom),
          to: parseDate(row.dateTo),
          comment: row.remarks,
          addexp: true,
          staffExpId: row.staffExpId,
        });
      },
      iconOnly: true,
      icon: <MdOutlineModeEdit size={25} color="#f5a524" />,
    },
    {
      name: "Delete",
      action: async (row) => {
        const userConfirmed = window.confirm(
          `Are you sure you want to Delete?`
        );
        if (!userConfirmed) return;
        onOpenChange();
        setDeleteRow({
          type: "exp",
          id: row.staffExpId,
        });
      },
      iconOnly: true,
      icon: <FaTrashCan size={25} color="#f50000" />,
    },
  ];

  const eduActionButtons = [
    {
      name: "Edit",
      action: (row) => {
        setEdu({
          institute: row.univ,
          score: row.marks,
          level: row.qualiFication,
          startDate: parseDate(row.startDate),
          endDate: parseDate(row.endDate),
          addEdu: true,
          qualiID: row.qualiID,
        });
      },
      iconOnly: true,
      icon: <MdOutlineModeEdit size={25} color="#f5a524" />,
    },
    {
      name: "Delete",
      action: async (row) => {
        const userConfirmed = window.confirm(
          `Are you sure you want to Delete?`
        );
        if (!userConfirmed) return;
        onOpenChange();
        setDeleteRow({
          type: "quali",
          id: row.qualiID,
        });
      },
      iconOnly: true,
      icon: <FaTrashCan size={25} color="#f50000" />,
    },
  ];

  async function saveExperience() {
    if (!exp.company || !exp.jobTitle) {
      toast.error("Please fill all mandatory fields");
      return;
    }
    const submissionData = {
      companyName: exp.company,
      designation: exp.jobTitle,
      dateFrom: formatDate(exp.from),
      dateTo: formatDate(exp.to),
      remarks: exp.comment,
    };
    if (exp.staffExpId) {
      submissionData.staffExpId = exp.staffExpId;
    }
    const token = await getCookie("accessToken");
    const response = await postData(
      `${baseUrl}/api/spshrm/${baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]}/exp/staff/${
        exp.staffExpId ? "update" : `${formData.staffId}/save-exp`
      }`,
      submissionData,
      token,
      exp.staffExpId && "PUT"
    );
    if (response) {
      toast.success("Save Successfully");
      getPimdata(setFormData, btoa(empNumber), setDocs, pathName);
      setExp(expInitialValue);
    }
  }

  async function saveEducation() {
    if (!edu.level) {
      toast.error("Please fill all mandatory fields");
      return;
    }
    const submissionData = {
      qualiFication: edu.level,
      univ: edu.institute,
      marks: edu.score,
      startDate: formatDate(edu.startDate),
      endDate: formatDate(edu.endDate),
    };

    if (edu.qualiID) {
      submissionData.qualiID = edu.qualiID;
    }

    //update
    const token = await getCookie("accessToken");
    const response = await postData(
      `${baseUrl}/api/spshrm/${baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]}/quali/${
        edu.qualiID ? "update" : `save?staffId=${formData.staffId}`
      }`,
      submissionData,
      token,
      edu.qualiID && "PUT"
    );
    if (response) {
      toast.success("Save Successfully");
      getPimdata(setFormData, btoa(empNumber), setDocs, pathName);
      setEdu(eduInitialValue);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="text-[#8896af] text-lg font-bold">Qualifications</div>
        <Divider />
        {exp.addexp && (
          <>
            <div>
              <div className="text-[#8896af] font-bold mb-2">
                Add Work Experience
              </div>
              <Divider />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1">
                <Input
                  label="Company"
                  isRequired
                  variant="bordered"
                  labelPlacement="outside"
                  fullWidth
                  value={exp.company}
                  name="company"
                  onChange={(e) => handleExpChange(e, "exp")}
                />
                <Input
                  label="Job Title"
                  isRequired
                  variant="bordered"
                  labelPlacement="outside"
                  required
                  fullWidth
                  name="jobTitle"
                  value={exp.jobTitle}
                  onChange={(e) => handleExpChange(e, "exp")}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1">
              <DatePicker
                label="From"
                variant="bordered"
                showMonthAndYearPickers
                labelPlacement="outside"
                value={exp.from}
                onChange={(date) => handleDateChange("from", date, "exp")}
              />
              <DatePicker
                label="To"
                variant="bordered"
                showMonthAndYearPickers
                name="to"
                labelPlacement="outside"
                value={exp.to}
                onChange={(date) => handleDateChange("to", date, "exp")}
              />
              <Textarea
                label="Comment"
                variant="bordered"
                labelPlacement="outside"
                fullWidth
                value={exp.comment}
                name="comment"
                onChange={(e) => handleExpChange(e, "exp")}
                className="col-span-2"
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button
                variant="bordered"
                className="rounded-full h-8 min-w-24 border-[#76bc21] border-1 text-[#76bc21] text-sm"
                onClick={() => setExp(expInitialValue)}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#76bc21] rounded-full h-8 min-w-24 text-white text-sm"
                onClick={saveExperience}
              >
                Save Exp
              </Button>
            </div>
            <Divider />
          </>
        )}

        <div className="flex gap-5 items-center text-[#64728c]">
          Work Experience
          <Button
            onClick={() =>
              setExp((prevData) => ({
                ...prevData,
                addexp: true,
              }))
            }
            className="h-7 rounded-full text-[#64728c] bg-[#eff1f3]"
          >
            +Add
          </Button>
        </div>
        <Divider />
        {formData?.exp?.length > 0 && (
          <CustomTable
            columns={expcolumns}
            data={formData.exp}
            actionButtons={expActionButtons}
          />
        )}

        {edu.addEdu && (
          <>
            <div>
              <div className="text-[#8896af] font-bold mb-2">Add Education</div>
              <Divider />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1">
                <div className="flex w-full max-w-xs flex-col gap-2">
                  <Select
                    label="Level"
                    isRequired
                    name="level"
                    variant="bordered"
                    labelPlacement="outside"
                    selectedKeys={[edu.level]}
                    className="max-w-xs"
                    onChange={(e) => handleExpChange(e, "edu")}
                  >
                    {["Metric", "Graduation", "PG"].map((ele) => (
                      <SelectItem key={ele}>{ele}</SelectItem>
                    ))}
                  </Select>
                </div>
                <Input
                  label="Institute"
                  variant="bordered"
                  labelPlacement="outside"
                  fullWidth
                  value={edu.institute}
                  name="institute"
                  onChange={(e) => handleExpChange(e, "edu")}
                />
                <Input
                  label="GPA/Score"
                  variant="bordered"
                  labelPlacement="outside"
                  required
                  fullWidth
                  name="score"
                  value={edu.score}
                  onChange={(e) => handleExpChange(e, "edu")}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-1">
              <DatePicker
                label="Start Date"
                variant="bordered"
                showMonthAndYearPickers
                labelPlacement="outside"
                value={edu.startDate}
                onChange={(date) => handleDateChange("startDate", date, "edu")}
              />
              <DatePicker
                label="End Date"
                variant="bordered"
                showMonthAndYearPickers
                labelPlacement="outside"
                value={edu.endDate}
                onChange={(date) => handleDateChange("endDate", date, "edu")}
              />
            </div>
            <div className="flex justify-end gap-4">
              <Button
                variant="bordered"
                className="rounded-full h-8 min-w-24 border-[#76bc21] border-1 text-[#76bc21] text-sm"
                onClick={() => setEdu(eduInitialValue)}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#76bc21] rounded-full h-8 min-w-24 text-white text-sm"
                onClick={saveEducation}
              >
                Save
              </Button>
            </div>
            <Divider />
          </>
        )}
        <div className="flex gap-5 items-center text-[#64728c]">
          Education
          <Button
            onClick={() =>
              setEdu((prevData) => ({
                ...prevData,
                addEdu: true,
              }))
            }
            className="h-7 rounded-full text-[#64728c] bg-[#eff1f3]"
          >
            +Add
          </Button>
        </div>
        <Divider />
        {formData?.quali?.length > 0 && (
          <CustomTable
            columns={educolumns}
            data={formData.quali}
            actionButtons={eduActionButtons}
          />
        )}
      </div>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        size="sm"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 justify-center w-full items-center">
                Are You Sure Delete
              </ModalHeader>

              <ModalFooter className="justify-center">
                <Button
                  className="rounded-full h-8"
                  color="warning"
                  variant="light"
                  onPress={onClose}
                >
                  Close
                </Button>
                <Button
                  color="primary"
                  className="h-8 rounded-full bg-[#f50000]"
                  onPress={async () => {
                    const token = await getCookie("accessToken");
                    const response = await deleteData(
                      `${baseUrl}/api/spshrm/${
                        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
                      }/${deleteRow.type}/${deleteRow.id}`,
                      token
                    );
                    if (response) {
                      getPimdata(
                        setFormData,
                        btoa(empNumber),
                        setDocs,
                        pathName
                      );
                      onClose();
                    }
                  }}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
