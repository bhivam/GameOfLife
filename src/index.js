function render(data) {
  const canvas = document.getElementsByTagName("canvas")[0];
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  const dataSize = data.length;
  const pixelSize = Math.floor(width / dataSize);

  // reset canvas
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, height, width);

  const drawPixel = (x, y) => {
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    ctx.stroke();
  };

  for (let y = 0; y < dataSize; y++) {
    for (let x = 0; x < dataSize; x++) {
      if (data[y][x]) {
        drawPixel(y, x);
      }
    }
  }
}

let SIZE = 100;

function createArray(randomize = false) {
  return Array(SIZE)
    .fill(1)
    .map(() => {
      return Array(SIZE)
        .fill(0)
        .map(() => {
          if (randomize) {
            return Math.round(Math.random());
          } else {
            return 0;
          }
        });
    });
}

let data = createArray(true);

function nextGeneration() {
  let newData = createArray();

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      let sum = liveCells(x, y);
      let isLive = data[y][x] === 1;
      if (isLive) {
        if (sum < 2 || sum > 3) {
          newData[y][x] = 0;
        } else {
          newData[y][x] = 1;
        }
      } else {
        if (sum === 3) {
          newData[y][x] = 1;
        } else {
          newData[y][x] = 0;
        }
      }
    }
  }

  data = newData;
}

function liveCells(x, y) {
  let neighborLocations = [
    [x, y + 1],
    [x + 1, y + 1],
    [x + 1, y],
    [x + 1, y - 1],
    [x, y - 1],
    [x - 1, y - 1],
    [x - 1, y],
    [x - 1, y + 1]
  ];

  let sum = 0;

  neighborLocations.forEach((location) => {
    let x = location[0];
    let y = location[1];

    if (data[y] !== undefined && data[y][x] !== undefined) {
      sum = sum + data[y][x];
    }
  });

  return sum;
}

// UI Functions

let isClear = true
let isPaused = true


function newBoard() {
  isClear = false
  pause()
  data = createArray(true)
  nextGeneration()
  render(data)
}

function clean() {
  isClear = true
  pause()
  render(createArray())
}

function play() {
  if (isClear) {
    alert("Create New Board")
  } else {
    isPaused = false
  }
}

function pause() {
  isPaused = true
}

function step() {
  pause()
  if (!isClear) {
    setTimeout(() => {
      nextGeneration()
      render(data)
    }, 200)
  }
}

setInterval(() => {
  if (!isPaused) {
    nextGeneration()
    render(data)
  }
}, 200)

