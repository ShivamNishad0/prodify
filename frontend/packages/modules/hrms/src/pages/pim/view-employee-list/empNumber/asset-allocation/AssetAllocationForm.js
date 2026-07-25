import { DatePicker, Input, Select, SelectItem } from "@nextui-org/react";
import React from "react";

export default function AssetAllocationForm({
  asset = "",
  setAsset = () => {},
  assetList = [],
  formElements = {},
  modalData = {},
  setModalData = () => {},
}) {
  const handleForm = (event) => {
    const { name, value } = event.target;
    setModalData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <>
      <div className="flex w-full justify-center gap-4">
        <Select
          label="Select an asset"
          labelPlacement="outside"
          variant="bordered"
          selectedKeys={[asset]}
          className="w-1/2"
          onChange={(e) => setAsset(e.target.value)}
          required
        >
          <SelectItem key="">--Select--</SelectItem>
          {assetList.length > 0 &&
            assetList.map((ele) => (
              <SelectItem key={JSON.stringify(ele)}>{ele.assetName}</SelectItem>
            ))}
        </Select>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {Object.keys(formElements).map((key, i) => {
          const element = formElements[key];
          return element.type !== "date" ? (
            ((asset && JSON.parse(asset).assetName === "LAPTOP") ||
              (key !== "ram" && key !== "hardDisk")) && (
              <Input
                key={i}
                variant="bordered"
                labelPlacement="outside"
                label={element.label}
                name={key}
                fullWidth
                value={modalData[key]}
                onChange={handleForm}
                disabled={element.disabled}
                isRequired={element.required}
              />
            )
          ) : (
            <DatePicker
              showMonthAndYearPickers
              key={i}
              label={element.label}
              name={key}
              value={modalData[key]}
              onChange={(date) => {
                setModalData((prevData) => ({
                  ...prevData,
                  dateOfIssue: date,
                }));
              }}
              labelPlacement="outside"
              variant="bordered"
              className="max-w-sm"
              isRequired
            />
          );
        })}
      </div>
    </>
  );
}
