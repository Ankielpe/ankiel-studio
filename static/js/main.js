document.addEventListener("DOMContentLoaded", () => {
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');
  const revealItems = document.querySelectorAll(".reveal");

  // -------------------------------------
  // MOBILE MENU
  // -------------------------------------
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("nav-open");
      menuToggle.classList.toggle("is-active");
      document.body.classList.toggle("menu-open");
    });
  }

  // -------------------------------------
  // SMOOTH SCROLL
  // -------------------------------------
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const targetSection = document.querySelector(targetId);
      if (!targetSection) return;

      e.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;
      const targetTop =
        targetSection.getBoundingClientRect().top +
        window.pageYOffset -
        headerHeight +
        1;

      window.scrollTo({
        top: targetTop,
        behavior: "smooth",
      });

      if (navMenu.classList.contains("nav-open")) {
        navMenu.classList.remove("nav-open");
        menuToggle.classList.remove("is-active");
        document.body.classList.remove("menu-open");
      }
    });
  });

  // -------------------------------------
  // CLOSE MENU ON OUTSIDE CLICK
  // -------------------------------------
  document.addEventListener("click", (e) => {
    if (!menuToggle || !navMenu) return;

    const clickedInsideMenu = navMenu.contains(e.target);
    const clickedToggle = menuToggle.contains(e.target);

    if (!clickedInsideMenu && !clickedToggle && navMenu.classList.contains("nav-open")) {
      navMenu.classList.remove("nav-open");
      menuToggle.classList.remove("is-active");
      document.body.classList.remove("menu-open");
    }
  });

  // -------------------------------------
  // HEADER SCROLLED STATE
  // -------------------------------------
  const updateHeaderState = () => {
    if (!header) return;

    if (window.scrollY > 20) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState);

  // -------------------------------------
  // REVEAL ANIMATIONS
  // -------------------------------------
  if ("IntersectionObserver" in window && revealItems.length > 0) {
    revealItems.forEach((item, index) => {
      item.style.opacity = "0";
      item.style.transform = "translateY(34px)";
      item.style.transition = `opacity 0.75s ease, transform 0.75s ease`;
      item.style.transitionDelay = `${Math.min(index % 4, 3) * 0.08}s`;
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealItems.forEach((item) => {
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => {
      item.style.opacity = "1";
      item.style.transform = "translateY(0)";
    });
  }

  // -------------------------------------
  // ACTIVE NAV LINK ON SCROLL
  // -------------------------------------
  const sections = document.querySelectorAll("section[id]");
  const menuAnchors = document.querySelectorAll('.nav-menu a[href^="#"]');

  const updateActiveLink = () => {
    const headerHeight = header ? header.offsetHeight : 0;
    const scrollPosition = window.scrollY + headerHeight + 40;

    let currentId = "";

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;

      if (scrollPosition >= top && scrollPosition < top + height) {
        currentId = section.getAttribute("id");
      }
    });

    menuAnchors.forEach((anchor) => {
      anchor.classList.remove("is-current");

      const href = anchor.getAttribute("href");
      if (href === `#${currentId}`) {
        anchor.classList.add("is-current");
      }
    });
  };

  updateActiveLink();
  window.addEventListener("scroll", updateActiveLink);
});