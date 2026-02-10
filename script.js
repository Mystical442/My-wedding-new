// MOBILE MENU
function toggleMenu() {
  document.querySelector(".nav-links").classList.toggle("active");
}

// SLIDESHOW
let slideIndex = 0;
showSlides();

function showSlides() {
  const slides = document.getElementsByClassName("slide");
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }

  if (slides.length > 0) {
    slides[slideIndex - 1].style.display = "block";
  }

  setTimeout(showSlides, 3500);
}

// COUNTDOWN TIMER
const weddingDate = new Date("October 10, 2026 12:00:00").getTime();
const countdownEl = document.getElementById("countdown");

if (countdownEl) {
  setInterval(() => {
    const now = new Date().getTime();
    const diff = weddingDate - now;

    if (diff <= 0) {
      countdownEl.innerHTML = "Today is the big day!";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    countdownEl.innerHTML = `${days} Days • ${hours} Hrs • ${minutes} Min • ${seconds} Sec`;
  }, 1000);
}

