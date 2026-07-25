import PrintIdCard from "@/components/print-id-card/PrintIdCard";
import React, { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PrintIdCard />
    </Suspense>
  );
}
