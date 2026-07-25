"use client";
import { getCookie } from "@/utils/cookieUtils";
import { getDesgnData } from "@/utils/getDesgnData";
import { usePathname } from "next/navigation";
import React, { createContext, Suspense, useEffect, useState } from "react";

const PIMReport = createContext({
  user: "",
  setUser: () => {},
  desgn: [],
  setDesgn: () => {},
  salary: "",
  setSalary: () => {},
});

export default PIMReport;
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

export function PIMReportProvider({ children }) {
  const pathName = usePathname();
  const [user, setUser] = useState("");
  const [salary, setSalary] = useState("");
  const [desgn, setDesgn] = useState([]);

  // Fetch designations only once when the component mounts
  useEffect(() => {
    getDesgnData(setDesgn, pathName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getSalaryStructure = async (staffId) => {
    try {
      const token = await getCookie("accessToken");
      if (!token) {
        throw new Error("Authentication token is missing");
      }

      const zone = baseZone[pathName.split("/")[1]];
      if (!zone) {
        throw new Error("Invalid zone from pathName");
      }

      const response = await fetch(
        `${baseUrl}/api/spshrm/${zone}/salary/by-staff-data/${staffId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Check if response is OK
      if (!response.ok) {
        throw new Error(`Error fetching salary data: ${response.statusText}`);
      }

      // Check if the response is JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        // Parse response as JSON
        const responseData = await response.json();
        setSalary(responseData);
      } else {
        // Handle non-JSON or empty responses
        const text = await response.text();
        console.warn("Expected JSON, but got:", text);
        setSalary(null); // Handle non-JSON response, depending on your logic
      }
    } catch (error) {
      console.error("Failed to get salary structure:", error);
    }
  };

  // Update user designation only when user.desigId changes and desgn is available
  useEffect(() => {
    if (user) {
      getSalaryStructure(user.staffId);
    }
    if (user?.desigId && desgn.length) {
      const foundDesignation = desgn.find(
        (ele) => ele.desigId.toString() === user.desigId.toString()
      );

      if (foundDesignation && user.designation !== foundDesignation.desigName) {
        setUser((prevData) => ({
          ...prevData,
          designation: foundDesignation.desigName,
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.desigId, desgn]);
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PIMReport.Provider value={{ user, setUser, desgn, setDesgn, salary }}>
        {children}
      </PIMReport.Provider>
    </Suspense>
  );
}
