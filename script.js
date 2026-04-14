const btn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

const stageImg = document.getElementById("stageImg");
const videoLayer = document.getElementById("videoLayer");
const message = document.getElementById("message");
const img = document.getElementById("toshiImg");
const flash = document.getElementById("flash");

const cutin = document.getElementById("cutin");
const pushBtn = document.getElementById("pushBtn");

let isKakuhen = false;
let stopFlag = false;
let chainCount = 0;
let pushCount = 0;
let spinInterval;

// =====================
btn.addEventListener("click", () => {
  stopFlag = false;
  startSpin();
});

stopBtn.addEventListener("click", () => {
  stopFlag = true;
  message.textContent = "STOP受付中…";
});

// =====================
// メイン演出
// =====================
function startSpin() {

  pushBtn.style.display = "none";
  stageImg.src = "happy.png";
  videoLayer.innerHTML = "";

  message.textContent = "変動中！！！";
  message.className = "message";

  const frames = [
    "nomal135.png",
    "nomal22.png",
    "nomal66.png",
    "aisyu777.png"
  ];

  let i = 0;

  spinInterval = setInterval(() => {
    img.src = frames[i % frames.length];
    i++;
  }, 100);

  flashEffect();

  const rank = getRank();

  setTimeout(() => {

    clearInterval(spinInterval);

    showRank(rank);
    changeImage(rank);

    if (rank === "hot" || rank === "guarantee") {
      document.body.classList.add("shake");
    }

    reachStage(rank)
      .then(() => cutinStage(rank))
      .then(() => buttonStage(rank))
      .then((forceHit) => judge(rank, forceHit));

  }, 1500);
}

// =====================
function getRank() {
  const r = Math.random();
  if (r < 0.5) return "normal";
  if (r < 0.75) return "chance";
  if (r < 0.85) return "hot";
  return "guarantee";
}

// =====================
function showRank(rank) {
  const texts = {
    normal: "...",
    chance: "CHANCE",
    hot: "激アツ",
    guarantee: "大当たり確定"
  };

  message.textContent = texts[rank];
  message.className = "message " + rank;
}

// =====================
function reachStage(rank) {
  return new Promise(resolve => {

    const images = {
      chance: "dakishimete.webp",
      hot: "pose.jpg",
      guarantee: "ai.jpg"
    };

    if (images[rank]) {
      stageImg.src = images[rank];
      videoLayer.innerHTML = "";
    }

    setTimeout(resolve, 1500);
  });
}

// =====================
function cutinStage(rank) {
  return new Promise(resolve => {

    if (rank === "hot" || rank === "guarantee") {
      cutin.style.display = "block";

      setTimeout(() => {
        cutin.style.display = "none";
        resolve();
      }, 1200);

    } else {
      resolve();
    }
  });
}

// =====================
function buttonStage(rank) {
  return new Promise(resolve => {

    if (rank === "chance" || rank === "hot") {

      pushBtn.style.display = "inline-block";
      pushCount = 0;

      message.textContent = "連打しろ！！！";

      const clickHandler = () => {
        pushCount++;
        message.textContent = "連打：" + pushCount;
      };

      pushBtn.addEventListener("click", clickHandler);

      setTimeout(() => {
        pushBtn.style.display = "none";
        pushBtn.removeEventListener("click", clickHandler);

        resolve(pushCount > 10);
      }, 2000);

    } else {
      resolve(false);
    }
  });
}

// =====================
function judge(rank, forceHit) {

  let probability = isKakuhen ? 0.7 : 0.3;

  if (rank === "chance") probability += 0.2;
  if (rank === "hot") probability += 0.5;
  if (rank === "guarantee") probability = 1;

  let hit = Math.random() < probability;
  if (forceHit) hit = true;

  document.body.classList.remove("shake");

  if (hit) {
    bigHit();
  } else {
    if (Math.random() < 0.3) {
      revive();
    } else {
      miss();
    }
  }
}

// =====================
function miss() {
  stageImg.src = "hazure.png";
  videoLayer.innerHTML = "";
  message.textContent = "…ハズレ";
  isKakuhen = false;
}

// =====================
function revive() {

  stageImg.src = "hazure.png";
  videoLayer.innerHTML = "";
  message.textContent = "………";

  setTimeout(() => {
    message.textContent = "まだ終わらない…！";
    flashEffect();

    setTimeout(bigHit, 1000);

  }, 1500);
}

// =====================
function bigHit() {

  chainCount++;

  const videos = ["hit1.mp4", "hit2.mp4", "hit3.mp4"];
  const v = videos[Math.floor(Math.random() * videos.length)];

  videoLayer.innerHTML = `
  <video autoplay muted>
    <source src="${v}">
  </video>
`;
  stageImg.src = "";

  message.textContent = "愛だけあればZONE突入";
  isKakuhen = true;

  setTimeout(() => {
    if (!stopFlag) startSpin();
    else endZone();
  }, 4000);
}

// =====================
function endZone() {
  isKakuhen = false;
  message.textContent = "愛だけがあればZONE終了…";
  stageImg.src = "hazure.png";
  videoLayer.innerHTML = "";
}

// =====================
function changeImage(rank) {
  const images = {
    normal: "nomal66.png",
    chance: "nomal22.png",
    hot: "pato.gif",
    guarantee: "aisyu777.png"
  };

  img.src = images[rank];

  if (rank === "hot") {
  img.style.transform = "scale(0.7)";
} else {
  img.style.transform = "scale(1)";
}
}

// =====================
function flashEffect() {
  flash.style.opacity = 1;
  setTimeout(() => flash.style.opacity = 0, 100);
}


// =========主役からのメッセージ============
document.addEventListener("DOMContentLoaded", () => {

  const againBtn = document.getElementById("againBtn");
  const finalMessage = document.getElementById("finalMessage");
  const ending = document.querySelector(".ending");

  againBtn.addEventListener("click", () => {
    finalMessage.classList.add("show");
    ending.classList.add("gold");
  });

});
// =========主役からのメッセージ　ここまで============