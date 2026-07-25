import React, { Suspense, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  Pagination,
  Spinner,
  TableCell,
  Button,
  Avatar,
  getKeyValue,
} from "@nextui-org/react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default function AsyncPaginateTable({
  columns = [],
  actionButtons = [],
  selectButton,
  selectedKeys,
  setSelectedKeys,
  resourceUrl,
  page,
  setPage,
  loadingState,
  data = [],
  handletarget,
  hanldeSelectKeys,
  targetValues,
}) {
  const rowsPerPage = 20;

  const pages = useMemo(() => {
    return data?.count ? Math.ceil(data.count / rowsPerPage) : 0;
  }, [data?.count, rowsPerPage]);

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

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Table
        isHeaderSticky
        selectionMode={selectButton ? selectButton : "none"}
        selectedKeys={selectedKeys}
        onSelectionChange={(e) => {
          hanldeSelectKeys
            ? hanldeSelectKeys(e)
            : setSelectedKeys((prevData) => {
                return [...prevData, [...e].pop()];
              });
        }}
        aria-label="Async pagination Table"
        isStriped
        bottomContent={
          page && pages > 0 ? (
            <div className="flex w-full justify-center">
              <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
              />
            </div>
          ) : null
        }
        classNames={{
          base: "h-full",
          wrapper: "scrollbar-hide shadow-none",
        }}
        className="shadow-small rounded-large"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              className={`font-bold text-black ${
                column.value === "Action" ? "text-center" : ""
              }`}
            >
              {column?.value || ""}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent="No Record Found"
          items={data?.results ?? []}
          loadingContent={<Spinner />}
          loadingState={loadingState}
        >
          {(item) => (
            <TableRow
              key={
                item.holidayId ||
                item.ssdId ||
                item.staffId ||
                item.assetId ||
                item.id ||
                item.tempEmp ||
                item.staffExpId ||
                item.depId ||
                item.desigId ||
                item.qualiID ||
                item.empNo ||
                item.pcId ||
                item.ppId
              }
            >
              {(columnKey) => {
                switch (columnKey) {
                  case "target":
                    return (
                      <TableCell
                        className={`text-center ${
                          item.error ? "text-red-500" : ""
                        }`}
                      >
                        <input
                          type="text"
                          className="border border-black bg-white p-2 w-full rounded-lg"
                          value={
                            targetValues.targets[item.ssId] !== undefined
                              ? targetValues.targets[item.ssId]
                              : ""
                          } // Ensure it's controlled and use empty string for undefined
                          onChange={(e) => handletarget(e, item)}
                        />
                      </TableCell>
                    );
                  case "action":
                    return (
                      <TableCell
                        className={`text-center ${
                          item.error ? "text-red-500" : ""
                        }`}
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
                                        button.iconOnly
                                          ? ""
                                          : "h-7 rounded-full mx-2"
                                      }`}
                                      isDisabled={
                                        button.disable
                                          ? button.disable(item)
                                          : false
                                      }
                                    >
                                      {button.iconOnly
                                        ? button.icon
                                        : button.name}
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
                          } ${
                            item[columnKey] === "TRUE" ? "" : "text-red-500"
                          }`}
                        >
                          {item[columnKey] === "TRUE"
                            ? "Generated"
                            : "Not Generated"}
                        </div>
                      </TableCell>
                    );
                  case "isOfferGenrated":
                    return (
                      <TableCell className="text-center">
                        <div
                          className={`flex items-center gap-4 ${
                            item.error ? "text-red-500" : ""
                          } ${
                            item[columnKey] === "TRUE" ? "" : "text-red-500"
                          }`}
                        >
                          {item[columnKey] === "TRUE"
                            ? "Generated"
                            : "Not Generated"}
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
                    const { dateAfter30Days, daysLeft } = expDate(
                      item.filledDate
                    );
                    return (
                      <TableCell
                        className={`text-center ${
                          item.error ? "text-red-500" : ""
                        } ${daysLeft < 6 ? "text-[#f50000]" : ""}`}
                      >
                        {item.characterDoc
                          ? "Verified"
                          : `${dateAfter30Days} (${daysLeft} Days Left)`}
                      </TableCell>
                    );
                  case "characterDoc":
                    return (
                      <TableCell
                        className={`text-center ${
                          item.error ? "text-red-500" : ""
                        }`}
                      >
                        {item.characterDoc ? (
                          <Button
                            color="primary"
                            variant="bordered"
                            className="h-7 rounded-full"
                            onClick={() =>
                              window.open(
                                resourceUrl + item.characterDoc,
                                "_blank"
                              )
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
                        className={`text-center ${
                          item.error ? "text-red-500" : ""
                        }`}
                      >
                        <div
                          className={`flex items-center gap-4 ${
                            item.error ? "text-red-500" : "ABCD"
                          }`}
                        >
                          {columnKey === "name" && (
                            <div className="aspect-square">
                              <Avatar
                                src={
                                  item.staffImg
                                    ? `${baseUrl}/api/v1/spsm/view/STAFF_IMG/${item.staffImg}`
                                    : ""
                                }
                                classNames={{ img: "absolute top-0 h-fit" }}
                              />
                            </div>
                          )}
                          {getKeyValue(item, columnKey)}
                        </div>
                      </TableCell>
                    );
                }
              }}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Suspense>
  );
}
