// Hamburger Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Exclusive Offer Timer
function startTimer() {
    const timer = document.querySelectorAll('.timer span');
    // Return early if timer elements don't exist
    if (!timer || timer.length < 3) return;

    let time = 6 * 3600 + 18 * 60 + 48; // 6:18:48 in seconds

    const interval = setInterval(() => {
        if (time <= 0) {
            clearInterval(interval);
            return;
        }

        let hours = Math.floor(time / 3600);
        let minutes = Math.floor((time % 3600) / 60);
        let seconds = time % 60;

        timer[0].textContent = String(hours).padStart(2, '0');
        timer[1].textContent = String(minutes).padStart(2, '0');
        timer[2].textContent = String(seconds).padStart(2, '0');

        time--;
    }, 1000);
}

// Contact Form Tab Switching
document.addEventListener('DOMContentLoaded', () => {
    // Initialize timer
    startTimer();

    // Initialize contact form tabs
    const optionCards = document.querySelectorAll(".option-card");

    if (optionCards.length > 0) {
        optionCards.forEach((card) => {
            card.addEventListener("click", () => {
                // Remove active class from all cards and forms
                document.querySelectorAll(".option-card")
                    .forEach((c) => c.classList.remove("active"));
                document.querySelectorAll(".form-content")
                    .forEach((form) => form.classList.remove("active"));

                // Add active class to selected card and form
                card.classList.add("active");
                const target = card.getAttribute("data-target");
                const targetForm = document.getElementById(`${target}-form`);
                if (targetForm) {
                    targetForm.classList.add("active");
                }
            });
        });
    }
});
