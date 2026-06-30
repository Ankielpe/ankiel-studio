document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const cinematicRoot = document.querySelector("[data-cinematic-root]");
  const header = document.querySelector("[data-header]");
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll('.nav-menu a[href^="#"], .hero-actions a[href^="#"], .pricing-card a[href^="#"]');
  const revealItems = document.querySelectorAll(".reveal, .reveal-title");
  const tiltCards = document.querySelectorAll("[data-tilt-card]");
  const magneticItems = document.querySelectorAll(".magnetic, .btn, .service-card, .pricing-card, .work-card, .cinematic-point, .contact-card, .seo-panel");
  const atmosphereCards = document.querySelectorAll(".service-card, .pricing-card, .work-card, .cinematic-point, .contact-card, .seo-panel, .process-step");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const smallScreen = window.matchMedia("(max-width: 760px)").matches;
  const mobileLight = coarsePointer || smallScreen;

  if (cinematicRoot) {
    body.classList.add("cinematic-mode", "story-primed");
  }

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

  if (!mobileLight) {
    magneticItems.forEach((item) => {
      item.addEventListener("pointermove", (event) => {
        const rect = item.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        item.style.setProperty("--x", `${x}%`);
        item.style.setProperty("--y", `${y}%`);
      });
    });
  }

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

  if (!reduceMotion && !mobileLight) {
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

  initCinematicStory(reduceMotion, mobileLight);
  initWebglBackground(reduceMotion, mobileLight);
});

function initCinematicStory(reduceMotion, mobileLight) {
  const body = document.body;
  const scenes = [
    ...document.querySelectorAll(".hero, .studio-strip, .section[data-chapter-title]"),
  ];
  const progressBar = document.querySelector("[data-chapter-progress]");
  const chapterNumber = document.querySelector("[data-chapter-number]");
  const chapterLabel = document.querySelector("[data-chapter-label]");
  const holdTargets = document.querySelectorAll("[data-cinematic-hold]");
  const lazyImages = new WeakSet();

  if (!scenes.length) return;

  let activeChapter = -1;
  let ticking = false;

  const labels = scenes.map((scene, index) => {
    if (scene.dataset.chapterTitle) return scene.dataset.chapterTitle;
    return index === 0 ? "Signal" : `Chapter ${index + 1}`;
  });

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const setChapter = (index) => {
    if (index === activeChapter) return;
    activeChapter = index;
    body.dataset.cinematicChapter = String((index % 4) + 1);

    if (chapterNumber) chapterNumber.textContent = String(index + 1).padStart(2, "0");
    if (chapterLabel) chapterLabel.textContent = labels[index] || `Chapter ${index + 1}`;
  };

  const update = () => {
    const viewport = window.innerHeight || 1;
    const scrollable = document.documentElement.scrollHeight - viewport;
    const storyProgress = scrollable > 0 ? window.scrollY / scrollable : 0;
    const spotlightX = 50 + Math.sin(storyProgress * Math.PI * 1.8) * 30;
    const spotlightY = 28 + Math.cos(storyProgress * Math.PI * 1.25) * 18;

    document.documentElement.style.setProperty("--story-progress", storyProgress.toFixed(4));
    document.documentElement.style.setProperty("--cinema-x", `${spotlightX}%`);
    document.documentElement.style.setProperty("--cinema-y", `${spotlightY}%`);

    let strongest = 0;
    let strongestScore = -1;

    scenes.forEach((scene, index) => {
      const rect = scene.getBoundingClientRect();
      const center = rect.top + rect.height * 0.5;
      const progress = (center - viewport * 0.5) / viewport;
      const visibility = 1 - clamp(Math.abs(progress), 0, 1);
      const drift = mobileLight ? 0 : clamp(progress * -48, -54, 54);
      const depth = mobileLight ? 0 : clamp(progress * -22, -24, 24);

      scene.style.setProperty("--chapter-visibility", visibility.toFixed(3));
      scene.style.setProperty("--chapter-drift", `${drift}px`);
      scene.style.setProperty("--chapter-depth", `${depth}px`);

      if (visibility > strongestScore) {
        strongestScore = visibility;
        strongest = index;
      }
    });

    setChapter(strongest);

    if (progressBar) progressBar.style.transform = `scaleY(${storyProgress})`;
  };

  const prewarmScene = (scene) => {
    scene.querySelectorAll("img").forEach((image) => {
      if (lazyImages.has(image)) return;
      lazyImages.add(image);
      if (typeof image.decode === "function") {
        image.decode().catch(() => {});
      }
    });
  };

  holdTargets.forEach((target) => {
    const start = () => target.classList.add("is-holding");
    const end = () => target.classList.remove("is-holding");

    target.addEventListener("pointerdown", start);
    target.addEventListener("pointerup", end);
    target.addEventListener("pointercancel", end);
    target.addEventListener("pointerleave", end);
    target.addEventListener("touchstart", start, { passive: true });
    target.addEventListener("touchend", end);
  });

  if ("IntersectionObserver" in window) {
    const preloadObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          prewarmScene(entry.target);
        });
      },
      {
        rootMargin: "60% 0px 60% 0px",
        threshold: 0.01,
      }
    );

    scenes.forEach((scene) => preloadObserver.observe(scene));
  } else {
    scenes.forEach(prewarmScene);
  }

  update();
  if (!reduceMotion) {
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(() => {
          update();
          ticking = false;
        });
      },
      { passive: true }
    );
    window.addEventListener("resize", update, { passive: true });
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      existing.addEventListener("load", resolve, { once: true });
      existing.addEventListener("error", reject, { once: true });
      if (window.THREE) resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

async function initWebglBackground(reduceMotion, mobileLight) {
  const canvas = document.getElementById("webgl-stage");

  const shouldSkip =
    reduceMotion ||
    mobileLight ||
    !canvas ||
    window.innerWidth < 720 ||
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);

  if (shouldSkip) {
    document.body.classList.add("no-webgl");
    return;
  }

  try {
    await loadScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js");
  } catch (error) {
    document.body.classList.add("no-webgl");
    return;
  }

  const THREE = window.THREE;
  if (!THREE) {
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

  const blobGeometry = new THREE.IcosahedronGeometry(2.35, 38);
  const blobMaterial = new THREE.MeshStandardMaterial({
    color: 0x2bb9c3,
    roughness: 0.34,
    metalness: 0.12,
    transparent: true,
    opacity: 0.24,
    wireframe: true,
  });
  const blob = new THREE.Mesh(blobGeometry, blobMaterial);
  blob.position.set(3.25, -0.72, -0.4);
  scene.add(blob);

  const glowGeometry = new THREE.IcosahedronGeometry(2.15, 18);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0x1f9ea7,
    transparent: true,
    opacity: 0.11,
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.position.copy(blob.position);
  scene.add(glow);

  const fractureGeometry = new THREE.TorusKnotGeometry(1.28, 0.011, 160, 8, 2, 5);
  const fractureMaterial = new THREE.MeshBasicMaterial({
    color: 0xd8b76a,
    transparent: true,
    opacity: 0.28,
  });
  const fracture = new THREE.Mesh(fractureGeometry, fractureMaterial);
  fracture.position.copy(blob.position);
  scene.add(fracture);

  const particleCount = 520;
  const positions = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i += 1) {
    const radius = 3.2 + Math.random() * 6.4;
    const angle = Math.random() * Math.PI * 2;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 5.6;
    positions[i * 3 + 2] = Math.sin(angle) * radius - 1.4;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x8ff6fb,
    size: 0.026,
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

  const warmLight = new THREE.PointLight(0xd8b76a, 1.1, 18);
  warmLight.position.set(4, -2, 4);
  scene.add(warmLight);

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

  const palette = [
    { blob: 0x2bb9c3, glow: 0x1f9ea7, fracture: 0xd8b76a },
    { blob: 0xd8b76a, glow: 0x2bb9c3, fracture: 0xf4efe4 },
    { blob: 0x8ff6fb, glow: 0xffffff, fracture: 0xd8b76a },
    { blob: 0x1f9ea7, glow: 0xd8b76a, fracture: 0xffffff },
  ];

  const animate = () => {
    const time = clock.getElapsedTime();
    const scrollMax = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const scrollRatio = Math.min(window.scrollY / scrollMax, 1);
    const chapterFloat = scrollRatio * 6;
    const activePalette = palette[Math.min(palette.length - 1, Math.floor(scrollRatio * palette.length))];

    const pos = particleGeometry.attributes.position.array;
    for (let i = 0; i < particleCount; i += 1) {
      const pulse = Math.sin(time * 0.42 + i * 0.22 + scrollRatio * 5.6);
      pos[i * 3] = basePositions[i * 3] + Math.cos(time * 0.18 + i) * scrollRatio * 0.18;
      pos[i * 3 + 1] = basePositions[i * 3 + 1] + pulse * (0.045 + scrollRatio * 0.035);
    }
    particleGeometry.attributes.position.needsUpdate = true;

    blobMaterial.color.lerp(new THREE.Color(activePalette.blob), 0.04);
    glowMaterial.color.lerp(new THREE.Color(activePalette.glow), 0.04);
    fractureMaterial.color.lerp(new THREE.Color(activePalette.fracture), 0.04);
    keyLight.color.lerp(new THREE.Color(activePalette.glow), 0.04);
    warmLight.color.lerp(new THREE.Color(activePalette.fracture), 0.04);

    blob.rotation.x = time * 0.12 + mouse.y * 0.08 + scrollRatio * 1.8;
    blob.rotation.y = time * 0.18 + mouse.x * 0.14 + scrollRatio * 3.2;
    blob.position.x = 3.25 + mouse.x * 0.18 - scrollRatio * 5.8;
    blob.position.y = -0.72 - mouse.y * 0.12 + Math.sin(chapterFloat) * 0.38;
    blob.scale.setScalar(1 + Math.sin(scrollRatio * Math.PI) * 0.16);

    glow.rotation.copy(blob.rotation);
    glow.position.copy(blob.position);
    glow.scale.setScalar(1.05 + Math.sin(time * 0.8) * 0.035 + scrollRatio * 0.22);

    fracture.rotation.x = blob.rotation.x * -0.45 + time * 0.08;
    fracture.rotation.y = blob.rotation.y * 0.8;
    fracture.position.copy(blob.position);
    fracture.scale.setScalar(1.05 + scrollRatio * 0.62 + Math.sin(time * 1.4) * 0.04);
    fractureMaterial.opacity = 0.16 + Math.sin(scrollRatio * Math.PI) * 0.22;

    particles.rotation.y = time * 0.025 + mouse.x * 0.03 + scrollRatio * 0.7;
    particles.rotation.x = mouse.y * 0.025;
    particleMaterial.opacity = 0.42 + Math.sin(scrollRatio * Math.PI) * 0.28;

    camera.position.x += (mouse.x * 0.18 + Math.sin(scrollRatio * Math.PI * 2) * 0.7 - camera.position.x) * 0.035;
    camera.position.y += (-mouse.y * 0.12 + Math.cos(scrollRatio * Math.PI * 1.4) * 0.24 - camera.position.y) * 0.035;
    camera.position.z += (9 - scrollRatio * 1.8 - camera.position.z) * 0.035;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    window.requestAnimationFrame(animate);
  };

  animate();
}
