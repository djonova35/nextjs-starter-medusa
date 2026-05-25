"use client"

import { useEffect } from "react"

export default function AccessoriesPage() {

  useEffect(() => {
    // Scroll reveal
    const reveals = document.querySelectorAll(".ac-reveal")
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("ac-reveal--visible")
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.12 }
      )
      reveals.forEach((el) => observer.observe(el))
    } else {
      reveals.forEach((el) => el.classList.add("ac-reveal--visible"))
    }

    // Sticky nav shadow + active tab
    const nav = document.getElementById("ac-nav")
    const sectionIds = ["tech", "jewelry", "bags"]
    const sections = sectionIds.map((id) => document.getElementById(id))
    const tabs = document.querySelectorAll(".ac-nav__tab")

    function highlightTab() {
      const wH = window.innerHeight
      let activeId: string | null = null
      sections.forEach((s) => {
        if (!s) return
        const r = s.getBoundingClientRect()
        if (r.top <= wH * 0.4 && r.bottom >= wH * 0.4) activeId = s.id
      })
      if (!activeId && window.scrollY < 200) activeId = "tech"
      tabs.forEach((t) =>
        t.classList.toggle(
          "ac-nav__tab--active",
          (t as HTMLElement).dataset.section === activeId
        )
      )
    }

    const onScroll = () => {
      if (nav) nav.classList.toggle("ac-nav--scrolled", window.scrollY > 10)
      highlightTab()
    }
    window.addEventListener("scroll", onScroll, { passive: true })

    // Smooth scroll on tab click
    tabs.forEach((tab) => {
      tab.addEventListener("click", function (e) {
        e.preventDefault()
        const el = tab as HTMLElement
        const target = document.getElementById(el.dataset.section || "")
        if (target && nav) {
          const top =
            target.getBoundingClientRect().top +
            window.scrollY -
            nav.getBoundingClientRect().height -
            12
          window.scrollTo({ top, behavior: "smooth" })
        }
      })
    })

    // Filter chips per group
    ;[
      "ac-tech-filters",
      "ac-jewelry-filters",
      "ac-bags-filters",
    ].forEach((id) => {
      const container = document.getElementById(id)
      if (!container) return
      const chips = container.querySelectorAll(".ac-chip")
      chips.forEach((chip) => {
        chip.addEventListener("click", function () {
          chips.forEach((c) => c.classList.remove("ac-chip--active"))
          chip.classList.add("ac-chip--active")
        })
      })
    })

    // Wishlist toggle
    document.querySelectorAll(".ac-card__wish").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation()
        const el = btn as HTMLElement
        const filled = el.textContent?.trim() === "♥"
        el.textContent = filled ? "♡" : "♥"
        el.style.color = filled ? "" : "#E85D75"
      })
    })

    // Add to bag flash
    document.querySelectorAll(".ac-card__add").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation()
        const el = btn as HTMLElement
        const orig = el.textContent || "+"
        el.textContent = "✓"
        el.style.background = "#22c55e"
        setTimeout(() => {
          el.textContent = orig
          el.style.background = ""
        }, 900)
      })
    })

    // Card ring pulse
    document.querySelectorAll(".ac-card").forEach((card) => {
      card.addEventListener("click", function (e) {
        const target = e.target as HTMLElement
        if (
          target.closest(".ac-card__add") ||
          target.closest(".ac-card__wish")
        )
          return
        const el = card as HTMLElement
        el.style.transition = "box-shadow 0.1s ease"
        el.style.boxShadow = "0 0 0 3px rgba(107,78,230,0.3)"
        setTimeout(() => {
          el.style.boxShadow = ""
          el.style.transition = ""
        }, 300)
      })
    })

    return () => {
      window.removeEventListener("scroll", onScroll)
    }
  }, [])

  const svgPlaceholder = (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  )

  return (
    <>
      <style>{`
        :root {
          --ac-cream:  #F4F2FA;
          --ac-ink:    #18162B;
          --ac-accent: #6B4EE6;
          --ac-gray:   #8A82A8;
          --ac-line:   #E2DCF5;
          --ac-card:   #FAFAFE;
          --ac-deep:   #160E2B;
        }

        @keyframes ac-fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ac-fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes ac-orbit {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes ac-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 0.8; transform: scale(1.05); }
        }

        .ac-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }
        @media (min-width: 768px)  { .ac-container { padding: 0 48px; } }
        @media (min-width: 1024px) { .ac-container { padding: 0 64px; } }

        /* ── HERO ── */
        .ac-hero {
          position: relative;
          width: 100%;
          min-height: 100svh;
          background: var(--ac-deep);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          padding-top: 48px;
          padding-bottom: 80px;
        }
        .ac-hero__bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #160E2B 0%, #1E0E40 40%, #160E30 70%, #0D0820 100%);
          z-index: 0;
        }
        .ac-hero__bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 70% 50% at 75% 35%, rgba(155,126,255,0.2) 0%, transparent 70%),
            radial-gradient(ellipse 40% 60% at 15% 75%, rgba(107,78,230,0.12) 0%, transparent 60%),
            radial-gradient(ellipse 30% 40% at 50% 10%, rgba(196,181,253,0.08) 0%, transparent 60%);
        }
        .ac-hero__orb {
          position: absolute;
          top: 50%;
          right: -80px;
          transform: translateY(-50%);
          width: 520px;
          height: 520px;
          z-index: 1;
        }
        .ac-hero__orb-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid rgba(155,126,255,0.15);
        }
        .ac-hero__orb-ring:nth-child(2) {
          inset: 60px;
          border-color: rgba(107,78,230,0.2);
          animation: ac-orbit 18s linear infinite;
        }
        .ac-hero__orb-ring:nth-child(3) {
          inset: 120px;
          border-color: rgba(196,181,253,0.25);
          animation: ac-orbit 12s linear infinite reverse;
        }
        .ac-hero__orb-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(107,78,230,0.35) 0%, transparent 70%);
          animation: ac-pulse 3s ease-in-out infinite;
        }
        @media (max-width: 768px) { .ac-hero__orb { display: none; } }
        .ac-hero__noise {
          position: absolute;
          inset: 0;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          z-index: 1;
        }
        .ac-hero__content {
          position: relative;
          z-index: 2;
          padding: 0 24px;
        }
        @media (min-width: 768px)  { .ac-hero__content { padding: 0 48px; } }
        @media (min-width: 1024px) { .ac-hero__content { padding: 0 64px; } }
        .ac-hero__eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ac-accent);
          margin-bottom: 20px;
          opacity: 0;
          animation: ac-fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.2s forwards;
        }
        .ac-hero__title {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: clamp(48px, 9vw, 120px);
          line-height: 0.92;
          color: #fff;
          letter-spacing: -0.02em;
          opacity: 0;
          animation: ac-fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.35s forwards;
        }
        .ac-hero__title em {
          font-style: normal;
          background: linear-gradient(135deg, #C4B5FD 0%, #9B7EFF 50%, #6B4EE6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .ac-hero__sub {
          margin-top: 28px;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 300;
          font-size: clamp(14px, 1.5vw, 17px);
          color: rgba(255,255,255,0.5);
          max-width: 480px;
          opacity: 0;
          animation: ac-fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.55s forwards;
        }
        .ac-hero__tags {
          margin-top: 32px;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          opacity: 0;
          animation: ac-fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.65s forwards;
        }
        .ac-hero__tag {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          padding: 6px 16px;
          border-radius: 999px;
          border: 1px solid rgba(155,126,255,0.35);
          color: rgba(255,255,255,0.6);
          background: rgba(107,78,230,0.08);
        }
        .ac-hero__cta-row {
          margin-top: 44px;
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          opacity: 0;
          animation: ac-fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.7s forwards;
        }
        .ac-hero__scroll {
          position: absolute;
          bottom: 32px;
          right: 48px;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0;
          animation: ac-fadeIn 1s ease 1.2s forwards;
        }
        .ac-hero__scroll span {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          writing-mode: vertical-lr;
        }
        .ac-hero__scroll-line {
          width: 1px;
          height: 48px;
          background: linear-gradient(to bottom, rgba(107,78,230,0.8), transparent);
        }

        /* ── BUTTONS ── */
        .ac-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border-radius: 999px;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 500;
          font-size: 13px;
          letter-spacing: 0.04em;
          cursor: pointer;
          border: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
          text-decoration: none;
        }
        .ac-btn:hover  { transform: translateY(-2px); }
        .ac-btn:active { transform: translateY(0); }
        .ac-btn--primary {
          background: var(--ac-accent);
          color: #fff;
          padding: 14px 32px;
          box-shadow: 0 4px 24px rgba(107,78,230,0.35);
        }
        .ac-btn--primary:hover { background: #7C63EF; box-shadow: 0 8px 32px rgba(107,78,230,0.45); }
        .ac-btn--ghost {
          background: transparent;
          color: rgba(255,255,255,0.7);
          padding: 14px 24px;
          border: 1px solid rgba(255,255,255,0.18);
        }
        .ac-btn--ghost:hover { background: rgba(255,255,255,0.06); color: #fff; }

        /* ── NAV (not sticky) ── */
.ac-nav {
  position: relative;
  background: rgba(250,250,254,0.92);
  border-bottom: 1px solid var(--ac-line);
}
.ac-nav--scrolled { box-shadow: none; }
        .ac-nav__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
          gap: 8px;
        }
        .ac-nav__logo {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 600;
          font-size: 20px;
          letter-spacing: 0.12em;
          color: var(--ac-ink);
          text-decoration: none;
          white-space: nowrap;
          flex-shrink: 0;
          display: none;
        }
        @media (min-width: 768px) { .ac-nav__logo { display: block; } }
        .ac-nav__tabs {
          display: flex;
          align-items: center;
          gap: 4px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          flex: 1;
        }
        .ac-nav__tabs::-webkit-scrollbar { display: none; }
        .ac-nav__tab {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ac-gray);
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 999px;
          white-space: nowrap;
          transition: color 0.2s ease, background 0.2s ease;
          cursor: pointer;
          background: none;
          border: none;
          flex-shrink: 0;
        }
        .ac-nav__tab:hover   { color: var(--ac-ink); background: var(--ac-line); }
        .ac-nav__tab--active { color: #fff; background: var(--ac-accent); }
        @media (max-width: 640px) {
          .ac-nav__tab { font-size: 9px; padding: 7px 12px; }
        }

        /* ── CATEGORY STRIP ── */
        .ac-cat-strip {
          background: #fff;
          border-bottom: 1px solid var(--ac-line);
          padding: 40px 0;
        }
        .ac-cat-strip__grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        @media (max-width: 640px) {
          .ac-cat-strip__grid { grid-template-columns: 1fr; gap: 12px; }
        }
        .ac-cat-strip__card {
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          aspect-ratio: 4 / 3;
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease;
          border: 1px solid var(--ac-line);
          text-decoration: none;
          display: block;
        }
        .ac-cat-strip__card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(22,14,43,0.12); }
        .ac-cat-strip__card--tech    { background: linear-gradient(160deg, #1A0E3A 0%, #2D1B69 50%, #4C35A0 100%); }
        .ac-cat-strip__card--jewelry { background: linear-gradient(160deg, #C4B5FD 0%, #9B7EFF 50%, #6B4EE6 100%); }
        .ac-cat-strip__card--bags    { background: linear-gradient(160deg, #160E2B 0%, #3D2880 100%); }
        .ac-cat-strip__card-inner {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 20px;
        }
        .ac-cat-strip__icon { font-size: 40px; opacity: 0.7; }
        .ac-cat-strip__label {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 20px;
          background: linear-gradient(to top, rgba(22,14,43,0.8) 0%, transparent 100%);
          text-align: center;
        }
        .ac-cat-strip__label-name {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 500;
          font-size: 22px;
          color: #fff;
          display: block;
        }
        .ac-cat-strip__label-count {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          margin-top: 2px;
        }

        /* ── SHARED SECTION ── */
        .ac-section { padding: 80px 0; }
        @media (min-width: 1024px) { .ac-section { padding: 120px 0; } }
        .ac-section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 48px;
          gap: 20px;
          flex-wrap: wrap;
        }
        .ac-section-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--ac-accent);
          margin-bottom: 10px;
        }
        .ac-section-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 500;
          font-size: clamp(36px, 5vw, 60px);
          line-height: 1;
          color: var(--ac-ink);
          letter-spacing: -0.02em;
        }
        .ac-section-title em { font-style: italic; font-weight: 300; color: var(--ac-gray); }
        .ac-view-all {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ac-accent);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          border-radius: 999px;
          border: 1px solid var(--ac-accent);
          transition: background 0.2s ease, color 0.2s ease;
          white-space: nowrap;
        }
        .ac-view-all:hover { background: var(--ac-accent); color: #fff; }

        /* ── FILTER CHIPS ── */
        .ac-filter-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 36px;
          flex-wrap: wrap;
        }
        .ac-chips { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .ac-chip {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 8px 18px;
          border-radius: 999px;
          border: 1px solid var(--ac-line);
          background: var(--ac-card);
          color: var(--ac-gray);
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }
        .ac-chip:hover   { border-color: var(--ac-accent); color: var(--ac-accent); }
        .ac-chip--active { background: var(--ac-accent); border-color: var(--ac-accent); color: #fff; }
        .ac-sort { display: flex; align-items: center; gap: 8px; }
        .ac-sort label {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--ac-gray);
          white-space: nowrap;
        }
        .ac-sort select {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px;
          color: var(--ac-ink);
          background: var(--ac-card);
          border: 1px solid var(--ac-line);
          border-radius: 999px;
          padding: 8px 36px 8px 16px;
          cursor: pointer;
          appearance: none;
          -webkit-appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238A82A8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 14px center;
          outline: none;
        }
        .ac-sort select:focus { border-color: var(--ac-accent); }

        /* ── PRODUCT GRID ── */
        .ac-product-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        @media (min-width: 768px)  { .ac-product-grid { gap: 28px; } }
        @media (min-width: 1024px) { .ac-product-grid { grid-template-columns: repeat(4, 1fr); gap: 24px; } }

        /* ── PRODUCT CARD ── */
        .ac-card {
          background: var(--ac-card);
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--ac-line);
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease;
          cursor: pointer;
          opacity: 0;
          animation: ac-fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .ac-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(22,14,43,0.12); }
        .ac-card:nth-child(1) { animation-delay: 0.05s; }
        .ac-card:nth-child(2) { animation-delay: 0.12s; }
        .ac-card:nth-child(3) { animation-delay: 0.19s; }
        .ac-card:nth-child(4) { animation-delay: 0.26s; }
        .ac-card__img {
          aspect-ratio: 3 / 4;
          background: var(--ac-line);
          position: relative;
          overflow: hidden;
        }
        .ac-card__img-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        .ac-card__img-placeholder svg  { width: 40px; height: 40px; opacity: 0.35; color: var(--ac-accent); }
        .ac-card__img-placeholder span {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ac-gray);
        }
        .ac-card__badge {
          position: absolute;
          top: 12px; left: 12px;
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 999px;
          z-index: 2;
        }
        .ac-card__badge--new  { background: var(--ac-accent); color: #fff; }
        .ac-card__badge--sale { background: #E85D75; color: #fff; }
        .ac-card__wish {
          position: absolute;
          top: 12px; right: 12px;
          width: 32px; height: 32px;
          border-radius: 999px;
          background: rgba(255,255,255,0.85);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 14px;
          z-index: 2;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .ac-card__wish:hover { background: #fff; transform: scale(1.1); }
        .ac-card__body { padding: 16px; }
        .ac-card__cat {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--ac-gray);
          margin-bottom: 6px;
        }
        .ac-card__name {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 500;
          font-size: 18px;
          line-height: 1.2;
          color: var(--ac-ink);
          margin-bottom: 10px;
        }
        .ac-card__footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .ac-card__price { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; color: var(--ac-ink); }
        .ac-card__price s { font-weight: 400; color: var(--ac-gray); margin-right: 6px; font-size: 13px; }
        .ac-card__add {
          width: 34px; height: 34px;
          border-radius: 999px;
          background: var(--ac-accent);
          border: none;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 18px;
          transition: background 0.2s ease, transform 0.2s ease;
          flex-shrink: 0;
        }
        .ac-card__add:hover { background: #7C63EF; transform: scale(1.08); }

        /* ── TECH SECTION ── */
        .ac-tech { background: var(--ac-deep); }
        .ac-tech .ac-section-title   { color: #fff; }
        .ac-tech .ac-section-eyebrow { color: #9B7EFF; }
        .ac-tech .ac-view-all        { color: rgba(255,255,255,0.6); border-color: rgba(255,255,255,0.2); }
        .ac-tech .ac-view-all:hover  { background: rgba(255,255,255,0.08); color: #fff; }
        .ac-tech .ac-chip            { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.12); color: rgba(255,255,255,0.5); }
        .ac-tech .ac-chip:hover      { border-color: var(--ac-accent); color: #C4B5FD; }
        .ac-tech .ac-chip--active    { background: var(--ac-accent); border-color: var(--ac-accent); color: #fff; }
        .ac-tech .ac-sort label      { color: rgba(255,255,255,0.4); }
        .ac-tech .ac-sort select     { background-color: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.12); color: #fff; }
        .ac-tech .ac-card            { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.08); }
        .ac-tech .ac-card:hover      { box-shadow: 0 16px 48px rgba(0,0,0,0.4); }
        .ac-tech .ac-card__img-placeholder { background: linear-gradient(160deg, #1E1147 0%, #2D1B69 100%); }
        .ac-tech .ac-card__name      { color: #fff; }
        .ac-tech .ac-card__price     { color: #C4B5FD; }

        .ac-tech-banner {
          display: grid;
          grid-template-columns: 1fr;
          border-radius: 24px;
          overflow: hidden;
          margin-bottom: 48px;
          border: 1px solid rgba(255,255,255,0.06);
          min-height: 380px;
        }
        @media (min-width: 768px) {
          .ac-tech-banner { grid-template-columns: 1fr 1fr; min-height: 420px; }
        }
        .ac-tech-banner__visual {
          background: linear-gradient(135deg, #1E1147 0%, #3D2880 50%, #2D1B69 100%);
          position: relative;
          min-height: 260px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .ac-tech-banner__visual::before {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 300px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(107,78,230,0.3) 0%, transparent 70%);
        }
        .ac-tech-banner__visual-inner {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }
        .ac-tech-banner__visual-icon { font-size: 64px; opacity: 0.8; }
        .ac-tech-banner__visual-inner span {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
        }
        .ac-tech-banner__content {
          background: rgba(255,255,255,0.03);
          padding: 48px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 20px;
          border-left: 1px solid rgba(255,255,255,0.06);
        }
        .ac-tech-banner__eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #9B7EFF;
        }
        .ac-tech-banner__title {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: clamp(28px, 3.5vw, 48px);
          line-height: 1.05;
          color: #fff;
        }
        .ac-tech-banner__desc { font-size: 14px; color: rgba(255,255,255,0.45); line-height: 1.7; max-width: 300px; }
        .ac-tech-banner__tags { display: flex; gap: 8px; flex-wrap: wrap; }
        .ac-tech-banner__tag {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 999px;
          border: 1px solid rgba(107,78,230,0.4);
          color: rgba(255,255,255,0.55);
        }

        /* ── TECH STATS ── */
        .ac-tech-stats {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 48px;
        }
        @media (min-width: 768px) { .ac-tech-stats { grid-template-columns: repeat(4, 1fr); gap: 16px; } }
        .ac-tech-stat {
          border-radius: 16px;
          padding: 24px 20px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .ac-tech-stat::before {
          content: '';
          position: absolute;
          top: -20px; right: -20px;
          width: 80px; height: 80px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(107,78,230,0.15) 0%, transparent 70%);
        }
        .ac-tech-stat__icon { font-size: 22px; margin-bottom: 10px; display: block; }
        .ac-tech-stat__num {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 30px;
          color: #fff;
          line-height: 1;
          margin-bottom: 6px;
        }
        .ac-tech-stat__num span { font-size: 16px; color: #9B7EFF; }
        .ac-tech-stat__label {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
        }

        /* ── JEWELRY SECTION ── */
        .ac-jewelry { background: var(--ac-cream); }
        .ac-jewelry-hero {
          border-radius: 24px;
          background: linear-gradient(135deg, #EDE8FC 0%, #C4B5FD 50%, #9B7EFF 100%);
          padding: 56px 48px;
          margin-bottom: 48px;
          position: relative;
          overflow: hidden;
        }
        .ac-jewelry-hero::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 360px; height: 360px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%);
        }
        .ac-jewelry-hero::after {
          content: '';
          position: absolute;
          bottom: -40px; left: 30%;
          width: 200px; height: 200px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.2);
        }
        .ac-jewelry-hero__inner {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }
        @media (min-width: 768px) {
          .ac-jewelry-hero__inner { grid-template-columns: 1fr 1fr; align-items: center; }
        }
        .ac-jewelry-hero__eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(22,14,43,0.5);
          margin-bottom: 16px;
        }
        .ac-jewelry-hero__title {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: clamp(36px, 5vw, 60px);
          color: var(--ac-deep);
          line-height: 1;
          margin-bottom: 16px;
        }
        .ac-jewelry-hero__desc {
          font-size: 14px;
          color: rgba(22,14,43,0.55);
          max-width: 360px;
          line-height: 1.7;
          margin-bottom: 28px;
        }
        .ac-jewelry-hero__tags { display: flex; gap: 8px; flex-wrap: wrap; }
        .ac-jewelry-tag {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 7px 16px;
          border-radius: 999px;
          border: 1px solid rgba(22,14,43,0.2);
          color: rgba(22,14,43,0.6);
          background: rgba(255,255,255,0.3);
        }
        .ac-jewelry-hero__visual {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        .ac-jewelry-gem {
          width: 80px; height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          border: 1px solid rgba(255,255,255,0.4);
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(8px);
        }
        .ac-jewelry-gem:nth-child(2) { width: 100px; height: 100px; font-size: 40px; }
        .ac-jewelry-gem:nth-child(3) { width: 70px; height: 70px; font-size: 28px; }

        /* ── BAGS SECTION ── */
        .ac-bags { background: #fff; border-top: 1px solid var(--ac-line); }
        .ac-bags__accent-bar { width: 60px; height: 3px; background: var(--ac-accent); border-radius: 999px; margin-top: 12px; }
        .ac-bags-feature {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-bottom: 48px;
        }
        @media (min-width: 768px) { .ac-bags-feature { grid-template-columns: 1.4fr 1fr; gap: 20px; } }
        .ac-bags-card {
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          border: 1px solid var(--ac-line);
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
          min-height: 300px;
        }
        .ac-bags-card:hover { transform: scale(1.015); }
        .ac-bags-card__bg {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .ac-bags-card__bg-icon { font-size: 48px; opacity: 0.5; }
        .ac-bags-card__bg span {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          opacity: 0.3;
        }
        .ac-bags-card--a .ac-bags-card__bg { background: linear-gradient(160deg, #EDE8FC 0%, #C4B5FD 100%); color: var(--ac-deep); }
        .ac-bags-card--b .ac-bags-card__bg { background: linear-gradient(160deg, #2A1A5E 0%, #6B4EE6 100%); color: rgba(255,255,255,0.9); }
        .ac-bags-card__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(22,14,43,0.75) 0%, rgba(22,14,43,0.05) 60%, transparent 100%);
          z-index: 2;
        }
        .ac-bags-card__info { position: absolute; bottom: 0; left: 0; right: 0; padding: 28px; z-index: 3; }
        .ac-bags-card__eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          margin-bottom: 8px;
        }
        .ac-bags-card__title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 500;
          font-size: 26px;
          color: #fff;
          margin-bottom: 16px;
          line-height: 1.1;
        }
        .ac-bags-card__cta {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 10px 22px;
          border-radius: 999px;
          background: rgba(107,78,230,0.7);
          border: 1px solid rgba(107,78,230,0.5);
          color: #fff;
          cursor: pointer;
          transition: background 0.2s ease;
          text-decoration: none;
          display: inline-block;
        }
        .ac-bags-card__cta:hover { background: var(--ac-accent); }

        /* ── SCROLL REVEAL ── */
        .ac-reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1);
        }
        .ac-reveal--visible  { opacity: 1; transform: translateY(0); }
        .ac-reveal--delay-1  { transition-delay: 0.1s; }
        .ac-reveal--delay-2  { transition-delay: 0.2s; }
        .ac-reveal--delay-3  { transition-delay: 0.3s; }
        .ac-reveal--delay-4  { transition-delay: 0.4s; }
      `}</style>

      {/* ── HERO ── */}
      <section className="ac-hero" aria-label="DJONOVA Accessories hero">
        <div className="ac-hero__bg" />
        <div className="ac-hero__noise" />
        <div className="ac-hero__orb">
          <div className="ac-hero__orb-ring" />
          <div className="ac-hero__orb-ring" />
          <div className="ac-hero__orb-ring" />
          <div className="ac-hero__orb-dot" />
        </div>
        <div className="ac-hero__content">
          <p className="ac-hero__eyebrow">DJONOVA · SS2025 Accessories</p>
          <h1 className="ac-hero__title">
            ACCESS-<br />
            ories for <em>every mood.</em>
          </h1>
          <p className="ac-hero__sub">
            Tech that works as hard as you do, jewellery that speaks before you do, and bags that carry your world in style.
          </p>
          <div className="ac-hero__tags">
            <span className="ac-hero__tag">✦ Tech Essentials</span>
            <span className="ac-hero__tag">💎 Jewellery</span>
            <span className="ac-hero__tag">👜 Bags</span>
          </div>
          <div className="ac-hero__cta-row">
            <a href="#tech" className="ac-btn ac-btn--primary">Shop Tech →</a>
            <a href="#jewelry" className="ac-btn ac-btn--ghost">View Jewellery</a>
          </div>
        </div>
        <div className="ac-hero__scroll">
          <div className="ac-hero__scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ── STICKY NAV ── */}
      <nav className="ac-nav" id="ac-nav" aria-label="Accessories category navigation">
        <div className="ac-container">
          <div className="ac-nav__inner">
            <a href="/categories/accessories" className="ac-nav__logo">DJONOVA</a>
            <div className="ac-nav__tabs" role="tablist">
              <button className="ac-nav__tab ac-nav__tab--active" data-section="tech"    role="tab">Tech Essentials</button>
              <button className="ac-nav__tab" data-section="jewelry" role="tab">Jewellery</button>
              <button className="ac-nav__tab" data-section="bags"    role="tab">Bags</button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── CATEGORY STRIP ── */}
      <div className="ac-cat-strip ac-reveal">
        <div className="ac-container">
          <div className="ac-cat-strip__grid">
            {[
              { cls: "tech",    label: "Tech Essentials", count: "48 products", icon: "⚡", href: "#tech"    },
              { cls: "jewelry", label: "Jewellery",        count: "64 products", icon: "💎", href: "#jewelry" },
              { cls: "bags",    label: "Bags",             count: "52 products", icon: "👜", href: "#bags"    },
            ].map((item) => (
              <a
                key={item.cls}
                href={item.href}
                className={`ac-cat-strip__card ac-cat-strip__card--${item.cls}`}
              >
                <div className="ac-cat-strip__card-inner">
                  <div className="ac-cat-strip__icon">{item.icon}</div>
                </div>
                <div className="ac-cat-strip__label">
                  <span className="ac-cat-strip__label-name">{item.label}</span>
                  <div className="ac-cat-strip__label-count">{item.count}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── TECH ESSENTIALS ── */}
      <section className="ac-section ac-tech" id="tech" aria-label="Tech Essentials">
        <div className="ac-container">
          <div className="ac-section-header ac-reveal">
            <div>
              <p className="ac-section-eyebrow">01 — Tech Essentials</p>
              <h2 className="ac-section-title">Power in your <em>pocket.</em></h2>
            </div>
            <a href="/categories/accessories/tech-essentials" className="ac-view-all">View All →</a>
          </div>

          <div className="ac-tech-stats ac-reveal ac-reveal--delay-1">
            {[
              { icon: "⚡", num: "65",  sup: "W",   label: "Fast Charging"     },
              { icon: "📶", num: "5G",  sup: "",    label: "Compatible"        },
              { icon: "🔋", num: "40",  sup: "hr",  label: "Battery Life"      },
              { icon: "🌿", num: "eco", sup: "★",   label: "Sustainable Range" },
            ].map((s) => (
              <div className="ac-tech-stat" key={s.label}>
                <span className="ac-tech-stat__icon">{s.icon}</span>
                <div className="ac-tech-stat__num">{s.num}<span>{s.sup}</span></div>
                <div className="ac-tech-stat__label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="ac-tech-banner ac-reveal ac-reveal--delay-2">
            <div className="ac-tech-banner__visual">
              <div className="ac-tech-banner__visual-inner">
                <div className="ac-tech-banner__visual-icon">🎧</div>
                <span>800 × 420 px</span>
              </div>
            </div>
            <div className="ac-tech-banner__content">
              <p className="ac-tech-banner__eyebrow">New Arrivals 2025</p>
              <h3 className="ac-tech-banner__title">
                Sound that<br />moves with you.
              </h3>
              <p className="ac-tech-banner__desc">
                Premium audio, seamless connectivity, and accessories designed to keep up with your lifestyle — from commute to studio.
              </p>
              <div className="ac-tech-banner__tags">
                <span className="ac-tech-banner__tag">Audio</span>
                <span className="ac-tech-banner__tag">Charging</span>
                <span className="ac-tech-banner__tag">Cases</span>
                <span className="ac-tech-banner__tag">Wearables</span>
              </div>
              <div>
                <a href="/categories/accessories/tech-essentials" className="ac-btn ac-btn--primary">
                  Shop Tech
                </a>
              </div>
            </div>
          </div>

          <div className="ac-filter-bar ac-reveal ac-reveal--delay-3" id="ac-tech-filters">
            <div className="ac-chips" role="group">
              {["All", "Audio", "Charging", "Cases", "Wearables", "Cables"].map((f, i) => (
                <button key={f} className={`ac-chip${i === 0 ? " ac-chip--active" : ""}`}>{f}</button>
              ))}
            </div>
            <div className="ac-sort">
              <label htmlFor="ac-sort-tech">Sort</label>
              <select id="ac-sort-tech">
                <option>Newest</option>
                <option>Price: Low–High</option>
                <option>Price: High–Low</option>
                <option>Best Sellers</option>
              </select>
            </div>
          </div>

          <div className="ac-product-grid ac-reveal ac-reveal--delay-4">
            {[
              { cat: "Audio",     name: "NOVA Pro Earbuds",      price: "£89.00",  badge: "new",  oldPrice: undefined },
              { cat: "Charging",  name: "MagSlim 65W Charger",   price: "£34.00",  badge: undefined, oldPrice: undefined },
              { cat: "Cases",     name: "AeroShield Phone Case",  price: "£28.00",  badge: "sale", oldPrice: "£35.00"  },
              { cat: "Wearables", name: "PULSE Smart Band",       price: "£119.00", badge: "new",  oldPrice: undefined },
            ].map((item, i) => (
              <article className="ac-card" key={i}>
                <div className="ac-card__img">
                  <div className="ac-card__img-placeholder">{svgPlaceholder}<span>600 × 800 px</span></div>
                  {item.badge === "new"  && <span className="ac-card__badge ac-card__badge--new">New</span>}
                  {item.badge === "sale" && <span className="ac-card__badge ac-card__badge--sale">Sale</span>}
                  <div className="ac-card__wish" aria-label="Add to wishlist">♡</div>
                </div>
                <div className="ac-card__body">
                  <p className="ac-card__cat">{item.cat}</p>
                  <h3 className="ac-card__name">{item.name}</h3>
                  <div className="ac-card__footer">
                    <span className="ac-card__price">
                      {item.oldPrice && <s>{item.oldPrice}</s>}
                      {item.price}
                    </span>
                    <button className="ac-card__add" aria-label="Add to bag">+</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── JEWELLERY ── */}
      <section className="ac-section ac-jewelry" id="jewelry" aria-label="Jewellery">
        <div className="ac-container">
          <div className="ac-section-header ac-reveal">
            <div>
              <p className="ac-section-eyebrow">02 — Jewellery</p>
              <h2 className="ac-section-title">Wear your <em>light.</em></h2>
            </div>
            <a href="/categories/accessories/jewelry" className="ac-view-all">View All →</a>
          </div>

          <div className="ac-jewelry-hero ac-reveal ac-reveal--delay-1">
            <div className="ac-jewelry-hero__inner">
              <div>
                <p className="ac-jewelry-hero__eyebrow">SS25 Fine Jewellery Edit</p>
                <h3 className="ac-jewelry-hero__title">
                  Every piece<br />tells a story.
                </h3>
                <p className="ac-jewelry-hero__desc">
                  Gold-plated, sterling silver, and gemstone pieces — crafted to layer, stack, and make every outfit yours.
                </p>
                <div className="ac-jewelry-hero__tags">
                  {["Rings", "Necklaces", "Earrings", "Bracelets", "Sets"].map((t) => (
                    <span key={t} className="ac-jewelry-tag">{t}</span>
                  ))}
                </div>
                <div style={{ marginTop: "28px" }}>
                  <a href="/categories/accessories/jewelry" className="ac-btn ac-btn--primary">
                    Shop Jewellery
                  </a>
                </div>
              </div>
              <div className="ac-jewelry-hero__visual">
                <div className="ac-jewelry-gem">💍</div>
                <div className="ac-jewelry-gem">✨</div>
                <div className="ac-jewelry-gem">📿</div>
              </div>
            </div>
          </div>

          <div className="ac-filter-bar ac-reveal ac-reveal--delay-2" id="ac-jewelry-filters">
            <div className="ac-chips" role="group">
              {["All", "Rings", "Necklaces", "Earrings", "Bracelets", "Sets"].map((f, i) => (
                <button key={f} className={`ac-chip${i === 0 ? " ac-chip--active" : ""}`}>{f}</button>
              ))}
            </div>
            <div className="ac-sort">
              <label htmlFor="ac-sort-jewelry">Sort</label>
              <select id="ac-sort-jewelry">
                <option>Newest</option>
                <option>Price: Low–High</option>
                <option>Price: High–Low</option>
                <option>Best Sellers</option>
              </select>
            </div>
          </div>

          <div className="ac-product-grid ac-reveal ac-reveal--delay-3">
            {[
              { cat: "Rings",     name: "Gold Dome Ring",          price: "£38.00",  badge: "new",  oldPrice: undefined },
              { cat: "Necklaces", name: "Pearl Pendant Chain",      price: "£52.00",  badge: undefined, oldPrice: undefined },
              { cat: "Earrings",  name: "Crystal Drop Hoops",       price: "£29.00",  badge: "sale", oldPrice: "£42.00"  },
              { cat: "Sets",      name: "Layering Stack Set",        price: "£74.00",  badge: "new",  oldPrice: undefined },
            ].map((item, i) => (
              <article className="ac-card" key={i}>
                <div className="ac-card__img">
                  <div className="ac-card__img-placeholder"
                    style={{ background: "linear-gradient(160deg, #EDE8FC 0%, #C4B5FD 100%)" }}>
                    {svgPlaceholder}
                    <span>600 × 800 px</span>
                  </div>
                  {item.badge === "new"  && <span className="ac-card__badge ac-card__badge--new">New</span>}
                  {item.badge === "sale" && <span className="ac-card__badge ac-card__badge--sale">Sale</span>}
                  <div className="ac-card__wish" aria-label="Add to wishlist">♡</div>
                </div>
                <div className="ac-card__body">
                  <p className="ac-card__cat">{item.cat}</p>
                  <h3 className="ac-card__name">{item.name}</h3>
                  <div className="ac-card__footer">
                    <span className="ac-card__price">
                      {item.oldPrice && <s>{item.oldPrice}</s>}
                      {item.price}
                    </span>
                    <button className="ac-card__add" aria-label="Add to bag">+</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── BAGS ── */}
      <section className="ac-section ac-bags" id="bags" aria-label="Bags">
        <div className="ac-container">
          <div className="ac-section-header ac-reveal">
            <div>
              <p className="ac-section-eyebrow">03 — Bags</p>
              <h2 className="ac-section-title">Carry it <em>beautifully.</em></h2>
              <div className="ac-bags__accent-bar" />
            </div>
            <a href="/categories/accessories/bags" className="ac-view-all">View All →</a>
          </div>

          <div className="ac-bags-feature ac-reveal ac-reveal--delay-1">
            <div className="ac-bags-card ac-bags-card--a">
              <div className="ac-bags-card__bg">
                <div className="ac-bags-card__bg-icon">👜</div>
                <span>700 × 500 px</span>
              </div>
              <div className="ac-bags-card__overlay" />
              <div className="ac-bags-card__info">
                <p className="ac-bags-card__eyebrow">SS25 Bag Edit</p>
                <h3 className="ac-bags-card__title">The Tote<br />Collection</h3>
                <a href="/categories/accessories/bags" className="ac-bags-card__cta">Shop Totes</a>
              </div>
            </div>
            <div className="ac-bags-card ac-bags-card--b">
              <div className="ac-bags-card__bg">
                <div className="ac-bags-card__bg-icon">💼</div>
                <span>500 × 500 px</span>
              </div>
              <div className="ac-bags-card__overlay" />
              <div className="ac-bags-card__info">
                <p className="ac-bags-card__eyebrow">New In</p>
                <h3 className="ac-bags-card__title">Mini &amp;<br />Crossbody</h3>
                <a href="/categories/accessories/bags" className="ac-bags-card__cta">Shop Mini Bags</a>
              </div>
            </div>
          </div>

          <div className="ac-filter-bar ac-reveal ac-reveal--delay-2" id="ac-bags-filters">
            <div className="ac-chips" role="group">
              {["All", "Tote", "Crossbody", "Mini Bag", "Backpack", "Clutch"].map((f, i) => (
                <button key={f} className={`ac-chip${i === 0 ? " ac-chip--active" : ""}`}>{f}</button>
              ))}
            </div>
            <div className="ac-sort">
              <label htmlFor="ac-sort-bags">Sort</label>
              <select id="ac-sort-bags">
                <option>Newest</option>
                <option>Price: Low–High</option>
                <option>Price: High–Low</option>
                <option>Best Sellers</option>
              </select>
            </div>
          </div>

          <div className="ac-product-grid ac-reveal ac-reveal--delay-3">
            {[
              { cat: "Tote",      name: "NOVA Canvas Tote",       price: "£68.00",  badge: "new",  oldPrice: undefined },
              { cat: "Crossbody", name: "Chain Mini Crossbody",   price: "£84.00",  badge: undefined, oldPrice: undefined },
              { cat: "Backpack",  name: "Urban Slim Backpack",     price: "£112.00", badge: "sale", oldPrice: "£140.00" },
              { cat: "Clutch",    name: "Satin Evening Clutch",    price: "£56.00",  badge: "new",  oldPrice: undefined },
            ].map((item, i) => (
              <article className="ac-card" key={i}>
                <div className="ac-card__img">
                  <div className="ac-card__img-placeholder"
                    style={{ background: "linear-gradient(160deg, #EDE8FC 0%, #D8D0F5 100%)" }}>
                    {svgPlaceholder}
                    <span>600 × 800 px</span>
                  </div>
                  {item.badge === "new"  && <span className="ac-card__badge ac-card__badge--new">New</span>}
                  {item.badge === "sale" && <span className="ac-card__badge ac-card__badge--sale">Sale</span>}
                  <div className="ac-card__wish" aria-label="Add to wishlist">♡</div>
                </div>
                <div className="ac-card__body">
                  <p className="ac-card__cat">{item.cat}</p>
                  <h3 className="ac-card__name">{item.name}</h3>
                  <div className="ac-card__footer">
                    <span className="ac-card__price">
                      {item.oldPrice && <s>{item.oldPrice}</s>}
                      {item.price}
                    </span>
                    <button className="ac-card__add" aria-label="Add to bag">+</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
