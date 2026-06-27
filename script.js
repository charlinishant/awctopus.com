document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector(".site-header");
    const nav = document.getElementById("nav");
    const menuToggle = document.getElementById("menuToggle");
    const backToTop = document.getElementById("backToTop");

    function updateHeader() {
        header.classList.toggle("sticky", window.scrollY > 24);
        backToTop.classList.toggle("show", window.scrollY > 520);
    }

    window.addEventListener("scroll", updateHeader);
    updateHeader();

    menuToggle.addEventListener("click", () => {
        const isOpen = nav.classList.toggle("active");
        header.classList.toggle("menu-open", isOpen);
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("active");
            header.classList.remove("menu-open");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });

    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    // Reveal animations and counters
    const counters = [...document.querySelectorAll("[data-counter]")];
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.16 });

    document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        });
    }, { threshold: 0.4 });

    counters.forEach((counter) => counterObserver.observe(counter));

    function animateCounter(element) {
        const target = Number(element.dataset.counter);
        const duration = 1300;
        const startTime = performance.now();

        function tick(now) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const value = Math.floor(eased * target);
            const suffix = target === 20000 || target === 24 ? "+" : target === 100 ? "%" : "";
            element.textContent = `${value.toLocaleString("en-IN")}${suffix}`;

            if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
    }

    // Course structure accordion
    document.querySelectorAll(".timeline-trigger").forEach((trigger) => {
        trigger.addEventListener("click", () => {
            const card = trigger.closest(".timeline-card");
            card.classList.toggle("active");
        });
    });

    // FAQ accordion, only one open at a time
    document.querySelectorAll(".faq-item button").forEach((button) => {
        button.addEventListener("click", () => {
            const item = button.closest(".faq-item");
            document.querySelectorAll(".faq-item").forEach((faq) => {
                if (faq !== item) faq.classList.remove("active");
            });
            item.classList.toggle("active");
        });
    });

    // Testimonial slider
    const testimonials = [
        {
            initials: "AS",
            review: "The assignments made contract clauses feel practical for the first time. I could finally understand how lawyers think through risk.",
            name: "Ananya Sharma",
            college: "National Law University, Delhi"
        },
        {
            initials: "VP",
            review: "The freelancing sessions helped me package my services, speak to clients confidently, and quote for drafting work without hesitation.",
            name: "Vikram Prasad",
            college: "Symbiosis Law School, Pune"
        },
        {
            initials: "MK",
            review: "I liked the mix of live classes, templates, and recordings. It worked even with my internship schedule.",
            name: "Meera Khanna",
            college: "Jindal Global Law School"
        },
        {
            initials: "RA",
            review: "The course helped me move from reading contracts passively to drafting with structure, confidence, and commercial clarity.",
            name: "Ritwik Anand",
            college: "Faculty of Law, DU"
        }
    ];

    const testimonialTrack = document.getElementById("testimonialTrack");
    const prevTestimonial = document.getElementById("prevTestimonial");
    const nextTestimonial = document.getElementById("nextTestimonial");
    let testimonialIndex = 0;
    let testimonialTimer;

    testimonials.forEach((testimonial, index) => {
        const card = document.createElement("article");
        card.className = `testimonial-card${index === 0 ? " active" : ""}`;
        card.innerHTML = `
            <div class="student-photo">${testimonial.initials}</div>
            <div class="stars" aria-label="Five star rating">*****</div>
            <p class="review">"${testimonial.review}"</p>
            <h3>${testimonial.name}</h3>
            <p>${testimonial.college}</p>
        `;
        testimonialTrack.appendChild(card);
    });

    function showTestimonial(nextIndex) {
        const cards = [...testimonialTrack.querySelectorAll(".testimonial-card")];
        cards[testimonialIndex].classList.remove("active");
        testimonialIndex = (nextIndex + cards.length) % cards.length;
        cards[testimonialIndex].classList.add("active");
    }

    function restartTestimonials() {
        clearInterval(testimonialTimer);
        testimonialTimer = setInterval(() => showTestimonial(testimonialIndex + 1), 4500);
    }

    prevTestimonial.addEventListener("click", () => {
        showTestimonial(testimonialIndex - 1);
        restartTestimonials();
    });

    nextTestimonial.addEventListener("click", () => {
        showTestimonial(testimonialIndex + 1);
        restartTestimonials();
    });

    restartTestimonials();

    // Contact form validation
    const contactForm = document.getElementById("contactForm");
    const formMessage = document.getElementById("formMessage");

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        formMessage.classList.remove("error");

        const formData = new FormData(contactForm);
        const name = String(formData.get("name") || "").trim();
        const email = String(formData.get("email") || "").trim();
        const phone = String(formData.get("phone") || "").trim();
        const message = String(formData.get("message") || "").trim();
        const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const phoneOk = /^[0-9+\-\s()]{8,}$/.test(phone);

        if (!name || !emailOk || !phoneOk || !message) {
            formMessage.textContent = "Please enter a valid name, email, phone, and message.";
            formMessage.classList.add("error");
            return;
        }

        contactForm.reset();
        formMessage.textContent = "Thank you. The Lawctopus team will contact you shortly.";
    });
});
