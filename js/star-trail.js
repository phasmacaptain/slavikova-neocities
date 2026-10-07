(() => {
    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = matchMedia("(pointer: fine)").matches;

    if (reducedMotion || !finePointer) return;

    const stars = ["✦", "✧", "⋆"];
    let lastStar = 1;

    document.addEventListener("pointermove", event => {
        const now = performance.now();
        if (now - lastStar < 60) return;
        lastStar = now;

        const star = document.createElement("span");
        star.className = "cursor-star-trail";
        star.textContent = stars[Math.floor(Math.random() * stars.length)];
        star.style.left = `${event.clientX}px`;
        star.style.top = `${event.clientY}px`;
        document.body.appendChild(star);
        star.addEventListener("animationend", () => star.remove(), { once: true });
    }, { passive: true });
})();
