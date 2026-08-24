/* =================================================================
   INNERMIND TECHNOLOGIES — INTERACTION LAYER
   Vanilla JS. Every module checks for its DOM target before running,
   so this single file is safe to include on every page.
   ================================================================= */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Nav scroll state ---------- */
  const nav = document.querySelector(".nav");
  if (nav) {
    const setScrolled = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
    setScrolled();
    window.addEventListener("scroll", setScrolled, { passive: true });
  }

  /* ---------- Mobile navigation panel ---------- */
  const menuBtn = document.querySelector(".menu-btn");
  const mobilePanel = document.querySelector(".mobile-panel");
  if (menuBtn && mobilePanel) {
    const closePanel = () => {
      menuBtn.setAttribute("aria-expanded", "false");
      mobilePanel.classList.remove("is-open");
      document.body.classList.remove("nav-open");
    };
    const openPanel = () => {
      menuBtn.setAttribute("aria-expanded", "true");
      mobilePanel.classList.add("is-open");
      document.body.classList.add("nav-open");
    };
    menuBtn.addEventListener("click", () => {
      const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
      isOpen ? closePanel() : openPanel();
    });
    mobilePanel.querySelectorAll("a").forEach(a => a.addEventListener("click", closePanel));
    window.addEventListener("keydown", e => {
      if (e.key === "Escape") closePanel();
    });
  }

  /* ---------- Custom cursor (fine pointer only, motion allowed) ---------- */
  if (!isCoarsePointer && !reduceMotion && window.matchMedia("(min-width:801px)").matches) {
    const dot = document.createElement("div");
    dot.className = "cursor-dot";
    const ring = document.createElement("div");
    ring.className = "cursor-ring";
    document.body.append(dot, ring);
    document.documentElement.classList.add("has-custom-cursor");

    let mx = -100, my = -100, rx = -100, ry = -100;

    window.addEventListener("pointermove", e => {
      mx = e.clientX;
      my = e.clientY;
    });

    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    const interactiveSelector = "a, button, input, textarea, .dim-node, [data-cursor]";
    document.addEventListener("mouseover", e => {
      if (e.target.closest && e.target.closest(interactiveSelector)) {
        ring.classList.add("is-active");
      }
    });
    document.addEventListener("mouseout", e => {
      if (e.target.closest && e.target.closest(interactiveSelector)) {
        ring.classList.remove("is-active");
      }
    });
  }

  /* ---------- Magnetic buttons ---------- */
  if (!isCoarsePointer && !reduceMotion) {
    document.querySelectorAll(".btn").forEach(btn => {
      btn.addEventListener("mousemove", e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.22}px, ${y * 0.32}px)`;
      });
      btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
    });
  }

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length) {
    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealEls.forEach(el => el.classList.add("is-visible"));
    } else {
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.16, rootMargin: "0px 0px -40px 0px" });
      revealEls.forEach(el => io.observe(el));
    }
  }

  /* ---------- EOS architecture diagram (draw-on-scroll) ---------- */
  const eosDiagram = document.querySelector(".eos-diagram");
  if (eosDiagram) {
    eosDiagram.querySelectorAll(".eos-path-solid").forEach(path => {
      const len = path.getTotalLength ? path.getTotalLength() : 1000;
      path.style.setProperty("--len", len);
    });
    if (reduceMotion || !("IntersectionObserver" in window)) {
      eosDiagram.classList.add("is-visible");
    } else {
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            eosDiagram.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.28 });
      io.observe(eosDiagram);
    }
  }

  /* ---------- Dimensions constellation ---------- */
  const constellation = document.querySelector(".constellation");
  if (constellation) {
    const nodesData = window.INNERMIND_DIMENSIONS || [];
    const ring = constellation.querySelector(".constellation-ring");
    const nodesLayer = document.createElement("div");
    nodesLayer.className = "constellation-nodes";
    nodesLayer.style.position = "absolute";
    nodesLayer.style.inset = "0";
    constellation.appendChild(nodesLayer);

    const panelIndex = document.querySelector("[data-dim-index]");
    const panelName = document.querySelector("[data-dim-name]");
    const panelDesc = document.querySelector("[data-dim-desc]");

    const setActive = (i) => {
      nodesLayer.querySelectorAll(".dim-node").forEach(n => n.classList.remove("is-active"));
      const node = nodesLayer.querySelector(`[data-i="${i}"]`);
      if (node) node.classList.add("is-active");
      const d = nodesData[i];
      if (d && panelIndex && panelName && panelDesc) {
        panelIndex.textContent = `${String(i + 1).padStart(2, "0")} / ${String(nodesData.length).padStart(2, "0")}`;
        panelName.textContent = d.name;
        panelDesc.textContent = d.desc;
      }
    };

    const total = nodesData.length;
    const R = 46; // percent radius
    nodesData.forEach((d, i) => {
      const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
      const x = 50 + R * Math.cos(angle);
      const y = 50 + R * Math.sin(angle);
      const btn = document.createElement("button");
      btn.className = "dim-node";
      btn.type = "button";
      btn.style.setProperty("--x", x + "%");
      btn.style.setProperty("--y", y + "%");
      btn.dataset.i = i;
      btn.setAttribute("aria-label", d.name);
      btn.addEventListener("mouseenter", () => setActive(i));
      btn.addEventListener("focus", () => setActive(i));
      btn.addEventListener("click", () => setActive(i));
      nodesLayer.appendChild(btn);
    });

    if (total) setActive(0);

    // pause ambient rotation while the visitor is engaging with it
    if (ring) {
      constellation.addEventListener("mouseenter", () => { ring.style.animationPlayState = "paused"; });
      constellation.addEventListener("mouseleave", () => { ring.style.animationPlayState = "running"; });
      constellation.addEventListener("focusin", () => { ring.style.animationPlayState = "paused"; });
      constellation.addEventListener("focusout", () => { ring.style.animationPlayState = "running"; });
    }
  }

  /* ---------- Applications explorer ---------- */
  const explorer = document.querySelector(".explorer");
  if (explorer) {
    const tabs = Array.from(explorer.querySelectorAll(".explorer-tab"));
    const panels = explorer.querySelectorAll(".explorer-panel");
    const activate = (tab) => {
      const target = tab.getAttribute("data-target");
      tabs.forEach(t => {
        t.classList.toggle("is-active", t === tab);
        t.setAttribute("aria-selected", t === tab ? "true" : "false");
        t.tabIndex = t === tab ? 0 : -1;
      });
      panels.forEach(p => p.classList.toggle("is-active", p.id === target));
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => activate(tab));
      tab.addEventListener("keydown", e => {
        const horizontal = window.matchMedia("(max-width:1080px)").matches;
        const nextKey = horizontal ? "ArrowRight" : "ArrowDown";
        const prevKey = horizontal ? "ArrowLeft" : "ArrowUp";
        let target = null;
        if (e.key === nextKey) target = tabs[(i + 1) % tabs.length];
        if (e.key === prevKey) target = tabs[(i - 1 + tabs.length) % tabs.length];
        if (target) {
          e.preventDefault();
          target.focus();
          activate(target);
        }
      });
    });
  }

  /* ---------- Hero cognitive field (canvas) ---------- */
  const fieldWrap = document.querySelector(".hero-field");
  if (fieldWrap) {
    const canvas = document.createElement("canvas");
    fieldWrap.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    let w, h, dpr;
    let points = [];
    let raf = null;
    let running = false;
    const pointer = { x: -9999, y: -9999, active: false };

    const COLORS = ["77,232,220", "93,140,255", "155,125,255"];

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = fieldWrap.clientWidth;
      h = fieldWrap.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const density = Math.max(38, Math.min(80, Math.floor((w * h) / 22000)));
      points = Array.from({ length: density }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.4 + 0.6,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    }

    function step() {
      ctx.clearRect(0, 0, w, h);
      const linkDist = Math.min(150, w * 0.14);

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        if (pointer.active) {
          const dx = p.x - pointer.x, dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 26000) {
            const d = Math.sqrt(d2) || 1;
            p.x += (dx / d) * 0.25;
            p.y += (dy / d) * 0.25;
          }
        }
      }

      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i], b = points[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < linkDist) {
            const alpha = (1 - dist / linkDist) * 0.22;
            ctx.strokeStyle = `rgba(${a.c},${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      if (pointer.active) {
        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          const dx = p.x - pointer.x, dy = p.y - pointer.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 170) {
            const alpha = (1 - dist / 170) * 0.35;
            ctx.strokeStyle = `rgba(77,232,220,${alpha})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.c},.85)`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      if (running) raf = requestAnimationFrame(step);
    }

    function start() {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(step);
    }
    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
    }

    resize();
    if (reduceMotion) {
      step(); // draw a single static frame, no continuous animation
    } else {
      start();
      let resizeTimer;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resize, 160);
      });
      fieldWrap.addEventListener("pointermove", e => {
        const r = fieldWrap.getBoundingClientRect();
        pointer.x = e.clientX - r.left;
        pointer.y = e.clientY - r.top;
        pointer.active = true;
      });
      fieldWrap.addEventListener("pointerleave", () => { pointer.active = false; });

      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(entries => {
          entries.forEach(entry => (entry.isIntersecting ? start() : stop()));
        }, { threshold: 0 });
        io.observe(fieldWrap);
      }
      document.addEventListener("visibilitychange", () => {
        document.hidden ? stop() : start();
      });
    }
  }
})();
