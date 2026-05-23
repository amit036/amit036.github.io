document.addEventListener("DOMContentLoaded", () => {
  // --- Theme Toggle Controller ---
  const themeToggleBtn = document.getElementById("theme-toggle");
  const metaColorScheme = document.querySelector('meta[name="color-scheme"]');

  function setTheme(theme) {
    document.documentElement.setAttribute("data-user-color-scheme", theme);
    if (metaColorScheme) {
      metaColorScheme.content = theme;
    }
    localStorage.setItem("color-scheme", theme);
  }

  // Initial Theme load
  const savedTheme = localStorage.getItem("color-scheme");
  const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");
  setTheme(initialTheme);

  // Toggle Action
  themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-user-color-scheme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  });

  // Watch system preferences for updates
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    if (!localStorage.getItem("color-scheme")) {
      const newTheme = e.matches ? "dark" : "light";
      setTheme(newTheme);
    }
  });


  // --- Mobile Navigation Overlay ---
  const menuToggle = document.getElementById("menu-toggle");
  const navLinksList = document.getElementById("nav-links");
  const navLinks = document.querySelectorAll(".nav-link");

  menuToggle.addEventListener("click", () => {
    navLinksList.classList.toggle("open");
    menuToggle.classList.toggle("hamburger-active");
  });

  // Close navigation menu when a link is clicked
  navLinks.forEach(link => {
    link.addEventListener("click", () => {
      navLinksList.classList.remove("open");
      menuToggle.classList.remove("hamburger-active");
    });
  });


  // --- Intersection Observer for Scroll Spy Nav Links ---
  const sections = document.querySelectorAll("section[id]");
  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -60% 0px", // Trigger when section fills mid screen
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        navLinks.forEach(link => {
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));


  // --- Project Filtering ---
  const filterButtons = document.querySelectorAll(".project-filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      // Toggle button active states
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      projectCards.forEach(card => {
        const category = card.getAttribute("data-category");
        if (filterValue === "all" || category === filterValue) {
          card.style.display = "flex";
          // Quick entrance animation
          card.style.animation = "none";
          card.offsetHeight; // Trigger reflow
          card.style.animation = "reveal 0.4s ease forwards";
        } else {
          card.style.display = "none";
        }
      });
    });
  });


  // --- Contact Form Submission & Feedback ---
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // Check if form is fully valid
    if (!contactForm.checkValidity()) {
      // Trigger invalid display styling on elements
      const inputs = contactForm.querySelectorAll(".form-control");
      inputs.forEach(input => {
        // Force the browser to evaluate validation states immediately
        input.classList.add("touched");
      });
      formStatus.textContent = "Please fill out all required fields correctly.";
      formStatus.style.color = "#ef4444";
      formStatus.style.display = "block";
      return;
    }

    // Form is valid: simulate delivery
    formStatus.textContent = "Sending message...";
    formStatus.style.color = "var(--blue-primary)";
    formStatus.style.display = "block";

    setTimeout(() => {
      formStatus.textContent = "Thank you! Your message has been sent successfully.";
      formStatus.style.color = "#22c55e";
      contactForm.reset();
      
      // Clear status message after a short delay
      setTimeout(() => {
        formStatus.style.display = "none";
      }, 5000);
    }, 1500);
  });
});
