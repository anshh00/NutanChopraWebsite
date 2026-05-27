const items = Array.from(document.querySelectorAll(".gallery-item"));
const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxCaption = lightbox.querySelector("figcaption");
const closeButton = lightbox.querySelector(".lightbox-close");
const prevButton = lightbox.querySelector(".lightbox-prev");
const nextButton = lightbox.querySelector(".lightbox-next");
const contactForm = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");
let currentIndex = 0;
const routes = ["home", "work", "social-goss", "about", "contact"];

function currentRoute() {
  const route = window.location.hash.replace("#", "").toLowerCase();
  return routes.includes(route) ? route : "home";
}

function showSection(route) {
  document.querySelectorAll(".page-section").forEach((section) => {
    section.classList.toggle("active", section.dataset.route === route);
  });

  document.querySelectorAll("[data-nav]").forEach((link) => {
    link.classList.toggle("active", link.dataset.nav === route);
  });

  const pageTitle = route
    .split("-")
    .map((word) => `${word[0].toUpperCase()}${word.slice(1)}`)
    .join(" ");
  document.title = route === "home" ? "Nutan Chopra" : `Nutan Chopra - ${pageTitle}`;
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

function showImage(index) {
  currentIndex = (index + items.length) % items.length;
  const item = items[currentIndex];
  lightboxImage.src = item.dataset.image;
  lightboxImage.alt = item.querySelector("img").alt;
  lightboxCaption.textContent = item.dataset.caption || "";
}

function openLightbox(index) {
  showImage(index);
  lightbox.classList.add("visible");
  lightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("visible");
  lightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

items.forEach((item, index) => {
  item.addEventListener("click", () => openLightbox(index));
});

closeButton.addEventListener("click", closeLightbox);
prevButton.addEventListener("click", () => showImage(currentIndex - 1));
nextButton.addEventListener("click", () => showImage(currentIndex + 1));

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (!lightbox.classList.contains("visible")) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    showImage(currentIndex - 1);
  }

  if (event.key === "ArrowRight") {
    showImage(currentIndex + 1);
  }
});

window.addEventListener("hashchange", () => showSection(currentRoute()));
showSection(currentRoute());

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const formData = new FormData(contactForm);

    formStatus.textContent = "Sending...";
    submitButton.disabled = true;

    try {
      const response = await fetch(contactForm.action, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error("Form submission failed");
      }

      contactForm.reset();
      formStatus.textContent = "Thank you. Your message has been sent.";
    } catch (error) {
      formStatus.textContent = "Sorry, the message could not be sent. Please try again.";
    } finally {
      submitButton.disabled = false;
    }
  });
}
