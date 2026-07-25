export function formatDateddmmyyyy(inputDate) {
  // Check if inputDate is provided and valid
  if (
    !inputDate ||
    typeof inputDate.year !== "number" ||
    typeof inputDate.month !== "number" ||
    typeof inputDate.day !== "number"
  ) {
    return "";
  }

  // Adjust month value as JavaScript Date object expects months from 0-11
  let date = new Date(inputDate.year, inputDate.month - 1, inputDate.day);

  // Get day, month, and year
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  // Formatting date to "DD-MM-YYYY"
  let formattedDate = `${day}-${month}-${year}`;

  return formattedDate;
}

export function formatDate(inputDate) {
  // Check if inputDate is provided and valid
  if (
    !inputDate ||
    typeof inputDate.year !== "number" ||
    typeof inputDate.month !== "number" ||
    typeof inputDate.day !== "number"
  ) {
    return "";
  }

  // Adjust month value as JavaScript Date object expects months from 0-11
  let date = new Date(inputDate.year, inputDate.month - 1, inputDate.day + 1);

  // Formatting date to "yyyy-mm-dd" (default format)
  return date.toISOString().split("T")[0];
}

export function convertDateToObject(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);

  return {
    era: "AD",
    year: year,
    month: month,
    day: day,
    calendar: {
      identifier: "gregory",
    },
  };
}
