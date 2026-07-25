import ExcelJS from "exceljs";

async function extractDataFromExcel(filePath) {
  // Create a new workbook instance
  const workbook = new ExcelJS.Workbook();

  // Read the file
  await workbook.xlsx.readFile(filePath);

  // Assuming the data is in the first sheet
  const worksheet = workbook.getWorksheet(1);

  // Array to hold the extracted data
  const data = [];

  // Loop through rows starting from row 3
  worksheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    if (rowNumber >= 3) {
      // Start from row 3
      const accountNumber = row.getCell(5).value; // Column 2 (B)
      const tempEmp = row.getCell(3).value; // Column 4 (D)
      const ifsc = row.getCell(4).value;
      const branch = row.getCell(7).value;
      const bankName = row.getCell(8).value;
      if (accountNumber && tempEmp) {
        // Construct the object
        const obj = {
          accountNumber: accountNumber,
          tempEmp: tempEmp,
          bankName: bankName,
          branch: branch,
          ifscCode: ifsc,
        };

        // Push to the data array
        data.push(obj);
      }
    }
  });

  return data;
}

// Example usage:
extractDataFromExcel("C:/Users/avina/Downloads/RMCBANKDETAILS.xlsx").then(
  (data) => {
    data.forEach((ele) => {
      console.log(ele);
      getPimdata(ele.tempEmp);
    });
  }
);

async function getPimdata(empNumber) {
  const token =
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3MzE0ODM2NDYsImV4cCI6MTczMTU3MDA0Nn0.rC_XH34w99F1dqMH5SSlGVej0oHVJqZt6oQJ4nxVW1M";
  const response = await getData(
    `http://192.168.31.128:8181/api/spshrm/rmc/staff/${btoa(empNumber)}`,
    token
  );

  if (response) {
    // Transform null values to empty strings
    const updateData = { ...response };
    console.log(response);
    // Object.keys(updateData).forEach((key) => {
    //   if (updateData[key] === null) {
    //     updateData[key] = ""; // Convert null to empty string
    //   }
    // });
  }
}

async function getData(url = "", token) {
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
