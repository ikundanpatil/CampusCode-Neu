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
