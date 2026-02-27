const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d", { alpha: false });
const message = document.getElementById("message");

const W = canvas.width;
const H = canvas.height;
const BASE_Y = 250;
const GRAVITY = 0.72;
const JUMP_FORCE = -13.8;
const START_SPEED = 6.2;
const MAX_SPEED = 12.5;
const NIGHT_INTERVAL = 700;
const BIRD_UNLOCK_SCORE = 380;

const DINO_SCALE = 3;
const DINO_X = 82;

const DINO_RUN_1 = [
  "............#######.",
  "............########",
  "............#.######",
  "............########",
  "............########",
  "............###.....",
  "............#######.",
  "#...........####....",
  "#...........####....",
  "##.........######...",
  "###.......#######...",
  "####.....#######....",
  "#######.#######.....",
  ".#############......",
  "..###########.......",
  "...#########........",
  "....#######.........",
  ".....#####..........",
  ".....###............",
  ".....##.............",
];

const DINO_RUN_2 = [
  "............#######.",
  "............########",
  "............#.######",
  "............########",
  "............########",
  "............###.....",
  "............#######.",
  "#...........####....",
  "#...........####....",
  "##.........######...",
  "###.......#######...",
  "####.....#######....",
  "#######.#######.....",
  ".#############......",
  "..###########.......",
  "...#########........",
  "....#######.........",
  ".....#####..........",
  ".........###........",
  "..........##........",
];

const DINO_JUMP = [
  "............#######.",
  "............########",
  "............#.######",
  "............########",
  "............########",
  "............###.....",
  "............#######.",
  "#...........####....",
  "#...........####....",
  "##.........######...",
  "###.......#######...",
  "####.....#######....",
  "#######.#######.....",
  ".#############......",
  "..###########.......",
  "...#########........",
  "....#######.........",
  ".....#####..........",
  ".....#...#..........",
  ".....##..##.........",
];

const dino = {
  x: DINO_X,
  y: BASE_Y,
  vy: 0,
  jumping: false,
  blinkAt: 0,
};

let state = "idle";
let speed = START_SPEED;
let score = 0;
let best = Number(localStorage.getItem("chrome-dino-best") || 0);
let tick = 0;
let obstacleTimer = 0;
let horizonOffset = 0;

const clouds = Array.from({ length: 4 }, (_, i) => ({
  x: 220 + i * 220,
  y: 30 + (i % 3) * 22,
  w: 46,
  h: 13,
  speed: 0.35 + i * 0.05,
}));

const obstacles = [];

function fmt(n) {
  return String(Math.floor(n)).padStart(5, "0");
}

function palette() {
  const night = Math.floor(score / NIGHT_INTERVAL) % 2 === 1;
  if (!night) {
    return {
      bg: "#f7f7f7",
      ink: "#535353",
      sub: "#d9d9d9",
      cloud: "#dfdfdf",
      hud: "#6e6e6e",
      night,
    };
  }

  return {
    bg: "#1f1f1f",
    ink: "#f2f2f2",
    sub: "#5f5f5f",
    cloud: "#3f3f3f",
    hud: "#d4d4d4",
    night,
  };
}

function drawSprite(sprite, x, y, scale, color, eyeOn = true) {
  ctx.fillStyle = color;
  for (let r = 0; r < sprite.length; r += 1) {
    const row = sprite[r];
    for (let c = 0; c < row.length; c += 1) {
      const v = row[c];
      if (v === ".") continue;
      const px = x + c * scale;
      const py = y + r * scale;
      ctx.fillRect(px, py, scale, scale);
    }
  }
}

function drawCloud(c, color) {
  ctx.fillStyle = color;
  ctx.fillRect(c.x, c.y + 3, c.w, c.h - 2);
  ctx.fillRect(c.x + 8, c.y - 2, c.w - 22, c.h);
  ctx.fillRect(c.x + 20, c.y + 1, c.w - 22, c.h);
}

function drawGround(colors) {
  ctx.fillStyle = colors.ink;
  ctx.fillRect(0, BASE_Y + 2, W, 3);

  ctx.fillStyle = colors.sub;
  const dashOffset = Math.floor(horizonOffset % 24);
  for (let x = -dashOffset; x < W; x += 24) {
    ctx.fillRect(x, BASE_Y + 9, 14, 2);
  }
}

function spawnObstacle() {
  if (score < 90 && obstacles.length > 0) return;

  const roll = Math.random();
  if (roll < 0.86 || score < BIRD_UNLOCK_SCORE) {
    const tall = Math.random() > 0.45;
    const multi = score > 500 && Math.random() > 0.82;
    const width = multi ? 44 : 20;
    const height = tall ? 48 : 36;
    obstacles.push({
      type: "cactus",
      x: W + 30,
      y: BASE_Y - height + 4,
      w: width,
      h: height,
    });
    return;
  }

  const high = Math.random() > 0.5;
  obstacles.push({
    type: "bird",
    x: W + 30,
    y: BASE_Y - (high ? 95 : 68),
    w: 44,
    h: 28,
    flap: 0,
  });
}

function drawCactus(o, color) {
  ctx.fillStyle = color;
  if (o.w > 24) {
    ctx.fillRect(o.x, o.y + 10, 14, o.h - 10);
    ctx.fillRect(o.x + 16, o.y, 14, o.h);
    ctx.fillRect(o.x + 32, o.y + 12, 12, o.h - 12);
    ctx.fillRect(o.x + 2, o.y + 18, 5, 10);
    ctx.fillRect(o.x + 35, o.y + 20, 5, 10);
    return;
  }

  ctx.fillRect(o.x + 6, o.y, 10, o.h);
  ctx.fillRect(o.x, o.y + 14, 6, 12);
  ctx.fillRect(o.x + 16, o.y + 10, 6, 12);
}

function drawBird(o, color) {
  o.flap += 1;
  const wingUp = o.flap % 20 < 10;

  ctx.fillStyle = color;
  ctx.fillRect(o.x + 8, o.y + 11, 24, 8);
  ctx.fillRect(o.x + 30, o.y + 13, 10, 4);
  if (wingUp) {
    ctx.fillRect(o.x + 13, o.y + 4, 14, 5);
  } else {
    ctx.fillRect(o.x + 13, o.y + 16, 14, 5);
  }
}

function drawObstacles(colors) {
  for (const o of obstacles) {
    if (o.type === "cactus") {
      drawCactus(o, colors.ink);
    } else {
      drawBird(o, colors.ink);
    }
  }
}

function dinoBounds() {
  const w = DINO_RUN_1[0].length * DINO_SCALE;
  const h = DINO_RUN_1.length * DINO_SCALE;
  return {
    x: dino.x + 9,
    y: dino.y + 4,
    w: w - 16,
    h: h - 4,
  };
}

function intersects(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function setMessage(text, visible) {
  message.textContent = text;
  message.style.display = visible ? "block" : "none";
}

function startGame() {
  state = "running";
  setMessage("", false);
}

function resetGame() {
  state = "idle";
  speed = START_SPEED;
  score = 0;
  tick = 0;
  obstacleTimer = 150;
  horizonOffset = 0;
  obstacles.length = 0;
  dino.vy = 0;
  dino.jumping = false;
  dino.y = BASE_Y - DINO_RUN_1.length * DINO_SCALE;
  dino.blinkAt = 120;
  setMessage("PRESS SPACE OR TAP TO START", true);
}

function gameOver() {
  state = "gameover";
  best = Math.max(best, Math.floor(score));
  localStorage.setItem("chrome-dino-best", String(best));
  setMessage("GAME OVER - PRESS R OR TAP", true);
}

function jump() {
  if (state === "idle") startGame();
  if (state === "running" && !dino.jumping) {
    dino.vy = JUMP_FORCE;
    dino.jumping = true;
  }
}

function updatePhysics() {
  dino.vy += GRAVITY;
  dino.y += dino.vy;

  const floor = BASE_Y - DINO_RUN_1.length * DINO_SCALE;
  if (dino.y >= floor) {
    dino.y = floor;
    dino.vy = 0;
    dino.jumping = false;
  }
}

function updateObstacles() {
  obstacleTimer -= speed;
  if (obstacleTimer <= 0) {
    spawnObstacle();
    obstacleTimer = Math.max(150, 230 + Math.random() * 170 - speed * 3);
  }

  for (let i = obstacles.length - 1; i >= 0; i -= 1) {
    const o = obstacles[i];
    o.x -= speed;
    if (o.x + o.w < -40) obstacles.splice(i, 1);
  }
}

function updateClouds() {
  for (const c of clouds) {
    c.x -= c.speed + speed * 0.02;
    if (c.x + c.w < -30) {
      c.x = W + Math.random() * 140;
      c.y = 24 + Math.random() * 64;
    }
  }
}

function detectCollision() {
  const d = dinoBounds();
  for (const o of obstacles) {
    const box = {
      x: o.x + 4,
      y: o.y + 3,
      w: o.w - 8,
      h: o.h - 6,
    };
    if (intersects(d, box)) return true;
  }
  return false;
}

function drawHud(colors) {
  ctx.fillStyle = colors.hud;
  ctx.font = "22px Courier New";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  const hiText = `HI ${fmt(best)} ${fmt(score)}`;
  ctx.fillText(hiText, W - 20, 14);
}

function drawNightDetails(colors) {
  if (!colors.night) return;
  ctx.fillStyle = colors.ink;
  ctx.beginPath();
  ctx.arc(W - 80, 56, 16, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = colors.bg;
  ctx.beginPath();
  ctx.arc(W - 72, 52, 14, 0, Math.PI * 2);
  ctx.fill();
}

function render() {
  const colors = palette();
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, W, H);

  drawNightDetails(colors);

  for (const c of clouds) {
    drawCloud(c, colors.cloud);
  }

  drawGround(colors);
  drawObstacles(colors);

  const runFrame = Math.floor(tick / 6) % 2;
  const sprite = dino.jumping ? DINO_JUMP : runFrame === 0 ? DINO_RUN_1 : DINO_RUN_2;
  const blink = state !== "running" && tick % dino.blinkAt === 0;
  drawSprite(sprite, dino.x, dino.y, DINO_SCALE, colors.ink, !blink);

  drawHud(colors);
}

function update() {
  tick += 1;

  if (state === "running") {
    speed = Math.min(MAX_SPEED, START_SPEED + score / 850);
    score += speed * 0.1;
    horizonOffset += speed;

    updateClouds();
    updatePhysics();
    updateObstacles();

    if (detectCollision()) {
      gameOver();
    }

    if (Math.floor(score) > best) {
      best = Math.floor(score);
      localStorage.setItem("chrome-dino-best", String(best));
    }
  } else {
    updateClouds();
    horizonOffset += 1;
  }

  render();
  requestAnimationFrame(update);
}

window.addEventListener("keydown", (e) => {
  if (["Space", "ArrowUp", "KeyW"].includes(e.code)) {
    e.preventDefault();
    if (state === "gameover") {
      resetGame();
      startGame();
      jump();
      return;
    }
    jump();
    return;
  }

  if (e.code === "KeyR" && state === "gameover") {
    resetGame();
    startGame();
  }
});

window.addEventListener("pointerdown", () => {
  if (state === "gameover") {
    resetGame();
    startGame();
    jump();
    return;
  }
  jump();
});

resetGame();
update();
