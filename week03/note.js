var a = 2;

(function () {
  try {
    a = 1;
    return;
    let a = 1;
  } catch (e) {
    console.log(e.message);
  }
})();

console.log(a);

const b = 1;

function test() {
  console.log(b);
  const b = 2;
}

test(); // Cannot access 'a' before initialization

let b = 1;

function test1() {
  console.log(b);
  let b = 2;
}

test1(); // Cannot access 'a' before initializationconst b = 1;

class c {d = 1};
function test2() {
  console.log(c);
  class c {};
}

test2(); // Cannot access 'a' before initialization