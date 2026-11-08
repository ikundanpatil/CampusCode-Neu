(() => {
  "use strict";
  document.addEventListener("DOMContentLoaded", () => {
    const shell = document.querySelector(".app-shell");
    const sidebar = document.querySelector(".sidebar");
    const collapsed = localStorage.getItem("campuscode-sidebar-collapsed") === "true";
    shell?.classList.toggle("sidebar-collapsed", collapsed);

    document.querySelector('[data-action="toggle-sidebar"]')?.addEventListener("click", () => {
      const value = !shell.classList.contains("sidebar-collapsed");
      shell.classList.toggle("sidebar-collapsed", value);
      localStorage.setItem("campuscode-sidebar-collapsed", String(value));
    });

    document.querySelectorAll(".workspace-parent").forEach((button) => {
      const group = button.closest(".workspace-nav-group");
      group?.classList.remove("is-expanded");
      button.setAttribute("aria-expanded", "false");
      button.addEventListener("click", () => {
        if (shell.classList.contains("sidebar-collapsed")) { shell.classList.remove("sidebar-collapsed"); localStorage.setItem("campuscode-sidebar-collapsed", "false"); }
        group.classList.toggle("is-expanded");
        button.setAttribute("aria-expanded", String(group.classList.contains("is-expanded")));
      });
    });

    const closeDrawer=()=>{sidebar?.classList.remove("is-open");document.querySelector(".sidebar-scrim")?.remove();};
    const openDrawer=(withScrim=true)=>{
      sidebar?.classList.add("is-open");
      if(!withScrim||document.querySelector(".sidebar-scrim"))return;
      const scrim=document.createElement("button");
      scrim.className="sidebar-scrim";
      scrim.setAttribute("aria-label","Close menu");
      scrim.addEventListener("click",closeDrawer);
      document.body.append(scrim);
    };
    if(window.matchMedia("(max-width: 900px)").matches)openDrawer(false);
    document.querySelector('[data-action="open-drawer"]')?.addEventListener("click",()=>openDrawer());
    document.querySelector('[data-action="close-drawer"]')?.addEventListener("click",closeDrawer);
    document.querySelectorAll("[data-nav-link]").forEach((link)=>link.addEventListener("click",closeDrawer));
  });
})();
