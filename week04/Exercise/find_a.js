function finda(str) {
  const index = str.indexOf('a');
  if(index === -1) {
    return false;
  }
  return true;
}

console.log(finda('i am john'));