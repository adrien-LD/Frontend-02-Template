const baseMap = { 2: "0b", 8: "0o", 16: "0x", 10: "" };

const hexArr = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
];

const binary = /[0|1]*/g;
const octal = /[0-7]*/g;
const hex = /[0-9a-bA-B]*/g;
const decimal = /^\d*$/g;

function parseNumber(numStr, base) {
  let num = 0;
  let isLegal = true;
  switch (base) {
    case 2:
      if (!binary.test(numStr)) {isLegal = false};
      break;
    case 8:
      if (!octal.test(numStr)) {isLegal = false};
      break;
    case 10:
      if (!decimal.test(numStr)) {isLegal = false};
      break;
    default:
      if (!hex.test(numStr)) {isLegal = false};
      break;
  }
  if (!isLegal) {
    return NaN;
  }

  const length = numStr.length;
  numStr.split("").map((currentValue, index) => {
    num +=
      hexArr.indexOf(currentValue.toUpperCase()) * base ** (length - index - 1);
  });
  return num;
}

function stringToNumber(str) {
  let num;
  const baseStr = str.slice(0, 2);
  const numStr = str.slice(2);
  switch (baseStr) {
    case "0B":
    case "0b":
      num = parseNumber(numStr, 2);
      break;
    case "0o":
    case "0O":
      num = parseNumber(numStr, 8);
      break;
    case "0x":
    case "0X":
      num = parseNumber(numStr, 16);
      break;
    default:
      num = parseNumber(str, 10);
      break;
  }
  return num;
}

// console.log(stringToNumber('0b11'));
// console.log(stringToNumber('0x17'));
// console.log(stringToNumber('0o11'));
// console.log(stringToNumber("1234"));
// console.log(stringToNumber('ssss'));

function numberToString(num, base) {
  let str = '';
  let number = num;
  while(number !== 0) {
    const remainder = hexArr[parseInt(number % base)];
    const res = parseInt(number / base); 
    console.log(res);
    str+= remainder .toString();
    number = res;
  }

  return str = baseMap[base] + str.split('').reverse().join('');
}


console.log(numberToString(123, 10));
console.log(numberToString(123, 2));
console.log(numberToString(123, 8));
console.log(numberToString(123, 16));
