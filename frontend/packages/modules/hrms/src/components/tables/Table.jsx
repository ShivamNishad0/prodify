"use client";
import React, { Suspense, useMemo, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
  Avatar,
  Pagination,
  Spinner,
} from "@nextui-org/react";
import { Button } from "@nextui-org/react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

const CustomTable = ({
  columns = [],
  data = [],
  actionButtons = [],
  selectButton,
  selectedKeys,
  setSelectedKeys,
  resourceUrl,
  pagination,
  loadingState,
  rowsPerPage = 15,
}) => {
  const [page, setPage] = useState(1);
  const daysLeftFor30Days = (startDate) => {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 90);
    const today = new Date();
    const timeDiff = end - today;
    const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return daysLeft > 0 ? daysLeft : 0;
  };

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

  const pages = Math.ceil(data.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return data?.slice(start, start + rowsPerPage);
  }, [page, rowsPerPage, data]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Table
        isHeaderSticky
        hideHeader={columns?.length ? false : true}
        selectionMode={selectButton && "multiple"}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        isStriped
        aria-label="Dynamic table"
        bottomContent={
          pagination === true
            ? data.length > rowsPerPage && (
                <div className="flex justify-center w-full">
                  <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="secondary"
                    page={page}
                    total={pages}
                    onChange={(page) => setPage(page)}
                  />
                </div>
              )
            : null
        }
        classNames={{
          wrapper: "min-h-[60px] overflow-y-scroll scrollbar-hide",
        }}
      >
        {columns.length && (
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                className={`font-bold text-black ${
                  column.value === "Action" ? "text-center" : ""
                }`}
                key={column.key}
              >
                {column?.value || ""}
              </TableColumn>
            )}
          </TableHeader>
        )}
        <TableBody
          emptyContent="No Record Found"
          items={pagination && data.length > rowsPerPage ? items : data}
          loadingContent={<Spinner />}
          loadingState={loadingState}
        >
          {(item) =>
            item.tableTitle === "Total" ? (
              <TableRow key={item.tableTitle} className="">
                {(columnKey) => {
                  if (columnKey !== "tableTitle") {
                    return (
                      <TableCell
                        className={`font-bold${
                          item.error ? "text-red-500" : ""
                        }`}
                      >
                        {getKeyValue(item, columnKey)}
                      </TableCell>
                    );
                  } else null;
                }}
              </TableRow>
            ) : (
              <TableRow
                key={
                  item.atdId ||
                  item.ssdId ||
                  item.holidayId ||
                  item.leaveId ||
                  item.assetId ||
                  item.id ||
                  item.staffId ||
                  item.tempEmp ||
                  item.staffExpId ||
                  item.depId ||
                  item.desigId ||
                  item.qualiID ||
                  item.empNo ||
                  item.month ||
                  item.areaId
                }
              >
                {(columnKey) => {
                  if (columnKey === "action") {
                    return (
                      <TableCell
                        className={`text-center ${
                          item.error ? "text-red-500" : ""
                        }`}
                      >
                        <div className="flex justify-center items-center">
                          {actionButtons.length &&
                            actionButtons.map((button, buttonIndex) => (
                              <React.Fragment key={buttonIndex}>
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
                                  {button.iconOnly ? button.icon : button.name}
                                </Button>
                                {button.tag}
                              </React.Fragment>
                            ))}
                        </div>
                      </TableCell>
                    );
                  } else if (columnKey === "customValue") {
                    return (
                      <TableCell className="text-center">
                        <div
                          className={`flex items-center gap-4 ${
                            item.error ? "text-red-500" : ""
                          } ${
                            daysLeftFor30Days(item.dateOfJoining) < 6
                              ? "text-red-500"
                              : ""
                          }`}
                        >
                          {daysLeftFor30Days(item.dateOfJoining)}
                        </div>
                      </TableCell>
                    );
                  } else if (columnKey === "newCondition") {
                    return (
                      <TableCell className="text-center">
                        <div className="flex items-center gap-4">
                          {newConditionHandler(item)}
                        </div>
                      </TableCell>
                    );
                  } else if (columnKey === "expiryDate") {
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
                  } else if (columnKey === "characterDoc") {
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
                            className="rounded-full h-7"
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
                  } else if (columnKey === "subDivision/location") {
                    return (
                      <TableCell
                        className={`text-center ${
                          item.error ? "text-red-500" : ""
                        }`}
                      >
                        <div
                          className={`flex items-center gap-4 ${
                            item.error ? "text-red-500" : ""
                          }`}
                        >
                          {item.subDivision || item.location}
                        </div>
                      </TableCell>
                    );
                  } else {
                    return (
                      <TableCell
                        className={`text-center ${
                          item.error ? "text-red-500" : ""
                        }`}
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
                }}
              </TableRow>
            )
          }
        </TableBody>
      </Table>
    </Suspense>
  );
};

export default CustomTable;
