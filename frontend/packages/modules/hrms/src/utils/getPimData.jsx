import { getData } from "./api";
import { getCookie } from "./cookieUtils";
import { splitName } from "@/utils/splitName";
import { parseDate } from "@internationalized/date";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

const docs = [
  "addharFrontDoc",
  "addharBackDoc",
  "bankDoc",
  "panFrontDoc",
  "panBackDoc",
  "characterDoc",
  "dlFrontDoc",
  "dlBackDoc",
];

export async function getPimdata(setFormData, empNumber, setDocs, pathName) {
  const token = await getCookie("accessToken");
  const response = await getData(
    `${baseUrl}/api/spshrm/${
      baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]
    }/staff/${empNumber}`,
    token
  );

  if (response) {
    // Transform null values to empty strings
    const updateData = { ...response };
    Object.keys(updateData).forEach((key) => {
      if (updateData[key] === null) {
        updateData[key] = ""; // Convert null to empty string
      }
    });

    // Further modifications as per your current logic
    const splittedName = splitName(response.name);
    updateData.firstName = splittedName.firstName;
    updateData.middleName = splittedName.middleName;
    updateData.lastName = splittedName.lastName;
    updateData.desigId = response.desigId?.toString();
    updateData.dlExpDate = parseDate(response?.dlExpDate || todayDateString());
    updateData.dob = parseDate(response?.dob || todayDateString());
    updateData.contractStartDate = parseDate(
      response?.contractStartDate || todayDateString()
    );
    updateData.contractEndDate = parseDate(
      response?.contractEndDate || todayDateString()
    );
    updateData.dateOfJoining = parseDate(
      response?.dateOfJoining || todayDateString()
    );

    // Remove elements with keys in docs and store them in a separate object
    const removedDocs = {};
    docs.forEach((key) => {
      if (updateData[key] !== undefined) {
        removedDocs[key] = updateData[key] === null ? "" : updateData[key];
        delete updateData[key];
      }
    });
    setFormData(updateData);
    setDocs(removedDocs);
  }
}

export function todayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
