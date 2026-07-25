import {
  TableCell,
  Avatar,
  Button,
  getKeyValue,
  Input,
} from "@nextui-org/react";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const renderCell = (
  item,
  columnKey,
  actionButtons,
  resourceUrl,
  handletarget,
  targetValues
) => {
  const expDate = (dateOfJoining) => {
    const inputDate = new Date(dateOfJoining);
    const dateAfter30Days = new Date(inputDate);
    dateAfter30Days.setDate(inputDate.getDate() + 90);
    const formattedDateAfter30Days =
      dateAfter30Days.toLocaleDateString("en-GB");
    const today = new Date();
    const timeDiff = dateAfter30Days - today;
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return { dateAfter30Days: formattedDateAfter30Days, daysLeft };
  };

  switch (columnKey) {
    case "target":
      return (
        <TableCell
          className={`text-center ${item.error ? "text-red-500" : ""}`}
        >
          <Input
            variant="bordered"
            classNames={{
              mainWrapper: "border-black",
              inputWrapper: "border-black bg-white",
            }}
            value={targetValues[item.ssId]}
            onChange={(e) => {
              handletarget(e, item);
            }}
          />
        </TableCell>
      );
    case "action":
      return (
        <TableCell
          className={`text-center ${item.error ? "text-red-500" : ""}`}
        >
          <div className="flex justify-center items-center">
            {actionButtons.length &&
              actionButtons.map(
                (button, buttonIndex) =>
                  button && (
                    <div key={buttonIndex}>
                      <Button
                        isIconOnly={button.iconOnly}
                        auto
                        variant="solid"
                        radius="full"
                        onClick={() => button.action(item)}
                        style={{
                          background: button.iconOnly
                            ? "transparent"
                            : button.color || "",
                        }}
                        className={`text-white ${
                          button.iconOnly ? "" : "h-7 rounded-full mx-2"
                        }`}
                        isDisabled={
                          button.disable ? button.disable(item) : false
                        }
                      >
                        {button.iconOnly ? button.icon : button.name}
                      </Button>
                      {button.tag}
                    </div>
                  )
              )}
          </div>
        </TableCell>
      );
    case "isIdGenrated":
      return (
        <TableCell className="text-center">
          <div
            className={`flex items-center gap-4 ${
              item.error ? "text-red-500" : ""
            } ${item[columnKey] === "TRUE" ? "" : "text-red-500"}`}
          >
            {item[columnKey] === "TRUE" ? "Generated" : "Not Generated"}
          </div>
        </TableCell>
      );
    case "isOfferGenrated":
      return (
        <TableCell className="text-center">
          <div
            className={`flex items-center gap-4 ${
              item.error ? "text-red-500" : ""
            } ${item[columnKey] === "TRUE" ? "" : "text-red-500"}`}
          >
            {item[columnKey] === "TRUE" ? "Generated" : "Not Generated"}
          </div>
        </TableCell>
      );
    case "newCondition":
      return (
        <TableCell className="text-center">
          <div className="flex items-center gap-4">
            {newConditionHandler(item)}
          </div>
        </TableCell>
      );
    case "expiryDate":
      const { dateAfter30Days, daysLeft } = expDate(item.filledDate);
      return (
        <TableCell
          className={`text-center ${item.error ? "text-red-500" : ""} ${
            daysLeft < 6 ? "text-[#f50000]" : ""
          }`}
        >
          {item.characterDoc
            ? "Verified"
            : `${dateAfter30Days} (${daysLeft} Days Left)`}
        </TableCell>
      );
    case "characterDoc":
      return (
        <TableCell
          className={`text-center ${item.error ? "text-red-500" : ""}`}
        >
          {item.characterDoc ? (
            <Button
              color="primary"
              variant="bordered"
              className="h-7 rounded-full"
              onClick={() =>
                window.open(resourceUrl + item.characterDoc, "_blank")
              }
            >
              View
            </Button>
          ) : (
            "Not Uploaded"
          )}
        </TableCell>
      );
    default:
      return (
        <TableCell
          className={`text-center ${item.error ? "text-red-500" : ""}`}
        >
          <div
            className={`flex items-center gap-4 ${
              item.error ? "text-red-500" : ""
            }`}
          >
            {columnKey === "name" && (
              <Avatar
                src={
                  item.staffImg
                    ? `${baseUrl}/api/v1/spsm/view/STAFF_IMG/${item.staffImg}`
                    : ""
                }
                classNames={{ img: "absolute top-0 h-fit" }}
              />
            )}
            {getKeyValue(item, columnKey)}
          </div>
        </TableCell>
      );
  }
};
