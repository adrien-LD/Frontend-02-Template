const root = document.getElementById('root');
const saveBtn = document.getElementById('savebtn');
const clearBtn = document.getElementById('clear');
let spans = [];
saveBtn.addEventListener('click', function () {
  onSave();
});

clearBtn.addEventListener('click', function() {
  onClear();
})

function onSave() {
  localStorage.setItem('map', JSON.stringify(map));
}

function onClear() {
  localStorage.clear();
  location.reload();
}

// 监听鼠标按下事件，判断是否画地图
let flag = 1;
window.addEventListener('mousedown', () => {
  flag = 2;
});

window.addEventListener('mouseup', () => {
  flag = 1;
});

// 初始化地图
const map = localStorage['map']
  ? JSON.parse(localStorage.getItem('map'))
  : new Array(10000).fill(0);

function init() {
  for (let i = 0; i < 100; i++) {
    for (let j = 0; j < 100; j++) {
      const span = document.createElement('span');
      if (map[i * 100 + j] === 1) {
        span.style.backgroundColor = '#000000';
      }
      span.addEventListener('mousemove', function () {
        if (flag === 2) {
          onMove(span, i, j);
        }
      });
      span.className = 'span';
      root.appendChild(span);
    }
  }
  spans = document.getElementsByTagName('span');
}

function onMove(element, i, j) {
  element.style.backgroundColor = '#000000';
  map[i * 100 + j] = 1;
}

function sleep(t) {
  return new Promise((reslove, reject) => {
    setTimeout(() => {
      reslove();
    }, t);
  });
}

// 广度优先搜索实现寻路
async function getPath(start, end) {
  spans[end.x * 100 + end.y].style.backgroundColor = 'blue';
  const quene = [start];

  function insert(point) {
    console.log(111, point);
    console.log(map[point.x * 100 + point.y]);
    if (point.x < 0 || point.y < 0) {
      return;
    }

    if (point.x > 100 || point.y > 100) {
      return;
    }

    if (
      map[point.x * 100 + point.y] === 1 ||
      map[point.x * 100 + point.y] === 2
    ) {
      return;
    }
    quene.push(point);
    map[point.x * 100 + point.y] = 2;
  }

  async function path() {
    const point = quene.shift();
    if (point.x === end.x && point.y === end.y) {
      return true;
    }

    spans[point.x * 100 + point.y].style.backgroundColor = 'green';
    await sleep(30);

    insert({ x: point.x - 1, y: point.y });
    insert({ x: point.x, y: point.y - 1 });
    insert({ x: point.x, y: point.y + 1 });
    insert({ x: point.x + 1, y: point.y });
    path();
  }

  await path();
}

// 启发式搜多
class Sorted {
  constructor(data, compare) {
    this.data = data;
    this.compare = compare || ((a, b) => a - b);
  }

  take() {
    if (!this.data.length) {
      return;
    }
    let min = this.data[0];
    let minIndex = 0;

    for (let i = 0; i < this.data.length; i++) {
      if (this.compare(this.data[i], min) <= 0) {
        min = this.data[i];
        minIndex = i;
      }
    }

    this.data[minIndex] = this.data[this.data.length - 1];
    this.data.pop();
    return min;
  }

  give(v) {
    this.data.push(v);
  }
}

async function findPath(start, end) {
  if (map[end.x * 100 + end.y] === 1) return false;

  const table = Object.create(map);
  spans[end.x * 100 + end.y].style.backgroundColor = 'blue';
  const quene = new Sorted([start], (a, b) => distance(a) - distance(b));

  function distance(point) {
    return (point.x - end.x) ** 2 + (point.y - end.y) ** 2;
  }

  function insert(point) {
    if (point.x < 0 || point.y < 0) {
      return;
    }

    if (point.x > 100 || point.y > 100) {
      return;
    }

    if (
      table[point.x * 100 + point.y] === 1 ||
      table[point.x * 100 + point.y] === 2
    ) {
      return;
    }
    quene.give(point);
    table[point.x * 100 + point.y] = 2;
  }

  while (quene.data.length) {
    const point = quene.take();
    if (point.x === end.x && point.y === end.y) {
      console.log(11111);
      return true;
    }

    spans[point.x * 100 + point.y].style.backgroundColor = 'green';
    await sleep(30);

    insert({ x: point.x - 1, y: point.y });
    insert({ x: point.x, y: point.y - 1 });
    insert({ x: point.x, y: point.y + 1 });
    insert({ x: point.x + 1, y: point.y });
  }
}

init();