"use client";
import {
  createContext,
  Suspense,
  useCallback,
  useEffect,
  useState,
} from "react";
import { parseDate } from "@internationalized/date";
import { getCookie } from "@/utils/cookieUtils";
import { getAllArea, getDesgnData } from "@/utils/getDesgnData";
import { todayDateString } from "@/utils/getPimData";
import { usePathname } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

const PIMContext = createContext({
  formData: {},
  setFormData: () => {},
  selections: {},
  setSelections: () => {},
  userData: "",
  setUserData: () => {},
  salary: "",
  setSalary: () => {},
  desgn: "",
  setDesgn: () => {},
  docs: "",
  setDocs: () => {},
  empNumber: "",
  setEmpNumber: () => {},
  zone: "",
  setZone: () => {},
  area: "",
  setArea: () => {},
  location: "",
  setLocation: () => {},
});

export default PIMContext;

export function PIMProvider({ children }) {
  const pathName = usePathname();
  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    fname: "",
    locationId: "",
    tempEmp: "",
    bloodGroup: "",
    dlNo: "",
    dlExpDate: parseDate(todayDateString()),
    dob: parseDate(todayDateString()),
    gender: "",
    maritalStatus: "",
    nationality: "",
    exEmp: "",
    street1: "",
    street2: "",
    city: "",
    state: "",
    pincode: "",
    pstreet1: "",
    pstreet2: "",
    pcity: "",
    pstate: "",
    ppincode: "",
    contactNo: "",
    email: "",
    areaId: "",
    emergencyMobile: "",
    emergencyRelation: "",
    dateOfJoining: parseDate(todayDateString()),
    desigId: "",
    location: "",
    contractStartDate: parseDate(todayDateString()),
    contractEndDate: parseDate(todayDateString()),
    contractDoc: "",
    ifscCode: "",
    accountNumber: "",
    branch: "",
    panCard: "",
    aadharNo: "",
    bankName: "",
    verified: "",
  });
  const [salary, setSalary] = useState({
    basic: 0.0,
    zoneId: "",
    hra: 0.0,
    conv_oth: 0.0,
    da: 0.0,
    gross: 0.0,
    staffId: "",
    scale: 0.42,
    pfStatus: "FALSE",
    pfPercent: 12,
    esiStatus: "FALSE",
    tdsPercent: 0,
    tdsStatus: "FALSE",
    esiPercent: 0.75,
    pfUAN_NO: "",
    esiNo: "",
  });
  const [selections, setSelections] = useState({
    area: "",
    circle: "",
    division: "",
    subDivision: "",
  });
  const [userData, setUserData] = useState("");
  const [desgn, setDesgn] = useState([]);
  const [empNumber, setEmpNumber] = useState("");
  const [zone, setZone] = useState("");
  const [area, setArea] = useState("");
  const [location, setLocation] = useState("");

  const desgnData = useCallback(() => {
    getDesgnData(setDesgn, pathName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [docs, setDocs] = useState({
    addharFrontDoc: "",
    addharBackDoc: "",
    bankDoc: "",
    panFrontDoc: "",
    panBackDoc: "",
    characterDoc: "",
    dlFrontDoc: "",
    dlBackDoc: "",
  });

  useEffect(() => {
    desgnData();
    getSalaryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  useEffect(() => {
    const locationId =
      Array.isArray(location) &&
      location.length &&
      location.find(
        (ele) =>
          ele?.location?.toLowerCase() ===
          formData?.area?.subDivision?.toLowerCase()
      )?.areaId;

    if (locationId) {
      setFormData((prevData) => ({
        ...prevData,
        location: locationId,
        // areaId: locationId,
      }));
    }

    if (area && formData && !formData.areaId) {
      const selectedArea = area.find(
        (ele) =>
          ele?.subDivision?.toLowerCase() ===
          formData?.area?.subDivision?.toLowerCase()
      );

      setFormData((prevData) => ({
        ...prevData,
        location: selectedArea?.areaId?.toString() ? "a" : "",
        areaId:
          selectedArea?.areaId?.toString() ||
          locationId?.areaId?.toString() ||
          "",
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.area, formData.areaId, location, area]);

  useEffect(() => {
    getSalaryData();
    (async () => {
      const zoneCookie = await getCookie("zone");
      setZone(zoneCookie);
    })();
    areaData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getSalaryData() {
    try {
      const user = await getCookie("user");
      setUserData(JSON.parse(user));

      if (!formData.staffId) return;

      const token = await getCookie("accessToken");
      const response = await fetch(
        `${baseUrl}/api/spshrm/${
          baseZone[pathName.split("/")[1]]
        }/salary/by-staff-data/${formData.staffId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const zoneCookie = await getCookie("zone");
      const initialSalary = {
        basic: 0.0,
        conv_oth: 0.0,
        da: 0.0,
        gross: 0.0,
        hra: 0.0,
        ssId: "",
        staffId: "",
        zoneId: parseFloat(zoneCookie),
        scale: 0.4,
        pfStatus: "FALSE",
        pfPercent: 12,
        esiStatus: "FALSE",
        esiPercent: 0.75,
        tdsPercent: "",
        tdsStatus: "FALSE",
        pfUAN_NO: "",
        esiNo: "",
      };
      if (response.status === 204) {
        setSalary(initialSalary);
        return;
      }

      if (response.status === 200) {
        const responseData = await response.json();
        for (const key in responseData) {
          if (responseData[key] === null || responseData[key] === undefined) {
            responseData[key] = "";
          }
        }
        responseData.pfPercent = 12;
        // responseData.pfPercent = responseData.pfPercent * 100;
        responseData.esiPercent = 0.75;
        // responseData.esiPercent = responseData.esiPercent;
        setSalary({
          ...initialSalary,
          ...responseData,
        });
      }
    } catch (error) {
      console.error("Error fetching user data or salary data:", error);
    }
  }

  const areaData = useCallback(
    () => getAllArea(setArea, pathName, setLocation),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PIMContext.Provider
        value={{
          formData,
          setFormData,
          selections,
          setSelections,
          userData,
          setUserData,
          salary,
          setSalary,
          desgn,
          setDesgn,
          docs,
          setDocs,
          empNumber,
          setEmpNumber,
          zone,
          area,
          setArea,
          location,
          setLocation,
        }}
      >
        {children}
      </PIMContext.Provider>
    </Suspense>
  );
}
