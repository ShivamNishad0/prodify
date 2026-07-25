// utils/getBackgroundColor.js
export const getBackgroundColor = (zoneid) => {
  const bgColors = {
    101: "bg-gradient-to-r from-[#FF920B] to-[#F35C17]",
    202: "bg-gradient-to-r from-[#556fa8ac] to-[#c94ddd]",
    301: "bg-gradient-to-r from-[#F8CDCD] to-[#95AAD3]",
    303: "bg-gradient-to-r from-[#65c8d9] to-[#0077A3]",
    404: "bg-gradient-to-r from-[#AB91C5] to-[#DC5356]",
    // 404: "bg-gradient-to-r from-[#34eb4f] to-[#2dbb6c]",
    505: "bg-gradient-to-r from-[#34eb4f] to-[#2dbb6c]",
    601: "bg-gradient-to-r from-[#9C0E5C] to-[#0077A3]",
  };

  return bgColors[zoneid] || "bg-gradient-to-r from-[#FF920B] to-[#F35C17]"; // Default background
};
