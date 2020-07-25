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
  if(c==='a') {
    return foundA2;
  }

  return start(c);
}

function foundA2(c) {
  if(c === 'b') {
    return foundB2;
  }
  return foundA(c);
}

function foundB2(c) {
  if(c === 'a') {
    return foundA3;
  }
  return start(c);
}

function foundA3(c) {
  if(c === 'b') {
    return foundB3;
  }
  return foundA(c); 
}

function foundB3(c) {
  if(c === 'x') {
    return foundX;
  }
  return foundB(c); 
}


function foundX(){
    return end;
}

function end() {
  return end;
}


console.log(match('abcababx113dde'));