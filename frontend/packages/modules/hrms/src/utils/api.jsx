import toast from "react-hot-toast";
import { deleteCookie } from "./cookieUtils";

// apiUtils.js
export async function postData(url = "", data = {}, token = "", method) {
  try {
    const response = await fetch(url, {
      method: method ? method : "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (response.status === 409) {
      const errorText = await response.text();
      const errorMessage = errorText || "User Already Exists";
      return errorMessage;
    }

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => ({})); // parse error response if possible
      const errorMessage =
        errorDetails.message || response.statusText || "An error has occurred";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      return await response.json(); // parses JSON response into native JavaScript objects
    } else {
      const responseText = await response.text();
      if (responseText) return responseText;
      else return true;
    }
  } catch (error) {
    toast.error(error.message || "An unexpected error occurred");
    // throw error;
  }
}

export async function getData(url = "", token) {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorDetails = await response.json().catch(() => ({})); // parse error response if possible
      const errorMessage =
        errorDetails.message || response.statusText || "An error has occurred";
      return errorMessage;
    }

    if (response.status === 204) {
      return "No Data Found"; // No content
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json(); // parses JSON response into native JavaScript objects
      return data;
    } else {
      const text = await response.text(); // if response is not JSON, return text
      return text;
    }
  } catch (error) {
    return { error: error.message || "An unexpected error occurred" };
  }
}

export async function deleteData(url = "", token) {
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    throw new Error(message);
  }

  return true; // parses JSON response into native JavaScript objects
}

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
export async function getLogo() {
  const response = await fetch(
    `${baseUrl}/api/v1/spsm/view/OTHER_DOC/f319807d-8d4a-4368-8797-2abc20bf6e55_2024-06-28_spslogo.jpeg`
  );

  if (response) {
    return response;
  }
}

export async function handleLogout(router) {
  deleteCookie("accessToken");
  deleteCookie("user");
  deleteCookie("zone");
  router.push("/");
}
