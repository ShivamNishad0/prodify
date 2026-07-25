import { getData } from "./api";
import { getCookie } from "./cookieUtils";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
const baseZone = JSON.parse(process.env.NEXT_PUBLIC_ZONE);

export async function getHolidayList(pathName) {
  try {
    const token = await getCookie("accessToken");
    const response = await getData(
      `${baseUrl}/api/spshrm/${baseZone[pathName.split("/")[pathName.includes("/hrms") ? 3 : 1]]}/holiday/all`,
      token
    );

    if (Array.isArray(response)) {
      return response;
    } else {
      console.error("Unexpected response format:", response);
    }
  } catch (error) {
    console.error("Error fetching holiday list:", error);
  }
}
