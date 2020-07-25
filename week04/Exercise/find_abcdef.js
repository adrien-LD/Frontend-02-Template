function findabcdef(str) {
  const strArr = str.split("");
  let flag = strArr.slice(0, 5).join("");
  const length = strArr.length;
  for (let i = 5; i < length; i++) {
    const str2 = `${flag}${strArr[i]}`;
    if (str2 === "abcdef") {
      return true;
    }
    flag = str2.slice(1, str2.length + 1);
  }

  return false;
}

console.log(findabcdef('1213e3e3abcdefg1123ddd'))