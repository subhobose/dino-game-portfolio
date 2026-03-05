const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d", { alpha: false });
const message = document.getElementById("message");
const milestoneBanner = document.getElementById("milestone-banner");
const milestoneCard = document.getElementById("milestone-card");
const milestoneClose = document.getElementById("milestone-close");
const milestoneTitle = document.getElementById("milestone-title");
const milestoneCompanies = document.getElementById("milestone-companies");
const milestoneChallenge = document.getElementById("milestone-challenge");
const milestoneAction = document.getElementById("milestone-action");
const milestoneOutcome = document.getElementById("milestone-outcome");
const milestoneTechRow = document.getElementById("milestone-tech-row");
const milestoneTech = document.getElementById("milestone-tech");
const gameoverPanel = document.getElementById("gameover-panel");
const gameoverTitle = document.getElementById("gameover-title");
const gameoverYear = document.getElementById("gameover-year");
const gameoverNote = document.getElementById("gameover-note");
const resumeBtn = document.getElementById("resume-btn");
const restartBtn = document.getElementById("restart-btn");

const W = canvas.width;
const H = canvas.height;
const BASE_Y = 250;
const GRAVITY = 0.72;
const JUMP_FORCE = -13.8;
const START_SPEED = 6.2;
const MAX_SPEED = 12.5;
const NIGHT_INTERVAL = 700;
const TIMELINE_START_YEAR = 2020;
const TIMELINE_END_YEAR = new Date().getFullYear();
const TIMELINE_SCORE_PER_YEAR = 220;
const DINO_SCALE = 3;
const DINO_X = 82;
const MILESTONE_SPAWN_LEAD_SCORE = Math.round((W + 70 - DINO_X) * 0.1);
const MILESTONES = [
  {
    year: "2020/2021",
    title: "Trajectory Shift",
    challenge: "Mechanical engineering path did not match what energized me most: writing software.",
    action: "Completed a CS minor, doubled down on coding projects, and built software fundamentals.",
    outcome: "Pivoted into tech and joined Amadeus as a Software Developer.",
    timelineYear: 2020.9,
    retryText: "CLEAR THE 2020/2021 PIVOT",
    companies: ["amadeus"],
  },
  {
    year: "Mid 2021",
    title: "Automation Impact",
    challenge: "Manual regression for a leading travel chatbot consumed large recurring effort.",
    action: "Built a Robot Framework based regression suite and introduced the approach to the team.",
    outcome: "Saved 30+ hours of manual work and inspired additional projects built on the same pattern.",
    timelineYear: 2021.5,
    retryText: "CLEAR THE AUTOMATION IMPACT",
    tech: ["robotframework", "python", "restapi"],
    companies: ["amadeus"],
  },
  {
    year: "Early 2022",
    title: "Graduate Leap",
    challenge: "Wanted deeper fundamentals and stronger depth in Data Structures and ML.",
    action: "Joined UTD for a Master's in Computer Science with a Data Science focus.",
    outcome: "Started formal advanced training to level up core CS rigor and ML capability.",
    timelineYear: 2022.15,
    retryText: "CLEAR THE GRADUATE LEAP",
    companies: ["utd"],
  },
  {
    year: "Early 2023",
    title: "Deep Learning Research",
    challenge: "First ML research stint on video learning data (Continuous self-supervised learning)",
    action: "Built an adaptive data augmentation strategy for streaming video dataset.",
    outcome: "Higher fine-tuning accuracy with lower storage footprint.",
    timelineYear: 2023.2,
    retryText: "CLEAR THE RESEARCH MILESTONE",
    tech: ["python", "pytorch", "cuda"],
    companies: ["utd"],
  },
  {
    year: "Mid 2023",
    title: "Ericsson DevOps",
    challenge: "First role in DevOps and networking as an Integration Engineer Intern at Ericsson.",
    action: "Used existing CI/CD knowledge to optimize release pipelines with Python on GitLab.",
    outcome: "Improved rollback timing and made deployments safer during integration cycles.",
    timelineYear: 2023.5,
    retryText: "CLEAR THE ERICSSON DEVOPS MILESTONE",
    tech: ["python", "gitlab"],
    companies: ["ericsson"],
  },
  {
    year: "Early 2024",
    title: "AI Recruiter Engine",
    challenge: "While preparing to graduate with my Master's, recruiter outreach was the key bottleneck to landing interviews.",
    action: "Built an AI-based LinkedIn automation web app to scrape recruiter data, send tailored invites quickly, run NLP replies on the user's behalf, and rank recruiters by compatibility.",
    outcome: "Increased callback rates through faster personalized outreach and smarter recruiter prioritization.",
    timelineYear: 2024.35,
    retryText: "CLEAR THE AI RECRUITER ENGINE",
    tech: ["selenium", "openai", "mysql"],
  },
  {
    year: "Mid 2024-2026",
    title: "Current Role Impact",
    challenge: "Built critical reliability and platform features across backup, security, and 5G operations.",
    action: "Developed backup/restore solutions, a Flask vulnerability scanning app, optimized CI/CD upgrade pipelines, and delivered a user activation dashboard for 5G core.",
    outcome: "Enabled safer operations, faster upgrades, and clearer activation visibility for core platform teams.",
    timelineYear: 2025.4,
    retryText: "CLEAR THE CURRENT ROLE MILESTONE",
    tech: ["python", "postgresql", "javascript"],
    companies: ["ericsson"],
  },
];
const TOTAL_MILESTONES = MILESTONES.length;

const TECH_ICON_URL = {
  python: "https://cdn.simpleicons.org/python",
  gitlab: "https://cdn.simpleicons.org/gitlab",
  selenium: "https://cdn.simpleicons.org/selenium",
  openai: "https://cdn.simpleicons.org/openai",
  mysql: "https://cdn.simpleicons.org/mysql",
  postgresql: "https://cdn.simpleicons.org/postgresql",
  javascript: "https://cdn.simpleicons.org/javascript",
  pytorch: "https://cdn.simpleicons.org/pytorch",
  cuda: "https://cdn.simpleicons.org/nvidia",
  robotframework: "https://cdn.simpleicons.org/robotframework",
};

const TECH_LABELS = {
  python: "Python",
  gitlab: "GitLab",
  selenium: "Selenium",
  openai: "OpenAI API",
  mysql: "MySQL",
  postgresql: "PostgreSQL",
  javascript: "JavaScript",
  pytorch: "PyTorch",
  cuda: "CUDA",
  robotframework: "Robot Framework",
  restapi: "REST API",
};

const COMPANY_ICON_URL = {
  ericsson: "https://cdn.simpleicons.org/ericsson",
};

const COMPANY_LABELS = {
  amadeus: "Amadeus",
  ericsson: "Ericsson",
  utd: "UTD",
};

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
  ".......###..........",
  "........##..........",
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
let horizonOffset = 0;
let unlockedMilestones = 0;
let activeMilestoneIndex = -1;
let milestoneCardViewed = [];
let milestoneCheckpoint = null;
let resumeSnapshot = null;
let resumeObstacle = null;
let journeyCompleted = false;

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

function spawnNextMilestone() {
  const nextIndex = unlockedMilestones;
  if (nextIndex >= MILESTONES.length) return;
  if (obstacles.some((o) => o.type === "milestone" && o.milestoneIndex === nextIndex)) return;
  const milestone = MILESTONES[nextIndex];
  const targetScore = Math.max(
    0,
    (milestone.timelineYear - TIMELINE_START_YEAR) * TIMELINE_SCORE_PER_YEAR
  );
  const spawnTriggerScore = Math.max(0, targetScore - MILESTONE_SPAWN_LEAD_SCORE);
  if (score < spawnTriggerScore) return;

  milestoneCheckpoint = {
    milestoneIndex: nextIndex,
    score,
    speed,
    tick,
    horizonOffset,
    dinoY: dino.y,
    dinoVy: dino.vy,
    dinoJumping: dino.jumping,
  };

  obstacles.push({
    type: "milestone",
    milestoneIndex: nextIndex,
    x: W + 70,
    y: BASE_Y - 56,
    w: 36,
    h: 56,
  });
}

function drawObstacles(colors) {
  for (const o of obstacles) {
    if (o.type === "milestone") {
      drawMilestoneObstacle(o, colors.ink);
    }
  }
}

function drawMilestoneObstacle(o, color) {
  ctx.fillStyle = color;
  ctx.fillRect(o.x + 8, o.y, 4, o.h);
  ctx.fillRect(o.x + 24, o.y, 4, o.h);
  ctx.fillRect(o.x + 8, o.y, 20, 4);
  ctx.fillRect(o.x + 12, o.y + 16, 12, 4);
  ctx.fillRect(o.x + 12, o.y + 30, 12, 4);
  ctx.fillRect(o.x + 12, o.y + 44, 12, 4);
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

function hideGameOverPanel() {
  gameoverPanel.hidden = true;
}

function showGameOverPanel(title, canResume, note = "") {
  gameoverTitle.textContent = title;
  const yearSpan = Math.max(1, TIMELINE_END_YEAR - TIMELINE_START_YEAR);
  const totalTimelineScore = yearSpan * TIMELINE_SCORE_PER_YEAR;
  const progress = Math.max(0, Math.min(1, score / totalTimelineScore));
  const yearReached = Math.min(
    TIMELINE_END_YEAR,
    TIMELINE_START_YEAR + Math.floor(progress * yearSpan)
  );
  gameoverYear.textContent = `Year Reached: ${yearReached}`;
  if (note) {
    gameoverNote.textContent = note;
    gameoverNote.hidden = false;
  } else {
    gameoverNote.textContent = "";
    gameoverNote.hidden = true;
  }
  resumeBtn.hidden = !canResume;
  gameoverPanel.hidden = false;
}

function showMilestoneBanner(index) {
  const milestone = MILESTONES[index];
  milestoneBanner.textContent = `MILESTONE UNLOCKED - ${milestone.year} ${milestone.title} (CLICK)`;
  milestoneBanner.hidden = false;
}

function hideMilestoneBanner() {
  milestoneBanner.hidden = true;
}

function renderMilestoneTech(techList = []) {
  milestoneTech.innerHTML = "";
  if (!Array.isArray(techList) || techList.length === 0) {
    milestoneTechRow.hidden = true;
    return;
  }

  for (const tech of techList) {
    const pill = document.createElement("span");
    pill.className = `tech-pill ${tech}`;

    const icon = document.createElement("span");
    if (TECH_ICON_URL[tech]) {
      const img = document.createElement("img");
      img.src = TECH_ICON_URL[tech];
      img.alt = "";
      img.width = 13;
      img.height = 13;
      img.loading = "lazy";
      icon.appendChild(img);
    } else {
      const fallback = document.createElement("span");
      fallback.className = "tech-dot";
      fallback.textContent = "{ }";
      icon.appendChild(fallback);
    }
    pill.appendChild(icon);

    const label = document.createElement("span");
    label.textContent = TECH_LABELS[tech] || tech;
    pill.appendChild(label);

    milestoneTech.appendChild(pill);
  }

  milestoneTechRow.hidden = false;
}

function renderMilestoneCompanies(companies = []) {
  milestoneCompanies.innerHTML = "";
  if (!Array.isArray(companies) || companies.length === 0) return;

  for (const company of companies) {
    const badge = document.createElement("span");
    badge.className = `company-pill ${company}`;
    badge.title = COMPANY_LABELS[company] || company;

    if (company === "amadeus") {
      const wordmark = document.createElement("span");
      wordmark.className = "company-wordmark amadeus";
      wordmark.textContent = "amadeus";
      badge.appendChild(wordmark);
    } else if (company === "utd") {
      const wordmark = document.createElement("span");
      wordmark.className = "company-wordmark utd-block";
      wordmark.textContent = "UTD";
      badge.appendChild(wordmark);
    } else if (COMPANY_ICON_URL[company]) {
      const img = document.createElement("img");
      img.src = COMPANY_ICON_URL[company];
      img.alt = "";
      img.width = 12;
      img.height = 12;
      img.loading = "lazy";
      badge.appendChild(img);
    } else {
      const monogram = document.createElement("span");
      monogram.className = "company-monogram";
      monogram.textContent = (COMPANY_LABELS[company] || company).slice(0, 3).toUpperCase();
      badge.appendChild(monogram);
    }

    if (company !== "amadeus" && company !== "utd") {
      const label = document.createElement("span");
      label.textContent = COMPANY_LABELS[company] || company;
      badge.appendChild(label);
    }

    milestoneCompanies.appendChild(badge);
  }
}

function openMilestoneCard() {
  if (activeMilestoneIndex < 0 || activeMilestoneIndex >= MILESTONES.length) return;
  const milestone = MILESTONES[activeMilestoneIndex];
  milestoneTitle.firstChild.textContent = `${milestone.year} - ${milestone.title} `;
  renderMilestoneCompanies(milestone.companies || []);
  milestoneChallenge.textContent = milestone.challenge;
  milestoneAction.textContent = milestone.action;
  milestoneOutcome.textContent = milestone.outcome;
  renderMilestoneTech(milestone.tech || []);
  state = "milestone";
  milestoneCard.hidden = false;
  hideMilestoneBanner();
}

function closeMilestoneCard() {
  milestoneCard.hidden = true;
  if (activeMilestoneIndex >= 0 && activeMilestoneIndex < milestoneCardViewed.length) {
    milestoneCardViewed[activeMilestoneIndex] = true;
  }
  if (state === "milestone") {
    state = "running";
  }
}

function resumeFromMilestoneWait() {
  if (state !== "milestone_wait") return;
  hideMilestoneBanner();
  state = "running";
}

function resumeFromGameOver() {
  if (!resumeSnapshot || !resumeObstacle) return;

  score = resumeSnapshot.score;
  speed = resumeSnapshot.speed;
  tick = resumeSnapshot.tick;
  horizonOffset = resumeSnapshot.horizonOffset;
  dino.y = resumeSnapshot.dinoY;
  dino.vy = resumeSnapshot.dinoVy;
  dino.jumping = resumeSnapshot.dinoJumping;
  resumeObstacle.x = dino.x + 500;

  hideGameOverPanel();
  setMessage("", false);
  state = "running";
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
  horizonOffset = 0;
  obstacles.length = 0;
  unlockedMilestones = 0;
  activeMilestoneIndex = -1;
  milestoneCardViewed = new Array(MILESTONES.length).fill(false);
  milestoneCheckpoint = null;
  resumeSnapshot = null;
  resumeObstacle = null;
  journeyCompleted = false;
  milestoneCard.hidden = true;
  hideMilestoneBanner();
  hideGameOverPanel();
  dino.vy = 0;
  dino.jumping = false;
  dino.y = BASE_Y - DINO_RUN_1.length * DINO_SCALE;
  dino.blinkAt = 120;
  setMessage("PRESS SPACE OR TAP TO START", true);
}

function gameOver(title = "Game Over", canResume = false, note = "") {
  state = "gameover";
  best = Math.max(best, Math.floor(score));
  localStorage.setItem("chrome-dino-best", String(best));
  setMessage("", false);
  showGameOverPanel("GAME OVER", canResume, note);
}

function jump() {
  if (state === "idle") startGame();
  if (state === "running" && !dino.jumping) {
    if (message.style.display !== "none") setMessage("", false);
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
  spawnNextMilestone();

  for (let i = obstacles.length - 1; i >= 0; i -= 1) {
    const o = obstacles[i];
    o.x -= speed;

    if (o.type === "milestone" && o.milestoneIndex === unlockedMilestones && o.x + o.w < dino.x - 6) {
      activeMilestoneIndex = o.milestoneIndex;
      unlockedMilestones += 1;
      milestoneCheckpoint = null;
      setMessage("", false);
      showMilestoneBanner(activeMilestoneIndex);
      state = "milestone_wait";
      obstacles.splice(i, 1);
      continue;
    }

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
    if (!intersects(d, box)) continue;

    if (o.type === "milestone" && o.milestoneIndex === unlockedMilestones) {
      if (milestoneCheckpoint && milestoneCheckpoint.milestoneIndex === o.milestoneIndex) {
        resumeSnapshot = milestoneCheckpoint;
        resumeObstacle = o;
        gameOver("GAME OVER", true);
        return false;
      }
    }

    return true;
  }
  return false;
}

function drawHud(colors) {
  ctx.fillStyle = colors.hud;
  ctx.font = "22px Courier New";
  ctx.textAlign = "right";
  ctx.textBaseline = "top";
  const hiText = `HI ${fmt(best)} ${fmt(score)}`;
  ctx.fillText(hiText, W - 20, H - 36);

  const unlockedCount = unlockedMilestones;
  ctx.fillStyle = colors.hud;
  ctx.font = "14px Courier New";
  ctx.textAlign = "left";
  ctx.fillText(`MILESTONES UNLOCKED ${unlockedCount}/${TOTAL_MILESTONES}`, 20, H - 28);
}

function drawTimeline(colors) {
  const yearSpan = Math.max(1, TIMELINE_END_YEAR - TIMELINE_START_YEAR);
  const totalTimelineScore = yearSpan * TIMELINE_SCORE_PER_YEAR;
  const progress = Math.max(0, Math.min(1, score / totalTimelineScore));
  const timelineX = 30;
  const timelineY = 44;
  const timelineW = W - 60;
  const timelineH = 6;
  const currentYear = Math.min(
    TIMELINE_END_YEAR,
    TIMELINE_START_YEAR + Math.floor(progress * yearSpan)
  );

  ctx.fillStyle = colors.sub;
  ctx.fillRect(timelineX, timelineY, timelineW, timelineH);

  ctx.fillStyle = colors.ink;
  ctx.fillRect(timelineX, timelineY, Math.max(2, timelineW * progress), timelineH);

  for (let year = TIMELINE_START_YEAR; year <= TIMELINE_END_YEAR; year += 1) {
    const t = (year - TIMELINE_START_YEAR) / yearSpan;
    const x = Math.round(timelineX + timelineW * t);
    const active = year <= currentYear;

    ctx.fillStyle = active ? colors.ink : colors.sub;
    ctx.fillRect(x, timelineY - 4, 1, timelineH + 8);

    ctx.font = "13px Courier New";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";

    if (year === currentYear) {
      const label = String(year);
      const labelW = Math.max(34, label.length * 8 + 8);
      ctx.fillStyle = colors.ink;
      ctx.fillRect(x - labelW / 2, timelineY - 24, labelW, 16);
      ctx.fillStyle = colors.bg;
      ctx.fillText(label, x, timelineY - 12);
    } else if (year % 2 === 1 || year === TIMELINE_END_YEAR || year === TIMELINE_START_YEAR) {
      ctx.fillStyle = active ? colors.ink : colors.hud;
      ctx.fillText(String(year), x, timelineY - 8);
    }
  }
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
  drawTimeline(colors);

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
  if (state === "running" || state === "idle") {
    tick += 1;
  }

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

    const yearSpan = Math.max(1, TIMELINE_END_YEAR - TIMELINE_START_YEAR);
    const totalTimelineScore = yearSpan * TIMELINE_SCORE_PER_YEAR;
    if (!journeyCompleted && unlockedMilestones === TOTAL_MILESTONES && score >= totalTimelineScore) {
      journeyCompleted = true;
      gameOver("GAME OVER", false, "Thanks for being a part of my journey.");
      render();
      requestAnimationFrame(update);
      return;
    }
  } else if (state === "idle") {
    updateClouds();
    horizonOffset += 1;
  }

  render();
  requestAnimationFrame(update);
}

window.addEventListener("keydown", (e) => {
  if (state === "gameover") {
    if (["Space", "Enter", "KeyC"].includes(e.code) && !resumeBtn.hidden) {
      e.preventDefault();
      resumeFromGameOver();
      return;
    }
    return;
  }

  if (state === "milestone_wait") {
    if (["Space", "ArrowUp", "KeyW"].includes(e.code)) {
      e.preventDefault();
      resumeFromMilestoneWait();
      jump();
    } else if (e.code === "Enter") {
      e.preventDefault();
      resumeFromMilestoneWait();
    }
    return;
  }

  if (state === "milestone") {
    if (["Space", "Enter", "Escape"].includes(e.code)) {
      e.preventDefault();
      closeMilestoneCard();
    }
    return;
  }

  if (["Space", "ArrowUp", "KeyW"].includes(e.code)) {
    e.preventDefault();
    jump();
    return;
  }
});

milestoneBanner.addEventListener("pointerdown", (e) => {
  e.stopPropagation();
});

milestoneBanner.addEventListener("click", () => {
  if (activeMilestoneIndex >= 0 && !milestoneCardViewed[activeMilestoneIndex]) {
    openMilestoneCard();
    return;
  }
  resumeFromMilestoneWait();
});

milestoneCard.addEventListener("pointerdown", (e) => {
  e.stopPropagation();
});

milestoneClose.addEventListener("click", () => {
  closeMilestoneCard();
});

resumeBtn.addEventListener("click", () => {
  resumeFromGameOver();
});

restartBtn.addEventListener("click", () => {
  resetGame();
  startGame();
});

window.addEventListener("pointerdown", (e) => {
  if (
    e.target.closest("#milestone-banner") ||
    e.target.closest("#milestone-card") ||
    e.target.closest("#gameover-panel")
  ) {
    return;
  }

  if (state === "gameover") {
    return;
  }

  if (state === "milestone_wait") {
    resumeFromMilestoneWait();
    jump();
    return;
  }

  if (state === "milestone") {
    return;
  }

  jump();
});

resetGame();
update();
