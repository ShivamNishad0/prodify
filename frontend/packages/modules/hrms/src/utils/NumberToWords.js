export function numberToWords(num) {
  const ones = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];

  const tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];

  const suffixes = ["", "thousand", "million", "billion", "trillion"];

  if (num === 0) {
    return "zero";
  }

  let words = "";
  let isMultipleOfThousand = true;

  for (let i = 0; num > 0; i++) {
    if (num % 1000 !== 0) {
      let segmentWords = convertLessThanOneThousand(num % 1000, ones, tens);
      if (suffixes[i]) {
        segmentWords += " " + suffixes[i];
        if (isMultipleOfThousand && i > 0 && num % 1000 > 1) {
          segmentWords += "s";
        }
      }
      words = segmentWords + " " + words;
      isMultipleOfThousand = false;
    } else {
      isMultipleOfThousand = true;
    }
    num = Math.floor(num / 1000);
  }

  return words.trim();
}

const convertLessThanOneThousand = (num, ones, tens) => {
  let currentWords = "";

  if (num % 100 < 20) {
    currentWords = ones[num % 100];
    num = Math.floor(num / 100);
  } else {
    currentWords = ones[num % 10];
    num = Math.floor(num / 10);
    currentWords = tens[num % 10] + " " + currentWords;
    num = Math.floor(num / 10);
  }
  if (num === 0) return currentWords.trim();
  return ones[num] + " hundred " + currentWords.trim();
};
