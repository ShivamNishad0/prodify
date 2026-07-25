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
    if (rowNumber > 1) {
      console.log();
      const gross = row.getCell(4).value;
      const basic = (gross * 2) / 5;
      const da = gross / 50;
      const hra = (gross * 21) / 125;

      const payload = {
        basic: basic,
        conv_oth: gross - (basic + da + hra),
        da: da,
        gross: row.getCell(4).value,
        hra: hra,
        staffId: row.getCell(1).value,
        zoneId: 404,
        pfStatus: "FALSE",
        pfPercent: 0.12,
        esiStatus: "FALSE",
        esiPercent: 0.75,
        tdsStatus: "FALSE",
        empNo: row.getCell(2).value,
        targetBased: row.getCell(3).value === "Target based" ? "TRUE" : "FALSE",
        staffName: "NARAYAN KUMAR SAW",
      };

      // Push to the data array
      data.push(payload);
    }
  });

  return data;
}

// Example usage: C:\Users\avina\Downloads
extractDataFromExcel("C:/Users/avina/Downloads/DhanbadMasterData.xlsx").then(
  (data) => {
    data.forEach(async (ele) => {
      try {
        console.log(ele);
        const response = await fetch(
          `https://spsplhrms.co.in:8181/api/spshrm/dmc/salary/new`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3MzQ1MTQ1MzksImV4cCI6MTczNDYwMDkzOX0.w_lZCuX_DnyIdfQ1YfMz2YGXFPbKv2GzaBMFo7sFk4YyaXP6XbvSDT3BLZ_bltFG`,
            },
            body: JSON.stringify(ele),
          }
        );

        if (response.status === 200) {
          console.log("🚗🚗🚗🚗 Success", ele.empNo);
        } else {
          console.log("❌ Not found:", ele.empNo, ele);
        }
      } catch (error) {
        console.error("Error processing", ele.empNo, error);
      }
    });
  }
);
