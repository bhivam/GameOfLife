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
    let color = data[y][x].map((num) => num.toString(16));
    color = "#" + color.join("").toUpperCase();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
    ctx.stroke();
  };

  for (let y = 0; y < dataSize; y++) {
    for (let x = 0; x < dataSize; x++) {
      drawPixel(y, x);
    }
  }
}

function arrayEquals(a, b) {
  return (
    Array.isArray(a) &&
    Array.isArray(b) &&
    a.length === b.length &&
    a.every((val, index) => val === b[index])
  );
}

function randColor() {
  return Array(6)
    .fill(0)
    .map(() => {
      return Math.floor(Math.random() * 16);
    });
}

let size = 100;

function createArray(randomize = false) {
  return Array(size)
    .fill(1)
    .map(() => {
      return Array(size)
        .fill(0)
        .map(() => {
          if (randomize) {
            if (Math.random() > 0.6) return randColor();
            else return [15, 15, 15, 15, 15, 15];
          } else {
            return [15, 15, 15, 15, 15, 15];
          }
        });
    });
}

let data = createArray(true);

function nextGeneration() {
  let newData = createArray();

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let sum = liveCells(x, y);
      let isLive = !arrayEquals(data[y][x], [15, 15, 15, 15, 15, 15]);
      if (isLive) {
        if (sum < 2 || sum > 3) {
          newData[y][x] = [15, 15, 15, 15, 15, 15];
        } else {
          newData[y][x] = data[y][x];
        }
      } else {
        if (sum === 3) {
          newData[y][x] = avgColor(x, y);
        } else {
          newData[y][x] = [15, 15, 15, 15, 15, 15];
        }
      }
    }
  }

  data = newData;
}

function avgColor(x, y) {
  let neighborLocations = [
    [x, y + 1],
    [x + 1, y + 1],
    [x + 1, y],
    [x + 1, y - 1],
    [x, y - 1],
    [x - 1, y - 1],
    [x - 1, y],
    [x - 1, y + 1],
  ];

  let sum = 0;
  let color = [0, 0, 0, 0, 0, 0];

  neighborLocations.forEach((location) => {
    let x = location[0];
    let y = location[1];

    if (
      data[y] !== undefined &&
      data[y][x] !== undefined &&
      !arrayEquals(data[y][x], [15, 15, 15, 15, 15, 15])
    ) {
      sum = sum + 1;
      for (let i = 0; i < 6; i++) {
        color[i] = color[i] + data[y][x][i];
      }
    }
  });

  for (let i = 0; i < 6; i++) {
    color[i] = Math.round(color[i] / sum);
  }

  return color;
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
    [x - 1, y + 1],
  ];
  let sum = 0;

  neighborLocations.forEach((location) => {
    let x = location[0];
    let y = location[1];

    if (
      data[y] !== undefined &&
      data[y][x] !== undefined &&
      !arrayEquals(data[y][x], [15, 15, 15, 15, 15, 15])
    ) {
      sum = sum + 1;
    }
  });

  return sum;
}

// UI Functions

let isClear = true;
let isPaused = true;

function newBoard() {
  isClear = false;
  pause();
  data = createArray(true);
  render(data);
}

function clean() {
  isClear = true;
  pause();
  render(createArray());
}

function play() {
  if (isClear) {
    alert("Reset the board to play the simulation.");
  } else {
    isPaused = false;
  }
}

function pause() {
  isPaused = true;
}

function step() {
  pause();
  if (!isClear) {
    nextGeneration();
    render(data);
  }
}

function changeSize(sliderSize) {
  size = sliderSize * 10;
  const canvas = document.getElementsByTagName("canvas")[0];
  canvas.width = size;
  canvas.height = size;
  newBoard();
}

let speed = 500;

function changeSpeed(sliderSpeed) {
  speed = 500 - (sliderSpeed - 5) * 100;
}

var loop = function () {
  if (!isPaused) {
    nextGeneration();
    render(data);
  }
  setTimeout(loop, speed);
};

setTimeout(loop, speed);
