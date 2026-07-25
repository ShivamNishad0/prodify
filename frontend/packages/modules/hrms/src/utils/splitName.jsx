export function splitName(fullName) {
  let nameParts = fullName?.trim().split(/\s+/);
  let firstName, middleName, lastName;

  if (nameParts?.length === 1) {
    // Only one name part
    firstName = nameParts[0];
    middleName = "";
    lastName = "";
  } else if (nameParts?.length === 2) {
    // Two name parts
    firstName = nameParts[0];
    middleName = "";
    lastName = nameParts[1];
  } else {
    // Three or more name parts
    firstName = nameParts && nameParts[0];
    lastName = nameParts?.pop(); // Remove and assign the last element
    middleName = nameParts?.slice(1).join(" "); // Join the remaining parts as middle name
  }
  return {
    firstName,
    middleName,
    lastName,
  };
}
