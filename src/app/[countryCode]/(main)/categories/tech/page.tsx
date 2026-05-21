"use client"

import { useEffect } from "react"

export default function TechPage() {

  useEffect(() => {
    // Scroll reveal
    const reveals = document.querySelectorAll(".tc-reveal")
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("tc-reveal--visible")
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.12 }
      )
      reveals.forEach((el) => observer.observe(el))
    } else {
      reveals.forEach((el) => el.classList.add("tc-reveal--visible"))
    }

    // Sticky nav shadow + active tab
    const nav = document.getElementById("tc-nav")
    const sectionIds = ["phones", "gadgets"]
    const sections = sectionIds.map((id) => document.getElementById(id))
    const tabs = document.querySelectorAll(".tc-nav__tab")

    function highlightTab() {
      const wH = window.innerHeight
      let activeId: string | null = null
      sections.forEach((s) => {
        if (!s) return
        const r = s.getBoundingClientRect()
        if (r.top <= wH * 0.4 && r.bottom >= wH * 0.4) activeId = s.id
      })
      if (!activeId && window.scrollY < 200) activeId = "phones"
      tabs.forEach((t) =>
        t.classList.toggle(
          "tc-nav__tab--active",
          (t as HTMLElement).dataset.section === activeId
        )
      )
    }

    const onScroll = () => {
      if (nav) nav.classList.toggle("tc-nav--scrolled", window.scrollY > 10)
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
    ;["tc-phones-filters", "tc-gadgets-filters"].forEach((id) => {
      const container = document.getElementById(id)
      if (!container) return
      const chips = container.querySelectorAll(".tc-chip")
      chips.forEach((chip) => {
        chip.addEventListener("click", function () {
          chips.forEach((c) => c.classList.remove("tc-chip--active"))
          chip.classList.add("tc-chip--active")
        })
      })
    })

    // Wishlist toggle
    document.querySelectorAll(".tc-card__wish").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation()
        const el = btn as HTMLElement
        const filled = el.textContent?.trim() === "♥"
        el.textContent = filled ? "♡" : "♥"
        el.style.color = filled ? "" : "#E85D75"
      })
    })

    // Add to bag flash
    document.querySelectorAll(".tc-card__add").forEach((btn) => {
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
    document.querySelectorAll(".tc-card").forEach((card) => {
      card.addEventListener("click", function (e) {
        const target = e.target as HTMLElement
        if (
          target.closest(".tc-card__add") ||
          target.closest(".tc-card__wish")
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
          --tc-cream: #F4F2FA;
          --tc-ink:   #18162B;
          --tc-accent:#6B4EE6;
          --tc-gray:  #8A82A8;
          --tc-line:  #E2DCF5;
          --tc-card:  #FAFAFE;
          --tc-deep:  #160E2B;
        }

        @keyframes tc-fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes tc-fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes tc-pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50%       { transform: scale(1.15); opacity: 1; }
        }
        @keyframes tc-orbit {
          from { transform: rotate(0deg) translateX(140px) rotate(0deg); }
          to   { transform: rotate(360deg) translateX(140px) rotate(-360deg); }
        }

        .tc-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }
        @media (min-width: 768px)  { .tc-container { padding: 0 48px; } }
        @media (min-width: 1024px) { .tc-container { padding: 0 64px; } }

        /* ── HERO ── */
        .tc-hero {
          position: relative;
          width: 100%;
          min-height: 100svh;
          background: var(--tc-deep);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          padding-top: 48px;
          padding-bottom: 80px;
        }
        .tc-hero__bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #160E2B 0%, #1A0E3A 30%, #2A1A5E 60%, #160E2B 100%);
          z-index: 0;
        }
        .tc-hero__bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 70% at 80% 30%, rgba(107,78,230,0.3) 0%, transparent 70%),
            radial-gradient(ellipse 50% 60% at 10% 80%, rgba(155,126,255,0.15) 0%, transparent 60%),
            radial-gradient(ellipse 30% 40% at 50% 50%, rgba(107,78,230,0.08) 0%, transparent 70%);
        }

        /* Tech-themed circuit grid overlay */
        .tc-hero__grid {
          position: absolute;
          inset: 0;
          z-index: 1;
          opacity: 0.04;
          background-image:
            linear-gradient(rgba(107,78,230,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(107,78,230,1) 1px, transparent 1px);
          background-size: 60px 60px;
        }

        /* Orbiting tech dot — unique to tech page */
        .tc-hero__orbit-wrap {
          position: absolute;
          top: 50%;
          right: 10%;
          transform: translateY(-50%);
          width: 280px;
          height: 280px;
          z-index: 1;
        }
        @media (max-width: 768px) { .tc-hero__orbit-wrap { display: none; } }
        .tc-hero__orbit-ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 1px solid rgba(107,78,230,0.2);
        }
        .tc-hero__orbit-ring:nth-child(2) {
          inset: 30px;
          border-color: rgba(107,78,230,0.3);
        }
        .tc-hero__orbit-ring:nth-child(3) {
          inset: 60px;
          border-color: rgba(107,78,230,0.4);
          background: radial-gradient(circle, rgba(107,78,230,0.1) 0%, transparent 70%);
        }
        .tc-hero__orbit-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 8px;
          height: 8px;
          margin: -4px;
          border-radius: 50%;
          background: var(--tc-accent);
          animation: tc-orbit 6s linear infinite;
          box-shadow: 0 0 12px rgba(107,78,230,0.8);
        }
        .tc-hero__orbit-dot:nth-child(5) {
          animation-duration: 10s;
          animation-direction: reverse;
          width: 5px;
          height: 5px;
          margin: -2.5px;
          background: #9B7EFF;
        }
        .tc-hero__orbit-center {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 36px;
          animation: tc-pulse 3s ease-in-out infinite;
        }

        .tc-hero__noise {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          z-index: 1;
        }
        .tc-hero__content {
          position: relative;
          z-index: 2;
          padding: 0 24px;
        }
        @media (min-width: 768px)  { .tc-hero__content { padding: 0 48px; } }
        @media (min-width: 1024px) { .tc-hero__content { padding: 0 64px; } }
        .tc-hero__eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--tc-accent);
          margin-bottom: 20px;
          opacity: 0;
          animation: tc-fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.2s forwards;
        }
        .tc-hero__title {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: clamp(52px, 9vw, 128px);
          line-height: 0.92;
          color: #fff;
          letter-spacing: -0.02em;
          opacity: 0;
          animation: tc-fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.35s forwards;
        }
        .tc-hero__title em {
          font-style: normal;
          background: linear-gradient(135deg, #9B7EFF 0%, #6B4EE6 50%, #C4B5FD 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .tc-hero__sub {
          margin-top: 28px;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 300;
          font-size: clamp(14px, 1.5vw, 17px);
          color: rgba(255,255,255,0.5);
          max-width: 480px;
          opacity: 0;
          animation: tc-fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.55s forwards;
        }

        /* Tech spec chips — unique to tech page */
        .tc-hero__specs {
          margin-top: 32px;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          opacity: 0;
          animation: tc-fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.65s forwards;
        }
        .tc-hero__spec-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          padding: 7px 14px;
          border-radius: 999px;
          border: 1px solid rgba(107,78,230,0.4);
          color: rgba(255,255,255,0.65);
          background: rgba(107,78,230,0.08);
        }
        .tc-hero__spec-chip-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--tc-accent);
          animation: tc-pulse 2s ease-in-out infinite;
        }
        .tc-hero__cta-row {
          margin-top: 44px;
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          opacity: 0;
          animation: tc-fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.7s forwards;
        }
        .tc-hero__scroll {
          position: absolute;
          bottom: 32px;
          right: 48px;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0;
          animation: tc-fadeIn 1s ease 1.2s forwards;
        }
        .tc-hero__scroll span {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          writing-mode: vertical-lr;
        }
        .tc-hero__scroll-line {
          width: 1px;
          height: 48px;
          background: linear-gradient(to bottom, rgba(107,78,230,0.8), transparent);
        }

        /* ── BUTTONS ── */
        .tc-btn {
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
        .tc-btn:hover  { transform: translateY(-2px); }
        .tc-btn:active { transform: translateY(0); }
        .tc-btn--primary {
          background: var(--tc-accent);
          color: #fff;
          padding: 14px 32px;
          box-shadow: 0 4px 24px rgba(107,78,230,0.35);
        }
        .tc-btn--primary:hover { background: #7C63EF; box-shadow: 0 8px 32px rgba(107,78,230,0.45); }
        .tc-btn--ghost {
          background: transparent;
          color: rgba(255,255,255,0.7);
          padding: 14px 24px;
          border: 1px solid rgba(255,255,255,0.18);
        }
        .tc-btn--ghost:hover { background: rgba(255,255,255,0.06); color: #fff; border-color: rgba(255,255,255,0.3); }

        /* ── STICKY NAV ── */
        .tc-nav {
          position: sticky;
          top: 0;
          z-index: 10;
          background: rgba(244,242,250,0.92);
          backdrop-filter: blur(16px) saturate(180%);
          -webkit-backdrop-filter: blur(16px) saturate(180%);
          border-bottom: 1px solid var(--tc-line);
          transition: box-shadow 0.3s ease;
        }
        .tc-nav--scrolled { box-shadow: 0 4px 24px rgba(22,14,43,0.08); }
        .tc-nav__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
          gap: 8px;
        }
        .tc-nav__logo {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 600;
          font-size: 20px;
          letter-spacing: 0.12em;
          color: var(--tc-ink);
          text-decoration: none;
          white-space: nowrap;
          flex-shrink: 0;
          display: none;
        }
        @media (min-width: 768px) { .tc-nav__logo { display: block; } }
        .tc-nav__tabs {
          display: flex;
          align-items: center;
          gap: 4px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          flex: 1;
          justify-content: flex-start;
        }
        .tc-nav__tabs::-webkit-scrollbar { display: none; }
        .tc-nav__tab {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--tc-gray);
          text-decoration: none;
          padding: 8px 14px;
          border-radius: 999px;
          white-space: nowrap;
          transition: color 0.2s ease, background 0.2s ease;
          cursor: pointer;
          background: none;
          border: none;
          flex-shrink: 0;
        }
        .tc-nav__tab:hover   { color: var(--tc-ink); background: var(--tc-line); }
        .tc-nav__tab--active { color: #fff; background: var(--tc-accent); }
        @media (max-width: 640px) {
          .tc-nav__tab { font-size: 9px; padding: 7px 12px; letter-spacing: 0.06em; }
        }

        /* ── CATEGORY STRIP ── */
        .tc-cat-strip {
          background: #fff;
          border-bottom: 1px solid var(--tc-line);
          padding: 40px 0;
        }
        .tc-cat-strip__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media (min-width: 768px)  { .tc-cat-strip__grid { grid-template-columns: repeat(2, 1fr); gap: 28px; } }
        @media (min-width: 1024px) { .tc-cat-strip__grid { grid-template-columns: repeat(2, 1fr); gap: 32px; } }

        .tc-cat-strip__card {
          border-radius: 24px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          aspect-ratio: 16 / 9;
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease;
          border: 1px solid var(--tc-line);
          text-decoration: none;
          display: block;
          min-height: 200px;
        }
        @media (min-width: 768px) { .tc-cat-strip__card { min-height: 260px; } }
        .tc-cat-strip__card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(22,14,43,0.12); }
        .tc-cat-strip__card--phones  {
          background: linear-gradient(135deg, #160E2B 0%, #2A1A5E 50%, #6B4EE6 100%);
        }
        .tc-cat-strip__card--gadgets {
          background: linear-gradient(135deg, #2A1A5E 0%, #4C35A0 50%, #9B7EFF 100%);
        }
        .tc-cat-strip__card-inner {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 16px;
          padding: 32px;
        }
        .tc-cat-strip__icon { font-size: 48px; }
        .tc-cat-strip__img-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .tc-cat-strip__img-placeholder svg  { width: 40px; height: 40px; opacity: 0.3; color: #fff; }
        .tc-cat-strip__img-placeholder span {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
        }
        .tc-cat-strip__label {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 24px 28px;
          background: linear-gradient(to top, rgba(22,14,43,0.85) 0%, transparent 100%);
        }
        .tc-cat-strip__label-name {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 500;
          font-size: 28px;
          color: #fff;
          display: block;
          margin-bottom: 4px;
        }
        .tc-cat-strip__label-count {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }

        /* ── SHARED SECTION ── */
        .tc-section { padding: 80px 0; }
        @media (min-width: 1024px) { .tc-section { padding: 120px 0; } }
        .tc-section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 48px;
          gap: 20px;
          flex-wrap: wrap;
        }
        .tc-section-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--tc-accent);
          margin-bottom: 10px;
        }
        .tc-section-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 500;
          font-size: clamp(36px, 5vw, 60px);
          line-height: 1;
          color: var(--tc-ink);
          letter-spacing: -0.02em;
        }
        .tc-section-title em { font-style: italic; font-weight: 300; color: var(--tc-gray); }
        .tc-view-all {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--tc-accent);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          border-radius: 999px;
          border: 1px solid var(--tc-accent);
          transition: background 0.2s ease, color 0.2s ease;
          white-space: nowrap;
        }
        .tc-view-all:hover { background: var(--tc-accent); color: #fff; }

        /* ── FILTER CHIPS ── */
        .tc-filter-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 36px;
          flex-wrap: wrap;
        }
        .tc-chips { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .tc-chip {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 8px 18px;
          border-radius: 999px;
          border: 1px solid var(--tc-line);
          background: var(--tc-card);
          color: var(--tc-gray);
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }
        .tc-chip:hover   { border-color: var(--tc-accent); color: var(--tc-accent); }
        .tc-chip--active { background: var(--tc-accent); border-color: var(--tc-accent); color: #fff; }
        .tc-sort { display: flex; align-items: center; gap: 8px; }
        .tc-sort label {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--tc-gray);
          white-space: nowrap;
        }
        .tc-sort select {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px;
          color: var(--tc-ink);
          background: var(--tc-card);
          border: 1px solid var(--tc-line);
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
        .tc-sort select:focus { border-color: var(--tc-accent); }

        /* ── PRODUCT GRID ── */
        .tc-product-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        @media (min-width: 768px)  { .tc-product-grid { gap: 28px; } }
        @media (min-width: 1024px) { .tc-product-grid { grid-template-columns: repeat(4, 1fr); gap: 24px; } }

        /* ── PRODUCT CARD ── */
        .tc-card {
          background: var(--tc-card);
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--tc-line);
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease;
          cursor: pointer;
          opacity: 0;
          animation: tc-fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .tc-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(22,14,43,0.12); }
        .tc-card:nth-child(1) { animation-delay: 0.05s; }
        .tc-card:nth-child(2) { animation-delay: 0.12s; }
        .tc-card:nth-child(3) { animation-delay: 0.19s; }
        .tc-card:nth-child(4) { animation-delay: 0.26s; }
        .tc-card__img {
          aspect-ratio: 1 / 1;
          background: var(--tc-line);
          position: relative;
          overflow: hidden;
        }
        .tc-card__img-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(160deg, #1E1147 0%, #2A1A5E 100%);
        }
        .tc-card__img-placeholder svg  { width: 40px; height: 40px; opacity: 0.25; color: #9B7EFF; }
        .tc-card__img-placeholder span {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
        }
        .tc-card__badge {
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
        .tc-card__badge--new  { background: var(--tc-accent); color: #fff; }
        .tc-card__badge--sale { background: #E85D75; color: #fff; }
        .tc-card__badge--hot  { background: #F59E0B; color: #fff; }
        .tc-card__wish {
          position: absolute;
          top: 12px; right: 12px;
          width: 32px; height: 32px;
          border-radius: 999px;
          background: rgba(255,255,255,0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 14px;
          z-index: 2;
          color: #fff;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .tc-card__wish:hover { background: rgba(255,255,255,0.25); transform: scale(1.1); }

        /* Tech spec tags on card — unique to tech cards */
        .tc-card__specs {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }
        .tc-card__spec {
          font-family: 'Space Mono', monospace;
          font-size: 8px;
          letter-spacing: 0.08em;
          padding: 3px 8px;
          border-radius: 4px;
          border: 1px solid var(--tc-line);
          color: var(--tc-accent);
          background: rgba(107,78,230,0.06);
        }
        .tc-card__body { padding: 16px; }
        .tc-card__cat {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--tc-gray);
          margin-bottom: 6px;
        }
        .tc-card__name {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 500;
          font-size: 18px;
          line-height: 1.2;
          color: var(--tc-ink);
          margin-bottom: 10px;
        }
        .tc-card__footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .tc-card__price { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; color: var(--tc-ink); }
        .tc-card__price s { font-weight: 400; color: var(--tc-gray); margin-right: 6px; font-size: 13px; }
        .tc-card__add {
          width: 34px; height: 34px;
          border-radius: 999px;
          background: var(--tc-accent);
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
        .tc-card__add:hover { background: #7C63EF; transform: scale(1.08); }

        /* ── PHONES SECTION ── */
        .tc-phones { background: var(--tc-cream); }

        /* Phone featured banner */
        .tc-phones-banner {
          border-radius: 24px;
          overflow: hidden;
          margin-bottom: 48px;
          display: grid;
          grid-template-columns: 1fr;
          border: 1px solid var(--tc-line);
          min-height: 380px;
        }
        @media (min-width: 768px) { .tc-phones-banner { grid-template-columns: 1fr 1fr; min-height: 440px; } }
        .tc-phones-banner__img {
          background: linear-gradient(135deg, #160E2B 0%, #2A1A5E 50%, #6B4EE6 100%);
          position: relative;
          min-height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .tc-phones-banner__img::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(107,78,230,0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(107,78,230,0.15) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .tc-phones-banner__img-inner {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          z-index: 2;
        }
        .tc-phones-banner__img-inner svg  { width: 48px; height: 48px; opacity: 0.35; color: #9B7EFF; }
        .tc-phones-banner__img-inner span {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
        }
        .tc-phones-banner__content {
          background: var(--tc-deep);
          padding: 48px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 20px;
        }
        .tc-phones-banner__eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--tc-accent);
        }
        .tc-phones-banner__title {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: clamp(32px, 4vw, 52px);
          line-height: 1.05;
          color: #fff;
        }
        .tc-phones-banner__desc { font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.7; max-width: 300px; }
        .tc-phones-banner__tags { display: flex; gap: 8px; flex-wrap: wrap; }
        .tc-phones-banner__tag {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 999px;
          border: 1px solid rgba(107,78,230,0.4);
          color: rgba(255,255,255,0.6);
        }

        /* ── GADGETS SECTION (dark) ── */
        .tc-gadgets { background: var(--tc-deep); padding: 80px 0; }
        @media (min-width: 1024px) { .tc-gadgets { padding: 120px 0; } }
        .tc-gadgets .tc-section-title   { color: #fff; }
        .tc-gadgets .tc-section-eyebrow { color: #9B7EFF; }
        .tc-gadgets .tc-view-all        { color: rgba(255,255,255,0.6); border-color: rgba(255,255,255,0.2); }
        .tc-gadgets .tc-view-all:hover  { background: rgba(255,255,255,0.08); color: #fff; }
        .tc-gadgets .tc-chip            { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.12); color: rgba(255,255,255,0.5); }
        .tc-gadgets .tc-chip:hover      { border-color: var(--tc-accent); color: #C4B5FD; }
        .tc-gadgets .tc-chip--active    { background: var(--tc-accent); border-color: var(--tc-accent); color: #fff; }
        .tc-gadgets .tc-sort label      { color: rgba(255,255,255,0.4); }
        .tc-gadgets .tc-sort select     { background-color: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.12); color: #fff; }
        .tc-gadgets .tc-card            { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.08); }
        .tc-gadgets .tc-card:hover      { box-shadow: 0 16px 48px rgba(0,0,0,0.4); }
        .tc-gadgets .tc-card__name      { color: #fff; }
        .tc-gadgets .tc-card__price     { color: #C4B5FD; }

        /* Gadgets hero banner */
        .tc-gadgets-hero {
          border-radius: 24px;
          background: linear-gradient(135deg, #1A0E3A 0%, #2A1A5E 40%, #4C35A0 100%);
          padding: 56px 48px;
          margin-bottom: 48px;
          position: relative;
          overflow: hidden;
        }
        .tc-gadgets-hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(107,78,230,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(107,78,230,0.08) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        .tc-gadgets-hero::after {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(107,78,230,0.2) 0%, transparent 70%);
        }
        .tc-gadgets-hero__inner { position: relative; z-index: 2; }
        .tc-gadgets-hero__eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          margin-bottom: 16px;
        }
        .tc-gadgets-hero__title {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: clamp(36px, 5vw, 64px);
          color: #fff;
          line-height: 1;
          margin-bottom: 20px;
        }
        .tc-gadgets-hero__desc {
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          max-width: 480px;
          line-height: 1.7;
          margin-bottom: 32px;
        }
        .tc-gadgets-hero__features { display: flex; gap: 16px; flex-wrap: wrap; }
        .tc-gadgets-feature { display: flex; align-items: center; gap: 8px; }
        .tc-gadgets-feature__dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--tc-accent);
          flex-shrink: 0;
          animation: tc-pulse 2s ease-in-out infinite;
        }
        .tc-gadgets-feature span {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
        }

        /* ── SCROLL REVEAL ── */
        .tc-reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1);
        }
        .tc-reveal--visible  { opacity: 1; transform: translateY(0); }
        .tc-reveal--delay-1  { transition-delay: 0.1s; }
        .tc-reveal--delay-2  { transition-delay: 0.2s; }
        .tc-reveal--delay-3  { transition-delay: 0.3s; }
        .tc-reveal--delay-4  { transition-delay: 0.4s; }
      `}</style>

      {/* ── HERO ── */}
      <section className="tc-hero" aria-label="DJONOVA Tech Essentials hero">
        <div className="tc-hero__bg" />
        <div className="tc-hero__grid" />
        <div className="tc-hero__noise" />
        <div className="tc-hero__orbit-wrap">
          <div className="tc-hero__orbit-ring" />
          <div className="tc-hero__orbit-ring" />
          <div className="tc-hero__orbit-ring" />
          <div className="tc-hero__orbit-dot" />
          <div className="tc-hero__orbit-dot" />
          <div className="tc-hero__orbit-center">⚡</div>
        </div>
        <div className="tc-hero__content">
          <p className="tc-hero__eyebrow">DJONOVA · Tech Essentials SS2025</p>
          <h1 className="tc-hero__title">
            TECH /<br />
            built for <em>living.</em>
          </h1>
          <p className="tc-hero__sub">
            Smart accessories and devices engineered to complement your lifestyle — not compete with it.
          </p>
          <div className="tc-hero__specs">
            {[
              { label: "Premium Build" },
              { label: "Warranty Included" },
              { label: "Next-Day Dispatch" },
              { label: "Expert Support" },
            ].map((s) => (
              <div className="tc-hero__spec-chip" key={s.label}>
                <div className="tc-hero__spec-chip-dot" />
                {s.label}
              </div>
            ))}
          </div>
          <div className="tc-hero__cta-row">
            <a href="#phones" className="tc-btn tc-btn--primary">Shop Phones →</a>
            <a href="#gadgets" className="tc-btn tc-btn--ghost">Explore Gadgets</a>
          </div>
        </div>
        <div className="tc-hero__scroll">
          <div className="tc-hero__scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ── STICKY NAV ── */}
      <nav className="tc-nav" id="tc-nav" aria-label="Tech category navigation">
        <div className="tc-container">
          <div className="tc-nav__inner">
            <a href="/categories/tech" className="tc-nav__logo">DJONOVA</a>
            <div className="tc-nav__tabs" role="tablist">
              <button className="tc-nav__tab tc-nav__tab--active" data-section="phones"  role="tab">Phones</button>
              <button className="tc-nav__tab" data-section="gadgets" role="tab">Gadgets</button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── CATEGORY STRIP ── */}
      <div className="tc-cat-strip tc-reveal">
        <div className="tc-container">
          <div className="tc-cat-strip__grid">
            {[
              { cls: "phones",  label: "Phones",  count: "24 products", href: "#phones",  icon: "📱" },
              { cls: "gadgets", label: "Gadgets", count: "18 products", href: "#gadgets", icon: "🎧" },
            ].map((item) => (
              <a
                key={item.cls}
                href={item.href}
                className={`tc-cat-strip__card tc-cat-strip__card--${item.cls}`}
              >
                <div className="tc-cat-strip__card-inner">
                  <div className="tc-cat-strip__img-placeholder">
                    {svgPlaceholder}
                    <span>800 × 450 px</span>
                  </div>
                </div>
                <div className="tc-cat-strip__label">
                  <span className="tc-cat-strip__label-name">{item.label}</span>
                  <div className="tc-cat-strip__label-count">{item.count}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── PHONES SECTION ── */}
      <section className="tc-section tc-phones" id="phones" aria-label="Phones">
        <div className="tc-container">

          <div className="tc-section-header tc-reveal">
            <div>
              <p className="tc-section-eyebrow">01 — Phones</p>
              <h2 className="tc-section-title">Power in your <em>pocket.</em></h2>
            </div>
            <a href="/categories/tech/phones" className="tc-view-all">View All →</a>
          </div>

          {/* Phones editorial banner */}
          <div className="tc-phones-banner tc-reveal tc-reveal--delay-1">
            <div className="tc-phones-banner__img">
              <div className="tc-phones-banner__img-inner">
                {svgPlaceholder}
                <span>800 × 600 px</span>
              </div>
            </div>
            <div className="tc-phones-banner__content">
              <p className="tc-phones-banner__eyebrow">Latest Drop</p>
              <h3 className="tc-phones-banner__title">Flagship<br />performance.</h3>
              <p className="tc-phones-banner__desc">
                Premium smartphones curated for the DJONOVA lifestyle — performance, design, and daily elegance in one device.
              </p>
              <div className="tc-phones-banner__tags">
                <span className="tc-phones-banner__tag">5G Ready</span>
                <span className="tc-phones-banner__tag">AMOLED</span>
                <span className="tc-phones-banner__tag">All-day Battery</span>
              </div>
              <div>
                <a href="/categories/tech/phones" className="tc-btn tc-btn--primary">Shop Phones</a>
              </div>
            </div>
          </div>

          {/* Phones filter */}
          <div className="tc-filter-bar tc-reveal tc-reveal--delay-2" id="tc-phones-filters">
            <div className="tc-chips" role="group">
              {["All", "Flagship", "Mid-range", "Budget", "Accessories"].map((f, i) => (
                <button
                  key={f}
                  className={`tc-chip${i === 0 ? " tc-chip--active" : ""}`}
                  data-group="phones"
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="tc-sort">
              <label htmlFor="tc-sort-phones">Sort</label>
              <select id="tc-sort-phones">
                <option>Newest</option>
                <option>Price: Low–High</option>
                <option>Price: High–Low</option>
                <option>Best Sellers</option>
              </select>
            </div>
          </div>

          {/* Phones product grid */}
          <div className="tc-product-grid tc-reveal tc-reveal--delay-3">
            {[
              {
                cat: "Flagship",
                name: "NOVA X Pro",
                price: "£899.00",
                badge: "new",
                specs: ["6.7\" AMOLED", "5G", "200MP", "5000mAh"],
              },
              {
                cat: "Flagship",
                name: "NOVA X Standard",
                price: "£699.00",
                badge: "new",
                specs: ["6.1\" AMOLED", "5G", "108MP", "4500mAh"],
              },
              {
                cat: "Mid-range",
                name: "PULSE 12",
                price: "£449.00",
                oldPrice: "£499.00",
                badge: "sale",
                saleLabel: "−10%",
                specs: ["6.4\" LCD", "5G", "64MP", "4000mAh"],
              },
              {
                cat: "Mid-range",
                name: "PULSE 12 Lite",
                price: "£329.00",
                badge: "hot",
                specs: ["6.0\" OLED", "4G", "48MP", "3800mAh"],
              },
            ].map((item, i) => (
              <article className="tc-card" key={i}>
                <div className="tc-card__img">
                  <div className="tc-card__img-placeholder">
                    {svgPlaceholder}
                    <span>600 × 600 px</span>
                  </div>
                  {item.badge === "new"  && <span className="tc-card__badge tc-card__badge--new">New</span>}
                  {item.badge === "sale" && <span className="tc-card__badge tc-card__badge--sale">{item.saleLabel}</span>}
                  {item.badge === "hot"  && <span className="tc-card__badge tc-card__badge--hot">Hot</span>}
                  <div className="tc-card__wish" aria-label="Add to wishlist">♡</div>
                </div>
                <div className="tc-card__body">
                  <p className="tc-card__cat">{item.cat}</p>
                  <h3 className="tc-card__name">{item.name}</h3>
                  <div className="tc-card__specs">
                    {item.specs.map((s) => (
                      <span key={s} className="tc-card__spec">{s}</span>
                    ))}
                  </div>
                  <div className="tc-card__footer">
                    <span className="tc-card__price">
                      {item.oldPrice && <s>{item.oldPrice}</s>}
                      {item.price}
                    </span>
                    <button className="tc-card__add" aria-label="Add to bag">+</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── GADGETS SECTION (dark) ── */}
      <section className="tc-gadgets" id="gadgets" aria-label="Gadgets">
        <div className="tc-container">

          <div className="tc-section-header tc-reveal">
            <div>
              <p className="tc-section-eyebrow">02 — Gadgets</p>
              <h2 className="tc-section-title">Smart living, <em>elevated.</em></h2>
            </div>
            <a href="/categories/tech/gadget" className="tc-view-all">View All →</a>
          </div>

          {/* Gadgets hero banner */}
          <div className="tc-gadgets-hero tc-reveal tc-reveal--delay-1">
            <div className="tc-gadgets-hero__inner">
              <p className="tc-gadgets-hero__eyebrow">New Season Tech</p>
              <h3 className="tc-gadgets-hero__title">Every device,<br />every lifestyle.</h3>
              <p className="tc-gadgets-hero__desc">
                From wireless audio to smart wearables — our gadget collection is curated for those who demand performance and elegance in equal measure.
              </p>
              <div className="tc-gadgets-hero__features">
                {[
                  "Premium Audio",
                  "Smart Wearables",
                  "Wireless Charging",
                  "Eco Packaging",
                ].map((f) => (
                  <div className="tc-gadgets-feature" key={f}>
                    <div className="tc-gadgets-feature__dot" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Gadgets filter */}
          <div className="tc-filter-bar tc-reveal tc-reveal--delay-2" id="tc-gadgets-filters">
            <div className="tc-chips" role="group">
              {["All", "Audio", "Wearables", "Charging", "Bags & Cases"].map((f, i) => (
                <button
                  key={f}
                  className={`tc-chip${i === 0 ? " tc-chip--active" : ""}`}
                  data-group="gadgets"
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="tc-sort">
              <label htmlFor="tc-sort-gadgets">Sort</label>
              <select id="tc-sort-gadgets">
                <option>Newest</option>
                <option>Price: Low–High</option>
                <option>Price: High–Low</option>
                <option>Best Sellers</option>
              </select>
            </div>
          </div>

          {/* Gadgets product grid */}
          <div className="tc-product-grid tc-reveal tc-reveal--delay-3">
            {[
              {
                cat: "Audio",
                name: "PULSE Pro Buds",
                price: "£129.00",
                badge: "new",
                specs: ["40hr Battery", "ANC", "IPX5", "Wireless"],
              },
              {
                cat: "Wearables",
                name: "FLOW Smart Watch",
                price: "£289.00",
                badge: "new",
                specs: ["AMOLED", "7-day Battery", "GPS", "Health"],
              },
              {
                cat: "Charging",
                name: "GRID 65W Charger",
                price: "£54.00",
                oldPrice: "£69.00",
                badge: "sale",
                saleLabel: "−22%",
                specs: ["65W GaN", "3-port", "Universal", "Compact"],
              },
              {
                cat: "Bags & Cases",
                name: "GRID Tech Bag",
                price: "£195.00",
                badge: "hot",
                specs: ["30L", "USB-C Port", "RFID-Safe", "Waterproof"],
              },
            ].map((item, i) => (
              <article className="tc-card" key={i}>
                <div className="tc-card__img">
                  <div className="tc-card__img-placeholder">
                    {svgPlaceholder}
                    <span>600 × 600 px</span>
                  </div>
                  {item.badge === "new"  && <span className="tc-card__badge tc-card__badge--new">New</span>}
                  {item.badge === "sale" && <span className="tc-card__badge tc-card__badge--sale">{item.saleLabel}</span>}
                  {item.badge === "hot"  && <span className="tc-card__badge tc-card__badge--hot">Hot</span>}
                  <div className="tc-card__wish" aria-label="Add to wishlist">♡</div>
                </div>
                <div className="tc-card__body">
                  <p className="tc-card__cat">{item.cat}</p>
                  <h3 className="tc-card__name">{item.name}</h3>
                  <div className="tc-card__specs">
                    {item.specs.map((s) => (
                      <span key={s} className="tc-card__spec">{s}</span>
                    ))}
                  </div>
                  <div className="tc-card__footer">
                    <span className="tc-card__price">
                      {item.oldPrice && <s>{item.oldPrice}</s>}
                      {item.price}
                    </span>
                    <button className="tc-card__add" aria-label="Add to bag">+</button>
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
