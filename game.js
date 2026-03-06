const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d", { alpha: false });
const message = document.getElementById("message");
const unlockCard = document.getElementById("unlock-card");
const unlockHeadline = document.getElementById("unlock-headline");
const unlockSummary = document.getElementById("unlock-summary");
const unlockMetric = document.getElementById("unlock-metric");
const unlockDetails = document.getElementById("unlock-details");
const unlockContinue = document.getElementById("unlock-continue");
const milestoneCard = document.getElementById("milestone-card");
const milestoneClose = document.getElementById("milestone-close");
const milestoneTitle = document.getElementById("milestone-title");
const milestoneCompanies = document.getElementById("milestone-companies");
const milestoneRole = document.getElementById("milestone-role");
const milestoneImpact = document.getElementById("milestone-impact");
const milestoneChallenge = document.getElementById("milestone-challenge");
const milestoneAction = document.getElementById("milestone-action");
const milestoneOutcome = document.getElementById("milestone-outcome");
const milestoneTechRow = document.getElementById("milestone-tech-row");
const milestoneTech = document.getElementById("milestone-tech");
const gameoverPanel = document.getElementById("gameover-panel");
const gameoverTitle = document.getElementById("gameover-title");
const gameoverYear = document.getElementById("gameover-year");
const gameoverStats = document.getElementById("gameover-stats");
const gameoverNote = document.getElementById("gameover-note");
const resumeBtn = document.getElementById("resume-btn");
const restartBtn = document.getElementById("restart-btn");
const quickRestartBtn = document.getElementById("quick-restart");
const skipPortfolioBtn = document.getElementById("skip-portfolio");
const portfolioScan = document.getElementById("portfolio-scan");
const portfolioCards = document.getElementById("portfolio-cards");
const closePortfolioBtn = document.getElementById("close-portfolio");

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
const UNLOCK_AUTO_DISMISS_TICKS = 600;
const DINO_SCALE = 3;
const DINO_X = 82;
const MILESTONE_SPAWN_LEAD_SCORE = Math.round((W + 70 - DINO_X) * 0.1);
const MILESTONES = [
  {
    year: "2020/2021",
    title: "Trajectory Shift",
    role: "Software Developer",
    challenge: "Mechanical track; software was the real pull.",
    action: "Pivoted with CS minor and shipping projects.",
    outcome: "Landed software role at Amadeus.",
    metric: "Career Pivot",
    summary: "Mechanical -> software pivot unlocked.",
    timelineYear: 2020.9,
    retryText: "CLEAR THE 2020/2021 PIVOT",
    companies: ["amadeus"],
  },
  {
    year: "Mid 2021",
    title: "Automation Impact",
    role: "QA Engineer",
    challenge: "Regression cycles were painfully manual.",
    action: "Built RobotFramework + Python + REST automation.",
    outcome: "Saved 30+ hours per cycle.",
    metric: "30+ hrs saved",
    summary: "Automation breakthrough at scale.",
    timelineYear: 2021.5,
    retryText: "CLEAR THE AUTOMATION IMPACT",
    tech: ["robotframework", "python", "restapi"],
    companies: ["amadeus"],
  },
  {
    year: "Early 2022",
    title: "Graduate Leap",
    role: "MSCS Student",
    challenge: "Needed deeper SW and ML depth.",
    action: "Started MSCS (Data Science focus) at UTD.",
    outcome: "Built stronger CS and ML foundations.",
    metric: "MSCS @ UTD",
    summary: "Graduate mission initiated.",
    timelineYear: 2022.15,
    retryText: "CLEAR THE GRADUATE LEAP",
    companies: ["utd"],
  },
  {
    year: "Early 2023",
    title: "Deep Learning Research",
    role: "Research Assistant",
    challenge: "First ML research on video learning data.",
    action: "Designed adaptive augmentation for ContSSL.",
    outcome: "Better accuracy with smaller storage footprint.",
    metric: "15% more accurate, 60% less storage",
    summary: "Research milestone: ContSSL gains.",
    timelineYear: 2023.2,
    retryText: "CLEAR THE RESEARCH MILESTONE",
    tech: ["python", "pytorch", "cuda"],
    companies: ["utd"],
  },
  {
    year: "Mid 2023",
    title: "Ericsson DevOps",
    role: "Integration Engineer Intern",
    challenge: "First deep dive into DevOps + networking.",
    action: "Optimized CI/CD upgrade and rollback paths.",
    outcome: "Safer deployments, faster rollback times.",
    metric: "40% improved Rollback speed",
    summary: "DevOps + networking impact delivered for 3+ clients.",
    timelineYear: 2023.5,
    retryText: "CLEAR THE ERICSSON DEVOPS INTERN MILESTONE",
    tech: ["python", "gitlab"],
    companies: ["ericsson"],
  },
  {
    year: "Early 2024",
    title: "HiredIn Tool",
    role: "Builder",
    challenge: "Recruiter outreach bottlenecked interviews.",
    action: "Built AI outreach + compatibility ranking web app.",
    outcome: "Higher callbacks via targeted conversations.",
    metric: "Callback rate up 30%",
    summary: "AI recruiting engine shipped.",
    timelineYear: 2024.35,
    retryText: "CLEAR THE AI RECRUITER APP MILESTONE",
    tech: ["selenium", "openai", "mysql"],
  },
  {
    year: "Mid 2024-2026",
    title: "Current Role Impact",
    role: "Integration Engineer",
    challenge: "Needed reliability across 5G core workflows.",
    action: "Built backup/restore, scanner, upgrades, dashboard.",
    outcome: "Safer ops, faster upgrades, clearer activation.",
    metric: "30% faster user onboarding",
    summary: "High impact across EIC and 5G core platform.",
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
let unlockPauseTicks = 0;
let unlockSummaryTicks = 0;
let unlockPulseTicks = 0;
let shakeTicks = 0;
let timelineSnapTicks = 0;
let lastTimelineYear = TIMELINE_START_YEAR;
let miniObstacleTimer = 140;
let miniObstacleBudget = 2;
let lastMiniSegment = 0;
let scanPreviousState = null;

const clouds = Array.from({ length: 4 }, (_, i) => ({
  x: 220 + i * 220,
  y: 30 + (i % 3) * 22,
  w: 46,
  h: 13,
  speed: 0.35 + i * 0.05,
}));

const skyline = Array.from({ length: 10 }, (_, i) => ({
  x: i * 120,
  w: 70 + (i % 3) * 20,
  h: 18 + (i % 4) * 10,
}));

const unlockParticles = [];
const obstacles = [];

function fmt(n) {
  return String(Math.floor(n)).padStart(5, "0");
}

function timelineInfo() {
  const yearSpan = Math.max(1, TIMELINE_END_YEAR - TIMELINE_START_YEAR);
  const totalTimelineScore = yearSpan * TIMELINE_SCORE_PER_YEAR;
  const progress = Math.max(0, Math.min(1, score / totalTimelineScore));
  const currentYear = Math.min(
    TIMELINE_END_YEAR,
    TIMELINE_START_YEAR + Math.floor(progress * yearSpan)
  );
  return { yearSpan, totalTimelineScore, progress, currentYear };
}

function impactScore(metric = "") {
  const matches = metric.match(/\d+(\.\d+)?/g);
  if (!matches || matches.length === 0) return 0;
  return Math.max(...matches.map((n) => Number(n)));
}

function topImpactMetrics(limit = 3) {
  return MILESTONES.map((m, idx) => ({
    metric: m.metric || "",
    score: impactScore(m.metric || ""),
    idx,
  }))
    .filter((x) => x.metric.length > 0)
    .sort((a, b) => b.score - a.score || b.idx - a.idx)
    .slice(0, limit)
    .map((x) => x.metric);
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

function updateSkyline() {
  for (const block of skyline) {
    block.x -= speed * 0.08;
    if (block.x + block.w < -20) {
      block.x = W + Math.random() * 90;
      block.h = 16 + Math.random() * 22;
    }
  }
}

function drawSkyline(colors) {
  ctx.fillStyle = colors.sub;
  for (const block of skyline) {
    ctx.fillRect(block.x, BASE_Y - 36 - block.h, block.w, block.h);
  }
}

function spawnUnlockBurst(x, y) {
  for (let i = 0; i < 22; i += 1) {
    unlockParticles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 4.8,
      vy: -Math.random() * 3.2 - 0.8,
      life: 36 + Math.random() * 20,
    });
  }
}

function updateUnlockParticles() {
  for (let i = unlockParticles.length - 1; i >= 0; i -= 1) {
    const p = unlockParticles[i];
    p.life -= 1;
    p.vy += 0.12;
    p.x += p.vx;
    p.y += p.vy;
    if (p.life <= 0) unlockParticles.splice(i, 1);
  }
}

function drawUnlockParticles(colors) {
  ctx.fillStyle = colors.ink;
  for (const p of unlockParticles) {
    const size = p.life > 20 ? 3 : 2;
    ctx.fillRect(p.x, p.y, size, size);
  }
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

function spawnMiniObstacle() {
  obstacles.push({
    type: "bird",
    x: W + 44,
    y: BASE_Y - 92,
    w: 30,
    h: 18,
  });
}

function drawObstacles(colors) {
  for (const o of obstacles) {
    if (o.type === "milestone") {
      drawMilestoneObstacle(o, colors.ink);
    } else if (o.type === "bird") {
      drawMiniObstacle(o, colors.ink);
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

function drawMiniObstacle(o, color) {
  ctx.fillStyle = color;
  const wingUp = Math.floor(tick / 8) % 2 === 0;
  ctx.fillRect(o.x + 6, o.y + 7, 18, 8);
  ctx.fillRect(o.x + 22, o.y + 9, 7, 4);
  if (wingUp) {
    ctx.fillRect(o.x + 10, o.y + 2, 10, 4);
  } else {
    ctx.fillRect(o.x + 10, o.y + 11, 10, 4);
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

function hideGameOverPanel() {
  gameoverPanel.hidden = true;
}

function showGameOverPanel(title, canResume, note = "") {
  gameoverTitle.textContent = title;
  const info = timelineInfo();
  const yearReached = info.currentYear;
  if (title === "JOURNEY COMPLETE") {
    gameoverYear.textContent = `Timeline Completed: ${TIMELINE_START_YEAR}-${TIMELINE_END_YEAR}`;
    gameoverStats.textContent = "I build reliable systems that scale, ship fast, and deliver measurable impact.";
  } else {
    gameoverYear.textContent = `Year Reached: ${yearReached}`;
    gameoverStats.textContent = `MILESTONES ${unlockedMilestones}/${TOTAL_MILESTONES}  •  SCORE ${fmt(score)}`;
  }
  gameoverStats.hidden = false;
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

function showUnlockCard(index) {
  const milestone = MILESTONES[index];
  unlockHeadline.textContent = milestone.title.toUpperCase();
  unlockSummary.textContent = milestone.summary || milestone.outcome;
  unlockMetric.textContent = milestone.metric || "MILESTONE UNLOCKED";
  unlockCard.hidden = false;
  unlockPauseTicks = UNLOCK_AUTO_DISMISS_TICKS;
  unlockSummaryTicks = 150;
  unlockPulseTicks = 22;
}

function hideUnlockCard() {
  unlockCard.hidden = true;
  unlockSummaryTicks = 0;
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

function buildTechPill(tech) {
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
  return pill;
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

function renderPortfolioScanCards() {
  portfolioCards.innerHTML = "";

  for (const milestone of MILESTONES) {
    const card = document.createElement("article");
    card.className = "scan-card";

    const head = document.createElement("header");
    head.className = "scan-head";

    const title = document.createElement("h3");
    title.className = "scan-title";
    title.textContent = `${milestone.year} - ${milestone.title}`;
    head.appendChild(title);

    const metric = document.createElement("span");
    metric.className = "scan-metric";
    metric.textContent = milestone.metric || "Impact";
    head.appendChild(metric);
    card.appendChild(head);

    const role = document.createElement("p");
    role.className = "scan-role";
    const companies = (milestone.companies || [])
      .map((c) => COMPANY_LABELS[c] || c)
      .join(" / ");
    role.textContent = companies ? `${milestone.role || "Role"} @ ${companies}` : milestone.role || "Role";
    card.appendChild(role);

    const problem = document.createElement("p");
    problem.className = "scan-line";
    problem.innerHTML = `<strong>Problem:</strong> ${milestone.challenge}`;
    card.appendChild(problem);

    const move = document.createElement("p");
    move.className = "scan-line";
    move.innerHTML = `<strong>Move:</strong> ${milestone.action}`;
    card.appendChild(move);

    const result = document.createElement("p");
    result.className = "scan-line";
    result.innerHTML = `<strong>Result:</strong> ${milestone.outcome}`;
    card.appendChild(result);

    if (Array.isArray(milestone.tech) && milestone.tech.length > 0) {
      const techRow = document.createElement("div");
      techRow.className = "milestone-tech scan-tech";
      for (const tech of milestone.tech) {
        techRow.appendChild(buildTechPill(tech));
      }
      card.appendChild(techRow);
    }

    portfolioCards.appendChild(card);
  }
}

function openPortfolioScan() {
  portfolioScan.hidden = false;
  if (state !== "scan") {
    scanPreviousState = state;
    state = "scan";
  }
}

function closePortfolioScan() {
  portfolioScan.hidden = true;
  if (state === "scan") {
    state = scanPreviousState || "idle";
  }
  scanPreviousState = null;
}

function openMilestoneCard() {
  if (activeMilestoneIndex < 0 || activeMilestoneIndex >= MILESTONES.length) return;
  const milestone = MILESTONES[activeMilestoneIndex];
  milestoneTitle.firstChild.textContent = `${milestone.year} - ${milestone.title} `;
  renderMilestoneCompanies(milestone.companies || []);
  milestoneRole.textContent = milestone.role || "Role";
  milestoneImpact.textContent = milestone.metric || "Impact";
  milestoneChallenge.textContent = milestone.challenge;
  milestoneAction.textContent = milestone.action;
  milestoneOutcome.textContent = milestone.outcome;
  renderMilestoneTech(milestone.tech || []);
  state = "milestone";
  milestoneCard.hidden = false;
  hideUnlockCard();
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
  hideUnlockCard();
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
  unlockPauseTicks = 0;
  unlockSummaryTicks = 0;
  unlockPulseTicks = 0;
  shakeTicks = 0;
  timelineSnapTicks = 0;
  lastTimelineYear = TIMELINE_START_YEAR;
  miniObstacleTimer = 140;
  miniObstacleBudget = 2;
  lastMiniSegment = 0;
  unlockParticles.length = 0;
  portfolioScan.hidden = true;
  scanPreviousState = null;
  milestoneCard.hidden = true;
  hideUnlockCard();
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
  showGameOverPanel(title, canResume, note);
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

  if (lastMiniSegment !== unlockedMilestones) {
    lastMiniSegment = unlockedMilestones;
    miniObstacleBudget = 2;
    miniObstacleTimer = 110 + Math.random() * 70;
  }

  miniObstacleTimer -= speed;
  const hasActiveMilestone = obstacles.some(
    (o) => o.type === "milestone" && o.milestoneIndex === unlockedMilestones
  );
  if (miniObstacleBudget > 0 && miniObstacleTimer <= 0 && !hasActiveMilestone) {
    spawnMiniObstacle();
    miniObstacleBudget -= 1;
    miniObstacleTimer = 170 + Math.random() * 120;
  }

  for (let i = obstacles.length - 1; i >= 0; i -= 1) {
    const o = obstacles[i];
    o.x -= speed;

    if (o.type === "milestone" && o.milestoneIndex === unlockedMilestones && o.x + o.w < dino.x - 6) {
      activeMilestoneIndex = o.milestoneIndex;
      unlockedMilestones += 1;
      milestoneCheckpoint = null;
      setMessage("", false);
      showUnlockCard(activeMilestoneIndex);
      spawnUnlockBurst(dino.x + 40, dino.y + 18);
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
    if (o.type === "bird") continue;

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
        shakeTicks = 16;
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
  const info = timelineInfo();
  const yearSpan = info.yearSpan;
  const progress = info.progress;
  const timelineX = 30;
  const timelineY = 44;
  const timelineW = W - 60;
  const timelineH = 6;
  const currentYear = info.currentYear;

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
      const snapBoost = timelineSnapTicks > 0 ? 6 : 0;
      const labelW = Math.max(34, label.length * 8 + 8) + snapBoost;
      ctx.fillStyle = colors.ink;
      ctx.fillRect(x - labelW / 2, timelineY - 24 - snapBoost * 0.3, labelW, 16 + snapBoost * 0.2);
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
  ctx.save();
  if (shakeTicks > 0) {
    const amp = Math.min(4, shakeTicks * 0.25);
    ctx.translate((Math.random() - 0.5) * amp, (Math.random() - 0.5) * amp);
  }
  ctx.fillStyle = colors.bg;
  ctx.fillRect(0, 0, W, H);

  drawNightDetails(colors);
  drawTimeline(colors);
  drawSkyline(colors);

  for (const c of clouds) {
    drawCloud(c, colors.cloud);
  }

  drawGround(colors);
  drawObstacles(colors);
  drawUnlockParticles(colors);

  const runFrame = Math.floor(tick / 6) % 2;
  const sprite = dino.jumping ? DINO_JUMP : runFrame === 0 ? DINO_RUN_1 : DINO_RUN_2;
  const blink = state !== "running" && tick % dino.blinkAt === 0;
  drawSprite(sprite, dino.x, dino.y, DINO_SCALE, colors.ink, !blink);

  drawHud(colors);
  ctx.restore();
}

function update() {
  if (shakeTicks > 0) shakeTicks -= 1;
  if (timelineSnapTicks > 0) timelineSnapTicks -= 1;
  if (unlockPulseTicks > 0) {
    unlockPulseTicks -= 1;
    const scale = 1 + unlockPulseTicks * 0.005;
    unlockCard.style.transform = `translateX(-50%) scale(${scale.toFixed(3)})`;
  } else {
    unlockCard.style.transform = "translateX(-50%) scale(1)";
  }
  updateUnlockParticles();

  if (state === "running" || state === "idle") {
    tick += 1;
  }

  if (state === "running") {
    speed = Math.min(MAX_SPEED, START_SPEED + score / 850);
    score += speed * 0.1;
    horizonOffset += speed;

    updateClouds();
    updateSkyline();
    updatePhysics();
    updateObstacles();

    if (detectCollision()) {
      gameOver();
    }

    if (Math.floor(score) > best) {
      best = Math.floor(score);
      localStorage.setItem("chrome-dino-best", String(best));
    }

    const info = timelineInfo();
    if (info.currentYear !== lastTimelineYear) {
      timelineSnapTicks = 16;
      lastTimelineYear = info.currentYear;
    }
    if (!journeyCompleted && unlockedMilestones === TOTAL_MILESTONES && score >= info.totalTimelineScore) {
      journeyCompleted = true;
      gameOver(
        "JOURNEY COMPLETE",
        false,
        "Thanks for being part of my journey. Let's build the next chapter together."
      );
      render();
      requestAnimationFrame(update);
      return;
    }
  } else if (state === "milestone_wait") {
    unlockPauseTicks -= 1;
    if (unlockPauseTicks <= 0) {
      resumeFromMilestoneWait();
    }
  } else if (state === "idle") {
    updateClouds();
    updateSkyline();
    horizonOffset += 1;
  }

  render();
  requestAnimationFrame(update);
}

window.addEventListener("keydown", (e) => {
  if (state === "scan") {
    if (e.code === "Escape") {
      e.preventDefault();
      closePortfolioScan();
    }
    return;
  }

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

canvas.addEventListener("pointerdown", (e) => {
  if (state === "scan" || state === "milestone" || state === "gameover") return;
  if (e.pointerType === "mouse" && e.button !== 0) return;
  e.preventDefault();
  jump();
});

unlockCard.addEventListener("pointerdown", (e) => {
  e.stopPropagation();
});

unlockDetails.addEventListener("click", () => {
  if (activeMilestoneIndex >= 0) {
    openMilestoneCard();
  }
});

unlockContinue.addEventListener("click", () => {
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

quickRestartBtn.addEventListener("click", () => {
  resetGame();
  startGame();
});

skipPortfolioBtn.addEventListener("click", () => {
  openPortfolioScan();
});

closePortfolioBtn.addEventListener("click", () => {
  closePortfolioScan();
});

resetGame();
renderPortfolioScanCards();
update();
