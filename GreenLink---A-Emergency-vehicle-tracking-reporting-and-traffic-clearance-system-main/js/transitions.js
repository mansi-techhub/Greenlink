/**
 * TalentForge — Page Transition System
 * Fades pages in on load, fades out before navigation.
 */
(function () {
    // Inject overlay element once
    const overlay = document.createElement("div");
    overlay.id = "page-transition-overlay";
    overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 99999;
    background: #0f0f0f;
    opacity: 1; pointer-events: none;
    transition: opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  `;
    document.documentElement.appendChild(overlay);

    // Fade IN on page load
    window.addEventListener("DOMContentLoaded", () => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                overlay.style.opacity = "0";
                setTimeout(() => { overlay.style.pointerEvents = "none"; }, 420);
            });
        });
    });

    // Fade OUT before navigating to internal links
    document.addEventListener("click", (e) => {
        const link = e.target.closest("a[href]");
        if (!link) return;

        const href = link.getAttribute("href");
        // Skip external links, anchors, javascript:, mailto:
        if (!href
            || href.startsWith("#")
            || href.startsWith("http")
            || href.startsWith("mailto")
            || href.startsWith("javascript")
            || link.target === "_blank"
            || e.metaKey || e.ctrlKey || e.shiftKey) return;

        e.preventDefault();

        overlay.style.pointerEvents = "all";
        overlay.style.opacity = "1";

        setTimeout(() => {
            window.location.href = href;
        }, 380);
    });
})();
