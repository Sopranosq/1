document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const loadingScreen = document.querySelector(".loading-screen");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const revealItems = document.querySelectorAll(".reveal-item");
    const parallaxCharacters = document.querySelectorAll(".poster-character[data-parallax]");
    const posterCharacters = document.querySelectorAll(".poster-character");

    body.classList.add("is-loading");

    if (loadingScreen) {
        loadingScreen.classList.add("is-stage-atmosphere");
    }

    const hideLoader = () => {
        if (loadingScreen) {
            loadingScreen.classList.add("is-hidden");
        }
        body.classList.remove("is-loading");
    };

    if (loadingScreen && !reducedMotion) {
        window.setTimeout(() => loadingScreen.classList.add("is-stage-logo"), 650);
        window.setTimeout(() => loadingScreen.classList.add("is-stage-figure"), 1450);
        window.setTimeout(hideLoader, 2550);
    } else {
        if (loadingScreen) {
            loadingScreen.classList.add("is-stage-logo", "is-stage-figure");
        }
        window.setTimeout(hideLoader, reducedMotion ? 180 : 1200);
    }

    if (typeof IntersectionObserver === "undefined") {
        revealItems.forEach((item) => {
            item.style.opacity = "1";
            item.style.transform = "none";
        });
        return;
    }

    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                revealObserver.unobserve(entry.target);
            });
        },
        {
            threshold: 0.2,
            rootMargin: "0px 0px -10% 0px"
        }
    );

    revealItems.forEach((item) => revealObserver.observe(item));

    const updateParallax = () => {
        if (reducedMotion) {
            return;
        }

        const viewportHeight = window.innerHeight || 1;

        parallaxCharacters.forEach((character) => {
            const imageLayer = character.querySelector(".poster-character__image");
            const amount = Number(character.dataset.parallax || 0.12);

            if (!imageLayer) {
                return;
            }

            const rect = character.getBoundingClientRect();
            const progress = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
            const offset = progress * amount * 100;
            const activeScale = character.classList.contains("is-active") ? 1.03 : 1;
            imageLayer.style.transform = `translateY(${offset * -0.24}px) scale(${activeScale})`;
        });
    };

    updateParallax();
    window.addEventListener("scroll", updateParallax, { passive: true });
    window.addEventListener("resize", updateParallax);

    posterCharacters.forEach((character) => {
        const setActive = (active) => {
            character.classList.toggle("is-active", active);
            updateParallax();
        };

        character.addEventListener("pointerdown", () => setActive(true));
        character.addEventListener("pointerup", () => setActive(false));
        character.addEventListener("pointerleave", () => setActive(false));
        character.addEventListener("pointercancel", () => setActive(false));
        character.addEventListener("touchend", () => setActive(false), { passive: true });
    });
});