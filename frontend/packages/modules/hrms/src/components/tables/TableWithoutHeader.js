import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/react";
import React from "react";

export default function TableWithoutHeader({ data = [] }) {
  return (
    <Table hideHeader aria-label="Example static collection table">
      <TableHeader>
        <TableColumn>NAME</TableColumn>
        <TableColumn>ROLE</TableColumn>
        <TableColumn>STATUS</TableColumn>
      </TableHeader>
      <TableBody
        emptyContent="No Record Found"
        items={data}
        loadingContent={<Spinner />}
      >
        <TableRow key="1">
          {(item) => (
            <TableRow key={item.atdId}>
              {(columnKey) => {
                <TableCell
                  className={`text-center ${item.error ? "text-red-500" : ""}`}
                >
                  {columnKey}
                </TableCell>;
              }}
            </TableRow>
          )}
          <TableCell>Tony Reichert</TableCell>
          <TableCell>CEO</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
