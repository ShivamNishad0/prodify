export const ranchiDivisions = {
  All: {
    All: {
      All: ["All"],
    },
  },
  Ranchi: {
    Ranchi: {
      Ranchi: ["Ranchi"],
    },
  },
  Hazaribagh: {
    Hazaribagh: {
      Hazaribagh: ["Hazaribagh (Rural)", "Hazaribagh (Urban)", "Katkamsandi"],
      Chatra: ["Chatra North", "Chatra South"],
      Barhi: ["Barkatta", "Chouparan"],
    },
    Koderma: {
      Koderma: ["Koderma", "Jumritilliya", "Domchanch"],
    },
    Ramgarh: {
      Ramgarh: ["Gola", "Ramgarh"],
      Kujju: ["Bhurkunda", "Kujju"],
    },
  },
  Medninagar: {
    Daltonganj: {
      Daltonganj: ["Daltonganj (Rural)", "Daltonganj (Urban)", "Patan"],
      Chatarpur: ["Chatarpur", "Japla"],
      Latehar: ["Latehar", "Barwadih"],
    },
    Garhwa: {
      "Garhwa I": ["Garhwa I", "Garhwa II"],
      "Garhwa II": ["Nagar Utari"],
    },
  },
  Dumka: {
    Dumka: {
      Dumka: ["Basukhinath", "Dumka (Rural)", "Dumka (Urban)"],
      Jamtara: ["Jamtara", "Mihijam"],
    },
    Sahebganj: {
      Sahebganj: [
        "Barharwa",
        "Rajmahal",
        "Sahebganj",
        "Sahebganj (Rural)",
        "Tinpahar",
      ],
      Pakur: ["Amrapara", "Pakur", "Pakur (Rural)"],
    },
  },
};

export const createNestedStructure = (areas) => {
  const nestedStructure = {};
  if (areas.length > 0) {
    areas.forEach(({ area, circle, division, subDivision }) => {
      if (!nestedStructure[area]) {
        nestedStructure[area] = {};
      }
      if (!nestedStructure[area][circle]) {
        nestedStructure[area][circle] = {};
      }
      if (!nestedStructure[area][circle][division]) {
        nestedStructure[area][circle][division] = [];
      }
      if (!nestedStructure[area][circle][division].includes(subDivision)) {
        nestedStructure[area][circle][division].push(subDivision);
      }
    });
  }

  return nestedStructure;
};

export const createNestedStructureWithId = (areas) => {
  const nestedStructure = {};
  if (areas.length > 0) {
    areas.forEach(({ areaId, area, circle, division, subDivision }) => {
      if (!nestedStructure[area]) {
        nestedStructure[area] = {};
      }
      if (!nestedStructure[area][circle]) {
        nestedStructure[area][circle] = {};
      }
      if (!nestedStructure[area][circle][division]) {
        nestedStructure[area][circle][division] = [];
      }
      if (!nestedStructure[area][circle][division].includes(subDivision)) {
        nestedStructure[area][circle][division].push(
          areaId + "-" + subDivision
        );
      }
    });
  }

  return nestedStructure;
};

export const createNestedStructureForId = (areas) => {
  const nestedStructure = {};
  areas.forEach(({ area, circle, division, subDivision }) => {
    nestedStructure[area] ??= {};
    nestedStructure[area][circle] ??= {};
    nestedStructure[area][circle][division] ??= [];
    if (!nestedStructure[area][circle][division].includes(subDivision)) {
      nestedStructure[area][circle][division].push(subDivision);
    }
  });
  return nestedStructure;
};

export const initialState = {
  postOf: "",
  name: "",
  tempEmp: "",
  fname: "",
  dob: "",
  age: "",
  gender: "",
  bloodgrp: "",
  nationality: "",
  maritalStatus: "",
  contactNo: "",
  paddress: "",
  caddress: "",
  email: "",
  quali: [
    {
      qualiFication: "",
      yop: "",
      univ: "",
      mmarks: "",
      omartks: "",
      percent: "",
    },
  ],
  aadharNo: "",
  panCard: "",
  exEmp: "",
  idCopy: "",
  declaration: "",
  filledDate: "",
  filledBy: "",
  place: "",
  netPay: "",
};

export const pay = {
  PM: 25000,
  APM: 30000,
  SUPERVISOR: 20000,
  "SUPPORT MANAGER": 20000,
  "COMPUTER OPERATOR": 10000,
  "COMPUTER OPERATOR(SUB-DIV)": 20000,
  "URJA MITRA": 12000,
  "SUPPORT MANAGER": 25000,
  "DATA CONSULTANT": 30000,
  "PROGRAM COORDINATOR": 35000,
  "TECHNICAL HANDLER": 30000,
  "CONSUMER HELPDESK TEAM": 20000,
  "PROJECT COORDINATOR": "",
};

export const docName = {
  bankDoc: "BANK",
  addharBackDoc: "AADHAR_BACK",
  addharFrontDoc: "AADHAR_FRONT",
  panBackDoc: "PAN_BACK",
  panFrontDoc: "PAN_FRONT",
  characterDoc: "CHARACTER",
  staffImg: "USER_IMG",
};

export const months = {
  JANUARY: 0,
  FEBRUARY: 1,
  MARCH: 2,
  APRIL: 3,
  MAY: 4,
  JUNE: 5,
  JULY: 6,
  AUGUST: 7,
  SEPTEMBER: 8,
  OCTOBER: 9,
  NOVEMBER: 10,
  DECEMBER: 11,
};

export const formElements = {
  leaderName: {
    label: "Leader Name",
    type: "text",
    disabled: false,
    required: true,
  },
  dateOfIssue: {
    label: "Date of Issue",
    type: "date",
    disabled: false,
    required: true,
  },
  areaOfStaff: { label: "Area of Staff", type: "text", disabled: true },
  modelNo: { label: "Model No", type: "text", required: false },
  deviceSlNo: {
    label: "Device Serial Number",
    type: "text",
    disabled: false,
    required: true,
  },
  empNo: { label: "Employee Number", type: "text", disabled: true },
  ram: { label: "RAM", type: "text", disabled: false, required: false },
  hardDisk: {
    label: "Hard Disk",
    type: "text",
    disabled: false,
    required: false,
  },
  remarks: { label: "Remarks", type: "text", disabled: false, required: false },
};

export const salaryExcelHeaders = [
  [
    "Nature of work and Location: Head office, Ranchi",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ],
  [
    "",
    "",
    "",
    "",
    "",
    "",
    "No. of Days during Month:",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ],
  [
    "",
    "",
    "Wage Period: Monthly",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ],
  [
    "",
    "Employee Details",
    "",
    "Particulars",
    "",
    "",
    "",
    "",
    "Amount of Wages Earned",
    "",
    "",
    "",
    "Deductions",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "Incentives",
    "",
    "",
    "",
    "",
  ],
  [
    "S.No.",
    "Name of Employees",
    "Emp. No.",
    "Basic/DA",
    "HRA",
    "Conv/Othr",
    "Gross",
    "Attendance",
    "Basic/DA",
    "HRA",
    "Conv/Othr",
    "Gross",
    "Emp. PF",
    "Emp. ESI",
    "TDS",
    "Other",
    "Remark",
    "Deduction",
    "Other",
    "Adv Deduc",
    "Prev Settl Amt",
    "Net Paid",
    "PF UAN No.",
    "ESI No.",
  ],
];

export const bijliSalaryExcelHeaders = [
  [
    "Nature of work and Location: Head office, Ranchi",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ],
  [
    "",
    "",
    "",
    "",
    "",
    "",
    "No. of Days during Month:",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ],
  [
    "",
    "",
    "Wage Period: Monthly",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ],
  [
    "",
    "Employee Details",
    "",
    "Particulars",
    "",
    "",
    "",
    "",
    "Amount of Wages Earned",
    "",
    "",
    "",
    "Deductions",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "Incentives",
    "",
    "",
    "",
  ],
  [
    "S.No.",
    "Name of Employees",
    "Emp. No.",
    "Basic/DA",
    "HRA",
    "Conv/Othr",
    "Gross",
    "Attendance",
    "Basic/DA",
    "HRA",
    "Conv/Othr",
    "Gross",
    "Emp. PF",
    "Emp. ESI",
    "TDS",
    "Other",
    "Remark",
    "Deduction",
    "Other",
    "Adv Deduc",
    "Prev Settl Amt",
    "Net Paid",
    "PF UAN No.",
    "ESI No.",
  ],
];
