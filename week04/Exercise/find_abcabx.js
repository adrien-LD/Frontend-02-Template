function match(str){
  let state = start;
  for(let item of str){
    state = state(item);
  }
  return state === end;
}

function start(c) {
  if(c ==='a') {
    return foundA;
  }
  return start;
}

function foundA(c) {
  if(c==='b') {
    return foundB;
  }

  return start(c);
}

function foundB(c) {
  if(c==='c') {
    return foundC;
  }

  return start(c);
}

function foundC(c) {
  if(c === 'a') {
    return foundA2;
  }
  return start(c);
}

function foundA2(c) {
  if(c === 'b') {
    return foundB2;
  }
  return findB(c);
}

function foundB2(c) {
  if(c === 'x') {
    return foundX;
  }
  return foundC(c);
}

function foundX(c){
    return end;
}

function end(c) {
  return end;
}


console.log(match('ababcabx113dde'));