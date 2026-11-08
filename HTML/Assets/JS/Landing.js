const authModal = document.getElementById("auth-modal");
const authForm = document.getElementById("auth-form");
const authModeLabel = document.getElementById("auth-mode-label");
const formTitle = document.getElementById("form-title");
const formDescription = document.getElementById("form-description");
const submitLabel = document.getElementById("auth-submit-label");
const switchPrompt = document.getElementById("auth-switch-prompt");
const switchButton = document.getElementById("auth-switch-button");
const authNotice = document.getElementById("auth-notice");
const passwordInput = document.getElementById("auth-password");
const confirmPasswordInput = document.getElementById("auth-confirm-password");
const nameInput = document.getElementById("auth-name");
const forgotPassword = document.getElementById("forgot-password");
const mobileMenu = document.getElementById("mobile-nav");
const menuToggle = document.getElementById("menu-toggle");
let authMode = "login";
let previouslyFocusedElement = null;

const particleCanvas = document.getElementById("hero-particles");
const particleContext = particleCanvas.getContext("2d");
const reduceParticleMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let particles = [];
let particleFrame = 0;
let particleWidth = 0;
let particleHeight = 0;
let lastParticleFrame = 0;

function createParticles() {
  const width = particleWidth;
  const height = particleHeight;
  const spacing = width < 720 ? 12 : 10;
  const clusters = [
    { x: 0.04, y: 0.14, rx: 0.085, ry: 0.12 },
    { x: 0.27, y: 0.24, rx: 0.07, ry: 0.1 },
    { x: 0.52, y: 0.12, rx: 0.08, ry: 0.11 },
    { x: 0.9, y: 0.19, rx: 0.085, ry: 0.13 },
    { x: 0.08, y: 0.62, rx: 0.08, ry: 0.12 },
    { x: 0.91, y: 0.64, rx: 0.08, ry: 0.12 },
    { x: 0.3, y: 0.88, rx: 0.07, ry: 0.08 },
    { x: 0.72, y: 0.88, rx: 0.075, ry: 0.08 },
  ];
  let seed = 41;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  particles = [];
  clusters.forEach((cluster, clusterIndex) => {
    const radiusX = Math.max(34, width * cluster.rx);
    const radiusY = Math.max(27, height * cluster.ry);
    const centerX = width * cluster.x;
    const centerY = height * cluster.y;

    for (let y = -radiusY; y <= radiusY; y += spacing) {
      for (let x = -radiusX; x <= radiusX; x += spacing) {
        const normalizedX = x / radiusX;
        const normalizedY = y / radiusY;
        const distance = Math.hypot(normalizedX, normalizedY);
        const edgeWave = Math.sin(normalizedX * 8 + Math.cos(normalizedY * 5)) * 0.12;
        if (distance > 0.82 + edgeWave || random() < 0.08) {
          continue;
        }

        particles.push({
          x: centerX + x + (random() - 0.5) * 2,
          y: centerY + y + (random() - 0.5) * 2,
          radius: 1 + random() * 0.7,
          phase: random() * Math.PI * 2,
          drift: 1.5 + random() * 3.5,
          cluster: clusterIndex,
        });
      }
    }
  });
}

function drawParticles(time = 0) {
  if (!reduceParticleMotion.matches && time - lastParticleFrame < 32) {
    particleFrame = window.requestAnimationFrame(drawParticles);
    return;
  }
  lastParticleFrame = time;
  particleContext.clearRect(0, 0, particleWidth, particleHeight);
  particles.forEach((particle) => {
    const drift = reduceParticleMotion.matches
      ? 0
      : Math.sin(time * 0.00045 + particle.phase) * particle.drift;
    const pulse = reduceParticleMotion.matches
      ? 0.38
      : 0.27 + (Math.sin(time * 0.0012 + particle.phase) + 1) * 0.14;
    particleContext.beginPath();
    particleContext.arc(
      particle.x + drift,
      particle.y + Math.cos(time * 0.0004 + particle.cluster) * 2,
      particle.radius,
      0,
      Math.PI * 2,
    );
    particleContext.fillStyle = `rgba(235, 133, 63, ${pulse})`;
    particleContext.fill();
  });

  if (!reduceParticleMotion.matches && document.visibilityState === "visible") {
    particleFrame = window.requestAnimationFrame(drawParticles);
  }
}

function resizeParticleCanvas() {
  const bounds = particleCanvas.getBoundingClientRect();
  const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  particleWidth = bounds.width;
  particleHeight = bounds.height;
  particleCanvas.width = Math.round(particleWidth * pixelRatio);
  particleCanvas.height = Math.round(particleHeight * pixelRatio);
  particleContext.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  createParticles();
  window.cancelAnimationFrame(particleFrame);
  lastParticleFrame = 0;
  drawParticles();
}

const particleResizeObserver = new ResizeObserver(resizeParticleCanvas);
particleResizeObserver.observe(particleCanvas);
reduceParticleMotion.addEventListener("change", resizeParticleCanvas);
document.addEventListener("visibilitychange", () => {
  window.cancelAnimationFrame(particleFrame);
  if (document.visibilityState === "visible") {
    drawParticles();
  }
});

function setAuthMode(mode) {
  authMode = mode === "register" ? "register" : "login";
  const isRegister = authMode === "register";

  authModeLabel.textContent = isRegister ? "JOIN THE COMMUNITY" : "WELCOME BACK";
  formTitle.textContent = isRegister ? "Create your account" : "Log in to CampusCode";
  formDescription.textContent = isRegister
    ? "Join in and find your next challenge."
    : "Good to see you again. Let's get back to it.";
  submitLabel.textContent = isRegister ? "Create Account" : "Continue";
  switchPrompt.textContent = isRegister ? "Already on CampusCode?" : "New to CampusCode?";
  switchButton.textContent = isRegister ? "Log in" : "Create an account";
  nameInput.required = isRegister;
  confirmPasswordInput.required = isRegister;
  passwordInput.autocomplete = isRegister ? "new-password" : "current-password";
  forgotPassword.hidden = isRegister;
  document.querySelectorAll(".register-field").forEach((field) => {
    field.hidden = !isRegister;
  });
  authNotice.textContent = "";
  confirmPasswordInput.setCustomValidity("");
}

function openAuth(mode) {
  if (!authModal.classList.contains("is-open")) {
    previouslyFocusedElement = document.activeElement;
  }
  closeMobileMenu();
  setAuthMode(mode);
  authModal.classList.add("is-open");
  authModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeAuth() {
  if (!authModal.classList.contains("is-open")) {
    return;
  }
  authModal.classList.remove("is-open");
  authModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  authNotice.textContent = "";
  if (previouslyFocusedElement instanceof HTMLElement) {
    previouslyFocusedElement.focus();
  }
}

function setMobileMenu(isOpen) {
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
  mobileMenu.classList.toggle("is-open", isOpen);
  mobileMenu.setAttribute("aria-hidden", String(!isOpen));
}

function closeMobileMenu() {
  setMobileMenu(false);
}

document.querySelectorAll("[data-auth-open]").forEach((button) => {
  button.addEventListener("click", () => openAuth(button.dataset.authOpen));
});

document.querySelectorAll("[data-auth-close]").forEach((button) => {
  button.addEventListener("click", closeAuth);
});

authModal.addEventListener("transitionend", (event) => {
  if (event.target !== authModal || event.propertyName !== "opacity" || !authModal.classList.contains("is-open")) {
    return;
  }
  const firstInput = authMode === "register" ? nameInput : document.getElementById("auth-email");
  firstInput.focus({ preventScroll: true });
});

switchButton.addEventListener("click", () => {
  setAuthMode(authMode === "login" ? "register" : "login");
  (authMode === "register" ? nameInput : document.getElementById("auth-email")).focus();
});

document.querySelectorAll("[data-password-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    const input = document.getElementById(button.dataset.passwordToggle);
    const isVisible = input.type === "text";
    input.type = isVisible ? "password" : "text";
    button.textContent = isVisible ? "Show" : "Hide";
    button.setAttribute("aria-label", `${isVisible ? "Show" : "Hide"} ${input.id === "auth-password" ? "password" : "confirm password"}`);
    button.setAttribute("aria-pressed", String(!isVisible));
    input.focus();
  });
});

menuToggle.addEventListener("click", () => {
  setMobileMenu(menuToggle.getAttribute("aria-expanded") !== "true");
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

forgotPassword.addEventListener("click", (event) => {
  event.preventDefault();
  authNotice.textContent = "Password reset is not connected yet. Please contact your campus administrator.";
});

authForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (authMode === "register" && passwordInput.value !== confirmPasswordInput.value) {
    confirmPasswordInput.setCustomValidity("Passwords do not match.");
    confirmPasswordInput.reportValidity();
    return;
  }
  confirmPasswordInput.setCustomValidity("");
  authNotice.textContent = authMode === "register"
    ? "Account creation is not connected yet. Your details haven't been sent."
    : "Sign-in is not connected yet. Your details haven't been sent.";
});

confirmPasswordInput.addEventListener("input", () => {
  confirmPasswordInput.setCustomValidity("");
});

document.querySelectorAll("[data-social]").forEach((button) => {
  button.addEventListener("click", () => {
    authNotice.textContent = `${button.dataset.social} sign-in is not connected yet.`;
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeAuth();
    closeMobileMenu();
  }

  if (event.key === "Tab" && authModal.classList.contains("is-open")) {
    const focusableElements = [...authModal.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled])'
    )].filter((element) => element.offsetParent !== null && element.tabIndex >= 0);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 720) {
    closeMobileMenu();
  }
});
