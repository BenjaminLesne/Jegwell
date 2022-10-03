export function closeMainMenu() {
  document.getElementById("main-menu")?.removeAttribute("open");
  document.body.style.overflow = "auto";
}
