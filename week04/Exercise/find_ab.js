function findab(str){
  const strArr = str.split('');
  let flag = strArr[0];
  const length = strArr.length;
  for(let i = 1; i < length ; i ++) {
    if(`${flag}${strArr[i]}` === 'ab') {
      return true;
    }
    flag = strArr[i];
  }

  return false;
}

console.log(findab('11 33 ff adrf'));