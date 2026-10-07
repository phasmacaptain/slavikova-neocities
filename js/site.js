(() => {
    const body = document.body;
    const base = (body.dataset.titleScroll || document.title).trim();
    let index = 0;
    let timer = null;

    const prefersReduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    const tickTitle = () => {
        if (!base || prefersReduced) return;

        document.title = base.slice(index) + " " + base.slice(0, index);
        index = (index + 1) % base.length;
    };

    const startTitle = () => {
        if (timer || document.hidden || prefersReduced) return;

        tickTitle();
        timer = setInterval(tickTitle, 800);
    };

    const stopTitle = () => {
        if (timer) {
            clearInterval(timer);
            timer = null;
        }
    };

    document.addEventListener("visibilitychange", () =>
        document.hidden ? stopTitle() : startTitle()
    );
    startTitle();

    const clockEls = [
        ...document.querySelectorAll("[data-slavikova-clock],[data-clock-large]")
    ];
    const zoneEls = [...document.querySelectorAll("[data-clock-zone]")];

    if (clockEls.length) {
        const updateClock = () => {
            const d = new Date();
            const value = new Intl.DateTimeFormat(undefined, {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false
            }).format(d);

            clockEls.forEach(el => (el.textContent = value));
            zoneEls.forEach(
                el =>
                    (el.textContent =
                        Intl.DateTimeFormat().resolvedOptions().timeZone ||
                        "local timezone")
            );
        };

        updateClock();
        setInterval(updateClock, 1000);
    }

    document
        .querySelectorAll("[data-last-updated]")
        .forEach(el => (el.textContent = document.lastModified || "today"));

    document.querySelectorAll("[data-open-webdeck]").forEach(btn =>
        btn.addEventListener("click", () =>
            window.open(
                "webdeck-player/index.html",
                "Web Deck Player",
                "height=290,width=640,resizable=yes"
            )
        )
    );

    const cal = document.querySelector("[data-pixel-calendar]");

    if (cal) {
        const grid = cal.querySelector(".calendar-grid");
        const title = cal.querySelector(".calendar-title");
        const prev = cal.querySelector("[data-cal-prev]");
        const next = cal.querySelector("[data-cal-next]");
        const todayBtn = cal.querySelector("[data-cal-today]");
        const now = new Date();
        let cursor = new Date(now.getFullYear(), now.getMonth(), 1);
        const heads = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

        const draw = () => {
            grid.textContent = "";

            heads.forEach(h => {
                const e = document.createElement("div");
                e.className = "calendar-head";
                e.textContent = h;
                grid.appendChild(e);
            });

            title.textContent = cursor.toLocaleDateString(undefined, {
                month: "long",
                year: "numeric"
            });

            const y = cursor.getFullYear();
            const m = cursor.getMonth();
            const first = new Date(y, m, 1).getDay();
            const days = new Date(y, m + 1, 0).getDate();
            const prevDays = new Date(y, m, 0).getDate();

            for (let i = 0; i < 42; i++) {
                const e = document.createElement("div");
                e.className = "calendar-cell";
                let n;
                let cm = m;
                let cy = y;

                if (i < first) {
                    n = prevDays - first + i + 1;
                    cm = m - 1;

                    if (cm < 0) {
                        cm = 11;
                        cy = y - 1;
                    }

                    e.classList.add("muted");
                } else if (i >= first + days) {
                    n = i - first - days + 1;
                    cm = m + 1;

                    if (cm > 11) {
                        cm = 0;
                        cy = y + 1;
                    }

                    e.classList.add("muted");
                } else {
                    n = i - first + 1;
                }

                e.textContent = n;

                if (
                    n === now.getDate() &&
                    cm === now.getMonth() &&
                    cy === now.getFullYear()
                ) {
                    e.classList.add("today");
                }

                grid.appendChild(e);
            }
        };

        prev?.addEventListener("click", () => {
            cursor = new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1);
            draw();
        });

        next?.addEventListener("click", () => {
            cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
            draw();
        });

        todayBtn?.addEventListener("click", () => {
            cursor = new Date(now.getFullYear(), now.getMonth(), 1);
            draw();
        });

        draw();
    }

    document.querySelectorAll("[data-fortune-cookie]").forEach(box => {
        const button = box.querySelector("[data-fortune-button]");
        const out = box.querySelector("[data-fortune-output]");

        if (!button || !out) return;

        const fortunes = [
            "A tiny obsession is about to become a whole new hobby ♡",
            "You will find a weird little website worth bookmarking.",
            "Your next hyperfixation is loading... 72%",
            "Make the fun version first. The perfect version can wait.",
            "A cat approves of your current decisions. Probably.",
            "An old song will hit exactly right today.",
            "A strangely specific coincidence is on its way ✧",
            "Save the page. The internet is temporary; your archive does not have to be.",
            "Today is a good day to make something just because it is pretty.",
            "If you find a secret door on the web, click it.",
            "Your 2007 self would be obsessed with this website."
        ];

        button.addEventListener("click", () => {
            out.textContent =
                fortunes[Math.floor(Math.random() * fortunes.length)];
            out.classList.remove("fortune-pop");
            void out.offsetWidth;
            out.classList.add("fortune-pop");
        });
    });
})();
