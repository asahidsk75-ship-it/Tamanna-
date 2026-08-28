const screens = [...document.querySelectorAll(".screen")];
let current = 0;
let letterOpened = false;

function makeStars() {
  const box = document.getElementById("stars");
  for (let i = 0; i < 85; i++) {
    const s = document.createElement("span");
    s.className = "star" + (Math.random() > .72 ? " square" : "");
    s.style.left = Math.random() * 100 + "%";
    s.style.top = Math.random() * 100 + "%";
    s.style.setProperty("--d", (1.5 + Math.random() * 4) + "s");
    s.style.animationDelay = (-Math.random() * 4) + "s";
    s.style.opacity = .2 + Math.random() * .7;
    box.appendChild(s);
  }
}
makeStars();

function tapSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(620, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(920, ctx.currentTime + .09);
    gain.gain.setValueAtTime(.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(.045, ctx.currentTime + .01);
    gain.gain.exponentialRampToValueAtTime(.0001, ctx.currentTime + .13);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + .14);
  } catch(e) {}
}

function showScreen(next) {
  if (next < 0 || next >= screens.length || next === current) return;
  screens[current].classList.remove("active");
  screens[current].classList.add("exit");
  const old = current;
  current = next;
  setTimeout(() => screens[old].classList.remove("exit"), 800);
  screens[current].classList.add("active");
  tapSound();

  if (current === 5) celebrate();
}

function next() {
  if (current < screens.length - 1) showScreen(current + 1);
}

document.querySelectorAll("[data-next]").forEach(btn => {
  btn.addEventListener("click", e => {
    e.stopPropagation();
    next();
  });
});

// Click/tap anywhere on the simple screens.
document.addEventListener("click", e => {
  if (e.target.closest("button,.envelope,.letter")) return;
  if ([1,2].includes(current)) next();
});

const envelope = document.getElementById("openLetter");
envelope.addEventListener("click", e => {
  e.stopPropagation();
  if (!letterOpened) {
    letterOpened = true;
    envelope.classList.add("open");
    tapSound();
    setTimeout(() => showScreen(4), 1050);
  }
});

function celebrate() {
  for (let i = 0; i < 90; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw";
    c.style.setProperty("--x", (Math.random() * 260 - 130) + "px");
    c.style.setProperty("--fall", (2.5 + Math.random() * 2.8) + "s");
    c.style.background = ["#ffd27a","#ff91a4","#fff0df","#dca7ff","#9fe7df"][Math.floor(Math.random()*5)];
    c.style.transform = `rotate(${Math.random()*360}deg)`;
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 6000);
  }
  const toast = document.getElementById("toast");
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2500);
}

document.getElementById("replay").addEventListener("click", e => {
  e.stopPropagation();
  screens[current].classList.remove("active");
  current = 0;
  letterOpened = false;
  envelope.classList.remove("open");
  screens[0].classList.add("active");
  document.querySelectorAll(".confetti").forEach(x => x.remove());
});
