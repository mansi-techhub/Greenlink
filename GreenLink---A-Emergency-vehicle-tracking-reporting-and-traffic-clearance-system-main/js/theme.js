/**
 * TalentForge — Dark Mode System
 * Applies data-theme="dark" on <html>, persists in localStorage.
 * Include this script in <head> (before render) to prevent flash.
 */
(function () {
    const saved = localStorage.getItem("tf-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (saved === "dark" || (!saved && prefersDark)) {
        document.documentElement.setAttribute("data-theme", "dark");
    }
})();

function toggleDarkMode() {
    const html = document.documentElement;
    const isDark = html.getAttribute("data-theme") === "dark";
    html.setAttribute("data-theme", isDark ? "light" : "dark");
    localStorage.setItem("tf-theme", isDark ? "light" : "dark");

    // Update toggle button icons if present
    const sunIcon = document.getElementById("dm-sun");
    const moonIcon = document.getElementById("dm-moon");
    if (sunIcon) sunIcon.style.display = isDark ? "none" : "block";
    if (moonIcon) moonIcon.style.display = isDark ? "block" : "none";
}

// Sync toggle button state once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const sunIcon = document.getElementById("dm-sun");
    const moonIcon = document.getElementById("dm-moon");
    if (sunIcon) sunIcon.style.display = isDark ? "none" : "block";
    if (moonIcon) moonIcon.style.display = isDark ? "block" : "none";
});
