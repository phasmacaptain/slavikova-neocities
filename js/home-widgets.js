(() => {
    const scheduleIdle = callback => {
        if ("requestIdleCallback" in window) {
            window.requestIdleCallback(callback, { timeout: 3000 });
        } else {
            window.setTimeout(callback, 1500);
        }
    };

    const activateWidgets = () => {
        const statusCafe = document.createElement("script");
        statusCafe.src = "https://status.cafe/current-status.js?name=slavikova";
        statusCafe.async = true;
        statusCafe.addEventListener("error", () => {
            console.error("Unable to load the Status Cafe widget.");
        }, { once: true });
        document.body.append(statusCafe);

        const counterContainer = document.querySelector("[data-lazy-counter]");
        if (counterContainer) {
            const counter = document.createElement("iframe");
            counter.title = "Visitor counter";
            counter.width = 60;
            counter.height = 32;
            counter.loading = "lazy";
            counter.setAttribute("scrolling", "no");
            counter.srcdoc = '<!doctype html><html><head><meta charset="utf-8"><style>html,body{width:100%;height:100%;margin:0}body{display:grid;place-items:center;overflow:hidden}</style></head><body><script>history.replaceState(null,"",parent.location.href)</script><script src="https://counter.websiteout.com/js/28/0/0/0"></script></body></html>';
            counter.addEventListener("error", () => {
                const fallback = document.createElement("span");
                fallback.className = "tiny-text";
                fallback.textContent = "counter unavailable";
                counter.replaceWith(fallback);
                console.error("Unable to load the visitor counter.");
            }, { once: true });
            counterContainer.replaceChildren(counter);
        }

        const player = document.querySelector("[data-lazy-src]");
        if (!player) return;

        let observer;
        const loadPlayer = () => {
            if (!player.dataset.lazySrc) return;
            player.src = player.dataset.lazySrc;
            delete player.dataset.lazySrc;
            observer?.disconnect();
        };

        if ("IntersectionObserver" in window) {
            observer = new IntersectionObserver(entries => {
                if (entries.some(entry => entry.isIntersecting)) loadPlayer();
            }, { rootMargin: "200px" });
            observer.observe(player);
        } else {
            window.setTimeout(loadPlayer, 1500);
        }
    };

    const scheduleWidgets = () => scheduleIdle(activateWidgets);
    if (document.readyState === "complete") {
        scheduleWidgets();
    } else {
        window.addEventListener("load", scheduleWidgets, { once: true });
    }

})();
