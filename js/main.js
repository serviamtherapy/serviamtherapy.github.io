```javascript
/* =========================================================
   SERVIAM THERAPY — PREMIUM INTERACTIONS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
/* =========================================================
   CENTRAL BOOKING SETTINGS
========================================================= */

const BOOKING_URL =
    "https://serviamtherapy.wixsite.com/home/book-online";

const WHATSAPP_NUMBER =
    ""; // Add your WhatsApp number later

    /* -----------------------------------------------------
       PAGE LOADER
    ----------------------------------------------------- */

    const loader = document.querySelector(".page-loader");

    if (loader) {
        window.addEventListener("load", () => {
            setTimeout(() => {
                loader.classList.add("hidden");
            }, 350);
        });
    }


    /* -----------------------------------------------------
       HEADER SCROLL EFFECT
    ----------------------------------------------------- */

    const header = document.querySelector(".site-header");

    const handleHeaderScroll = () => {

        if (!header) return;

        if (window.scrollY > 60) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    };

    handleHeaderScroll();

    window.addEventListener(
        "scroll",
        handleHeaderScroll,
        { passive: true }
    );


    /* -----------------------------------------------------
       MOBILE MENU
    ----------------------------------------------------- */

    const menuToggle =
        document.querySelector(".mobile-menu-toggle");

    const navMenu =
        document.querySelector(".nav-menu");

    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", () => {

            const isOpen =
                navMenu.classList.toggle("open");

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            document.body.classList.toggle(
                "menu-open",
                isOpen
            );
        });


        /* Close menu after clicking a link */

        navMenu
            .querySelectorAll("a")
            .forEach(link => {

                link.addEventListener("click", () => {

                    navMenu.classList.remove("open");

                    menuToggle.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                    document.body.classList.remove(
                        "menu-open"
                    );
                });

            });
    }


    /* -----------------------------------------------------
       FAQ ACCORDION
    ----------------------------------------------------- */

    const faqItems =
        document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {

        const question =
            item.querySelector(".faq-question");

        if (!question) return;

        question.addEventListener("click", () => {

            const alreadyOpen =
                item.classList.contains("open");


            /* Close all other questions */

            faqItems.forEach(otherItem => {

                if (otherItem !== item) {
                    otherItem.classList.remove("open");

                    const otherQuestion =
                        otherItem.querySelector(
                            ".faq-question"
                        );

                    if (otherQuestion) {
                        otherQuestion.setAttribute(
                            "aria-expanded",
                            "false"
                        );
                    }
                }

            });


            /* Toggle selected question */

            item.classList.toggle(
                "open",
                !alreadyOpen
            );

            question.setAttribute(
                "aria-expanded",
                alreadyOpen ? "false" : "true"
            );

        });

    });


    /* -----------------------------------------------------
       SMOOTH INTERNAL NAVIGATION
    ----------------------------------------------------- */

    document
        .querySelectorAll('a[href^="#"]')
        .forEach(link => {

            link.addEventListener("click", event => {

                const targetId =
                    link.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }

                const target =
                    document.querySelector(targetId);

                if (!target) return;

                event.preventDefault();

                const headerHeight =
                    header
                        ? header.offsetHeight
                        : 0;

                const targetPosition =
                    target.getBoundingClientRect().top +
                    window.scrollY -
                    headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });

            });

        });


    /* -----------------------------------------------------
       ACTIVE NAVIGATION
    ----------------------------------------------------- */

    const sections =
        document.querySelectorAll("section[id]");

    const navLinks =
        document.querySelectorAll(
            '.nav-link[href^="#"]'
        );

    if (
        sections.length &&
        navLinks.length
    ) {

        const updateActiveNavigation = () => {

            const scrollPosition =
                window.scrollY +
                (header
                    ? header.offsetHeight + 100
                    : 100
                );

            let currentSection = "";

            sections.forEach(section => {

                if (
                    scrollPosition >=
                    section.offsetTop
                ) {
                    currentSection =
                        section.id;
                }

            });

            navLinks.forEach(link => {

                const target =
                    link.getAttribute("href");

                link.classList.toggle(
                    "active",
                    target ===
                    `#${currentSection}`
                );

            });

        };

        updateActiveNavigation();

        window.addEventListener(
            "scroll",
            updateActiveNavigation,
            { passive: true }
        );
    }


    /* -----------------------------------------------------
       SCROLL REVEAL
    ----------------------------------------------------- */

    const revealElements =
        document.querySelectorAll(
            ".section-heading, " +
            ".service-card, " +
            ".about-image-wrapper, " +
            ".about-content, " +
            ".benefit-card, " +
            ".process-step, " +
            ".testimonial-card, " +
            ".gallery-item, " +
            ".faq-item, " +
            ".contact-content, " +
            ".contact-card"
        );


    revealElements.forEach(element => {
        element.classList.add("reveal");
    });


    if ("IntersectionObserver" in window) {

        const observer =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "revealed"
                            );

                            observer.unobserve(
                                entry.target
                            );
                        }

                    });

                },
                {
                    threshold: 0.12,
                    rootMargin:
                        "0px 0px -40px 0px"
                }
            );


        revealElements.forEach(element => {
            observer.observe(element);
        });

    } else {

        revealElements.forEach(element => {
            element.classList.add("revealed");
        });

    }


    /* -----------------------------------------------------
       COUNTER ANIMATION
    ----------------------------------------------------- */

    const counters =
        document.querySelectorAll(
            "[data-counter]"
        );

    if (
        counters.length &&
        "IntersectionObserver" in window
    ) {

        const counterObserver =
            new IntersectionObserver(
                entries => {

                    entries.forEach(entry => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }

                        const counter =
                            entry.target;

                        const target =
                            Number(
                                counter.dataset.counter
                            );

                        const duration = 1400;

                        const startTime =
                            performance.now();

                        const animate =
                            currentTime => {

                                const progress =
                                    Math.min(
                                        (
                                            currentTime -
                                            startTime
                                        ) / duration,
                                        1
                                    );

                                const eased =
                                    1 -
                                    Math.pow(
                                        1 - progress,
                                        3
                                    );

                                counter.textContent =
                                    Math.floor(
                                        eased * target
                                    );

                                if (progress < 1) {

                                    requestAnimationFrame(
                                        animate
                                    );

                                } else {

                                    counter.textContent =
                                        target;
                                }

                            };

                        requestAnimationFrame(
                            animate
                        );

                        counterObserver.unobserve(
                            counter
                        );

                    });

                },
                {
                    threshold: .7
                }
            );


        counters.forEach(counter => {
            counterObserver.observe(counter);
        });

    }


    /* -----------------------------------------------------
       IMAGE LAZY LOADING
    ----------------------------------------------------- */

    document
        .querySelectorAll("img")
        .forEach(image => {

            if (
                !image.hasAttribute("loading") &&
                !image.closest(".hero")
            ) {
                image.setAttribute(
                    "loading",
                    "lazy"
                );
            }

        });


    /* -----------------------------------------------------
       EXTERNAL LINKS
    ----------------------------------------------------- */

    document
        .querySelectorAll(
            'a[target="_blank"]'
        )
        .forEach(link => {

            const rel =
                link.getAttribute("rel") || "";

            if (!rel.includes("noopener")) {

                link.setAttribute(
                    "rel",
                    `${rel} noopener noreferrer`.trim()
                );

            }

        });


    /* -----------------------------------------------------
       WHATSAPP BUTTON
    ----------------------------------------------------- */

    const whatsappButtons =
        document.querySelectorAll(
            ".whatsapp-link"
        );

    whatsappButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                if (
                    typeof gtag === "function"
                ) {

                    gtag(
                        "event",
                        "whatsapp_booking_click"
                    );

                }

            }
        );

    });


    /* -----------------------------------------------------
       BACK TO TOP
    ----------------------------------------------------- */

    const backToTop =
        document.querySelector(
            ".back-to-top"
        );

    if (backToTop) {

        const updateBackToTop = () => {

            backToTop.classList.toggle(
                "visible",
                window.scrollY > 700
            );

        };

        updateBackToTop();

        window.addEventListener(
            "scroll",
            updateBackToTop,
            { passive: true }
        );

        backToTop.addEventListener(
            "click",
            () => {

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            }
        );
    }
/* =========================================================
   BOOKING BUTTONS
========================================================= */

document
    .querySelectorAll(".booking-link")
    .forEach(button => {

        button.addEventListener("click", event => {

            event.preventDefault();

            window.location.href = BOOKING_URL;

        });

    });
});
```
