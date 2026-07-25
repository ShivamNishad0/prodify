import React, { Suspense } from "react";
import PrintIdCard from "@/components/print-id-card/PrintIdCard";

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PrintIdCard />
    </Suspense>
  );
}
