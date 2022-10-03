export function closeMainMenu() {
    var _a;
    (_a = document.getElementById("main-menu")) === null || _a === void 0 ? void 0 : _a.removeAttribute("open");
    document.body.style.overflow = "auto";
}
