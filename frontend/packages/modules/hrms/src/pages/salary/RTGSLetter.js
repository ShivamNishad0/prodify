"use client";
import { useState } from "react";
import jsPDF from "jspdf";
import { Input, Select, SelectItem, Textarea, Button } from "@nextui-org/react"; // Assuming NextUI components

export default function BankLetterForm() {
  const [formData, setFormData] = useState({
    letterNo: "",
    date: "",
    bankName: "",
    branchName: "",
    accountNumber: "",
    paymentOf: "",
    batch1Amount: "",
    batch1ChequeNo: "",
    batch1Date: "",
    batch2Amount: "",
    bankName: "",
    batch2ChequeNo: "",
    batch2Date: "",
    totalAmount: "",
    amountInWords: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBankChange = (e) => {
    setFormData({ ...formData, bankName: e.target.value });
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Set font size
    doc.setFontSize(12);

    // Increase top margin by starting from y = 30
    const topMargin = 50;

    // Letter No. and Date
    doc.text(`Letter No.: ${formData.letterNo}`, 10, topMargin);
    doc.text(`Date: ${formData.date}`, 150, topMargin);

    // Address Block
    doc.text(`To,`, 10, topMargin + 10);
    doc.text(`The Branch Manager,`, 10, topMargin + 15);
    doc.text(
      `${formData.branchName}, ${formData.bankName},`,
      10,
      topMargin + 20
    );
    doc.text(`Ranchi`, 10, topMargin + 25);

    // Subject
    let subjectText = `Sub: Request for RTGS by debiting our A/C No. ${formData.accountNumber} of Sri Publication & Stationers Pvt. Ltd Payment of: ${formData.paymentOf}`;
    let splitSubjectText = doc.splitTextToSize(subjectText, 180); // Wrapping text at 180mm width
    doc.text(splitSubjectText, 10, topMargin + 35);

    // Body of the letter
    doc.text(`Dear Sir,`, 10, topMargin + 50);

    let bodyText1 = `Please RTGS the amounts in Batch 1 and Batch 2, as detailed below.`;
    let splitBodyText1 = doc.splitTextToSize(bodyText1, 180);
    doc.text(splitBodyText1, 10, topMargin + 60);

    // Batch 1 Details
    doc.text(
      `Batch 1 (OTHER BANK): Amt Rs ${formData.batch1Amount}`,
      10,
      topMargin + 70
    );
    doc.text(
      `Cheque No.: ${formData.batch1ChequeNo}, Dated: ${formData.batch1Date}`,
      10,
      topMargin + 75
    );

    // Batch 2 Details
    doc.text(
      `Batch 2 (${formData.bankName}): Amt Rs ${formData.batch2Amount}`,
      10,
      topMargin + 85
    );
    doc.text(
      `Cheque No.: ${formData.batch2ChequeNo}, Dated: ${formData.batch2Date}`,
      10,
      topMargin + 90
    );

    // Debit Request
    let debitText = `Please debit from our A/C No. ${formData.accountNumber} for Rs ${formData.totalAmount} (${formData.amountInWords}) and transfer the amount as per the attached enclosures.`;
    let splitDebitText = doc.splitTextToSize(debitText, 180);
    doc.text(splitDebitText, 10, topMargin + 100);

    // Closing
    doc.text(`Thank you for your cooperation.`, 10, topMargin + 120);
    doc.text(`Yours Sincerely,`, 10, topMargin + 130);
    doc.text(`For Sri Publication & Stationers Pvt Ltd,`, 10, topMargin + 140);
    doc.text(`Rajendra Sharma, Director`, 10, topMargin + 160);
    doc.text(`Director`, 10, topMargin + 170);

    // Save the PDF
    doc.save("bank-letter.pdf");
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input
          label="Letter No."
          placeholder="SPSSL/24-25/..."
          name="letterNo"
          value={formData.letterNo}
          variant="bordered"
          labelPlacement="outside"
          onChange={handleInputChange}
        />
        <Input
          type="date"
          label="Date"
          name="date"
          value={formData.date}
          variant="bordered"
          labelPlacement="outside"
          onChange={handleInputChange}
        />
        <Input
          label="Bank Name"
          placeholder="Bank Name"
          name="bankName"
          value={formData.bankName}
          variant="bordered"
          labelPlacement="outside"
          onChange={handleInputChange}
        />
        <Input
          label="Branch Name"
          placeholder="Branch Name"
          name="branchName"
          value={formData.branchName}
          variant="bordered"
          labelPlacement="outside"
          onChange={handleInputChange}
        />
        <Input
          label="Company's Account Number"
          placeholder="Account Number"
          name="accountNumber"
          value={formData.accountNumber}
          variant="bordered"
          labelPlacement="outside"
          onChange={handleInputChange}
        />
        <Input
          label="Payment of"
          placeholder="Payment Description"
          name="paymentOf"
          value={formData.paymentOf}
          variant="bordered"
          labelPlacement="outside"
          onChange={handleInputChange}
        />
        <Input
          label="Batch 1 (OTHER BANK)"
          placeholder="Amount in Rs."
          name="batch1Amount"
          value={formData.batch1Amount}
          variant="bordered"
          labelPlacement="outside"
          onChange={handleInputChange}
        />
        <Input
          label="Batch 1 Cheque No."
          placeholder="Cheque Number"
          name="batch1ChequeNo"
          value={formData.batch1ChequeNo}
          variant="bordered"
          labelPlacement="outside"
          onChange={handleInputChange}
        />
        <Input
          type="date"
          label="Batch 1 Date"
          name="batch1Date"
          value={formData.batch1Date}
          variant="bordered"
          labelPlacement="outside"
          onChange={handleInputChange}
        />
        <Input
          label="Batch 2 (COMPANY'S BANK NAME)"
          placeholder="Amount in Rs."
          name="batch2Amount"
          value={formData.batch2Amount}
          variant="bordered"
          labelPlacement="outside"
          onChange={handleInputChange}
        />
        <Select
          label="Company's Bank Name"
          placeholder="Select Bank"
          name="bankName"
          value={formData.bankName}
          variant="bordered"
          labelPlacement="outside"
          onChange={handleBankChange}
        >
          <SelectItem key="Union Bank Of India" value="Union Bank of India">
            Union Bank Of India
          </SelectItem>
          <SelectItem key="hdfc" value="HDFC Bank">
            HDFC Bank
          </SelectItem>
          <SelectItem key="icici" value="ICICI Bank">
            ICICI Bank
          </SelectItem>
          <SelectItem key="axis" value="Axis Bank">
            Axis Bank
          </SelectItem>
          <SelectItem key="pnb" value="Punjab National Bank">
            Punjab National Bank
          </SelectItem>
        </Select>
        <Input
          label="Batch 2 Cheque No."
          placeholder="Cheque Number"
          name="batch2ChequeNo"
          value={formData.batch2ChequeNo}
          variant="bordered"
          labelPlacement="outside"
          onChange={handleInputChange}
        />
        <Input
          type="date"
          label="Batch 2 Date"
          name="batch2Date"
          value={formData.batch2Date}
          variant="bordered"
          labelPlacement="outside"
          onChange={handleInputChange}
        />
        <Input
          label="Total Amount to Debit"
          placeholder="Total Amount in Rs."
          name="totalAmount"
          value={
            formData.totalAmount ||
            (Number(formData.batch1Amount) || 0) +
              (Number(formData.batch2Amount) || 0)
          }
          variant="bordered"
          labelPlacement="outside"
          onChange={handleInputChange}
        />
        <Textarea
          label="Amount in Words"
          placeholder="Amount in words"
          name="amountInWords"
          value={formData.amountInWords}
          variant="bordered"
          labelPlacement="outside"
          onChange={handleInputChange}
        />
      </form>
      <Button color="primary" className="w-full" onClick={generatePDF}>
        Generate PDF
      </Button>
    </div>
  );
}
