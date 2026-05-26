(() => {
  const root = document.documentElement;
  const canvas = document.getElementById("film-canvas");
  const ctx = canvas.getContext("2d");
  const scenes = [...document.querySelectorAll(".film-scene")];
  const depthItems = [...document.querySelectorAll("[data-depth]")];
  const holdTargets = [...document.querySelectorAll("[data-hold-reveal]")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width = 0;
  let height = 0;
  let pixelRatio = 1;
  let particles = [];
  let mouseX = 0.72;
  let mouseY = 0.28;

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    pixelRatio = Math.min(window.devicePixelRatio || 1, 1.6);

    canvas.width = Math.floor(width * pixelRatio);
    canvas.height = Math.floor(height * pixelRatio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const count = width < 720 ? 72 : 128;
    particles = Array.from({ length: count }, (_, index) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.8 + 0.4,
      speed: Math.random() * 0.25 + 0.08,
      drift: Math.random() * 0.7 + 0.15,
      phase: index * 0.41,
    }));
  };

  const sceneProgress = (scene) => {
    const rect = scene.getBoundingClientRect();
    const center = rect.top + rect.height * 0.5;
    const distance = Math.abs(center - height * 0.5);
    const active = 1 - clamp(distance / (height * 0.82), 0, 1);
    const local = clamp((height - rect.top) / (height + rect.height), 0, 1);
    return { active, local };
  };

  const updateScroll = () => {
    const scrollable = document.documentElement.scrollHeight - height;
    const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
    root.style.setProperty("--progress", progress.toFixed(4));
    root.style.setProperty("--spot-x", `${52 + Math.sin(progress * Math.PI * 1.6) * 28}%`);
    root.style.setProperty("--spot-y", `${24 + Math.cos(progress * Math.PI * 1.2) * 18}%`);

    scenes.forEach((scene) => {
      const { active, local } = sceneProgress(scene);
      scene.style.setProperty("--copy-opacity", (0.22 + active * 0.78).toFixed(3));
      scene.style.setProperty("--copy-y", `${(1 - active) * 54}px`);
      scene.style.setProperty("--object-opacity", (0.2 + active * 0.8).toFixed(3));
      scene.style.setProperty("--object-y", `${(0.5 - local) * -80}px`);
      scene.style.setProperty("--object-rx", `${(0.5 - local) * 8}deg`);
      scene.style.setProperty("--object-ry", `${-10 + local * 18}deg`);
    });

    depthItems.forEach((item) => {
      const depth = Number(item.dataset.depth || 0.1);
      const rect = item.getBoundingClientRect();
      const shift = (rect.top + rect.height * 0.5 - height * 0.5) * depth * -0.25;
      item.style.setProperty("--object-x", `${(mouseX - 0.5) * depth * 80}px`);
      item.style.setProperty("--depth-y", `${shift}px`);
    });
  };

  const draw = (time) => {
    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createRadialGradient(
      width * mouseX,
      height * mouseY,
      0,
      width * mouseX,
      height * mouseY,
      Math.max(width, height) * 0.75
    );
    gradient.addColorStop(0, "rgba(43, 185, 195, 0.17)");
    gradient.addColorStop(0.38, "rgba(216, 183, 106, 0.07)");
    gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    particles.forEach((particle) => {
      particle.y -= particle.speed;
      particle.x += Math.sin(time * 0.0004 + particle.phase) * particle.drift;

      if (particle.y < -10) {
        particle.y = height + 10;
        particle.x = Math.random() * width;
      }

      const alpha = 0.18 + Math.sin(time * 0.001 + particle.phase) * 0.12;
      ctx.fillStyle = `rgba(203, 248, 250, ${alpha})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();

    if (!reduceMotion) {
      window.requestAnimationFrame(draw);
    }
  };

  holdTargets.forEach((target) => {
    target.addEventListener("pointerdown", () => target.classList.add("is-holding"));
    target.addEventListener("pointerup", () => target.classList.remove("is-holding"));
    target.addEventListener("pointerleave", () => target.classList.remove("is-holding"));
    target.addEventListener("touchstart", () => target.classList.add("is-holding"), { passive: true });
    target.addEventListener("touchend", () => target.classList.remove("is-holding"));
  });

  window.addEventListener("pointermove", (event) => {
    mouseX = event.clientX / Math.max(width, 1);
    mouseY = event.clientY / Math.max(height, 1);
    updateScroll();
  }, { passive: true });

  window.addEventListener("resize", () => {
    resize();
    updateScroll();
  }, { passive: true });

  window.addEventListener("scroll", updateScroll, { passive: true });

  resize();
  updateScroll();
  draw(0);
})();
