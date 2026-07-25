import AddEmployee from "@/pages/pim/add-employee/AddEmployee";
import React, { Suspense } from "react";

export default function page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AddEmployee />
    </Suspense>
  );
}
