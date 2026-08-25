/* =================================================================
   INNERMIND TECHNOLOGIES — INTERACTION ARCHITECTURE LAYER
   Vanilla JS Engine. High-performance, modular, accessible.
   Hero Canvas & Custom Cursor preserved intact.
   ================================================================= */
(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isCoarsePointer = window.matchMedia("(pointer: coarse)").matches;

  /* ---------- 1. Dynamic Footer Year ---------- */
  document.querySelectorAll("[data-year]").forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- 2. Top Scroll Progress Indicator ---------- */
  {
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);
    let ticking = false;

    const updateProgress = () => {
      const h = document.documentElement;
      const scrollable = h.scrollHeight - h.clientHeight;
      const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      bar.style.width = pct + "%";
      ticking = false;
    };

    updateProgress();
    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(updateProgress);
        ticking = true;
      }
    }, { passive: true });
    window.addEventListener("resize", updateProgress);
  }

  /* ---------- 3. Navigation Scroll State ---------- */
  const nav = document.querySelector(".nav");
  if (nav) {
    const handleNavScroll = () => {
      nav.classList.toggle("is-scrolled", window.scrollY > 12);
    };
    handleNavScroll();
    window.addEventListener("scroll", handleNavScroll, { passive: true });
  }

  /* ---------- 4. Mobile Navigation Drawer ---------- */
  const menuBtn = document.querySelector(".menu-btn");
  const mobilePanel = document.querySelector(".mobile-panel");
  if (menuBtn && mobilePanel) {
    const closeMenu = () => {
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", "Open menu");
      mobilePanel.classList.remove("is-open");
      document.body.classList.remove("nav-open");
    };

    const openMenu = () => {
      menuBtn.setAttribute("aria-expanded", "true");
      menuBtn.setAttribute("aria-label", "Close menu");
      mobilePanel.classList.add("is-open");
      document.body.classList.add("nav-open");
    };

    menuBtn.addEventListener("click", () => {
      const isOpen = menuBtn.getAttribute("aria-expanded") === "true";
      isOpen ? closeMenu() : openMenu();
    });

    mobilePanel.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeMenu);
    });

    window.addEventListener("keydown", e => {
      if (e.key === "Escape" && mobilePanel.classList.contains("is-open")) {
        closeMenu();
      }
    });
  }

  /* ---------- 5. Desktop Nav Hover Indicator Pill ---------- */
  const navLinksWrap = document.querySelector(".nav-links");
  if (navLinksWrap) {
    const links = Array.from(navLinksWrap.querySelectorAll("a"));
    const pill = document.createElement("div");
    pill.className = "nav-pill";
    pill.setAttribute("aria-hidden", "true");
    navLinksWrap.appendChild(pill);

    const positionPill = (el) => {
      if (!el) {
        pill.style.opacity = "0";
        return;
      }
      pill.style.left = el.offsetLeft + "px";
      pill.style.width = el.offsetWidth + "px";
      pill.style.opacity = "1";
    };

    const resetToActive = () => {
      const activeLink = navLinksWrap.querySelector("a.active");
      positionPill(activeLink);
    };

    links.forEach(link => {
      link.addEventListener("mouseenter", () => positionPill(link));
      link.addEventListener("focus", () => positionPill(link));
    });

    navLinksWrap.addEventListener("mouseleave", resetToActive);
    window.addEventListener("resize", resetToActive);
    resetToActive();
  }

  /* ---------- 6. Custom Cursor (Fine pointer & motion enabled) ---------- */
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

  /* ---------- 7. Magnetic Button Micro-Physics ---------- */
  if (!isCoarsePointer && !reduceMotion) {
    document.querySelectorAll(".btn").forEach(btn => {
      btn.addEventListener("mousemove", e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.22}px, ${y * 0.32}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* ---------- 8. Spotlight + 3D Tilt Surfaces ---------- */
  if (!isCoarsePointer && !reduceMotion) {
    const tiltTargets = document.querySelectorAll(".card, .tech-box, .dimension-card, .cta-band");
    const glowOnlyTargets = document.querySelectorAll(".eos-stage, .dim-panel");

    const attachSpotlight = (el, allowTilt) => {
      el.classList.add("has-spotlight");
      if (allowTilt) el.classList.add("has-tilt");
      const glow = document.createElement("div");
      glow.className = "spot-glow";
      glow.setAttribute("aria-hidden", "true");
      el.prepend(glow);

      el.addEventListener("pointermove", e => {
        const r = el.getBoundingClientRect();
        const px = ((e.clientX - r.left) / r.width) * 100;
        const py = ((e.clientY - r.top) / r.height) * 100;
        glow.style.setProperty("--sx", px + "%");
        glow.style.setProperty("--sy", py + "%");
        if (allowTilt) {
          const rx = ((e.clientY - r.top - r.height / 2) / r.height) * -5;
          const ry = ((e.clientX - r.left - r.width / 2) / r.width) * 5;
          el.style.setProperty("--tilt-x", rx.toFixed(2) + "deg");
          el.style.setProperty("--tilt-y", ry.toFixed(2) + "deg");
        }
      });
      el.addEventListener("pointerleave", () => {
        el.style.removeProperty("--tilt-x");
        el.style.removeProperty("--tilt-y");
      });
    };

    tiltTargets.forEach(el => attachSpotlight(el, true));
    glowOnlyTargets.forEach(el => attachSpotlight(el, false));
  }

  /* ---------- 9. Split-Text Headline Reveal ---------- */
  const splitIntoWords = (root) => {
    let wordIndex = 0;
    const GRADIENT_CLASSES = ["gradient", "gradient-warm"];
    const walk = (node, inheritedGradient) => {
      Array.from(node.childNodes).forEach(child => {
        if (child.nodeType === Node.TEXT_NODE) {
          const text = child.textContent;
          if (!text || !text.trim()) return;
          const frag = document.createDocumentFragment();
          text.split(/(\s+)/).forEach(part => {
            if (part === "") return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(part));
            } else {
              const span = document.createElement("span");
              span.className = inheritedGradient ? `word ${inheritedGradient}` : "word";
              span.style.setProperty("--stagger", (wordIndex * 0.032) + "s");
              span.textContent = part;
              wordIndex += 1;
              frag.appendChild(span);
            }
          });
          node.replaceChild(frag, child);
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          let grad = inheritedGradient;
          GRADIENT_CLASSES.forEach(gc => {
            if (child.classList.contains(gc)) grad = gc;
          });
          walk(child, grad);
        }
      });
    };
    walk(root, null);
  };

  if (!reduceMotion) {
    document.querySelectorAll(".hero-inner h1, .page-hero h1, .quote").forEach(el => {
      el.classList.remove("reveal");
      el.classList.add("split-reveal");
      splitIntoWords(el);
    });
  }

  /* ---------- 10. Reveal Trigger Observer ---------- */
  document.querySelectorAll(".hero-inner, .page-hero .container").forEach(container => {
    container.classList.add("reveal-group");
    Array.from(container.children).forEach(child => {
      if (!child.classList.contains("split-reveal")) child.classList.add("reveal");
    });
  });

  const revealEls = document.querySelectorAll(".reveal, .split-reveal");
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
      }, { threshold: 0.14, rootMargin: "0px 0px -30px 0px" });
      revealEls.forEach(el => io.observe(el));
    }
  }

  /* ---------- 11. EOS Pipeline Flow Animation ---------- */
  const eosDiagram = document.querySelector(".eos-diagram");
  if (eosDiagram) {
    let svgRoot = null;
    eosDiagram.querySelectorAll(".eos-path-solid").forEach(path => {
      const len = path.getTotalLength ? path.getTotalLength() : 1000;
      path.style.setProperty("--len", len);
      svgRoot = path.ownerSVGElement;

      if (!reduceMotion && svgRoot) {
        const svgNS = "http://www.w3.org/2000/svg";
        const pathId = "eosFlowPath";
        path.setAttribute("id", pathId);
        [0, 0.5].forEach((phase, idx) => {
          const dot = document.createElementNS(svgNS, "circle");
          dot.setAttribute("r", "3.6");
          dot.setAttribute("fill", idx === 0 ? "#4de8dc" : "#9b7dff");
          dot.setAttribute("opacity", "0.95");
          const motion = document.createElementNS(svgNS, "animateMotion");
          motion.setAttribute("dur", "4.2s");
          motion.setAttribute("repeatCount", "indefinite");
          motion.setAttribute("begin", (phase * 4.2) + "s");
          motion.setAttribute("rotate", "auto");
          const mpath = document.createElementNS(svgNS, "mpath");
          mpath.setAttributeNS("http://www.w3.org/1999/xlink", "href", "#" + pathId);
          motion.appendChild(mpath);
          dot.appendChild(motion);
          svgRoot.appendChild(dot);
        });
        if (svgRoot.pauseAnimations) svgRoot.pauseAnimations();
      }
    });

    if (reduceMotion || !("IntersectionObserver" in window)) {
      eosDiagram.classList.add("is-visible");
    } else {
      const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            eosDiagram.classList.add("is-visible");
            if (svgRoot && svgRoot.unpauseAnimations) svgRoot.unpauseAnimations();
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.25 });
      io.observe(eosDiagram);
    }
  }

  /* ---------- 12. 15 Dimensions Constellation Radial Model ---------- */
  const constellation = document.querySelector(".constellation");
  if (constellation) {
    const nodesData = window.INNERMIND_DIMENSIONS || [];
    const ring = constellation.querySelector(".constellation-ring");
    const core = constellation.querySelector(".constellation-core");

    const svgNS = "http://www.w3.org/2000/svg";
    const connectorSvg = document.createElementNS(svgNS, "svg");
    connectorSvg.setAttribute("viewBox", "0 0 100 100");
    connectorSvg.setAttribute("class", "constellation-connector");
    connectorSvg.setAttribute("aria-hidden", "true");
    const connectorLine = document.createElementNS(svgNS, "line");
    connectorLine.setAttribute("x1", "50");
    connectorLine.setAttribute("y1", "50");
    connectorLine.setAttribute("x2", "50");
    connectorLine.setAttribute("y2", "50");
    connectorLine.setAttribute("stroke", "#4de8dc");
    connectorLine.setAttribute("stroke-width", "0.4");
    connectorLine.setAttribute("opacity", "0.75");
    connectorSvg.appendChild(connectorLine);
    if (core) core.insertAdjacentElement("afterend", connectorSvg);

    const nodesLayer = document.createElement("div");
    nodesLayer.className = "constellation-nodes";
    nodesLayer.style.position = "absolute";
    nodesLayer.style.inset = "0";
    constellation.appendChild(nodesLayer);

    const panelIndex = document.querySelector("[data-dim-index]");
    const panelName = document.querySelector("[data-dim-name]");
    const panelDesc = document.querySelector("[data-dim-desc]");
    const panelFields = [panelIndex, panelName, panelDesc].filter(Boolean);
    const positions = [];

    const applyContent = (i) => {
      const d = nodesData[i];
      if (!d) return;
      if (panelIndex) panelIndex.textContent = `${String(i + 1).padStart(2, "0")} / ${String(nodesData.length).padStart(2, "0")}`;
      if (panelName) panelName.textContent = d.name;
      if (panelDesc) panelDesc.textContent = d.desc;
    };

    const setActiveNode = (i) => {
      nodesLayer.querySelectorAll(".dim-node").forEach(n => n.classList.remove("is-active"));
      const node = nodesLayer.querySelector(`[data-i="${i}"]`);
      if (node) node.classList.add("is-active");

      const pos = positions[i];
      if (pos) {
        connectorLine.setAttribute("x2", pos.x.toFixed(2));
        connectorLine.setAttribute("y2", pos.y.toFixed(2));
      }

      if (reduceMotion || !panelFields.length) {
        applyContent(i);
      } else {
        panelFields.forEach(el => { el.style.opacity = "0"; });
        setTimeout(() => {
          applyContent(i);
          panelFields.forEach(el => { el.style.opacity = "1"; });
        }, 120);
      }
    };

    const total = nodesData.length;
    const R = 46;
    nodesData.forEach((d, i) => {
      const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
      const x = 50 + R * Math.cos(angle);
      const y = 50 + R * Math.sin(angle);
      positions.push({ x, y });
      const btn = document.createElement("button");
      btn.className = "dim-node";
      btn.type = "button";
      btn.style.setProperty("--x", x + "%");
      btn.style.setProperty("--y", y + "%");
      btn.dataset.i = i;
      btn.setAttribute("aria-label", `Dimension: ${d.name}`);
      btn.addEventListener("mouseenter", () => setActiveNode(i));
      btn.addEventListener("focus", () => setActiveNode(i));
      btn.addEventListener("click", () => setActiveNode(i));
      nodesLayer.appendChild(btn);
    });

    if (total) setActiveNode(0);

    if (ring) {
      constellation.addEventListener("mouseenter", () => { ring.style.animationPlayState = "paused"; });
      constellation.addEventListener("mouseleave", () => { ring.style.animationPlayState = "running"; });
      constellation.addEventListener("focusin", () => { ring.style.animationPlayState = "paused"; });
      constellation.addEventListener("focusout", () => { ring.style.animationPlayState = "running"; });
    }
  }

  /* ---------- 13. Applications Multi-Domain Explorer ---------- */
  const explorer = document.querySelector(".explorer");
  if (explorer) {
    const tabsWrap = explorer.querySelector(".explorer-tabs");
    const tabs = Array.from(explorer.querySelectorAll(".explorer-tab"));
    const panels = explorer.querySelectorAll(".explorer-panel");

    const indicator = document.createElement("div");
    indicator.className = "explorer-indicator";
    indicator.setAttribute("aria-hidden", "true");
    if (tabsWrap) tabsWrap.prepend(indicator);

    const moveIndicator = (tab) => {
      if (!indicator || !tab) return;
      const isMobile = window.matchMedia("(max-width:1100px)").matches;
      if (isMobile) {
        indicator.style.height = "100%";
        indicator.style.width = tab.offsetWidth + "px";
        indicator.style.transform = `translateX(${tab.offsetLeft}px)`;
      } else {
        indicator.style.width = "100%";
        indicator.style.height = tab.offsetHeight + "px";
        indicator.style.transform = `translateY(${tab.offsetTop}px)`;
      }
    };

    const activateTab = (tab) => {
      const target = tab.getAttribute("data-target");
      tabs.forEach(t => {
        const isActive = t === tab;
        t.classList.toggle("is-active", isActive);
        t.setAttribute("aria-selected", isActive ? "true" : "false");
        t.tabIndex = isActive ? 0 : -1;
      });
      panels.forEach(p => p.classList.toggle("is-active", p.id === target));
      moveIndicator(tab);
    };

    tabs.forEach((tab, i) => {
      tab.addEventListener("click", () => activateTab(tab));
      tab.addEventListener("keydown", e => {
        const isHorizontal = window.matchMedia("(max-width:1100px)").matches;
        const nextKey = isHorizontal ? "ArrowRight" : "ArrowDown";
        const prevKey = isHorizontal ? "ArrowLeft" : "ArrowUp";
        let target = null;
        if (e.key === nextKey) target = tabs[(i + 1) % tabs.length];
        if (e.key === prevKey) target = tabs[(i - 1 + tabs.length) % tabs.length];
        if (target) {
          e.preventDefault();
          target.focus();
          activateTab(target);
        }
      });
    });

    const initialTab = tabs.find(t => t.classList.contains("is-active")) || tabs[0];
    requestAnimationFrame(() => moveIndicator(initialTab));
    window.addEventListener("resize", () => moveIndicator(explorer.querySelector(".explorer-tab.is-active") || initialTab));
  }

  /* ---------- 14. Hero Cognitive Field Canvas (PRESERVED) ---------- */
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
      step();
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
