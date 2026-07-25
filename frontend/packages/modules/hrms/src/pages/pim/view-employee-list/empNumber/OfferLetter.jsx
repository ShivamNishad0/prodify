"use client";
import PIMContext from "@/context/PIMProvider";
import { parseDate } from "@internationalized/date";
import { numberToWords } from "@/utils/NumberToWords";
import {
  Button,
  DatePicker,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { formatDate, formatDateddmmyyyy } from "@/utils/formatDate";
import toast from "react-hot-toast";
import { getCookie } from "@/utils/cookieUtils";
import { getPimdata } from "@/utils/getPimData";
import { getData } from "@/utils/api";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

export default function OfferLetter() {
  const pathName = usePathname();
  const router = useRouter();
  const {
    formData,
    salary,
    desgn,
    setFormData,
    setDocs,
    setSalary,
    empNumber,
    userData,
  } = useContext(PIMContext);
  const getDateOneDayAfterToday = () => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split("T")[0];
  };

  const [doj, setDoj] = useState(parseDate(getDateOneDayAfterToday()));
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    onOpen();
    setDoj(formData.dateOfJoining);
    getUserData();

    // Add event listener when component mounts
    document.addEventListener("keydown", handlePrintShortcut);

    // Clean up event listener when component unmounts
    return () => {
      document.removeEventListener("keydown", handlePrintShortcut);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function generateOfferLetter() {
    try {
      const token = await getCookie("accessToken");
      const base64staffId = btoa(formData.staffId);
      const response = await fetch(
        `${baseUrl}/api/spshrm/${
          baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
        }/staff/generateOfferLetter/${base64staffId}/${btoa(userData.id)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        await getPimdata(setFormData, btoa(empNumber), setDocs, pathName);
        getSalarydata();
        toast.success("Offer Letter Generated Successfully");
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error generating offer letter:", error);
      toast.error("An error occurred while generating the offer letter.");
    }
  }

  async function getSalarydata() {
    const token = await getCookie("accessToken");
    const response = await getData(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/salary/by-staff-data/${formData.staffId}`,
      token
    );
    if (response) {
      const updateData = { ...response };
      updateData.staffId = parseFloat(formData.staffId);
      updateData.empNo = formData.tempEmp;
      setSalary(updateData);
    }
  }

  const handlePrintShortcut = (event) => {
    // Check if Ctrl (or Command on macOS) + P is pressed
    if ((event.ctrlKey || event.metaKey) && event.key === "p") {
      event.preventDefault(); // Prevent the default browser print dialog
      handlePrint(); // Call your custom function for printing
    }
  };

  const [offerData, setOfferData] = useState({
    basic: "",
    hra: "",
    conveyance: "",
    medicalAllowance: "",
    specialAllowance: "",
    totalEarning: "",
    totalDeduction: "",
    netPay: formData.netPay || "",
    netPayBijli: "",
    inWords: "",
    payNote: "",
    employerContributionPF: "",
    employerContributionESI: "",
  });

  useEffect(() => {
    setOfferData((prev) => ({
      ...prev,
      payNote:
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]] === "bijli"
          ? "As Per JBVNL Norms/ Co. Norms"
          : "(As Per Norms)",
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathName]);

  async function getUserData() {
    setOfferData((prevData) => ({
      ...prevData,
      netPay: salary.gross,
      inWords: numberToWords(salary.gross),
    }));
  }

  const handlePrint = () => {
    const offerLetterSection = document.getElementById("offerLetterSection");
    if (offerLetterSection) {
      // Create a clone of the offerLetterSection to manipulate for printing
      const printContent = offerLetterSection.cloneNode(true);

      // Get all the input elements in the cloned content
      const inputs = printContent.querySelectorAll("input");

      // Replace input elements with their values
      inputs.forEach((input) => {
        const span = document.createElement("span");
        span.textContent = input.value;
        if (input.id === "inWords") {
          span.style.textTransform = "capitalize"; // Apply capitalization inline
        }
        input.parentNode.replaceChild(span, input);
      });

      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
            <html>
                <head>
                    <title>Offer Letter</title>
                    <style>
                        @media print {
                            @page {
                                margin: 12.7mm 12.7mm 12.7mm 12.7mm;  /* Set the margin to 0.5 inches */
                            }
                            body * {
                                visibility: hidden;
                            }
                            #offerLetterSection, #offerLetterSection * {
                                visibility: visible;
                            }
                            #offerLetterSection {
                                position: absolute;
                                left: 0;
                                top: 0;
                                width: 100%;
                                margin: 0;
                                margin-top: 60px;
                                padding: 0;
                                font-size: 11px;
                            }
                            #offerLetterSection h1, #offerLetterSection h2 {
                                text-decoration-line: underline;
                                font-size: 14px;
                                margin-bottom: 2px;
                                margin-top: 5px;
                            }
                            #offerLetterSection table {
                                width: 100%;
                                font-size: 12px;
                            }
                            #offerLetterSection table, #offerLetterSection th, #offerLetterSection td {
                                border: 1px solid black;
                            }
                            #offerLetterSection th, #offerLetterSection td {
                                padding: 1px;
                                text-align: left;
                            }
                            #offerLetterSection .flex {
                                display: flex;
                                justify-content: space-between;
                            }
                            #offerLetterSection p {
                                margin: 0 0 8px;
                                line-height: 1;
                            }
                            #mainHeading {
                                text-align: center;
                            }
                            #spspl {
                                padding-top: 2px;
                            }
                            #note{
                            text-decoration-line: underline;
                            font-size: 14px;
                            font-weight: 700;
                            padding-bottom: 4px;
                            }
                            body {
                                margin: 1cm;
                            }
                        }
                    </style>
                </head>
                <body>
                    ${printContent.outerHTML}
                </body>
            </html>
        `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOfferData({ ...offerData, [name]: value });
  };

  const formatDate1 = (dateString) => {
    const [year, month, day] = dateString.split("-");
    let date = new Date(year, month - 1, day);

    // Check if the date is Sunday (0)
    if (date.getDay() === 0) {
      // Add two days if it's Sunday
      date.setDate(date.getDate() + 1);
    } else {
      // Add one day otherwise
      date.setDate(date.getDate());
    }

    // Get the adjusted year, month, and day
    const adjustedYear = date.getFullYear();
    const adjustedMonth = String(date.getMonth() + 1).padStart(2, "0");
    const adjustedDay = String(date.getDate()).padStart(2, "0");

    return `${adjustedDay}-${adjustedMonth}-${adjustedYear}`;
  };

  return (
    <>
      <div>
        <div id="offerLetterSection" className="bg-white mx-auto p-6 container">
          <h1 id="mainHeading" className="mb-4 font-bold text-xl text-center">
            Offer of Appointment
          </h1>
          <div className="flex justify-between mb-2">
            <p>
              <strong>Date:</strong>{" "}
              {formData.filledDate && typeof formData.filledDate === "string"
                ? formatDate1(formData.filledDate)
                : formatDateddmmyyyy(formData.filledDate)}
            </p>
            <p>
              <strong>Name:</strong> <span>{formData.name}</span>
            </p>
            <p>
              <strong>Employee Code:</strong> {formData.tempEmp}
            </p>
          </div>
          <p className="mb-4">
            With reference to your application and subsequent discussion, it
            gives us immense pleasure to offer you an appointment in{" "}
            <strong>Sri Publication & Stationers (P) Ltd.</strong>
          </p>
          <p className="mb-4">
            1. We are pleased to inform you that you have been selected for the
            post of{" "}
            <strong>
              {desgn.length &&
                desgn.find((ele) => ele.desigId.toString() === formData.desigId)
                  ?.desigName}
            </strong>{" "}
            for <strong>Electricity department</strong> at one of our
            office/branch in Jharkhand which is transferable as per the
            requirement of the organization.
            <br />
            2. You are requested to join on{" "}
            <strong>{formatDateddmmyyyy(doj)}</strong> and the offer stands
            withdrawn thereafter, unless the date is extended and communicate to
            you in writing.
            <br />
            3. You will be in probation period for 3 months from the date of
            joining. The probation period may be extended unless you are given a
            permanent position.
            <br />
            4. Please sign in the duplicate copy of this letter (duplicate copy
            enclosed) on the sheets at the bottom and return to the Human
            Resource Department at our Corporate Office in Ranchi within Seven
            days from letter issue date.
          </p>
          <p>
            We welcome you to Sri Publication & Stationers (P) Ltd. and look
            forward to a long term association.
          </p>
          <h2 className="mb-2 font-bold text-lg">Salary Structure</h2>
          <table className="mb-4 border border-black w-full border-collapse table-auto">
            <thead>
              <tr>
                <th className="p-2 border border-black">Earning Components</th>
                <th className="p-2 border border-black">Amount</th>
                <th className="p-2 border border-black">Deduction</th>
                <th className="p-2 border border-black">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 border border-black">Basic</td>
                <td className="p-2 border border-black">
                  <Input
                    variant="bordered"
                    size={"sm"}
                    type="text"
                    name="basic"
                    placeholder="As Per Norms"
                    isDisabled
                    value={"As Per Norms"}
                    // value={offerData.basic}
                    onChange={handleChange}
                  />
                </td>
                <td className="p-2 border border-black">
                  <Input
                    variant="bordered"
                    size={"sm"}
                    type="text"
                    placeholder="As Per Norms"
                    isDisabled
                    value={"As Per Norms"}
                    // value={offerData.deduction1}
                    name="deduction1"
                    onChange={handleChange}
                  />
                </td>
                <td className="p-2 border border-black">
                  <Input
                    variant="bordered"
                    size={"sm"}
                    type="text"
                    placeholder="As Per Norms"
                    isDisabled
                    value={"As Per Norms"}
                    // value={offerData.deduction2}
                    name="deduction2"
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td className="p-2 border border-black">HRA</td>
                <td className="p-2 border border-black">
                  <Input
                    variant="bordered"
                    size={"sm"}
                    type="text"
                    name="hra"
                    placeholder="As Per Norms"
                    isDisabled
                    value={"As Per Norms"}
                    // value={offerData.hra}
                    onChange={handleChange}
                  />
                </td>
                <td className="p-2 border border-black">
                  <Input
                    variant="bordered"
                    size={"sm"}
                    type="text"
                    placeholder="As Per Norms"
                    isDisabled
                    value={"As Per Norms"}
                    // value={offerData.deduction3}
                    name="deduction3"
                    onChange={handleChange}
                  />
                </td>
                <td className="p-2 border border-black">
                  <Input
                    variant="bordered"
                    size={"sm"}
                    type="text"
                    name="deduction4"
                    placeholder="As Per Norms"
                    isDisabled
                    value={"As Per Norms"}
                    // value={offerData.deduction4}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td className="p-2 border border-black">Conveyance</td>
                <td className="p-2 border border-black">
                  <Input
                    variant="bordered"
                    size={"sm"}
                    type="text"
                    name="conveyance"
                    placeholder="As Per Norms"
                    isDisabled
                    value={"As Per Norms"}
                    // value={offerData.conveyance}
                    onChange={handleChange}
                  />
                </td>
                <td className="p-2 border border-black">
                  <Input
                    variant="bordered"
                    size={"sm"}
                    type="text"
                    name="deduction5"
                    placeholder="As Per Norms"
                    isDisabled
                    value={"As Per Norms"}
                    // value={offerData.deduction5}
                    onChange={handleChange}
                  />
                </td>
                <td className="p-2 border border-black">
                  <Input
                    variant="bordered"
                    size={"sm"}
                    type="text"
                    name="deduction6"
                    placeholder="As Per Norms"
                    isDisabled
                    value={"As Per Norms"}
                    // value={offerData.deduction6}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td className="p-2 border border-black">Medical Allowance</td>
                <td className="p-2 border border-black">
                  <Input
                    variant="bordered"
                    size={"sm"}
                    type="text"
                    name="medicalAllowance"
                    placeholder="As Per Norms"
                    isDisabled
                    value={"As Per Norms"}
                    // value={offerData.medicalAllowance}
                    onChange={handleChange}
                  />
                </td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td className="p-2 border border-black">Special Allowance</td>
                <td className="p-2 border border-black">
                  <Input
                    variant="bordered"
                    size={"sm"}
                    type="text"
                    name="specialAllowance"
                    placeholder="As Per Norms"
                    isDisabled
                    value={"As Per Norms"}
                    // value={offerData.specialAllowance}
                    onChange={handleChange}
                  />
                </td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td className="p-2 border border-black">Total Earning</td>
                <td className="p-2 border border-black">
                  <Input
                    variant="bordered"
                    size={"sm"}
                    type="text"
                    name="specialAllowance"
                    placeholder="As Per Norms"
                    isDisabled
                    value={"As Per Norms"}
                    // value={offerData.specialAllowance}
                    onChange={handleChange}
                  />
                </td>
                <td className="pr-2 text-right">Total Deduction</td>
                <td className="p-2 border border-black">
                  <Input
                    variant="bordered"
                    size={"sm"}
                    type="text"
                    name="totalDeduction"
                    placeholder="As Per Norms"
                    isDisabled
                    value={"As Per Norms"}
                    // value={offerData.totalDeduction}
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td className="p-2 border border-black">Net Pay</td>
                <td className="p-2 border border-black">
                  <Input
                    variant="bordered"
                    size={"sm"}
                    type="text"
                    name="netPay"
                    value={
                      baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]] === "bijli"
                        ? offerData.netPayBijli
                        : offerData.netPay + " /-"
                    }
                    endContent={
                      <span className="flex items-center px-1.5 text-sm capitalize">
                        {baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]] === "bijli"
                          ? "As Per JBVNL Norms/ Co. Norms"
                          : "(As Per Norms)"}
                      </span>
                    }
                    classNames={{
                      inputWrapper:
                        "inline-flex w-full items-center h-full box-border",
                      innerWrapper: "flex flex-grow relative",
                      input:
                        "font-normal bg-transparent !outline-none placeholder:text-foreground-500 focus-visible:outline-none data-[has-start-content=true]:ps-1.5 data-[has-end-content=true]:pe-1.5 text-small h-full w-full",
                    }}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const value = parseFloat(raw);

                      const key =
                        baseZone[window.location.pathname.split("/")[1]] ===
                        "bijli"
                          ? "netPayBijli"
                          : "netPay";

                      setOfferData((prevData) => ({
                        ...prevData,
                        [key]: isNaN(value) ? "" : value,
                        inWords: isNaN(value) ? "" : numberToWords(value),
                      }));
                    }}
                  />
                </td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td className="p-2 border border-black">In words</td>
                <td className="p-2 border border-black" colSpan="3">
                  <Input
                    variant="bordered"
                    size={"sm"}
                    type="text"
                    id="inWords"
                    name="inWords"
                    style={{ textTransform: "capitalize" }}
                    value={
                      baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]] === "bijli"
                        ? offerData.netPayBijli
                          ? offerData.inWords + " only"
                          : "As Per JBVNL Norms/Co. Norms"
                        : offerData.inWords + " only"
                    }
                    onChange={handleChange}
                  />
                </td>
              </tr>
              <tr>
                <td className="p-2 border border-black">
                  Employer&apos;s Contribution to PF
                </td>
                <td className="p-2 border border-black" colSpan="3">
                  <Input
                    variant="bordered"
                    size={"sm"}
                    type="email"
                    placeholder="As Per Norms"
                    isDisabled
                    value={"As Per Norms"}
                  />
                </td>
              </tr>
              <tr>
                <td className="p-2 border border-black">
                  Employer&apos;s Contribution to ESI
                </td>
                <td className="p-2 border border-black" colSpan="3">
                  <Input
                    variant="bordered"
                    size={"sm"}
                    type="email"
                    placeholder="As Per Norms"
                    isDisabled
                    value={"As Per Norms"}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <h2>Terms and Conditions:</h2>
          <p>
            <strong>Provisional Offer:</strong> This Offer Letter is provisional
            and will be valid for 3 months from the date of your joining the
            organization. It will not be considered proof of your permanent
            employment within the organization.
          </p>
          <p>
            <strong>Training Period: </strong>The first 10 days from the date of
            your joining will constitute a mandatory training period. During
            this period, you will not be eligible for any payment.
          </p>

          <p className="mb-4">
            <strong>Performance and Verification:</strong> An appointment letter
            confirming permanent employment will be issued only after a thorough
            performance analysis based on the organization&apos;s performance
            benchmarks. Additionally, successful background verification of the
            documents submitted for proof of past employment records is
            required. Failure to meet these criteria may result in the
            organization taking appropriate legal action regarding your
            enrollment.
          </p>
          <h2 className="mb-2 font-bold text-lg">Organization&apos;s Rights</h2>
          <p className="mb-4">
            The organization reserves the right to amend, modify or revoke this
            Offer Letter at any time during the provisional period without prior
            notice, based on business needs or other relevant factors.
          </p>
          <h2 className="mb-2 font-bold text-lg">Disclaimer</h2>
          <p className="mb-4">
            Direct Recruitment: We hire our employees solely through direct
            recruitment and are not associated with any agency or consultancy
            for the hiring process.
            <br />
            No Recruitment Fees: We do not charge any fees or money for the
            recruitment of candidates. Any money spent by the candidates for the
            recruitment process will not be covered under our liability or
            responsibility.
          </p>
          <h2 className="mb-2 font-bold text-lg">
            Acknowledgment and Acceptance
          </h2>
          <p className="mb-4">
            I, __________________________ have read and understood the terms and
            conditions of this provisional Offer Letter and accept the same.
          </p>
          <p className="mb-4">
            Signature: __________________________ Date:
            __________________________
          </p>
          <p className="mb-4">
            <span id="note" className="font-bold text-lg">
              Note:
            </span>
            <br />
            1. You shall be provided with the “Appointment Letter” along with
            signing of “Employee Agreement” at the time of your joining.
            <br />
            2. In case you fail to join on the above mentioned date unless
            permitted in writing, this “Offer of Appointment” shall be deemed
            cancelled.
            <br />
            3. You are required to submit your police verification certificate
            within 30 days of your joining date. Failure to provide this
            document within the stipulated time frame will result in the
            cancellation of your offer letter.
            <br />
            4. You shall not, directly or indirectly engage in or assist others
            to engage in any activity that conflicts with the interests of the
            company your responsibilities withing organisation. Any violation of
            this term will result in the immediate termination of your
            employment from us.
            {baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]] === "bijli" && (
              <>
                <br />
                5. Please note that this offer letter is not a legally binding
                document and does not serve as proof of employment or
                confirmation of your employment status with the company this
                offer letter cannot be presented to any third parties, financial
                institutions, or legal entities as evidence or confirmation of
                your employment status with the company. After completing the
                probation period we will conduct a performance review, after
                which we will inform you regarding the status of your candidacy
                and any further employment steps.
                {baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]] === "bijli" &&
                  desgn.length &&
                  desgn
                    .find((ele) => ele.desigId.toString() === formData.desigId)
                    ?.desigName.toLowerCase() === "urja mitra" && (
                    <>
                      <br />
                      6. As per (JBVNL) norms, you are required to process a
                      minimum of 50 bills per day and a total of 1,500 bills per
                      month. This is a mandatory requirement. Failure to meet
                      the daily target of 50 bills will result in your day being
                      marked absent.
                    </>
                  )}
              </>
            )}
          </p>
          <div id="spspl">
            For Sri Publication & Stationers (P) Ltd.
            <br />
            Human Resources Manager
            <br />
            <br />
            {baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]] === "bijli" &&
              "This is autogenerated offer letter"}
          </div>
        </div>
        <div className="flex justify-evenly my-4">
          <Button
            className="rounded-full h-8"
            variant="solid"
            color="primary"
            onPress={() => router.back()}
          >
            Back
          </Button>
          <Button
            className="rounded-full h-8"
            onPress={handlePrint}
            variant="solid"
            color="primary"
          >
            Print
          </Button>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose();
          if (formData.isOfferGenrated === "FALSE") generateOfferLetter();
        }}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col justify-center items-center gap-1">
            Generate Offer Letter
          </ModalHeader>
          <ModalBody>
            <DatePicker
              size="sm"
              type="date"
              label={"Date Of Joining"}
              labelPlacement="outside"
              name="doj"
              variant="bordered"
              color="primary"
              defaultValue={doj}
              onChange={setDoj}
              className="max-w-sm"
            />
            <DatePicker
              size="sm"
              type="date"
              label={"Date Of Issue"}
              labelPlacement="outside"
              name="filledDate"
              variant="bordered"
              color="primary"
              defaultValue={
                typeof formData.filledDate === "string"
                  ? parseDate(formData.filledDate)
                  : formData.filledDate
              }
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  filledDate: e,
                }))
              }
              className="max-w-sm"
            />
          </ModalBody>
          <ModalFooter>
            <Button
              className="rounded-full h-8"
              color="error"
              variant="light"
              onClick={() => {
                onClose();
                if (formData.isOfferGenrated === "FALSE") generateOfferLetter();
              }}
            >
              Close
            </Button>
            <Button
              className="rounded-full h-8"
              color="primary"
              onClick={() => {
                onClose();
                if (formData.isOfferGenrated === "FALSE") generateOfferLetter();
              }}
            >
              Generate
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
