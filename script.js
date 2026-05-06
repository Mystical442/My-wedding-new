const menuButton = document.querySelector(".menu-btn");
const navLinks = document.querySelector(".nav-links");
const navAnchors = document.querySelectorAll(".nav-links a");

function closeMenu() {
  if (!menuButton || !navLinks) return;
  navLinks.classList.remove("active");
  menuButton.setAttribute("aria-expanded", "false");
}

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("active");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  navAnchors.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
}

const weddingDate = new Date("2026-10-10T12:00:00-04:00").getTime();
const countdownEl = document.getElementById("countdown");

function renderCountdown() {
  if (!countdownEl) return;

  const diff = weddingDate - Date.now();

  if (diff <= 0) {
    countdownEl.innerHTML = '<span class="wedding-day"><strong>Today</strong><em>Celebrate</em></span>';
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const units = [
    ["Days", days],
    ["Hours", hours],
    ["Minutes", minutes],
    ["Seconds", seconds],
  ];

  countdownEl.innerHTML = units
    .map(([label, value]) => `<span><strong>${String(value).padStart(label === "Days" ? 3 : 2, "0")}</strong><em>${label}</em></span>`)
    .join("");
}

renderCountdown();
setInterval(renderCountdown, 1000);

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const sections = [...document.querySelectorAll("main section[id]")];

if ("IntersectionObserver" in window && sections.length) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach((anchor) => {
          anchor.classList.toggle("active", anchor.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-42% 0px -48% 0px", threshold: 0.01 }
  );

  sections.forEach((section) => navObserver.observe(section));
}

document.querySelectorAll(".flip-card").forEach((card) => {
  card.addEventListener("click", () => {
    card.classList.toggle("is-flipped");
  });
});

const rsvpForm = document.getElementById("rsvp-form");
const formStatus = document.getElementById("form-status");

if (rsvpForm && formStatus) {
  rsvpForm.addEventListener("submit", async (event) => {
    if (!window.fetch) return;

    event.preventDefault();
    formStatus.textContent = "Sending RSVP...";

    try {
      const body = new URLSearchParams(new FormData(rsvpForm)).toString();
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      if (!response.ok) throw new Error("Submission failed");

      rsvpForm.reset();
      formStatus.textContent = "Thank you. Your RSVP has been received.";
    } catch (error) {
      formStatus.textContent = "Your RSVP could not be sent here. Please try again in a moment.";
    }
  });
}
