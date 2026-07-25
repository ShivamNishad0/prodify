"use client";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  Button,
  Input,
  Checkbox,
  ModalHeader,
} from "@nextui-org/react";
import { getData, postData } from "@/utils/api";
import { getCookie } from "@/utils/cookieUtils";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

export default function TargetModal({
  isOpen,
  onOpenChange,
  onClose,
  selectedStaff,
  setSelectedStaff,
  mutateData,
  zone,
  month,
  year,
  getAllempList,
}) {
  const pathName = usePathname();
  const [advance, setAdvance] = useState({
    totalAdv: 0,
    totalBlanceAdv: 0,
    totalSettledAdv: 0,
    settlementAmt: 0,
  });
  const [prevSettlment, setPrevSettlement] = useState({
    amount: 0,
    remark: "",
  });
  const [rent, setRent] = useState({
    amount: 0,
  });
  const [check_incentive, setChkIncentive] = useState({
    amount: 0,
  });
  const [other_exp, setOther_exp] = useState({
    amount: 0,
    remark: "",
  });
  const [mobile, setMobile] = useState({
    amount: 0,
  });
  const [incentive, setIncentive] = useState({
    amount: 0,
  });

  const handleChange = (e, setfunction) => {
    const { name, value } = e.target;

    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue) && value !== "") {
      return;
    }

    setfunction((prevData) => ({
      ...prevData,
      [name]: parsedValue || 0,
    }));
  };

  const handleStringSave = async (e, setfunction) => {
    const { name, value } = e.target;
    setfunction((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (selectedStaff?.empNo) {
      getAdvanceDetails();
      getPrevSettlementDetails();
      if (
        pathName.split("/")[pathName.includes("/hrms") ? 3 : 1] === "suda" &&
        pathName.split("/")[pathName.includes("/hrms") ? 3 : 1] === "bhilai"
      ) {
        getIncentiveDetails();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStaff]);

  const getAdvanceDetails = async () => {
    const token = await getCookie("accessToken");
    const resposne = await getData(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/payroll/emp-adv-details?emp_no=${selectedStaff.empNo}`,
      token
    );
    if (resposne)
      setAdvance({
        totalAdv: resposne.totalAdv,
        totalBlanceAdv: resposne.totalBlanceAdv,
        totalSettledAdv: resposne.totalSettledAdv,
        settlementAmt: 0,
      });
  };

  async function getPrevSettlementDetails() {
    const token = await getCookie("accessToken");
    const resposne = await getData(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/payroll/emp-prev-details?emp_no=${
        selectedStaff.empNo
      }&month=${month}&year=${year}`,
      token
    );
    if (resposne) {
      if (resposne.prevSetldAmt)
        setPrevSettlement((prevData) => ({
          ...prevData,
          amount: resposne.prevSetldAmt,
        }));
      if (resposne.prevSetldRmk !== "N/A")
        setPrevSettlement((prevData) => ({
          ...prevData,
          remark: resposne.prevSetldRmk,
        }));
    }
  }

  const getIncentiveDetails = async () => {
    const token = await getCookie("accessToken");
    const response = await getData(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/payroll/emp-allowances-details?emp_no=${
        selectedStaff.empNo
      }&month=${month}&year=${year}`,
      token
    );

    if (response) {
      setRent({ amount: response.rent || 0 });
      setChkIncentive({ amount: response.check_incentive || 0 });
      setOther_exp({ amount: response.other_exp || 0 });
      setMobile({ amount: response.mobile || 0 });
      setIncentive({ amount: response.incentive || 0 });
    }
  };

  const handleSaveDeduction = async () => {
    const { deduction, deductionRemark } = selectedStaff;
    if (!deduction || !deductionRemark) return;
    const token = await getCookie("accessToken");
    const payload = {
      empNo: selectedStaff.empNo,
      month: month,
      year: year,
      amount: deduction.toString(),
      remark: deductionRemark,
    };
    const response = await postData(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/payroll/emp-deduction`,
      payload,
      token,
      "POST"
    );
    if (response) {
      mutateData();
      getAllempList();
      getAdvanceDetails();
      toast.success("Deduction Saved Successfully");
    }
  };

  const renderInput = (
    label,
    name,
    value,
    setfunction,
    isDisabled = false,
    type,
    description
  ) => (
    <Input
      label={label}
      labelPlacement="outside"
      placeholder=" "
      variant="bordered"
      required
      fullWidth
      name={name}
      value={value[name]}
      description={description}
      onChange={(e) =>
        type === "string"
          ? handleStringSave(e, setfunction)
          : handleChange(e, setfunction)
      }
      isDisabled={isDisabled}
    />
  );

  const handleSaveAdvance = async (type) => {
    const token = await getCookie("accessToken");
    const payload = {
      empNo: selectedStaff.empNo,
      month: month,
      year: year,
    };
    if (type === "adv") payload.amount = selectedStaff.advance;
    if (type === "setl") payload.amount = advance.settlementAmt;
    if (type === "prev_setl") {
      payload.amount = prevSettlment.amount;
      payload.remark = prevSettlment.remark;
    }
    const response = await postData(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/payroll/emp-adv-details?type=${type}`,
      payload,
      token,
      "POST"
    );
    if (response) {
      mutateData();
      getAllempList();
      getAdvanceDetails();
      toast.success("Advance Saved Successfully");
    }
  };

  const handleModalClose = (isOpen) => {
    onOpenChange(isOpen);
    if (!isOpen) {
      setSelectedStaff(""); // Reset selected staff when modal is closed
      setAdvance({
        totalAdv: 0,
        totalBlanceAdv: 0,
        totalSettledAdv: 0,
        settlementAmt: 0,
      });
      setPrevSettlement({
        amount: 0,
        remark: "",
      });
      setRent({
        amount: 0,
      });
      setChkIncentive({
        amount: 0,
      });
      setOther_exp({
        amount: 0,
      });
      setMobile({
        amount: 0,
      });
      setIncentive({
        amount: 0,
      });
    }
  };

  const handleSaveHoldSalary = async () => {
    const token = await getCookie("accessToken");
    const response = await postData(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/payroll/hold-action?month=${month}&year=${year}&type=${
        selectedStaff.onHold === "TRUE" ? true : false
      }&empNo=${selectedStaff.empNo}`,
      "",
      token,
      "POST"
    );
    if (response === "SALARY_UPDATED") {
      toast.success("Saved Succesfully");
      mutateData();
      onClose();
    }
  };

  const handleSaveIncentive = async (type, payloadData) => {
    const token = await getCookie("accessToken");
    const payload = {
      empNo: selectedStaff.empNo,
      month: month,
      year: year,
      amount: payloadData.amount,
      advanceRemark: payloadData.remark,
      zoneId: zone,
    };
    const response = await postData(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/payroll/emp-adv-details?type=${type}`,
      payload,
      token,
      "POST"
    );
    if (response) {
      mutateData();
      getAllempList();
      getAdvanceDetails();
      toast.success("Saved Successfully");
    }
  };

  return (
    <Modal
      size="2xl"
      isOpen={isOpen}
      onOpenChange={handleModalClose}
      scrollBehavior="inside"
    >
      <ModalContent className="border border-black p-4">
        {() => (
          <>
            <ModalHeader className="justify-center py-1 w-full">
              {selectedStaff.staffName + " (" + selectedStaff.empNo + ") "}
            </ModalHeader>
            <ModalBody className="gap-2 scrollbar-hide border-2 p-2 border-black rounded-md">
              <div className="border-black border p-2 flex flex-col gap-2 rounded-lg">
                <h1 className="font-semibold text-center">Advance Details</h1>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {renderInput("Amount", "totalAdv", advance, setAdvance, true)}
                  {renderInput(
                    "Remaining Amount",
                    "totalBlanceAdv",
                    advance,
                    setAdvance,
                    true
                  )}
                  {renderInput(
                    "Setteled Amount",
                    "totalSettledAdv",
                    advance,
                    setAdvance,
                    true
                  )}
                </div>
              </div>
              <div className="border-black border p-2 flex flex-col gap-2 rounded-lg">
                <h1 className="font-semibold text-center">Advance Payment</h1>
                <div className="flex justify-between items-end gap-4">
                  <div className="w-1/2">
                    {renderInput(
                      "Amount",
                      "advance",
                      selectedStaff,
                      setSelectedStaff
                    )}
                  </div>
                  <Button
                    className="h-7 rounded-full"
                    color="primary"
                    onPress={() => handleSaveAdvance("adv")}
                    isDisabled={!selectedStaff.advance}
                  >
                    Save
                  </Button>
                </div>
              </div>
              <div className="border-black border p-2 flex flex-col gap-2 rounded-lg">
                <h1 className="font-semibold text-center">
                  Advance Settlement
                </h1>
                <div className="flex justify-between items-end gap-4">
                  <div className="w-1/2">
                    {renderInput(
                      "Amount",
                      "settlementAmt",
                      advance,
                      setAdvance
                    )}
                  </div>
                  <Button
                    className="h-7 rounded-full"
                    color="primary"
                    onPress={() => handleSaveAdvance("setl")}
                    isDisabled={!advance.settlementAmt}
                  >
                    Save
                  </Button>
                </div>
              </div>
              <div className="border-black border p-2 flex flex-col gap-2 rounded-lg">
                <h1 className="font-semibold text-center">Deductions</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderInput(
                    "Amount",
                    "deduction",
                    selectedStaff,
                    setSelectedStaff
                  )}
                  {renderInput(
                    "Remark",
                    "deductionRemark",
                    selectedStaff,
                    setSelectedStaff,
                    false,
                    "string"
                  )}
                </div>
                <div className="flex justify-end">
                  <Button
                    className="h-7 rounded-full"
                    color="primary"
                    onPress={() => handleSaveDeduction()}
                    // isDisabled={!advance.settlementAmt}
                  >
                    Save
                  </Button>
                </div>
              </div>
              <div className="border-black border p-2 flex flex-col gap-2 rounded-lg">
                <h1 className="font-semibold text-center">
                  Previous Settelement
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {renderInput(
                    "Amount",
                    "amount",
                    prevSettlment,
                    setPrevSettlement
                  )}
                  {renderInput(
                    "Remark",
                    "remark",
                    prevSettlment,
                    setPrevSettlement,
                    false,
                    "string"
                  )}
                </div>
                <div className="flex justify-end">
                  <Button
                    className="h-7 rounded-full"
                    color="primary"
                    onPress={() => handleSaveAdvance("prev_setl")}
                    isDisabled={!prevSettlment.amount}
                  >
                    Save
                  </Button>
                </div>
              </div>
              {(pathName.split("/")[pathName.includes("/hrms") ? 3 : 1] === "suda" ||
                pathName.split("/")[pathName.includes("/hrms") ? 3 : 1] === "rmc") && (
                <>
                  <div className="border-black border p-2 flex flex-col gap-2 rounded-lg">
                    <h1 className="font-semibold text-center">Rent</h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {renderInput("Amount", "amount", rent, setRent)}
                    </div>
                    <div className="flex justify-end">
                      <Button
                        className="h-7 rounded-full"
                        color="primary"
                        onPress={() => handleSaveIncentive("rent", rent)}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                  <div className="border-black border p-2 flex flex-col gap-2 rounded-lg">
                    <h1 className="font-semibold text-center">
                      Cheque Incentive
                    </h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {renderInput(
                        "Amount",
                        "amount",
                        check_incentive,
                        setChkIncentive
                      )}
                    </div>
                    <div className="flex justify-end">
                      <Button
                        className="h-7 rounded-full"
                        color="primary"
                        onPress={() =>
                          handleSaveIncentive(
                            "check_incentive",
                            check_incentive
                          )
                        }
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                  <div className="border-black border p-2 flex flex-col gap-2 rounded-lg">
                    <h1 className="font-semibold text-center">
                      Travel Expenses
                    </h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {renderInput("Amount", "amount", other_exp, setOther_exp)}
                    </div>
                    <div className="flex justify-end">
                      <Button
                        className="h-7 rounded-full"
                        color="primary"
                        onPress={() =>
                          handleSaveIncentive("other_exp", other_exp)
                        }
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </>
              )}
              {pathName.split("/")[pathName.includes("/hrms") ? 3 : 1] === "bhilai" && (
                <>
                  <div className="border-black border p-2 flex flex-col gap-2 rounded-lg">
                    <h1 className="font-semibold text-center">
                      Mobile Allowance
                    </h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {renderInput("Amount", "amount", mobile, setMobile)}
                    </div>
                    <div className="flex justify-end">
                      <Button
                        className="h-7 rounded-full"
                        color="primary"
                        onPress={() => handleSaveIncentive("mobile", mobile)}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                  <div className="border-black border p-2 flex flex-col gap-2 rounded-lg">
                    <h1 className="font-semibold text-center">
                      Incentive Field Staff
                    </h1>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {renderInput("Amount", "amount", incentive, setIncentive)}
                    </div>
                    <div className="flex justify-end">
                      <Button
                        className="h-7 rounded-full"
                        color="primary"
                        onPress={() =>
                          handleSaveIncentive("incentive", incentive)
                        }
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </>
              )}
              <div className="border-black border p-2 flex flex-col gap-2 rounded-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <h1 className="font-semibold text-center">
                    Hold Payment for this Month
                  </h1>
                  <div className="flex justify-between">
                    <Checkbox
                      isSelected={selectedStaff.onHold === "TRUE"}
                      value={selectedStaff.onHold === "TRUE" ? true : false}
                      onChange={(e) => {
                        setSelectedStaff((prevData) => ({
                          ...prevData,
                          onHold: e.target.value === "false" ? "TRUE" : "FALSE",
                        }));
                      }}
                    >
                      Hold Payment
                    </Checkbox>
                    <div className="flex justify-end">
                      <Button
                        className="h-7 rounded-full"
                        color="primary"
                        onPress={handleSaveHoldSalary}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}
