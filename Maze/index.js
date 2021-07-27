const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;

const cellsHorizontal = 5;
const cellsVertical = 5;
const width = window.innerWidth;
const height = window.innerHeight;

const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const engine = Engine.create();
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    wireframes: false,
    width: width,
    height: height,
  },
});
Render.run(render);

Runner.run(Runner.create(), engine);

// Walls
const walls = [
  Bodies.rectangle(width / 2 - 1, 0, width, 2, {
    isStatic: true,
  }),
  Bodies.rectangle(width / 2, height, width, 2, {
    isStatic: true,
  }),
  Bodies.rectangle(0, height / 2, 2, height, {
    isStatic: true,
  }),
  Bodies.rectangle(width, height / 2, 2, height, {
    isStatic: true,
  }),
];
World.add(world, walls);

// maze generation

const shuffle = (arr) => {
  let counter = arr.length;
  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);
    counter--;

    const tmp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = tmp;

    return arr;
  }
};

const grid = Array(cellsVertical)
  .fill()
  .map(() => Array(cellsHorizontal).fill(false));

const verticals = Array(cellsVertical)
  .fill()
  .map(() => Array(cellsHorizontal - 1).fill(false));

const horizontals = Array(cellsVertical - 1)
  .fill()
  .map(() => Array(cellsHorizontal).fill(false));

// console.log(grid, verticals, horizontals);

const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

// Recursively step through each cell
const stepThroughCell = (row, column) => {
  // If I have visited the cell at [row, column], the return
  if (grid[row][column]) {
    return;
  }

  // Mark this cell as being visited
  grid[row][column] = true;

  // Assemble randomly-ordered list of neighbours
  const neighbours = shuffle([
    [row - 1, column, "up"],
    [row, column + 1, "right"],
    [row + 1, column, "down"],
    [row, column - 1, "left"],
  ]);

  // For each neighbour....
  for (let neighbour of neighbours) {
    const [nextRow, nextColumn, direction] = neighbour;
    // See if that neighbour is out of bounds
    if (
      nextRow < 0 ||
      nextRow >= cellsVertical ||
      nextColumn < 0 ||
      nextColumn >= cellsHorizontal
    ) {
      continue;
    }

    // If we have visited that neighbour, continue to next neighbour
    if (grid[nextRow][nextColumn]) {
      continue;
    }

    // Remove a wall from either hori or ver
    if (direction === "left") {
      verticals[row][column - 1] = true;
    } else if (direction === "right") {
      verticals[row][column] = true;
    } else if (direction === "up") {
      horizontals[row - 1][column] = true;
    } else if (direction === "down") {
      horizontals[row][column] = true;
    }
    stepThroughCell(nextRow, nextColumn);
  }
  // Visit that next cell
};

// Init the maze
stepThroughCell(startRow, startColumn);

// Draw the horizontal walls
horizontals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }
    const horizontalWalls = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX / 2,
      rowIndex * unitLengthY + unitLengthY,
      unitLengthX,
      5,
      {
        label: "wall",
        isStatic: true,
        render: {
          fillStyle: "red",
        },
      }
    );
    World.add(world, horizontalWalls);
  });
});

// Draw the vertical walls
verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }
    const verticalsWalls = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX,
      rowIndex * unitLengthY + unitLengthY / 2,
      5,
      unitLengthY,
      {
        label: "wall",
        isStatic: true,
        render: {
          fillStyle: "red",
        },
      }
    );
    World.add(world, verticalsWalls);
  });
});

// Goal Square
const goal = Bodies.rectangle(
  width - unitLengthX / 2,
  height - unitLengthY / 2,
  unitLengthX * 0.7,
  unitLengthY * 0.7,
  {
    isStatic: true,
    label: "goal",
    render: {
      fillStyle: "green",
    },
  }
);
World.add(world, goal);

// Player ball
const ball = Bodies.circle(
  unitLengthX / 2,
  unitLengthY / 2,
  Math.min(unitLengthX, unitLengthY) / 4,
  {
    label: "player",
    render: {
      fillStyle: "blue",
    },
  }
);
World.add(world, ball);

document.addEventListener("keydown", (e) => {
  const { x, y } = ball.velocity;

  if (e.keyCode === 87 || e.keyCode === 38) {
    Body.setVelocity(ball, { x, y: y - 0.5 });
  }
  if (e.keyCode === 68 || e.keyCode === 39) {
    Body.setVelocity(ball, { x: x + 0.5, y });
  }
  if (e.keyCode === 83 || e.keyCode === 40) {
    Body.setVelocity(ball, { x, y: y + 0.5 });
  }
  if (e.keyCode === 65 || e.keyCode === 37) {
    Body.setVelocity(ball, { x: x - 0.5, y });
  }
});

// Win condition of the game
Events.on(engine, "collisionStart", (e) => {
  e.pairs.forEach((collision) => {
    const labels = ["player", "goal"];
    if (
      labels.includes(collision.bodyA.label) &&
      labels.includes(collision.bodyB.label)
    ) {
      document.querySelector(".winner").classList.remove("hidden");
      world.gravity.y = 1;
      world.bodies.forEach((body) => {
        if (body.label === "wall") {
          Body.setStatic(body, false);
        }
      });
    }
  });
});
