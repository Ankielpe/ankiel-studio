document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"], .hero-actions a[href^="#"], .pricing-card a[href^="#"]');
  const revealItems = document.querySelectorAll(".reveal, .reveal-title");
  const tiltCards = document.querySelectorAll("[data-tilt-card]");
  const magneticItems = document.querySelectorAll(".magnetic, .btn, .service-card, .pricing-card, .work-card, .cinematic-point, .contact-card, .seo-panel");
  const atmosphereCards = document.querySelectorAll(".service-card, .pricing-card, .work-card, .cinematic-point, .contact-card, .seo-panel, .process-step");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const closeMenu = () => {
    if (!navMenu || !menuToggle) return;
    navMenu.classList.remove("nav-open");
    menuToggle.classList.remove("is-active");
    menuToggle.setAttribute("aria-expanded", "false");
    body.classList.remove("menu-open");
  };

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("nav-open");
      menuToggle.classList.toggle("is-active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      body.classList.toggle("menu-open", isOpen);
    });

    document.addEventListener("click", (event) => {
      if (!navMenu.classList.contains("nav-open")) return;
      if (navMenu.contains(event.target) || menuToggle.contains(event.target)) return;
      closeMenu();
    });
  }

  const updateHeader = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 14);
  };

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      event.preventDefault();
      const offset = header ? header.offsetHeight + 14 : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;

      window.scrollTo({
        top,
        behavior: reduceMotion ? "auto" : "smooth",
      });

      closeMenu();
    });
  });

  if ("IntersectionObserver" in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -64px 0px",
      }
    );

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 5, 4) * 0.055}s`;
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const sections = document.querySelectorAll("section[id]");
  const menuAnchors = document.querySelectorAll('.nav-menu a[href^="#"]');

  const updateActiveLink = () => {
    const offset = (header ? header.offsetHeight : 0) + 80;
    let currentId = "";

    sections.forEach((section) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (window.scrollY + offset >= top && window.scrollY + offset < bottom) {
        currentId = section.id;
      }
    });

    menuAnchors.forEach((anchor) => {
      anchor.classList.toggle("is-current", anchor.getAttribute("href") === `#${currentId}`);
    });
  };

  updateActiveLink();
  window.addEventListener("scroll", updateActiveLink, { passive: true });

  magneticItems.forEach((item) => {
    item.addEventListener("pointermove", (event) => {
      const rect = item.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      item.style.setProperty("--x", `${x}%`);
      item.style.setProperty("--y", `${y}%`);
    });
  });

  if (!reduceMotion && window.matchMedia("(pointer: fine)").matches) {
    tiltCards.forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1000px) rotateX(${y * -4}deg) rotateY(${x * 5}deg) translateY(-3px)`;
      });

      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  const parallaxItems = document.querySelectorAll(".hero-interface, .cinematic-point, .work-card, .seo-panel");
  const ambientLayer = document.querySelector(".page-ambient");
  let ticking = false;

  const updateParallax = () => {
    const viewport = window.innerHeight || 1;
    const scrollY = window.scrollY || 0;

    if (ambientLayer) {
      ambientLayer.style.setProperty("--ambient-shift", `${Math.sin(scrollY * 0.0016) * 28}px`);
    }

    parallaxItems.forEach((item, index) => {
      const rect = item.getBoundingClientRect();
      const progress = (rect.top + rect.height * 0.5 - viewport * 0.5) / viewport;
      const shift = Math.max(-18, Math.min(18, progress * -18));
      item.style.setProperty("--parallax-y", `${shift + index * 0.3}px`);
    });

    atmosphereCards.forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      const center = rect.top + rect.height * 0.5;
      const progress = (center - viewport * 0.5) / viewport;
      const visibleRatio = 1 - Math.min(1, Math.abs(progress));
      const wave = scrollY * 0.0012 + index * 0.72;
      const x = 50 + Math.sin(wave) * 24;
      const y = 46 + Math.cos(wave * 1.13) * 22;
      const shift = Math.max(-22, Math.min(22, progress * -18));
      const intensity = 0.34 + Math.max(0, visibleRatio) * 0.44;

      card.style.setProperty("--card-x", `${x}%`);
      card.style.setProperty("--card-y", `${y}%`);
      card.style.setProperty("--card-shift", `${shift}px`);
      card.style.setProperty("--card-intensity", intensity.toFixed(3));
    });

    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      const center = rect.top + rect.height * 0.5;
      const progress = (center - viewport * 0.5) / viewport;
      const x = 50 + Math.sin(scrollY * 0.001 + index) * 28;
      const y = 35 + Math.cos(scrollY * 0.0012 + index) * 18;
      section.style.setProperty("--bg-x", `${x}%`);
      section.style.setProperty("--bg-y", `${y}%`);
      section.style.setProperty("--section-shift", `${Math.max(-34, Math.min(34, progress * -28))}px`);
      section.style.setProperty("--section-rotate", `${Math.sin(scrollY * 0.0008 + index) * 9}deg`);
    });

    ticking = false;
  };

  if (!reduceMotion) {
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      },
      { passive: true }
    );
    updateParallax();
  }

  initWebglBackground(reduceMotion);
});

function initWebglBackground(reduceMotion) {
  const canvas = document.getElementById("webgl-stage");
  const THREE = window.THREE;

  const shouldSkip =
    reduceMotion ||
    !canvas ||
    !THREE ||
    window.innerWidth < 720 ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

  if (shouldSkip) {
    document.body.classList.add("no-webgl");
    return;
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
  } catch (error) {
    document.body.classList.add("no-webgl");
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.z = 9;

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.setClearColor(0x000000, 0);

  const blobGeometry = new THREE.IcosahedronGeometry(2.35, 32);
  const blobMaterial = new THREE.MeshStandardMaterial({
    color: 0x2bb9c3,
    roughness: 0.34,
    metalness: 0.12,
    transparent: true,
    opacity: 0.26,
    wireframe: true,
  });
  const blob = new THREE.Mesh(blobGeometry, blobMaterial);
  blob.position.set(3.25, -0.72, -0.4);
  scene.add(blob);

  const glowGeometry = new THREE.IcosahedronGeometry(2.15, 16);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0x1f9ea7,
    transparent: true,
    opacity: 0.11,
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.position.copy(blob.position);
  scene.add(glow);

  const particleCount = 420;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i += 1) {
    const radius = 3.5 + Math.random() * 5.2;
    const angle = Math.random() * Math.PI * 2;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 5.6;
    positions[i * 3 + 2] = Math.sin(angle) * radius - 1.4;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x8ff6fb,
    size: 0.025,
    transparent: true,
    opacity: 0.72,
    depthWrite: false,
  });
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  particles.position.y = -0.12;
  particles.position.x = -0.35;
  scene.add(particles);

  const keyLight = new THREE.PointLight(0x8ff6fb, 2.2, 22);
  keyLight.position.set(-3, 3, 5);
  scene.add(keyLight);

  const softLight = new THREE.AmbientLight(0xffffff, 0.28);
  scene.add(softLight);

  const mouse = { x: 0, y: 0 };
  window.addEventListener(
    "pointermove",
    (event) => {
      mouse.x = (event.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (event.clientY / window.innerHeight - 0.5) * 2;
    },
    { passive: true }
  );

  const resize = () => {
    const width = canvas.clientWidth || window.innerWidth;
    const height = canvas.clientHeight || window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };

  resize();
  window.addEventListener("resize", resize, { passive: true });

  document.body.classList.add("webgl-ready");
  const clock = new THREE.Clock();
  const basePositions = positions.slice();

  const animate = () => {
    const time = clock.getElapsedTime();
    const scrollRatio = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1.4);

    const pos = particleGeometry.attributes.position.array;
    for (let i = 0; i < particleCount; i += 1) {
      pos[i * 3 + 1] = basePositions[i * 3 + 1] + Math.sin(time * 0.42 + i * 0.22) * 0.045;
    }
    particleGeometry.attributes.position.needsUpdate = true;

    blob.rotation.x = time * 0.12 + mouse.y * 0.08;
    blob.rotation.y = time * 0.18 + mouse.x * 0.14;
    blob.position.x = 3.25 + mouse.x * 0.18;
    blob.position.y = -0.72 - mouse.y * 0.12 - scrollRatio * 0.18;

    glow.rotation.copy(blob.rotation);
    glow.position.copy(blob.position);
    glow.scale.setScalar(1.05 + Math.sin(time * 0.8) * 0.035);

    particles.rotation.y = time * 0.025 + mouse.x * 0.03;
    particles.rotation.x = mouse.y * 0.025;
    camera.position.x += (mouse.x * 0.18 - camera.position.x) * 0.035;
    camera.position.y += (-mouse.y * 0.12 - camera.position.y) * 0.035;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
  };

  animate();
}
