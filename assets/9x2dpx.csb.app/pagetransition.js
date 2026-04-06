// -----------------------------------------
// OSMO PAGE TRANSITION BOILERPLATE
// -----------------------------------------

gsap.registerPlugin(CustomEase);

history.scrollRestoration = "manual";

let lenis = null;
let nextPage = document;
let onceFunctionsInitialized = false;

const hasLenis = typeof window.Lenis !== "undefined";
const hasScrollTrigger = typeof window.ScrollTrigger !== "undefined";

const rmMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
let reducedMotion = rmMQ.matches;
rmMQ.addEventListener?.("change", (e) => (reducedMotion = e.matches));
rmMQ.addListener?.((e) => (reducedMotion = e.matches));

const pointerMQ = window.matchMedia("(pointer: coarse)");
const isTouchDevice = pointerMQ.matches;
const connection =
  navigator.connection || navigator.mozConnection || navigator.webkitConnection;
const isLowEndDevice =
  (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) ||
  (navigator.deviceMemory && navigator.deviceMemory <= 4) ||
  !!connection?.saveData ||
  /2g|3g/i.test(connection?.effectiveType || "");
const shouldUseLightAnimations = isTouchDevice || isLowEndDevice;

const has = (s) => !!nextPage.querySelector(s);

let staggerDefault = 0.05;
let durationDefault = 0.6;

CustomEase.create("osmo", "0.625, 0.05, 0, 1");
gsap.defaults({ ease: "osmo", duration: durationDefault });
gsap.config({
  autoSleep: 60,
});

if (hasScrollTrigger) {
  ScrollTrigger.config({
    limitCallbacks: true,
    ignoreMobileResize: true,
  });
}

// -----------------------------------------
// FUNCTION REGISTRY
// -----------------------------------------

function initOnceFunctions() {
  initLenis();
  if (onceFunctionsInitialized) return;
  onceFunctionsInitialized = true;

  if (has("[data-insideviews]")) initInsideViewsInfinite();

  // Runs once on first load
  // if (has('[data-something]')) initSomething();
}

function initBeforeEnterFunctions(next) {
  nextPage = next || document;
}

function initAfterEnterFunctions(next, data) {
  nextPage = next || document;

  resetWebflow(data);

  if (has("[heading-move-wrap]")) initHeadingMarquee();
  if (has(".image-content-parralax")) initImageContentParallax();
  if (has("[data-insideviews]")) initInsideViewsInfinite();
  if (has("[heading-animation]")) initHeadingMetaAnimation();
  if (has("[heading-hero-animation]")) initHeroHeadingMetaAnimation();

  if (hasLenis) {
    lenis.resize();
  }

  if (hasScrollTrigger) {
    ScrollTrigger.refresh();
  }
}

// -----------------------------------------
// PAGE TRANSITIONS
// -----------------------------------------

function runPageOnceAnimation(next) {
  const tl = gsap.timeline();

  if (reducedMotion) {
    tl.set(next, { autoAlpha: 1 });
    tl.call(() => initHeadingMarquee(next, true), null, 0);
    tl.add("pageReady");
    tl.call(resetPage, [next], "pageReady");
    return new Promise((resolve) => tl.call(resolve, null, "pageReady"));
  }

  gsap.set(next, {
    autoAlpha: 0,
    x: "10rem",
    y: "-10rem",
    rotation: -8,
    transformOrigin: "50% 0%",
    force3D: true,
  });

  tl.add("startEnter", 0.65);

  tl.call(() => initHeadingMarquee(next, true), null, "startEnter");

  tl.to(
    next,
    {
      x: "0rem",
      y: "0rem",
      duration: 0.7,
      ease: "back.out(2)",
      force3D: true,
    },
    "startEnter"
  );

  tl.to(
    next,
    {
      autoAlpha: 1,
      duration: 0.25,
      ease: "none",
    },
    "startEnter"
  );

  tl.to(
    next,
    {
      rotation: 0,
      duration: 0.48,
      ease: "power1.out",
      force3D: true,
    },
    "startEnter"
  );

  tl.add("pageReady", "startEnter+=0.7");
  tl.call(resetPage, [next], "pageReady");

  return new Promise((resolve) => {
    tl.call(resolve, null, "pageReady");
  });
}

function runPageLeaveAnimation(current, next) {
  const tl = gsap.timeline({
    onComplete: () => {
      current.remove();
    },
  });

  destroyInsideViews(current);

  if (reducedMotion) {
    return tl.set(current, { autoAlpha: 0 });
  }

  const inner = current.querySelector(".page-freeze-wrap");
  const scrollY = window.scrollY;

  if (!inner) {
    gsap.set(current, {
      transformOrigin: "50% 0%",
      force3D: true,
    });

    tl.to(current, {
      x: "-10rem",
      y: "10rem",
      rotation: 6,
      autoAlpha: 0,
      duration: 0.6,
      ease: "power1.out",
      force3D: true,
    });

    return tl;
  }

  gsap.set(current, {
    position: "fixed",
    inset: 0,
    width: "100%",
    height: window.innerHeight,
    overflow: "hidden",
    margin: 0,
    zIndex: 2,
  });

  gsap.set(inner, {
    y: -scrollY,
    transformOrigin: "50% 0%",
    width: "100%",
    force3D: true,
  });

  tl.to(inner, {
    x: "-10rem",
    y: -scrollY + 160,
    rotation: 6,
    autoAlpha: 0,
    duration: 0.6,
    ease: "power1.out",
    force3D: true,
  });

  return tl;
}

function runPageEnterAnimation(next) {
  const tl = gsap.timeline();

  if (reducedMotion) {
    tl.set(next, { autoAlpha: 1 });
    tl.call(() => initHeadingMarquee(next, true), null, 0);
    tl.call(() => initHeroHeadingMetaAnimation(next, true), null, 0);
    tl.add("pageReady");
    tl.call(resetPage, [next], "pageReady");
    return new Promise((resolve) => tl.call(resolve, null, "pageReady"));
  }

  gsap.set(next, {
    autoAlpha: 0,
    x: "10rem",
    y: "-10rem",
    rotation: -8,
    transformOrigin: "50% 0%",
    force3D: true,
  });

  tl.add("startEnter", 0.65);

  tl.call(() => initHeadingMarquee(next, true), null, "startEnter");
  tl.call(
    () => initHeroHeadingMetaAnimation(next, true),
    null,
    "startEnter+=0.1"
  );

  tl.to(
    next,
    {
      x: "0rem",
      y: "0rem",
      duration: 0.7,
      ease: "back.out(2)",
      force3D: true,
    },
    "startEnter"
  );

  tl.to(
    next,
    {
      autoAlpha: 1,
      duration: 0.25,
      ease: "none",
    },
    "startEnter"
  );

  tl.to(
    next,
    {
      rotation: 0,
      duration: 0.48,
      ease: "power1.out",
      force3D: true,
    },
    "startEnter"
  );

  tl.add("pageReady", "startEnter+=0.7");
  tl.call(resetPage, [next], "pageReady");

  return new Promise((resolve) => {
    tl.call(resolve, null, "pageReady");
  });
}

// -----------------------------------------
// BARBA HOOKS + INIT
// -----------------------------------------

barba.hooks.beforeEnter((data) => {
  // Position new container on top
  gsap.set(data.next.container, {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
  });

  if (lenis && typeof lenis.stop === "function") {
    lenis.stop();
  }

  initBeforeEnterFunctions(data.next.container);
  applyThemeFrom(data.next.container);
});

barba.hooks.afterLeave(() => {
  if (hasScrollTrigger) {
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  }
});

barba.hooks.enter((data) => {
  initBarbaNavUpdate(data);
});

barba.hooks.afterEnter((data) => {
  // Run page functions
  initAfterEnterFunctions(data.next.container, data);

  // Settle
  if (hasLenis) {
    lenis.resize();
    lenis.start();
  }

  if (hasScrollTrigger) {
    ScrollTrigger.refresh();
  }
});

barba.init({
  debug: false,
  timeout: 7000,
  preventRunning: true,
  transitions: [
    {
      name: "default",
      sync: true,

      // First load
      async once(data) {
        initOnceFunctions();

        return runPageOnceAnimation(data.next.container);
      },

      // Current page leaves
      async leave(data) {
        return runPageLeaveAnimation(
          data.current.container,
          data.next.container
        );
      },

      // New page enters
      async enter(data) {
        return runPageEnterAnimation(data.next.container);
      },
    },
  ],
});

// -----------------------------------------
// GENERIC + HELPERS
// -----------------------------------------

const themeConfig = {
  light: {
    nav: "dark",
    transition: "light",
  },
  dark: {
    nav: "light",
    transition: "dark",
  },
};

function applyThemeFrom(container) {
  const pageTheme = container?.dataset?.pageTheme || "light";
  const config = themeConfig[pageTheme] || themeConfig.light;

  document.body.dataset.pageTheme = pageTheme;
  const transitionEl = document.querySelector("[data-theme-transition]");
  if (transitionEl) {
    transitionEl.dataset.themeTransition = config.transition;
  }

  const nav = document.querySelector("[data-theme-nav]");
  if (nav) {
    nav.dataset.themeNav = config.nav;
  }
}

function initLenis() {
  if (lenis) return; // already created
  if (!hasLenis) return;

  lenis = new Lenis({
    lerp: shouldUseLightAnimations ? 0.14 : 0.165,
    wheelMultiplier: shouldUseLightAnimations ? 1.05 : 1.25,
    touchMultiplier: shouldUseLightAnimations ? 1 : 1.2,
  });

  if (hasScrollTrigger) {
    lenis.on("scroll", ScrollTrigger.update);
  }

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}

function resetPage(container) {
  window.scrollTo(0, 0);
  gsap.set(container, { clearProps: "position,top,left,right" });

  if (hasLenis) {
    lenis.resize();
    lenis.start();
  }
}

function debounceOnWidthChange(fn, ms) {
  let last = innerWidth,
    timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (innerWidth !== last) {
        last = innerWidth;
        fn.apply(this, args);
      }
    }, ms);
  };
}

function initBarbaNavUpdate(data) {
  var tpl = document.createElement("template");
  tpl.innerHTML = data.next.html.trim();
  var nextNodes = tpl.content.querySelectorAll("[data-barba-update]");
  var currentNodes = document.querySelectorAll("nav [data-barba-update]");

  currentNodes.forEach(function (curr, index) {
    var next = nextNodes[index];
    if (!next) return;

    // Aria-current sync
    var newStatus = next.getAttribute("aria-current");
    if (newStatus !== null) {
      curr.setAttribute("aria-current", newStatus);
    } else {
      curr.removeAttribute("aria-current");
    }

    // Class list sync
    var newClassList = next.getAttribute("class") || "";
    curr.setAttribute("class", newClassList);
  });
}

// -----------------------------------------
// YOUR FUNCTIONS GO BELOW HERE
// -----------------------------------------

function resetWebflow(data) {
  if (!window.Webflow) return;
  if (!data?.next?.html) return;

  const parser = new DOMParser();
  const nextDoc = parser.parseFromString(data.next.html, "text/html");

  const nextPageId = nextDoc.documentElement.getAttribute("data-wf-page");
  const nextSiteId = nextDoc.documentElement.getAttribute("data-wf-site");

  if (nextPageId) {
    document.documentElement.setAttribute("data-wf-page", nextPageId);
  }

  if (nextSiteId) {
    document.documentElement.setAttribute("data-wf-site", nextSiteId);
  }

  window.Webflow.destroy();
  window.Webflow.ready();

  try {
    window.Webflow.require("ix2")?.init();
  } catch (e) {
    console.warn("Webflow ix2 init failed:", e);
  }

  try {
    if (nextSiteId) {
      window.Webflow.require("commerce")?.init({
        siteId: nextSiteId,
        apiUrl: "https://render.webflow.com",
      });
    }
  } catch (e) {
    console.warn("Webflow commerce init failed:", e);
  }
}

function initImageContentParallax() {
  if (!hasScrollTrigger) return;

  const wraps = nextPage.querySelectorAll(".image-content-parralax");

  wraps.forEach((wrap) => {
    const image = wrap.querySelector(".image-content");
    if (!image) return;
    if (image.dataset.parallaxInitialized === "true") return;

    image.dataset.parallaxInitialized = "true";

    gsap.to(image, {
      yPercent: 5,
      ease: "none",
      scrollTrigger: {
        trigger: wrap,
        start: "top top",
        end: "bottom top",
        scrub: 1.2,
        invalidateOnRefresh: true,
      },
    });
  });
}

function initHeadingMarquee(scope = nextPage, immediate = false) {
  const wraps = scope.querySelectorAll("[heading-move-wrap]");

  wraps.forEach((wrap) => {
    const track = wrap.querySelector("[heading-move]");
    if (!track) return;

    if (track.dataset.marqueeInitialized === "true") return;
    track.dataset.marqueeInitialized = "true";

    track.innerHTML += track.innerHTML;

    gsap.set(wrap, { overflow: "hidden" });
    gsap.set(track, {
      yPercent: 100,
      xPercent: 0,
      willChange: "transform",
    });

    const tl = gsap.timeline({ paused: !immediate });

    tl.to(
      track,
      {
        yPercent: 0,
        duration: 1,
        ease: "power3.out",
      },
      0
    );

    tl.to(
      track,
      {
        xPercent: -50,
        duration: 40,
        ease: "none",
        repeat: -1,
      },
      0
    );

    if (!immediate) {
      ScrollTrigger.create({
        trigger: wrap,
        start: "top 85%",
        once: true,
        onEnter: () => tl.play(),
      });
    }
  });
}

function destroyInsideViews(scope = document) {
  const sections = scope.querySelectorAll("[data-insideviews]");

  sections.forEach((section) => {
    if (typeof section._insideviewsDestroy === "function") {
      section._insideviewsDestroy();
      delete section._insideviewsDestroy;
    }
  });
}

function initInsideViewsInfinite(scope = nextPage) {
  const sections = scope.querySelectorAll("[data-insideviews]");
  const imageUpdateInterval = shouldUseLightAnimations ? 90 : 45;
  const velocityFriction = shouldUseLightAnimations ? 0.92 : 0.95;
  const wheelStrength = shouldUseLightAnimations ? 0.85 : 1.1;
  const lerpStrength = shouldUseLightAnimations ? 0.12 : 0.14;

  sections.forEach((section) => {
    const viewport = section.querySelector(".insideviews-viewport");
    const track = section.querySelector(".insideviews-track");
    const firstSet = section.querySelector(".insideviews-set");
    const items = Array.from(section.querySelectorAll(".insideviews-item"));

    if (!viewport || !track || !firstSet || !items.length) return;
    if (section.dataset.insideviewsInitialized === "true") return;
    section.dataset.insideviewsInitialized = "true";

    let currentX = 0;
    let targetX = 0;
    let velocity = 0;
    let isPointerInside = false;
    let isIdle = false;
    let lastWrappedX = 0;
    let lastImageUpdateAt = 0;
    let loopWidth = Math.max(firstSet.offsetWidth, 1);
    let resizeObserver = null;

    const updateLoopWidth = () => {
      loopWidth = Math.max(firstSet.offsetWidth, 1);
      isIdle = false;
    };

    const updateImages = () => {
      const viewportRect = viewport.getBoundingClientRect();
      const edgeZone = viewportRect.width * 0.18;

      items.forEach((item) => {
        const rect = item.getBoundingClientRect();

        let targetHeight = 50; // normal
        const minHeight = 20; // an den Seiten

        if (rect.left < viewportRect.left + edgeZone) {
          const progress = gsap.utils.clamp(
            0,
            1,
            (rect.right - viewportRect.left) / edgeZone
          );

          targetHeight = gsap.utils.mapRange(0, 1, minHeight, 50, progress);
        }

        if (rect.right > viewportRect.right - edgeZone) {
          const progress = gsap.utils.clamp(
            0,
            1,
            (viewportRect.right - rect.left) / edgeZone
          );

          targetHeight = Math.min(
            targetHeight,
            gsap.utils.mapRange(0, 1, minHeight, 50, progress)
          );
        }

        const roundedHeight = Math.round(targetHeight * 10) / 10;
        if (item.dataset.insideviewsHeight !== String(roundedHeight)) {
          item.dataset.insideviewsHeight = String(roundedHeight);
          item.style.height = `${roundedHeight}vh`;
        }
      });
    };

    const onWheel = (e) => {
      if (!isPointerInside) return;
      e.preventDefault();

      velocity += e.deltaY * wheelStrength;
      isIdle = false;
    };

    const tick = () => {
      velocity *= velocityFriction;
      targetX -= velocity * 0.04;
      currentX += (targetX - currentX) * lerpStrength;

      const wrappedX = gsap.utils.wrap(-loopWidth, 0, currentX);
      const isMoving =
        Math.abs(velocity) > 0.02 ||
        Math.abs(targetX - currentX) > 0.05 ||
        Math.abs(wrappedX - lastWrappedX) > 0.05;

      if (!isMoving && isIdle) {
        return;
      }

      gsap.set(track, { x: wrappedX });
      lastWrappedX = wrappedX;

      const now = performance.now();
      if (
        lastImageUpdateAt === 0 ||
        now - lastImageUpdateAt >= imageUpdateInterval
      ) {
        updateImages();
        lastImageUpdateAt = now;
      }

      isIdle = !isMoving;
    };

    const onMouseEnter = () => {
      isPointerInside = true;
    };

    const onMouseLeave = () => {
      isPointerInside = false;
    };

    const onResize = debounceOnWidthChange(() => {
      updateLoopWidth();
      updateImages();
    }, 120);

    viewport.addEventListener("mouseenter", onMouseEnter);
    viewport.addEventListener("mouseleave", onMouseLeave);
    viewport.addEventListener("wheel", onWheel, { passive: false });

    gsap.ticker.add(tick);
    window.addEventListener("resize", onResize);

    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        updateLoopWidth();
      });
      resizeObserver.observe(firstSet);
      resizeObserver.observe(viewport);
    }

    section._insideviewsDestroy = () => {
      viewport.removeEventListener("mouseenter", onMouseEnter);
      viewport.removeEventListener("mouseleave", onMouseLeave);
      viewport.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
      gsap.ticker.remove(tick);
      resizeObserver?.disconnect();
    };

    updateLoopWidth();
    updateImages();
  });
}

function initHeadingMetaAnimation(scope = nextPage) {
  if (!hasScrollTrigger) return;

  function getTriggerElement(el) {
    return el.parentElement || el;
  }

  function getStartAt(...elements) {
    return elements.some((el) => el?.hasAttribute("delay")) ? 0.2 : 0;
  }

  function setupSplitText(el, type = "heading") {
    const split = new SplitText(el, { type: "words, chars" });

    gsap.set(split.words, {
      display: "inline-block",
      whiteSpace: "nowrap",
    });

    gsap.set(split.chars, {
      display: "inline-block",
      opacity: 0,
      x: "0.75rem",
      willChange: "opacity, transform",
      force3D: true,
    });

    if (type === "heading") {
      el.dataset.headingAnimationInitialized = "true";
    }

    if (type === "meta") {
      el.dataset.metaAnimationInitialized = "true";
    }

    return split;
  }

  function setupDivider(el) {
    gsap.set(el, {
      scaleX: 0,
      x: "3rem",
      transformOrigin: "left center",
      willChange: "transform",
      force3D: true,
    });

    el.dataset.dividerAnimationInitialized = "true";
  }

  // 1) Heading-Animationen
  const headings = scope.querySelectorAll("[heading-animation]");

  headings.forEach((heading) => {
    if (heading.dataset.headingAnimationInitialized === "true") return;

    const container = heading.parentElement;
    const meta =
      container?.querySelector("[meta-animation]") &&
      container.querySelector("[meta-animation]").dataset
        .metaAnimationInitialized !== "true"
        ? container.querySelector("[meta-animation]")
        : null;

    const divider =
      container?.querySelector("[divider-animation]") &&
      container.querySelector("[divider-animation]").dataset
        .dividerAnimationInitialized !== "true"
        ? container.querySelector("[divider-animation]")
        : null;

    const startAt = getStartAt(heading, meta, divider);

    const headingSplit = setupSplitText(heading, "heading");
    const metaSplit = meta ? setupSplitText(meta, "meta") : null;

    if (divider) {
      setupDivider(divider);
    }

    const cleanupTargets = [...headingSplit.chars];
    if (metaSplit) {
      cleanupTargets.push(...metaSplit.chars);
    }
    if (divider) {
      cleanupTargets.push(divider);
    }

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => gsap.set(cleanupTargets, { clearProps: "willChange" }),
    });

    tl.to(
      headingSplit.chars,
      {
        opacity: 1,
        x: "0rem",
        duration: 0.4,
        stagger: shouldUseLightAnimations ? 0.035 : 0.05,
        ease: "sine.out",
      },
      startAt
    );

    if (metaSplit) {
      tl.to(
        metaSplit.chars,
        {
          opacity: 1,
          x: "0rem",
          duration: 0.4,
          stagger: shouldUseLightAnimations ? 0.04 : 0.06,
          ease: "sine.out",
        },
        startAt
      );
    }

    if (divider) {
      tl.to(
        divider,
        {
          scaleX: 1,
          x: "0rem",
          duration: 0.8,
          ease: "power2.out",
        },
        startAt
      );
    }

    ScrollTrigger.create({
      trigger: getTriggerElement(heading),
      start: "top 75%",
      once: true,
      onEnter: () => tl.play(),
    });
  });

  // 2) Eigenständige Meta-Animationen
  const metas = scope.querySelectorAll("[meta-animation]");

  metas.forEach((meta) => {
    if (meta.dataset.metaAnimationInitialized === "true") return;

    const startAt = getStartAt(meta);
    const metaSplit = setupSplitText(meta, "meta");

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => gsap.set(metaSplit.chars, { clearProps: "willChange" }),
    });

    tl.to(
      metaSplit.chars,
      {
        opacity: 1,
        x: "0rem",
        duration: 0.4,
        stagger: shouldUseLightAnimations ? 0.04 : 0.06,
        ease: "sine.out",
      },
      startAt
    );

    ScrollTrigger.create({
      trigger: getTriggerElement(meta),
      start: "top 75%",
      once: true,
      onEnter: () => tl.play(),
    });
  });

  // 3) Eigenständige Divider-Animationen
  const dividers = scope.querySelectorAll("[divider-animation]");

  dividers.forEach((divider) => {
    if (divider.dataset.dividerAnimationInitialized === "true") return;

    const startAt = getStartAt(divider);

    setupDivider(divider);

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => gsap.set(divider, { clearProps: "willChange" }),
    });

    tl.to(
      divider,
      {
        scaleX: 1,
        x: "0rem",
        duration: 0.8,
        ease: "power2.out",
      },
      startAt
    );

    ScrollTrigger.create({
      trigger: getTriggerElement(divider),
      start: "top 75%",
      once: true,
      onEnter: () => tl.play(),
    });
  });
}

function initHeroHeadingMetaAnimation(scope = nextPage, immediate = false) {
  const wraps = scope.querySelectorAll("[hero-animation-wrap]");

  wraps.forEach((wrap) => {
    if (wrap.dataset.heroAnimationInitialized === "true") return;
    wrap.dataset.heroAnimationInitialized = "true";

    const headings = wrap.querySelectorAll("[heading-hero-animation]");
    const meta = wrap.querySelector("[meta-hero-animation]") || null;
    const dividers = wrap.querySelectorAll("[divider-hero-animation]");

    if (!headings.length) return;

    const hasDelay =
      wrap.hasAttribute("delay") ||
      [...headings].some((heading) => heading.hasAttribute("delay")) ||
      meta?.hasAttribute("delay") ||
      [...dividers].some((divider) => divider.hasAttribute("delay"));

    const startAt = hasDelay ? 0.2 : 0;

    gsap.set(headings, { opacity: 1 });

    if (meta) {
      gsap.set(meta, { opacity: 1 });
    }

    const headingSplits = [];

    headings.forEach((heading) => {
      const split = new SplitText(heading, {
        type: "words, chars",
        wordsClass: "split-word",
        charsClass: "split-char-heading",
      });

      gsap.set(split.words, {
        display: "inline-block",
        whiteSpace: "nowrap",
      });

      gsap.set(split.chars, {
        display: "inline-block",
        opacity: 0,
        x: "0.75rem",
        willChange: "opacity, transform",
        force3D: true,
      });

      headingSplits.push(split);
    });

    const metaSplit = meta
      ? new SplitText(meta, {
          type: "words, chars",
          wordsClass: "split-word",
          charsClass: "split-char-meta",
        })
      : null;

    if (metaSplit) {
      gsap.set(metaSplit.words, {
        display: "inline-block",
        whiteSpace: "nowrap",
      });

      gsap.set(metaSplit.chars, {
        display: "inline-block",
        opacity: 0,
        x: "0.3rem",
        willChange: "opacity, transform",
        force3D: true,
      });
    }

    if (dividers.length) {
      gsap.set(dividers, {
        width: "0%",
        x: "3rem",
        willChange: "width, transform",
        force3D: true,
      });
    }

    const cleanupTargets = [];
    headingSplits.forEach((split) => cleanupTargets.push(...split.chars));
    if (metaSplit) {
      cleanupTargets.push(...metaSplit.chars);
    }
    if (dividers.length) {
      cleanupTargets.push(...dividers);
    }

    const tl = gsap.timeline({
      paused: true,
      onComplete: () => gsap.set(cleanupTargets, { clearProps: "willChange" }),
    });

    headingSplits.forEach((split) => {
      tl.to(
        split.chars,
        {
          opacity: 1,
          x: "0rem",
          duration: 0.6,
          stagger: shouldUseLightAnimations ? 0.05 : 0.08,
          ease: "sine.out",
        },
        startAt
      );
    });

    if (metaSplit) {
      tl.to(
        metaSplit.chars,
        {
          opacity: 1,
          x: "0rem",
          duration: 0.12,
          stagger: shouldUseLightAnimations ? 0.012 : 0.017,
          ease: "sine.out",
        },
        startAt
      );
    }

    if (dividers.length) {
      tl.to(
        dividers,
        {
          width: "100%",
          x: "0rem",
          duration: 0.6,
          ease: "power2.out",
        },
        startAt
      );
    }

    if (immediate) {
      tl.play(0);
    } else {
      requestAnimationFrame(() => tl.play(0));
    }
  });
}
