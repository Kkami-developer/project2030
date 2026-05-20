/* ===========================
   NAV 스크롤 효과
=========================== */
const nav = document.querySelector(".nav");

const updateNav = () => {
  if (!nav) return;
  nav.classList.toggle("is-scrolled", window.scrollY > 12);
};

window.addEventListener("scroll", updateNav, { passive: true });
updateNav();

/* ===========================
   맨 위로 버튼 (페이지 맨 아래에서만)
=========================== */
const scrollTopBtn = document.getElementById("scrollToTop");
if (scrollTopBtn) {
  const updateScrollTopBtn = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const isBottom = max - window.scrollY < 80;
    scrollTopBtn.classList.toggle("is-visible", isBottom);
  };
  window.addEventListener("scroll", updateScrollTopBtn, { passive: true });
  window.addEventListener("resize", updateScrollTopBtn);
  updateScrollTopBtn();
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ===========================
   스크롤 버튼
=========================== */
const scrollToSection = (el) => {
  if (!el) return;
  const navH = nav ? nav.getBoundingClientRect().height : 0;
  const top = el.getBoundingClientRect().top + window.scrollY - navH;
  window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
};

const getSnapSections = () =>
  [...document.querySelectorAll("main .section-snap")];

document.querySelectorAll("[data-scroll-target]").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    const isMobile = window.matchMedia("(max-width: 640px)").matches;
    if (isMobile && btn.id === "scrollDown") {
      const navH = nav ? nav.getBoundingClientRect().height : 0;
      const y = window.scrollY + navH + 12;
      const next =
        getSnapSections().find((sec) => sec.offsetTop > y) ||
        document.querySelector(btn.dataset.scrollTarget);
      scrollToSection(next);
      return;
    }
    const target = document.querySelector(btn.dataset.scrollTarget);
    scrollToSection(target);
  });
});

/* ===========================
   페이드인 (IntersectionObserver)
=========================== */
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

document.querySelectorAll(".fade-in").forEach((el) => fadeObserver.observe(el));

/* ===========================
   줄 단위 스크롤 등장 (reveal-line)
=========================== */
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.35, rootMargin: "0px 0px -8% 0px" }
  );
  document.querySelectorAll(".reveal-line:not(.is-visible)").forEach((el) => revealObserver.observe(el));
} else {
  document.querySelectorAll(".reveal-line").forEach((el) => el.classList.add("is-visible"));
}

/* ===========================
   긴박감 타임라인 — 지금에서 이어지는 화살표
=========================== */
const urgencyTimeline = document.getElementById("urgencyTimeline");
if (urgencyTimeline) {
  const runUrgencyTimeline = () => {
    urgencyTimeline.classList.add("is-connected");
    if (prefersReducedMotion) {
      urgencyTimeline.classList.add("is-step-5");
      return;
    }
    const stepMs = 620;
    [1, 2, 3, 4, 5].forEach((step, i) => {
      setTimeout(() => urgencyTimeline.classList.add(`is-step-${step}`), i * stepMs);
    });
  };
  const urgencyTlObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        runUrgencyTimeline();
        urgencyTlObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -5% 0px" }
  );
  urgencyTlObserver.observe(urgencyTimeline);
  if (prefersReducedMotion) runUrgencyTimeline();
}

/* ===========================
   섹션 패널 전환 (스크롤 몰입)
=========================== */
if (!prefersReducedMotion) {
  const panelSections = document.querySelectorAll(".section-snap");
  const panelObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("is-panel-in", entry.isIntersecting);
      });
    },
    { threshold: 0.22, rootMargin: "-12% 0px -12% 0px" }
  );
  panelSections.forEach((sec) => {
    if (sec.id === "hero") return;
    sec.classList.add("section-panel");
    panelObserver.observe(sec);
  });
}

/* ===========================
   스토리 카드 — 상세 모달
=========================== */
const STORY_DATA = {
  debate: {
    tag: "2025 대선 기후 의제 격상",
    title: "대선 토론장에 최초로 기후를 올렸습니다",
    body: `<p>2025년 대선을 앞두고 녹색전환연구소와 시민·연대 단체는 기후위기 대응을 공식 토론 의제로 올릴 것을 캠페인했습니다. <strong>온라인 청원 1,600명</strong>, <strong>오프라인 서명 800명 이상</strong>이 모였고, 시민이 적어주신 <strong>784개</strong>의 기후 질문을 정리해 후보자에게 전달했습니다. 그 결과 한국 선거 역사상 처음으로 대선 후보 2차 TV토론회에서 기후위기가 단일 의제로 채택됐습니다.</p>`,
  },
  governance: {
    tag: "2025-2026 정부 구조 개편",
    title: "'기후 정부'의 거버넌스를 그렸습니다",
    body: `<p>연구소는 기후위기 대응을 위한 정부 조직 개편안을 제안했습니다. <strong>기후에너지환경부</strong> 신설, <strong>국립기후과학원</strong> 설립, <strong>기후시민회의</strong> 도입 등이 핵심이었습니다.</p>
<p>2025년 대선을 앞두고 마련한 공동 기후공약 30개 중 상당수가 현 정부 123개 국정과제에 반영됐고, 기후시민회의 신설 등이 포함됐습니다. 연구소의 개편안은 법적·제도적 근거 마련으로 이어졌습니다.</p>
<ul>
<li>기후에너지환경부</li>
<li>국립기후과학원 설립 추진</li>
<li>기후시민회의 시범 운영·제도화 논의</li>
</ul>`,
  },
  plans226: {
    tag: "2025-2026 · 전수 분석",
    title: "전국 지자체 탄소중립 계획, 전면 재설계 필요를 밝혔습니다",
    body: `<p>2026년 6월 지방선거를 앞두고 연구소는 전국 <strong>226개</strong> 기초지자체의 탄소중립 기본계획을 8개월간 전수 분석했습니다.</p>
<p>10곳 중 4곳은 전면 재설계가 필요한 수준이라는 결론을 냈고, 그 결과는 한국환경공단 탄소중립 기본계획 가이드라인 개정안에 반영되고 있습니다. 민간 독립 싱크탱크이기 때문에 가능한 일이었습니다.</p>`,
  },
  esg: {
    tag: "2024-2026 · 공론장 형성",
    title: "ESG 공시, 기업의 기후 책임으로",
    body: `<p>2024년부터 연구소는 금융위 ESG 공시 로드맵이 기후 책임을 충분히 담지 못한다는 점을 지적하며 공론장을 열었습니다. 투자·회계 전문가의 영역이던 ESG를 <strong>기후·에너지 문제</strong>로 끌어올렸습니다.</p>
<p>2025년 탄소중립·녹색성장 기본법 개정과 중소기업 녹색전환 지원 등 국정과제에도 연구소 제안이 반영되었습니다. 기업의 기후공시가 시민의 삶과 연결되는 제도로 바뀌도록 압력을 이어가고 있습니다.</p>`,
  },
};

const storyModal = document.getElementById("storyModal");
const storyModalTag = document.getElementById("storyModalTag");
const storyModalTitle = document.getElementById("storyModalTitle");
const storyModalBody = document.getElementById("storyModalBody");
let storyModalLastFocus = null;

const openStoryModal = (key) => {
  const data = STORY_DATA[key];
  if (!data || !storyModal) return;
  storyModalTag.textContent = data.tag;
  storyModalTitle.textContent = data.title;
  storyModalBody.innerHTML = data.body;
  storyModalLastFocus = document.activeElement;
  storyModal.hidden = false;
  storyModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  storyModal.querySelector(".story-modal__close")?.focus();
};

const closeStoryModal = () => {
  if (!storyModal || storyModal.hidden) return;
  storyModal.hidden = true;
  storyModal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (storyModalLastFocus && typeof storyModalLastFocus.focus === "function") {
    storyModalLastFocus.focus();
  }
};

document.querySelectorAll(".story-item--clickable[data-story]").forEach((item) => {
  const open = () => openStoryModal(item.dataset.story);
  item.addEventListener("click", open);
  item.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      open();
    }
  });
});

storyModal?.querySelectorAll("[data-story-close]").forEach((el) => {
  el.addEventListener("click", closeStoryModal);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeStoryModal();
});
document.addEventListener("keydown", (e) => {
  if (!storyModal || storyModal.hidden || e.key !== "Tab") return;
  const focusable = [...storyModal.querySelectorAll(
    'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
  )].filter(el => !el.closest("[hidden]"));
  if (!focusable.length) return;
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (e.shiftKey) {
    if (document.activeElement === first) { e.preventDefault(); last.focus(); }
  } else {
    if (document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

/* ===========================
   임팩트 카운터 애니메이션
=========================== */
const counterEls = document.querySelectorAll(".impact-num[data-target]");

const animateCounter = (el) => {
  const target = parseInt(el.dataset.target, 10);
  const block = el.closest(".stories-stat");
  const numWrap = el.closest(".stories-stat__num");
  const isStoriesStatNum = Boolean(numWrap);
  el.classList.add("is-counted");
  if (prefersReducedMotion) {
    el.textContent = target;
    if (numWrap && !isStoriesStatNum) numWrap.style.transform = "scale(1)";
    block?.classList.add("is-visible");
    return;
  }
  const duration = isStoriesStatNum ? 1400 : 2000;
  const start = performance.now();
  block?.classList.add("is-counting");
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);
    el.textContent = value;
    if (numWrap && !isStoriesStatNum) {
      const scale = 0.35 + eased * 0.65;
      numWrap.style.transform = `scale(${scale})`;
    }
    if (progress < 1) requestAnimationFrame(tick);
    else {
      el.textContent = target;
      if (numWrap && !isStoriesStatNum) numWrap.style.transform = "scale(1)";
      block?.classList.remove("is-counting");
    }
  };
  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      if (entry.target.classList.contains("impact-num")) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
        return;
      }
      if (entry.target.id === "storiesStat") {
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.22, rootMargin: "0px 0px -8% 0px" }
);

const storiesStatBlock = document.getElementById("storiesStat");
const impactTitleMark = document.getElementById("impactTitleMark");

const runStoriesStatSequence = () => {
  if (!storiesStatBlock) return;
  impactTitleMark?.classList.add("is-visible");
  storiesStatBlock.classList.add("is-visible");
  window.setTimeout(() => {
    storiesStatBlock.classList.add("is-seq-cover");
  }, 520);
  window.setTimeout(() => {
    storiesStatBlock.classList.add("is-seq-num");
    const num = storiesStatBlock.querySelector(".impact-num[data-target]");
    if (num && !num.classList.contains("is-counted")) animateCounter(num);
  }, 1120);
};

if (storiesStatBlock && impactTitleMark && !prefersReducedMotion) {
  let sequencePlayed = false;
  const isMobileStat = () => window.matchMedia("(max-width: 720px)").matches;
  const statSeqObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting || sequencePlayed) return;
        sequencePlayed = true;
        runStoriesStatSequence();
        statSeqObserver.unobserve(entry.target);
      });
    },
    {
      threshold: isMobileStat() ? 0.08 : 0.2,
      rootMargin: isMobileStat() ? "0px 0px 0px 0px" : "0px 0px -10% 0px",
    }
  );
  statSeqObserver.observe(storiesStatBlock);
} else if (storiesStatBlock) {
  impactTitleMark?.classList.add("is-visible");
  storiesStatBlock.classList.add("is-visible", "is-seq-cover", "is-seq-num");
  const num = storiesStatBlock.querySelector(".impact-num[data-target]");
  if (num && !num.classList.contains("is-counted")) animateCounter(num);
} else {
  counterEls.forEach((el) => counterObserver.observe(el));
}

/* ===========================
   캐러셀
=========================== */
const track = document.getElementById("carouselTrack");
const dotsWrap = document.getElementById("carouselDots");
const prevBtn = document.getElementById("carouselPrev");
const nextBtn = document.getElementById("carouselNext");

if (track && dotsWrap) {
  const cards = Array.from(track.querySelectorAll(".testi-card"));
  let currentIndex = 0;
  let isCarouselScrolling = false;
  let carouselScrollTimer = null;

  const getCardScrollLeft = (index) => {
    const card = cards[index];
    if (!card) return 0;
    const padLeft = parseFloat(getComputedStyle(track).paddingLeft) || 0;
    const trackRect = track.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();
    const target = track.scrollLeft + (cardRect.left - trackRect.left) - padLeft;
    const maxScroll = Math.max(0, track.scrollWidth - track.clientWidth);
    return Math.min(Math.max(0, target), maxScroll);
  };

  const goToCard = (index) => {
    const i = Math.max(0, Math.min(index, cards.length - 1));
    if (!cards[i]) return;
    isCarouselScrolling = true;
    currentIndex = i;
    updateDots(i);
    track.scrollTo({ left: getCardScrollLeft(i), behavior: "smooth" });
    clearTimeout(carouselScrollTimer);
    carouselScrollTimer = setTimeout(() => {
      isCarouselScrolling = false;
    }, 450);
  };

  const dots = [];
  cards.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot" + (i === 0 ? " is-active" : "");
    dot.setAttribute("aria-label", `${i + 1}번째 증언`);
    dot.addEventListener("click", () => goToCard(i));
    dotsWrap.appendChild(dot);
    dots.push(dot);
  });

  const updateDots = (index) => {
    dots.forEach((d, i) => d.classList.toggle("is-active", i === index));
  };

  prevBtn && prevBtn.addEventListener("click", () => {
    goToCard(currentIndex - 1);
  });

  nextBtn && nextBtn.addEventListener("click", () => {
    goToCard(currentIndex + 1);
  });

  // 스크롤로 닷 동기화
  let scrollTimer;
  track.addEventListener("scroll", () => {
    if (isCarouselScrolling) return;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const trackLeft = track.getBoundingClientRect().left;
      let closestIndex = 0;
      let minDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.getBoundingClientRect().left - trackLeft);
        if (dist < minDist) { minDist = dist; closestIndex = i; }
      });
      currentIndex = closestIndex;
      updateDots(currentIndex);
    }, 80);
  }, { passive: true });

  // 자동 회전 (5초마다 다음 카드로, 끝나면 처음으로)
  const AUTOPLAY_INTERVAL = 5000;
  let autoplayId = null;
  let isPaused = false;

  const tickAutoplay = () => {
    if (isPaused) return;
    const next = (currentIndex + 1) % cards.length;
    goToCard(next);
  };

  const startAutoplay = () => {
    if (autoplayId) return;
    autoplayId = setInterval(tickAutoplay, AUTOPLAY_INTERVAL);
  };
  const stopAutoplay = () => {
    if (autoplayId) {
      clearInterval(autoplayId);
      autoplayId = null;
    }
  };

  // 사용자 인터랙션이 있으면 잠시 멈추고 곧 재개
  const pauseBriefly = (ms = 8000) => {
    isPaused = true;
    setTimeout(() => { isPaused = false; }, ms);
  };

  [prevBtn, nextBtn, ...dots].forEach((btn) => {
    if (!btn) return;
    btn.addEventListener("click", () => pauseBriefly());
  });
  const carouselWrap = track.closest(".carousel-wrap");
  if (carouselWrap) {
    carouselWrap.addEventListener("mouseenter", stopAutoplay);
    carouselWrap.addEventListener("mouseleave", startAutoplay);
  }
  // 페이지가 보이지 않으면 정지
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAutoplay(); else startAutoplay();
  });
  // 화면에 들어왔을 때만 시작
  const carouselSection = document.querySelector("#testimonials");
  if (carouselSection && "IntersectionObserver" in window) {
    const carouselObs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) startAutoplay();
        else stopAutoplay();
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -15% 0px" });
    carouselObs.observe(carouselSection);
  } else {
    startAutoplay();
  }
}

/* ===========================
   금액 선택 버튼
=========================== */
const REGULAR_URL = "https://mrmweb.hsit.co.kr/v2/Member/MemberJoin.aspx?action=join&server=gJz3gP4AaOwGm0ODwIv9iw==";

document.querySelectorAll(".amount-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".amount-btn").forEach((b) => b.classList.remove("is-selected"));
    btn.classList.add("is-selected");
    window.open(REGULAR_URL, "_blank", "noopener,noreferrer");
  });
});

/* ===========================
   혜택 아코디언 힌트 텍스트
=========================== */
document.querySelectorAll(".benefit-details").forEach((details) => {
  const hint = details.querySelector(".benefit-toggle-hint");
  if (!hint) return;
  const sync = () => { hint.textContent = details.open ? "접기" : "펼치기"; };
  details.addEventListener("toggle", sync);
  sync();
});

/* ===========================
   형광펜 밑줄 (스크롤 트리거)
=========================== */
const highlightObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        highlightObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.35, rootMargin: "0px 0px -5% 0px" }
);
document.querySelectorAll(".highlight").forEach((el) => {
  if (el.closest(".hero-headline, .hero")) return;
  highlightObserver.observe(el);
});

/* ===========================
   스토리 아이템 enter 애니메이션
=========================== */
const storyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        storyObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);
document.querySelectorAll(".story-item").forEach((el) => storyObserver.observe(el));

/* ===========================
   스토리 stat 숫자 카운터
=========================== */
const statNums = document.querySelectorAll(".story-stat-num[data-target]");
const animateStatNum = (el) => {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1400;
  const start = performance.now();
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target).toLocaleString("ko-KR");
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = target.toLocaleString("ko-KR");
  };
  requestAnimationFrame(tick);
};
const statObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateStatNum(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);
statNums.forEach((el) => statObserver.observe(el));

/* ===========================
   재정 구조 도넛 — 순차 등장 + 도넛 애니메이션
=========================== */
const animateFinanceDonut = (donut) => {
  if (!donut || donut.classList.contains("is-animated")) return;
  const arcs = donut.querySelectorAll(".finance-arc");
  arcs.forEach((arc, idx) => {
    const target = arc.getAttribute("data-target-dasharray");
    if (target) {
      setTimeout(() => {
        arc.style.strokeDasharray = target;
      }, idx * 250 + 150);
    }
  });
  donut.classList.add("is-animated");
};

const financeChart = document.getElementById("financeChart");
if (financeChart) {
  const financeCurrent = financeChart.querySelector(".finance-donut--current");
  const financeTarget = financeChart.querySelector(".finance-donut--target");
  const stepMs = 480;

  const runFinanceChartSequence = () => {
    if (prefersReducedMotion) {
      financeChart.classList.add("is-reveal-step-3");
      animateFinanceDonut(financeCurrent);
      animateFinanceDonut(financeTarget);
      return;
    }
    financeChart.classList.add("is-reveal-step-1");
    animateFinanceDonut(financeCurrent);
    setTimeout(() => financeChart.classList.add("is-reveal-step-2"), stepMs);
    setTimeout(() => {
      financeChart.classList.add("is-reveal-step-3");
      animateFinanceDonut(financeTarget);
    }, stepMs * 2);
  };

  const financeChartObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        runFinanceChartSequence();
        financeChartObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.22, rootMargin: "0px 0px -8% 0px" }
  );
  financeChartObserver.observe(financeChart);
}

/* ===========================
   공유 동선 - 시스템 공유 우선, 클립보드 폴백 (모바일 대응)
=========================== */
(() => {
  const shareBlock = document.querySelector(".share-block");
  if (!shareBlock) return;

  const url = "https://igtproject2030.netlify.app/";
  const title =
    document.querySelector('meta[property="og:title"]')?.getAttribute("content") ||
    "녹색전환연구소의 첫 후원 캠페인 - 프로젝트 2030";
  const text = "녹색전환연구소의 첫 후원 캠페인에 함께해주세요.";

  const copyBtn = shareBlock.querySelector('[data-share="copy"]');
  const toast = shareBlock.querySelector(".share-toast");

  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("is-show");
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
      toast.classList.remove("is-show");
    }, 2400);
  };

  const fallbackCopy = (value) => {
    const ta = document.createElement("textarea");
    ta.value = value;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "0";
    ta.style.left = "0";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (_) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  };

  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      // 모바일은 navigator.share가 더 자연스러움
      const isMobile = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
      if (isMobile && typeof navigator !== "undefined" && navigator.share) {
        try {
          await navigator.share({ title, text, url });
          return;
        } catch (_) {
          // 사용자 취소면 그냥 종료, 그 외엔 복사로 폴백
        }
      }
      // 데스크톱 또는 모바일 폴백: 클립보드 복사
      let copied = false;
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(url);
          copied = true;
        } catch (_) { copied = false; }
      }
      if (!copied) copied = fallbackCopy(url);

      if (copied) {
        showToast("링크가 복사되었습니다");
      } else {
        showToast("복사에 실패했어요. 주소창의 URL을 직접 복사해주세요.");
      }
    });
  }
})();

/* ===========================
   커스텀 커서 - 잉크 점 + 잔상 링 (포인터 디바이스 전용)
=========================== */
const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
if (supportsHover) {
  const dot = document.createElement("div");
  dot.className = "cursor-dot";
  dot.setAttribute("aria-hidden", "true");

  const ring = document.createElement("div");
  ring.className = "cursor-ring";
  ring.setAttribute("aria-hidden", "true");

  document.body.append(dot, ring);

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  }, { passive: true });

  const animateRing = () => {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    requestAnimationFrame(animateRing);
  };
  animateRing();

  const hoverSelectors = "a, button, summary, [data-scroll-target], .amount-btn, .story-item, .impact-card, .policy-card, .future-card, .benefit-item, .floating-donate, .testi-card, .faq-item, .binder-tab";

  document.querySelectorAll(hoverSelectors).forEach((el) => {
    el.addEventListener("mouseenter", () => {
      dot.classList.add("is-hover");
      ring.classList.add("is-hover");
    });
    el.addEventListener("mouseleave", () => {
      dot.classList.remove("is-hover");
      ring.classList.remove("is-hover");
    });
  });

  // 클릭 시 잉크 자국
  document.addEventListener("mousedown", (e) => {
    const drop = document.createElement("div");
    drop.className = "ink-drop";
    drop.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    document.body.appendChild(drop);
    setTimeout(() => drop.remove(), 750);
  });

  document.addEventListener("mouseleave", () => {
    dot.classList.add("is-hidden");
    ring.classList.add("is-hidden");
  });
  document.addEventListener("mouseenter", () => {
    dot.classList.remove("is-hidden");
    ring.classList.remove("is-hidden");
  });

  document.querySelectorAll(".term-tip").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      dot.classList.add("is-term");
      ring.classList.add("is-term");
      dot.classList.remove("is-hover");
      ring.classList.remove("is-hover");
    });
    el.addEventListener("mouseleave", () => {
      dot.classList.remove("is-term");
      ring.classList.remove("is-term");
    });
  });
}

/* ===========================
   서류철 탭 네비 (스크롤 스파이 + smooth scroll)
=========================== */
(() => {
  const binderNav = document.getElementById("binderNav");
  if (!binderNav) return;

  const tabs = [...binderNav.querySelectorAll(".binder-tab")];
  const sectionIds = tabs
    .map((tab) => tab.dataset.binder || tab.getAttribute("href")?.slice(1))
    .filter(Boolean);
  const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);
  if (!sections.length || !tabs.length) return;

  const tabById = new Map(
    tabs.map((tab) => [tab.dataset.binder || tab.getAttribute("href")?.slice(1), tab])
  );

  const setActive = (id) => {
    if (!id || !tabById.has(id)) return;
    tabs.forEach((tab) => {
      const isActive = tab.dataset.binder === id;
      tab.classList.toggle("is-active", isActive);
      if (isActive) tab.setAttribute("aria-current", "true");
      else tab.removeAttribute("aria-current");
    });
  };

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (!target) return;
    const navH = nav ? nav.getBoundingClientRect().height : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
  };

  tabs.forEach((tab) => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      const id = tab.dataset.binder || tab.getAttribute("href")?.slice(1);
      if (!id) return;
      setActive(id);
      scrollToSection(id);
    });
  });

  const visibleRatios = new Map();

  const pickActiveSection = () => {
    let bestId = sectionIds[0];
    let bestRatio = -1;
    visibleRatios.forEach((ratio, id) => {
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestId = id;
      }
    });
    if (bestRatio >= 0) setActive(bestId);
  };

  const spyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        if (entry.isIntersecting) {
          visibleRatios.set(id, entry.intersectionRatio);
        } else {
          visibleRatios.delete(id);
        }
      });
      pickActiveSection();
    },
    {
      root: null,
      rootMargin: `-${(nav?.offsetHeight ?? 64) + 8}px 0px -45% 0px`,
      threshold: [0, 0.15, 0.35, 0.55, 0.75, 1],
    }
  );

  sections.forEach((section) => spyObserver.observe(section));

  const syncOnScrollEnd = () => {
    if (visibleRatios.size) return;
    const navH = (nav?.offsetHeight ?? 64) + window.innerHeight * 0.3;
    let current = sectionIds[0];
    sections.forEach((section) => {
      if (section.offsetTop <= window.scrollY + navH) current = section.id;
    });
    setActive(current);
  };

  window.addEventListener("scroll", syncOnScrollEnd, { passive: true });
  syncOnScrollEnd();

  const heroStageEl = document.querySelector(".hero-stage");
  const updateBinderOnHero = () => {
    if (!heroStageEl) return;
    const stageEnd = heroStageEl.offsetTop + heroStageEl.offsetHeight;
    const onHero = window.scrollY < stageEnd - ((nav?.offsetHeight ?? 64) + 32);
    binderNav.classList.toggle("is-on-hero", onHero);
  };
  window.addEventListener("scroll", updateBinderOnHero, { passive: true });
  window.addEventListener("resize", updateBinderOnHero);
  updateBinderOnHero();
})();

/* ===========================
   히어로: 아래로 스크롤 버튼
=========================== */
const scrollDownBtn = document.getElementById("scrollDown");
const heroStage = document.querySelector(".hero-stage");

if (scrollDownBtn && heroStage) {
  const updateScrollDown = () => {
    const stageEnd = heroStage.offsetTop + heroStage.offsetHeight;
    const onStage = window.scrollY < stageEnd - ((nav?.offsetHeight ?? 64) + 48);
    scrollDownBtn.classList.toggle("is-visible", onStage);
  };
  window.addEventListener("scroll", updateScrollDown, { passive: true });
  window.addEventListener("resize", updateScrollDown);
  updateScrollDown();
}

/* ===========================
   용어 설명 팝오버
=========================== */
const TERM_TIPS = {
  "carbon-neutral": {
    title: "탄소중립",
    body: "배출한 온실가스만큼 다시 흡수해, 결과적으로 순배출을 0에 가깝게 만드는 것. 한국은 2050년을 목표로 법에 적어 두었습니다.",
  },
  "net-zero": {
    title: "Net Zero",
    body: "탄소중립과 같은 뜻으로 쓰입니다. '배출 − 흡수 = 0'이 되는 지점을 뜻해요.",
  },
  ndc: {
    title: "NDC",
    body: "Nationally Determined Contribution. 파리협정에 따라 각 나라가 세우는 감축 목표입니다. 한국은 2030년까지 2018년 대비 온실가스 40% 줄이기를 약속했습니다.",
  },
  "green-transition": {
    title: "녹색전환",
    body: "화석연료·무한 성장 중심의 경제를, 생태적으로 지속 가능하고 더 평등한 사회로 바꾸는 일을 말합니다.",
  },
  "climate-citizen": {
    title: "기후시민",
    body: "기후위기 대응을 일상의 선택과 시민 참여로 연결하는 사람·공동체를 말합니다.",
  },
  "climate-city": {
    title: "기후도시",
    body: "에너지·교통·주거를 바꿔 온실가스는 줄이고, 살기 좋은 동네를 만드는 도시입니다.",
  },
  "green-industry": {
    title: "녹색산업",
    body: "제조·에너지·금융을 친환경 방향으로 바꾸고, 좋은 녹색 일자리를 만드는 산업 전환을 뜻합니다.",
  },
  "project-2030": {
    title: "프로젝트 2030",
    body: "녹색전환연구소의 첫 후원 캠페인입니다. 2030년까지 기후시민·기후도시·녹색산업 세 축에 매진하며, 현장 연구와 정책 제안, 시민 참여 프로그램을 이어 갑니다. 정치와 행정이 바뀌어도 끊기지 않는 연구의 밑바탕을 시민과 함께 만드는 일입니다.",
  },
};

const termPopover = document.getElementById("termPopover");
const termPopoverTitle = document.getElementById("termPopoverTitle");
const termPopoverBody = document.getElementById("termPopoverBody");
let activeTerm = null;

const hideTermPopover = () => {
  if (!termPopover) return;
  termPopover.hidden = true;
  termPopover.classList.remove("is-placement-right");
  activeTerm = null;
};

const showTermPopover = (el) => {
  const key = el.dataset.term;
  const tip = TERM_TIPS[key];
  if (!termPopover || !termPopoverTitle || !termPopoverBody || !tip) return;
  termPopoverTitle.textContent = tip.title;
  termPopoverBody.textContent = tip.body;
  termPopover.hidden = false;
  activeTerm = el;
  const placement = el.dataset.tipPlacement || "below";
  termPopover.classList.toggle("is-placement-right", placement === "right");
  requestAnimationFrame(() => {
    const rect = el.getBoundingClientRect();
    const popRect = termPopover.getBoundingClientRect();
    const pad = 12;
    let left;
    let top;
    if (placement === "right") {
      left = rect.right + 14;
      top = rect.top;
      if (left + popRect.width > window.innerWidth - pad) {
        left = Math.max(pad, rect.left - popRect.width - 14);
      }
      top = Math.max(pad, Math.min(top, window.innerHeight - popRect.height - pad));
    } else {
      left = rect.left + rect.width / 2 - popRect.width / 2;
      top = rect.bottom + 10;
      left = Math.max(pad, Math.min(left, window.innerWidth - popRect.width - pad));
      if (top + popRect.height > window.innerHeight - pad) {
        top = rect.top - popRect.height - 10;
      }
    }
    termPopover.style.left = `${left}px`;
    termPopover.style.top = `${top}px`;
  });
};

document.querySelectorAll(".term-tip").forEach((el) => {
  el.addEventListener("mouseenter", () => showTermPopover(el));
  el.addEventListener("focus", () => showTermPopover(el));
  el.addEventListener("mouseleave", () => {
    if (activeTerm === el) hideTermPopover();
  });
  el.addEventListener("blur", hideTermPopover);
});

termPopover?.addEventListener("mouseenter", () => {
  /* keep open while hovering popover */
});
termPopover?.addEventListener("mouseleave", hideTermPopover);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") hideTermPopover();
});
document.addEventListener("scroll", hideTermPopover, { passive: true });
