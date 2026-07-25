import { getCookie } from "./cookieUtils";

export const fetcher = async (url) => {
  const token = await getCookie("accessToken"); // Make sure to set this environment variable
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) => res.json());
};
