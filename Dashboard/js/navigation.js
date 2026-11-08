(() => {
  "use strict";
  document.addEventListener("DOMContentLoaded", () => {
    const shell = document.querySelector(".app-shell");
    const sidebar = document.querySelector(".sidebar");
    const desktopSidebar = window.matchMedia("(min-width: 901px)");
    const storedCollapseState = localStorage.getItem("campuscode-sidebar-collapsed");
    const collapsed =
      desktopSidebar.matches ||
      storedCollapseState === null ||
      storedCollapseState === "true";
    shell?.classList.toggle("sidebar-collapsed", collapsed);

    const updateHoverExpansion = () => {
      const shouldExpand =
        desktopSidebar.matches &&
        shell?.classList.contains("sidebar-collapsed") &&
        (sidebar?.matches(":hover") || sidebar?.contains(document.activeElement));
      shell?.classList.toggle("sidebar-hover-expanded", Boolean(shouldExpand));
    };

    sidebar?.addEventListener("pointerenter", updateHoverExpansion);
    sidebar?.addEventListener("pointerleave", updateHoverExpansion);
    sidebar?.addEventListener("focusin", updateHoverExpansion);
    sidebar?.addEventListener("focusout", () => requestAnimationFrame(updateHoverExpansion));
    desktopSidebar.addEventListener("change", () => {
      if (desktopSidebar.matches) shell?.classList.add("sidebar-collapsed");
      updateHoverExpansion();
    });

    document.querySelectorAll(".workspace-parent").forEach((button) => {
      const group = button.closest(".workspace-nav-group");
      group?.classList.remove("is-expanded");
      button.setAttribute("aria-expanded", "false");
      button.addEventListener("click", () => {
        group.classList.toggle("is-expanded");
        button.setAttribute("aria-expanded", String(group.classList.contains("is-expanded")));
      });
    });

    const closeDrawer = () => {
      sidebar?.classList.remove("is-open");
      document.querySelector(".sidebar-scrim")?.remove();
    };
    const openDrawer = (withScrim = true) => {
      sidebar?.classList.add("is-open");
      if (!withScrim || document.querySelector(".sidebar-scrim")) return;
      const scrim = document.createElement("button");
      scrim.className = "sidebar-scrim";
      scrim.setAttribute("aria-label", "Close menu");
      scrim.addEventListener("click", closeDrawer);
      document.body.append(scrim);
    };
    if (window.matchMedia("(max-width: 900px)").matches) openDrawer(false);
    document.querySelector('[data-action="open-drawer"]')?.addEventListener("click", () => openDrawer());
    document.querySelector('[data-action="close-drawer"]')?.addEventListener("click", closeDrawer);
    document.querySelectorAll("[data-nav-link]").forEach((link) => link.addEventListener("click", closeDrawer));
  });
})();
