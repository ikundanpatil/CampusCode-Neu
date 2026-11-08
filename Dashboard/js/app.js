(() => {
  "use strict";

  const CC = (window.CampusCode = window.CampusCode || {});
  CC.$ = (selector, root = document) => root.querySelector(selector);
  CC.$$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  CC.escape = (value = "") => String(value).replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
  CC.relative = (path) => (document.body.dataset.page === "overview" ? path : `../${path}`);

  CC.closeModal = () => {
    CC.$(".event-modal-backdrop[data-vanilla-modal]")?.remove();
    document.body.style.overflow = "";
  };

  CC.openModal = (content, className = "communication-detail-modal") => {
    CC.closeModal();
    const backdrop = document.createElement("div");
    backdrop.className = "event-modal-backdrop";
    backdrop.dataset.vanillaModal = "";
    backdrop.innerHTML = `<section class="event-detail-modal ${className}" role="dialog" aria-modal="true">${content}</section>`;
    backdrop.addEventListener("mousedown", (event) => { if (event.target === backdrop) CC.closeModal(); });
    backdrop.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener("click", CC.closeModal));
    document.body.append(backdrop);
    document.body.style.overflow = "hidden";
    backdrop.querySelector("button, input, select, textarea")?.focus();
    return backdrop;
  };

  const searchItems = [
    ["Overview", "Dashboard", "index.html"], ["Campus Innovation Hackathon", "Event", "pages/events.html"],
    ["National Coding Challenge", "Event", "pages/events.html"], ["My Events", "Navigation", "pages/my-events.html"],
    ["StudyMate", "AI Tool", "index.html#studymate"], ["IdeaCheck", "AI Tool", "index.html#ideacheck"],
    ["RuleBot", "AI Tool", "index.html#rulebot"], ["Official Updates", "Communication", "pages/communication.html#official"],
    ["Certificates", "Achievement", "pages/profile.html#achievements"], ["CampusCode Arena", "Competition", "pages/arena.html"],
  ];

  function closeHeaderMenus() {
    CC.$$(".header-dropdown").forEach((menu) => menu.remove());
    CC.$$(".header-actions [aria-expanded='true'], .search-field input[aria-expanded='true']").forEach((control) => control.setAttribute("aria-expanded", "false"));
    CC.$(".topbar")?.classList.remove("mobile-search-open");
  }

  function dropdown(wrapper, html, className = "compact-menu") {
    closeHeaderMenus();
    const menu = document.createElement("div");
    menu.className = `header-dropdown ${className}`;
    menu.innerHTML = html;
    wrapper.append(menu);
    wrapper.querySelector("button")?.setAttribute("aria-expanded", "true");
    return menu;
  }

  function renderSearch(input) {
    const wrapper = input.closest(".global-search");
    const query = input.value.trim().toLowerCase();
    const matches = searchItems.filter(([label, category]) => `${label} ${category}`.toLowerCase().includes(query)).slice(0, 6);
    CC.$(".search-results", wrapper)?.remove();
    const menu = document.createElement("div");
    menu.className = "header-dropdown search-results";
    menu.innerHTML = `<div class="dropdown-heading"><span>${query ? "Search results" : "Quick access"}</span><small>${matches.length} results</small></div>` +
      (matches.length ? `<div class="result-list">${matches.map(([label, category, href]) => `<a href="${CC.relative(href)}"><span class="result-icon">⌕</span><span><strong>${CC.escape(label)}</strong><small>${CC.escape(category)}</small></span><span>→</span></a>`).join("")}</div>` : `<div class="search-empty"><span>⌕</span><strong>No results found</strong><p>Try searching for an event, course, tool, or page.</p></div>`);
    wrapper.append(menu); input.setAttribute("aria-expanded", "true");
  }

  function initHeader() {
    const input = CC.$(".search-field input");
    input?.addEventListener("focus", () => renderSearch(input));
    input?.addEventListener("input", () => renderSearch(input));
    CC.$(".mobile-search-button")?.addEventListener("click", () => { CC.$(".topbar")?.classList.add("mobile-search-open"); setTimeout(() => input?.focus(), 0); });

    const notification = CC.$('[aria-label="Notifications"]');
    notification?.addEventListener("click", () => {
      const menu = dropdown(notification.parentElement, `<div class="dropdown-heading"><span>Notifications</span><small>2 unread</small></div>
        <a class="notification-item unread" href="${CC.relative("pages/my-events.html")}"><span class="notification-symbol">✓</span><span><strong>Registration confirmed</strong><small>Design Sprint ’26 · 8 min ago</small></span></a>
        <a class="notification-item unread" href="${CC.relative("pages/communication.html#official")}"><span class="notification-symbol">!</span><span><strong>Submission window updated</strong><small>CampusCode · 1 hour ago</small></span></a>
        <a class="notification-item" href="${CC.relative("pages/profile.html#achievements")}"><span class="notification-symbol">◇</span><span><strong>Certificate is ready</strong><small>National Coding Quiz · Yesterday</small></span></a>
        <a class="dropdown-footer" href="${CC.relative("pages/communication.html#notifications")}">View all notifications →</a>`, "notification-menu");
      menu.querySelector("a")?.focus();
    });

    const help = CC.$('[aria-label="Help and support"]');
    help?.addEventListener("click", () => dropdown(help.parentElement, `<div class="dropdown-heading"><span>Help & Support</span></div>
      <a href="${CC.relative("pages/communication.html#help")}"><span>Student Guide</span></a><a href="${CC.relative("pages/communication.html#help")}"><span>Help Center</span></a><a href="${CC.relative("pages/communication.html#help")}"><span>Contact Support</span></a>`));

    const profile = CC.$('[aria-label="Open profile menu"]');
    profile?.addEventListener("click", () => dropdown(profile.parentElement, `<div class="profile-summary"><span class="avatar">AM</span><span><strong>Alex Morgan</strong><small>alex.morgan@campus.edu</small></span></div>
      <a href="${CC.relative("pages/profile.html")}"><span>My Profile</span></a><a href="${CC.relative("pages/profile.html")}"><span>Account Settings</span></a><button data-demo-logout><span>Logout</span></button>`));
  }

  function initCommunication() {
    if (document.body.dataset.page !== "communication") return;
    const map = { "#notifications": "communication-notifications-template", "#help": "communication-help-template", "#official": "communication-official-template" };
    const render = () => {
      const id = map[location.hash] || "communication-official-template";
      const template = document.getElementById(id);
      const current = CC.$(".communication-page");
      if (template && current) current.replaceWith(template.content.firstElementChild.cloneNode(true));
      bindCommunication();
    };
    const bindCommunication = () => {
      CC.$$(".communication-tabs button").forEach((button) => button.addEventListener("click", () => {
        const text = button.textContent.trim(); location.hash = text.includes("Help") ? "help" : text.includes("Official") ? "official" : "notifications";
      }));
      const applyReadState = () => {
        const read = JSON.parse(localStorage.getItem("campuscode-read-notifications") || "[]");
        CC.$$(".communication-notification-list article").forEach((item, index) => { if (read.includes(index)) item.classList.replace("unread", "read"); });
      };
      applyReadState();
      CC.$$(".notification-actions button").forEach((button) => button.addEventListener("click", () => {
        const item = button.closest("article"); const index = CC.$$(".communication-notification-list article").indexOf(item);
        if (button.textContent.includes("Mark")) { const read = new Set(JSON.parse(localStorage.getItem("campuscode-read-notifications") || "[]")); read.add(index); localStorage.setItem("campuscode-read-notifications", JSON.stringify([...read])); item.classList.replace("unread", "read"); }
        else showCommunicationDetail(item);
      }));
      CC.$$(".notification-copy-button").forEach((button) => button.addEventListener("click", () => showCommunicationDetail(button.closest("article"))));
      const controls = CC.$$(".notification-center-heading button");
      controls[0]?.addEventListener("click", () => CC.$$(".communication-notification-list article.read").forEach((item) => item.classList.toggle("is-hidden")));
      controls[1]?.addEventListener("click", () => { const total=CC.$$(".communication-notification-list article").length; localStorage.setItem("campuscode-read-notifications",JSON.stringify([...Array(total).keys()])); CC.$$(".communication-notification-list article").forEach((item)=>item.classList.replace("unread","read")); });
      CC.$$(".announcement-footer button").forEach((button) => button.addEventListener("click", () => showCommunicationDetail(button.closest("article"))));
      CC.$$(".support-options article").forEach((card, index) => card.addEventListener("click", () => { if(index===0) location.href=CC.relative("pages/communication.html#help"); if(index===1) CC.$(".faq-panel")?.classList.toggle("is-hidden"); if(index===2) CC.$(".support-form")?.scrollIntoView({behavior:"smooth"}); }));
      const form=CC.$(".support-form"); form?.addEventListener("submit",(event)=>{event.preventDefault(); const subject=form.querySelector("input").value.trim(), category=form.querySelector("select").value, message=form.querySelector("textarea").value.trim(); form.querySelectorAll("label small").forEach((e)=>e.remove()); let bad=false; [[form.querySelector("input"),subject,"Enter a short subject."],[form.querySelector("select"),category,"Choose a support category."],[form.querySelector("textarea"),message.length>=20,"Add at least 20 characters."]].forEach(([field,valid,msg])=>{if(!valid){field.insertAdjacentHTML("afterend",`<small>${msg}</small>`);bad=true;}}); if(!bad){form.insertAdjacentHTML("afterbegin",`<div class="support-confirmation"><span>✓</span><div><strong>Request received</strong><p>Your demonstration support request has been recorded locally.</p></div></div>`);form.reset();}});
    };
    const showCommunicationDetail = (item) => CC.openModal(`<div class="modal-heading"><div><span class="event-category">CampusCode communication</span><h2>${CC.escape(item.querySelector("h3, strong, .notification-copy-button span")?.textContent || "Update")}</h2></div><button data-close-modal aria-label="Close">×</button></div><div class="communication-detail-body"><span class="communication-detail-icon">!</span><h3>Communication details</h3><p>${CC.escape(item.querySelector("p, .notification-copy-button strong")?.textContent || "Demonstration communication details.")}</p><div class="communication-detail-note"><strong>Demonstration content</strong><span>This message is sample data for the CampusCode prototype.</span></div></div>`);
    addEventListener("hashchange", render); render();
  }

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".topbar")) closeHeaderMenus();
    if (event.target.closest("[data-demo-logout], [data-action='demo-logout']")) alert("Demo logout: no authentication session is connected.");
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") { closeHeaderMenus(); CC.closeModal(); }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); CC.$(".search-field input")?.focus(); }
  });
  document.addEventListener("DOMContentLoaded", () => { initHeader(); initCommunication(); });
})();
