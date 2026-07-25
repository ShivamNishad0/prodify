import { getData } from "./api";
import { getCookie } from "./cookieUtils";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

export const getDesgnData = async (setDesgn, pathName) => {
  try {
    const token = await getCookie("accessToken");
    const response = await fetch(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/designations/all`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const responseData = await response.json();
        setDesgn(responseData);
      }
    } else {
      console.error("Failed to fetch designation data");
    }
  } catch (error) {
    console.error("Error fetching designation data:", error);
  }
};

export const getAllArea = async (setArea, pathName, setLocation) => {
  const zoneMapping = {
    "head-office": "101",
    "bijli": "202",
    "rmc": "301",
    "suda": "303",
    "dmc": "404",
    "bhilai": "601"
  };
  const currentDept = pathName.split("/")[pathName.includes("/hrms") ? 3 : 1];
  const derivedZoneId = zoneMapping[currentDept] || "";
  
  try {
    const token = await getCookie("accessToken");
    const response = await fetch(
      `${baseUrl}/api/spshrm/${
        baseZone[currentDept]
      }/area/all?zoneId=${derivedZoneId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const contentType = response.headers.get("Content-Type");

      if (contentType && contentType.includes("application/json")) {
        const responseData = await response.json();
        const locationData = [];
        const areaData = [];

        // Add the "DETAILED" entry only when pathName.split("/")[pathName.includes("/hrms") ? 3 : 1] === "bijli"
        if (pathName.split("/")[pathName.includes("/hrms") ? 3 : 1] === "bijli") {
          locationData.push({
            areaId: "a",
            location: "DETAILED",
          });
        }

        responseData.forEach((ele) => {
          if (
            ele.area === ele.circle &&
            ele.circle === ele.division &&
            ele.division === ele.subDivision
          ) {
            locationData.push({ areaId: ele.areaId, location: ele.area });
          } else {
            areaData.push(ele);
          }
        });

        if (locationData.length && setLocation) setLocation(locationData);
        if (areaData.length) setArea(areaData);
      } else if (!contentType && response.status === 204) {
        // Handle no content (HTTP 204 No Content)
        console.warn("No content returned from the server.");
        setArea([]);
      } else {
        const rawData = await response.text(); // Fallback to text
        console.warn("Unexpected content type or empty response:", rawData);
      }
    } else {
      console.error("Failed to fetch area data, status:", response.status);
    }
  } catch (error) {
    console.error("Error fetching area data:", error);
  }
};

export const getAllDept = async (setDept, pathName) => {
  try {
    const token = await getCookie("accessToken");
    const response = await fetch(
      `${baseUrl}/api/spshrm/${
        baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
      }/department/all`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/json")) {
        const responseData = await response.json();
        setDept(responseData);
      } else if (!contentType && response.status === 204) {
        // Handle no content (HTTP 204 No Content)
        console.warn("No content returned from the server.");
        setDept([]);
      }
    } else {
      console.error("Failed to fetch department data");
    }
  } catch (error) {
    console.error("Error fetching department data:", error);
  }
};

export const getAssetList = async (setAssetList, pathName) => {
  const token = await getCookie("accessToken");
  const response = await getData(
    `${baseUrl}/api/spshrm/${
      baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
    }/assets/all-asset`,
    token
  );
  setAssetList(Array.isArray(response) ? response : []);
};
