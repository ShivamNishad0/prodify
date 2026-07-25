// async function fetchAllAttendanceSequentially() {
//   const token =
//     "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NTA3NTc1MzUsImV4cCI6MTc1MDg0MzkzNX0.dZoBLTy5wgE81pYdloj3uAryDGtAhCSQ70jeQGWb_RM";
//   const baseUrl = "http://localhost:8181";
//   const zone = "ho";

//   const empNos = [
//     "ER-2627",
//     "ER-647",
//     "ER-476",
//     "ER-024",
//     "ER-676",
//     "ER-419",
//     "ER-2391",
//     "ER-234",
//     "ER-1154",
//     "ER-957",
//     "ER-970",
//     "ER-609",
//     "ER-760",
//     "ER-648",
//     "ER-2093",
//     "ER-1389",
//     "ER-1423",
//     "ER-787",
//     "ER-1155",
//     "ER-964",
//     "ER-948",
//     "ER-756",
//     "ER-828",
//     "ER-1786",
//     "ER-1683",
//     "ER-1722",
//     "ER-1770",
//     "ER-1784",
//     "ER-1502",
//     "ER-1865",
//     "ER-2310",
//     "ER-2324",
//     "ER-2341",
//     "ER-2609",
//     "ER-2357",
//     "ER-2465",
//     "ER-2477",
//     "ER-2487",
//     "ER-2488",
//     "ER-2483",
//     "ER-2482",
//     "ER-2550",
//     "ER-2621",
//     "ER-2554",
//     "ER-2656",
//     "ER-2739",
//     "ER-2747",
//     "ER-2752",
//     "ER-2763",
//     "ER-2774",
//     "ER-2649",
//     "ER-2793",
//     "ER-2819",
//     "ER-2650",
//     "ER-2658",
//     "ER-2687",
//     "ER-2654",
//     "ER-2689",
//     "ER-2651",
//     "ER-2694",
//     "ER-2720",
//     "ER-2854",
//     "ER-2883",
//     "ER-2784",
//     "ER-2825",
//     "ER-2834",
//     "ER-2850",
//     "ER-2884",
//     "ER-2890",
//     "ER-2693",
//     "ER-01",
//     "ER-16",
//     "ER-745",
//     "ER-31",
//     "ER-32",
//     "ER-33",
//     "ER-34",
//     "ER-35",
//     "ER-36",
//     "ER-37",
//     "ER-2303",
//     "ER-18",
//     "ER-019",
//     "ER-1404",
//     "ER-1662",
//   ];

//   for (const empNo of empNos) {
//     try {
//       const url = `${baseUrl}/api/spshrm/${zone}/attendance/employee/${empNo}?month=MAY&year=2025`;
//       const response = await fetch(url, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         console.warn(`❌ Failed for ${empNo}: ${response.status}`);
//         continue;
//       }

//       const responseData = await response.json();

//       const attendance = Object.keys(responseData)
//         .filter(
//           (key) => key.startsWith("d") && typeof responseData[key] === "string"
//         )
//         .map((day) => ({
//           day,
//           status: responseData[day],
//         }));

//       const transformedData = {
//         empNo,
//         attendance,
//       };

//       // 👉 Log for this employee
//       console.log(`✅ ${empNo}:`, transformedData);
//     } catch (error) {
//       console.error(`❌ Error for ${empNo}:`, error);
//     }
//   }
// }

// fetchAllAttendanceSequentially()
//   .then(() => console.log("All attendance fetched successfully"))
//   .catch((error) => console.error("Error fetching attendance:", error));

const token =
  "eyJhbGciOiJIUzM4NCJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJpYXQiOjE3NTA2NzU3NTcsImV4cCI6MTc1MDc2MjE1N30.PEhidHv0geZa53yqrIne1fVhjitzXjjb71UdK_bWiq53-OG2_xYD14siX6fCoyPh";
const baseUrl = "https://spsplhrms.co.in:8181";
const zone = "ho";
async function fetchOnlyD1Attendance() {
  const empNos = [
    "ER-2627",
    "ER-647",
    "ER-476",
    "ER-024",
    "ER-676",
    "ER-419",
    "ER-2391",
    "ER-234",
    "ER-1154",
    "ER-957",
    "ER-970",
    "ER-609",
    "ER-760",
    "ER-648",
    "ER-2093",
    "ER-1389",
    "ER-1423",
    "ER-787",
    "ER-1155",
    "ER-964",
    "ER-948",
    "ER-756",
    "ER-828",
    "ER-1786",
    "ER-1683",
    "ER-1722",
    "ER-1770",
    "ER-1784",
    "ER-1502",
    "ER-1865",
    "ER-2310",
    "ER-2324",
    "ER-2341",
    "ER-2609",
    "ER-2357",
    "ER-2465",
    "ER-2477",
    "ER-2487",
    "ER-2488",
    "ER-2483",
    "ER-2482",
    "ER-2550",
    "ER-2621",
    "ER-2554",
    "ER-2656",
    "ER-2739",
    "ER-2747",
    "ER-2752",
    "ER-2763",
    "ER-2774",
    "ER-2649",
    "ER-2793",
    "ER-2819",
    "ER-2650",
    "ER-2658",
    "ER-2687",
    "ER-2654",
    "ER-2689",
    "ER-2651",
    "ER-2694",
    "ER-2720",
    "ER-2854",
    "ER-2883",
    "ER-2784",
    "ER-2825",
    "ER-2834",
    "ER-2850",
    "ER-2884",
    "ER-2890",
    "ER-2693",
    "ER-01",
    "ER-16",
    "ER-745",
    "ER-31",
    "ER-32",
    "ER-33",
    "ER-34",
    "ER-35",
    "ER-36",
    "ER-37",
    "ER-2303",
    "ER-18",
    "ER-019",
    "ER-1404",
    "ER-1662",
  ];

  const result = {};

  for (const empNo of empNos) {
    try {
      const response = await fetch(
        `${baseUrl}/api/spshrm/${zone}/attendance/employee/${empNo}?month=JULY&year=2025`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.warn(`❌ ${empNo}: Failed to fetch`);
        continue;
      }

      const data = await response.json();

      result[data.attendanceId] = {
        empNo: empNo,
        attendance: { day: "d1", status: data["d1"] },
      };
    } catch (error) {
      console.error(`❌ ${empNo}:`, error.message);
    }
  }

  console.log("✅ Final D1 Attendance Object:");
  console.log(result);
  return result;
}

fetchOnlyD1Attendance().then((result) => {
  console.log("📦 Attendance data fetched", result);
  updateD1Status(result);
});

async function updateD1Status(attendanceMap) {
  // Helper POST function
  async function postData(url, data, token, method = "POST") {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.text();
    console.log(responseData);
    return responseData;
  }

  for (const [attendanceId, { empNo, attendance }] of Object.entries(
    attendanceMap
  )) {
    const day = attendance.day;
    const currentStatus = attendance.status;
    // const newStatus = currentStatus === "PRESENTS" ? "ABSENT" : "PRESENTS";
    const newStatus = currentStatus;

    try {
      const response = await postData(
        `${baseUrl}/api/spshrm/${zone}/attendance/edit/${attendanceId}`,
        { day, status: newStatus },
        token,
        "PUT"
      );

      console.log(
        `✅ Updated ${empNo} (${attendanceId}): ${currentStatus} → ${newStatus}`
      );
    } catch (error) {
      console.error(
        `❌ Error updating ${empNo} (${attendanceId}):`,
        error.message
      );
    }
  }
}
