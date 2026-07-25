import React from "react";
import { PIMReportProvider } from "@/context/PIMReport";
import Report from "@/pages/pim/report/Report";

export default function page() {
  return (
    <PIMReportProvider>
      <Report />
    </PIMReportProvider>
  );
}
