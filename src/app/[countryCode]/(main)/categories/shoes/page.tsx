"use client"

import { useEffect } from "react"

export default function ShoesPage() {

  useEffect(() => {
    // Scroll reveal
    const reveals = document.querySelectorAll(".sh-reveal")
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("sh-reveal--visible")
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.12 }
      )
      reveals.forEach((el) => observer.observe(el))
    } else {
      reveals.forEach((el) => el.classList.add("sh-reveal--visible"))
    }

    // Filter chips per group
    ;[
      "sh-women-filters",
      "sh-men-filters",
      "sh-kids-filters",
      "sh-casual-filters",
      "sh-formal-filters",
      "sh-sports-filters",
    ].forEach((id) => {
      const container = document.getElementById(id)
      if (!container) return
      const chips = container.querySelectorAll(".sh-chip")
      chips.forEach((chip) => {
        chip.addEventListener("click", function () {
          chips.forEach((c) => c.classList.remove("sh-chip--active"))
          chip.classList.add("sh-chip--active")
        })
      })
    })

    // Wishlist toggle
    document.querySelectorAll(".sh-card__wish").forEach((btn) => {
      btn.addEventListener("click", function (e) {
        e.stopPropagation()
        const el = btn as HTMLElement
        const filled = el.textContent?.trim() === "♥"
        el.textContent = filled ? "♡" : "♥"
        el.style.color = filled ? "" : "#E85D75"
      })
    })

    // Add to bag flash
    document.querySelectorAll(".sh-card__add").forEach((btn) => {
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
    document.querySelectorAll(".sh-card").forEach((card) => {
      card.addEventListener("click", function (e) {
        const target = e.target as HTMLElement
        if (
          target.closest(".sh-card__add") ||
          target.closest(".sh-card__wish")
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
          --sh-cream: #F4F2FA;
          --sh-ink:   #18162B;
          --sh-accent:#6B4EE6;
          --sh-gray:  #8A82A8;
          --sh-line:  #E2DCF5;
          --sh-card:  #FAFAFE;
          --sh-deep:  #160E2B;
        }

        @keyframes sh-fadeUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sh-fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes sh-sole-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        .sh-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 24px;
        }
        @media (min-width: 768px)  { .sh-container { padding: 0 48px; } }
        @media (min-width: 1024px) { .sh-container { padding: 0 64px; } }

        /* ── HERO ── */
        .sh-hero {
          position: relative;
          width: 100%;
          min-height: 100svh;
          background: var(--sh-deep);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          padding-top: 48px;
          padding-bottom: 80px;
        }
        .sh-hero__bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #160E2B 0%, #2A1A5E 40%, #1A0E3A 70%, #0D0820 100%);
          z-index: 0;
        }
        .sh-hero__bg::after {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 80% 60% at 70% 40%, rgba(107,78,230,0.25) 0%, transparent 70%),
            radial-gradient(ellipse 40% 80% at 20% 80%, rgba(107,78,230,0.12) 0%, transparent 60%);
        }
        .sh-hero__sole-ring {
          position: absolute;
          top: 50%;
          right: -120px;
          transform: translateY(-50%);
          width: 600px;
          height: 600px;
          border-radius: 50%;
          border: 1px solid rgba(107,78,230,0.12);
          z-index: 1;
        }
        .sh-hero__sole-ring::before {
          content: '';
          position: absolute;
          inset: 40px;
          border-radius: 50%;
          border: 1px solid rgba(107,78,230,0.18);
        }
        .sh-hero__sole-ring::after {
          content: '';
          position: absolute;
          inset: 80px;
          border-radius: 50%;
          border: 2px solid rgba(107,78,230,0.25);
          animation: sh-sole-spin 20s linear infinite;
        }
        @media (max-width: 768px) { .sh-hero__sole-ring { display: none; } }
        .sh-hero__noise {
          position: absolute;
          inset: 0;
          opacity: 0.04;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          z-index: 1;
        }
        .sh-hero__content {
          position: relative;
          z-index: 2;
          padding: 0 24px;
        }
        @media (min-width: 768px)  { .sh-hero__content { padding: 0 48px; } }
        @media (min-width: 1024px) { .sh-hero__content { padding: 0 64px; } }
        .sh-hero__eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--sh-accent);
          margin-bottom: 20px;
          opacity: 0;
          animation: sh-fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.2s forwards;
        }
        .sh-hero__title {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: clamp(52px, 9vw, 128px);
          line-height: 0.92;
          color: #fff;
          letter-spacing: -0.02em;
          opacity: 0;
          animation: sh-fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.35s forwards;
        }
        .sh-hero__title em {
          font-style: normal;
          background: linear-gradient(135deg, #9B7EFF 0%, #6B4EE6 50%, #C4B5FD 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .sh-hero__sub {
          margin-top: 28px;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 300;
          font-size: clamp(14px, 1.5vw, 17px);
          color: rgba(255,255,255,0.5);
          max-width: 480px;
          opacity: 0;
          animation: sh-fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.55s forwards;
        }
        .sh-hero__sizes {
          margin-top: 32px;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          opacity: 0;
          animation: sh-fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.65s forwards;
        }
        .sh-hero__size-label {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
        }
        .sh-hero__size-chip {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          padding: 6px 14px;
          border-radius: 999px;
          border: 1px solid rgba(107,78,230,0.4);
          color: rgba(255,255,255,0.65);
          background: rgba(107,78,230,0.08);
        }
        .sh-hero__cta-row {
          margin-top: 44px;
          display: flex;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          opacity: 0;
          animation: sh-fadeUp 0.9s cubic-bezier(0.22,1,0.36,1) 0.7s forwards;
        }
        .sh-hero__scroll {
          position: absolute;
          bottom: 32px;
          right: 48px;
          z-index: 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          opacity: 0;
          animation: sh-fadeIn 1s ease 1.2s forwards;
        }
        .sh-hero__scroll span {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          writing-mode: vertical-lr;
        }
        .sh-hero__scroll-line {
          width: 1px;
          height: 48px;
          background: linear-gradient(to bottom, rgba(107,78,230,0.8), transparent);
        }

        /* ── BUTTONS ── */
        .sh-btn {
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
        .sh-btn:hover  { transform: translateY(-2px); }
        .sh-btn:active { transform: translateY(0); }
        .sh-btn--primary {
          background: var(--sh-accent);
          color: #fff;
          padding: 14px 32px;
          box-shadow: 0 4px 24px rgba(107,78,230,0.35);
        }
        .sh-btn--primary:hover { background: #7C63EF; box-shadow: 0 8px 32px rgba(107,78,230,0.45); }
        .sh-btn--ghost {
          background: transparent;
          color: rgba(255,255,255,0.7);
          padding: 14px 24px;
          border: 1px solid rgba(255,255,255,0.18);
        }
        .sh-btn--ghost:hover { background: rgba(255,255,255,0.06); color: #fff; border-color: rgba(255,255,255,0.3); }

        /* ── CATEGORY STRIP ── */
        .sh-cat-strip {
          background: #fff;
          border-bottom: 1px solid var(--sh-line);
          padding: 40px 0;
        }
        .sh-cat-strip__grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 16px;
        }
        @media (max-width: 1024px) {
          .sh-cat-strip__grid { grid-template-columns: repeat(3, 1fr); gap: 12px; }
        }
        @media (max-width: 640px) {
          .sh-cat-strip__grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
        }
        .sh-cat-strip__card {
          border-radius: 16px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          aspect-ratio: 3 / 4;
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease;
          border: 1px solid var(--sh-line);
          text-decoration: none;
          display: block;
        }
        .sh-cat-strip__card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(22,14,43,0.12); }
        .sh-cat-strip__card--women  { background: linear-gradient(160deg, #EDE8FC 0%, #C4B5FD 100%); }
        .sh-cat-strip__card--men    { background: linear-gradient(160deg, #2A1A5E 0%, #4C35A0 100%); }
        .sh-cat-strip__card--kids   { background: linear-gradient(160deg, #2D1060 0%, #6B4EE6 100%); }
        .sh-cat-strip__card--casual { background: linear-gradient(160deg, #D8D0F5 0%, #9B7EFF 100%); }
        .sh-cat-strip__card--formal { background: linear-gradient(160deg, #160E2B 0%, #2A1A5E 100%); }
        .sh-cat-strip__card--sports { background: linear-gradient(160deg, #6B4EE6 0%, #9B7EFF 100%); }
        .sh-cat-strip__card-inner {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 20px;
        }
        .sh-cat-strip__img-placeholder {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .sh-cat-strip__img-placeholder svg  { width: 36px; height: 36px; opacity: 0.3; }
        .sh-cat-strip__img-placeholder span {
          font-family: 'Space Mono', monospace;
          font-size: 8px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          opacity: 0.45;
        }
        .sh-cat-strip__label {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          padding: 16px;
          background: linear-gradient(to top, rgba(22,14,43,0.7) 0%, transparent 100%);
          text-align: center;
        }
        .sh-cat-strip__label-name {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 500;
          font-size: 18px;
          color: #fff;
          display: block;
        }
        .sh-cat-strip__label-count {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          margin-top: 2px;
        }

        /* ── SHARED SECTION ── */
        .sh-section { padding: 80px 0; }
        @media (min-width: 1024px) { .sh-section { padding: 120px 0; } }
        .sh-section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 48px;
          gap: 20px;
          flex-wrap: wrap;
        }
        .sh-section-eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--sh-accent);
          margin-bottom: 10px;
        }
        .sh-section-title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 500;
          font-size: clamp(36px, 5vw, 60px);
          line-height: 1;
          color: var(--sh-ink);
          letter-spacing: -0.02em;
        }
        .sh-section-title em { font-style: italic; font-weight: 300; color: var(--sh-gray); }
        .sh-view-all {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--sh-accent);
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          border-radius: 999px;
          border: 1px solid var(--sh-accent);
          transition: background 0.2s ease, color 0.2s ease;
          white-space: nowrap;
        }
        .sh-view-all:hover { background: var(--sh-accent); color: #fff; }

        /* ── FILTER CHIPS ── */
        .sh-filter-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 36px;
          flex-wrap: wrap;
        }
        .sh-chips { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
        .sh-chip {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 8px 18px;
          border-radius: 999px;
          border: 1px solid var(--sh-line);
          background: var(--sh-card);
          color: var(--sh-gray);
          cursor: pointer;
          transition: all 0.2s ease;
          user-select: none;
        }
        .sh-chip:hover   { border-color: var(--sh-accent); color: var(--sh-accent); }
        .sh-chip--active { background: var(--sh-accent); border-color: var(--sh-accent); color: #fff; }
        .sh-sort { display: flex; align-items: center; gap: 8px; }
        .sh-sort label {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--sh-gray);
          white-space: nowrap;
        }
        .sh-sort select {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 13px;
          color: var(--sh-ink);
          background: var(--sh-card);
          border: 1px solid var(--sh-line);
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
        .sh-sort select:focus { border-color: var(--sh-accent); }

        /* ── PRODUCT GRID ── */
        .sh-product-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }
        @media (min-width: 768px)  { .sh-product-grid { gap: 28px; } }
        @media (min-width: 1024px) { .sh-product-grid { grid-template-columns: repeat(4, 1fr); gap: 24px; } }

        /* ── PRODUCT CARD ── */
        .sh-card {
          background: var(--sh-card);
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid var(--sh-line);
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease;
          cursor: pointer;
          opacity: 0;
          animation: sh-fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .sh-card:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(22,14,43,0.12); }
        .sh-card:nth-child(1) { animation-delay: 0.05s; }
        .sh-card:nth-child(2) { animation-delay: 0.12s; }
        .sh-card:nth-child(3) { animation-delay: 0.19s; }
        .sh-card:nth-child(4) { animation-delay: 0.26s; }
        .sh-card__img {
          aspect-ratio: 3 / 4;
          background: var(--sh-line);
          position: relative;
          overflow: hidden;
        }
        .sh-card__img-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: linear-gradient(160deg, #EDE8FC 0%, #D8D0F5 100%);
        }
        .sh-card__img-placeholder svg  { width: 40px; height: 40px; opacity: 0.35; color: var(--sh-accent); }
        .sh-card__img-placeholder span {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--sh-gray);
        }
        .sh-card__badge {
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
        .sh-card__badge--new  { background: var(--sh-accent); color: #fff; }
        .sh-card__badge--sale { background: #E85D75; color: #fff; }
        .sh-card__wish {
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
        .sh-card__wish:hover { background: #fff; transform: scale(1.1); }
        .sh-card__sizes {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }
        .sh-card__size {
          font-family: 'Space Mono', monospace;
          font-size: 8px;
          letter-spacing: 0.08em;
          padding: 3px 7px;
          border-radius: 4px;
          border: 1px solid var(--sh-line);
          color: var(--sh-gray);
          background: var(--sh-cream);
        }
        .sh-card__size--out { opacity: 0.4; text-decoration: line-through; }
        .sh-card__body { padding: 16px; }
        .sh-card__cat {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--sh-gray);
          margin-bottom: 6px;
        }
        .sh-card__name {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 500;
          font-size: 18px;
          line-height: 1.2;
          color: var(--sh-ink);
          margin-bottom: 10px;
        }
        .sh-card__footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .sh-card__price { font-family: 'Space Grotesk', sans-serif; font-weight: 600; font-size: 15px; color: var(--sh-ink); }
        .sh-card__price s { font-weight: 400; color: var(--sh-gray); margin-right: 6px; font-size: 13px; }
        .sh-card__add {
          width: 34px; height: 34px;
          border-radius: 999px;
          background: var(--sh-accent);
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
        .sh-card__add:hover { background: #7C63EF; transform: scale(1.08); }

        /* ── WOMEN SECTION ── */
        .sh-women { background: var(--sh-cream); }
        .sh-women-banner {
          display: grid;
          grid-template-columns: 1fr;
          border-radius: 24px;
          overflow: hidden;
          margin-bottom: 48px;
          border: 1px solid var(--sh-line);
          min-height: 380px;
        }
        @media (min-width: 768px) { .sh-women-banner { grid-template-columns: 1fr 1fr; min-height: 440px; } }
        .sh-women-banner__img {
          background: linear-gradient(135deg, #C4B5FD 0%, #7C63EF 60%, #4C35A0 100%);
          position: relative;
          min-height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .sh-women-banner__img-inner {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          z-index: 2;
        }
        .sh-women-banner__img-inner svg  { width: 48px; height: 48px; opacity: 0.4; color: #fff; }
        .sh-women-banner__img-inner span {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }
        .sh-women-banner__content {
          background: var(--sh-deep);
          padding: 48px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 20px;
        }
        .sh-women-banner__eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--sh-accent);
        }
        .sh-women-banner__title {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: clamp(32px, 4vw, 52px);
          line-height: 1.05;
          color: #fff;
        }
        .sh-women-banner__desc { font-size: 14px; color: rgba(255,255,255,0.5); line-height: 1.7; max-width: 300px; }
        .sh-women-banner__tags { display: flex; gap: 8px; flex-wrap: wrap; }
        .sh-women-banner__tag {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 999px;
          border: 1px solid rgba(107,78,230,0.4);
          color: rgba(255,255,255,0.6);
        }

        /* ── MEN SECTION ── */
        .sh-men { background: #fff; border-top: 1px solid var(--sh-line); border-bottom: 1px solid var(--sh-line); }
        .sh-men__accent-bar { width: 60px; height: 3px; background: var(--sh-accent); border-radius: 999px; margin-top: 12px; }

/* ── KIDS SECTION ── */
.sh-kids { background: #EDE8FC; padding: 80px 0; }
@media (min-width: 1024px) { .sh-kids { padding: 120px 0; } }
.sh-kids .sh-section-title   { color: var(--sh-ink); }
.sh-kids .sh-section-eyebrow { color: var(--sh-accent); }
.sh-kids .sh-view-all        { color: var(--sh-accent); border-color: var(--sh-accent); }
.sh-kids .sh-view-all:hover  { background: var(--sh-accent); color: #fff; }
.sh-kids .sh-chip            { background: #fff; border-color: var(--sh-line); color: var(--sh-gray); }
.sh-kids .sh-chip:hover      { border-color: var(--sh-accent); color: var(--sh-accent); }
.sh-kids .sh-chip--active    { background: var(--sh-accent); border-color: var(--sh-accent); color: #fff; }
.sh-kids .sh-sort label      { color: var(--sh-gray); }
.sh-kids .sh-sort select     { background-color: #fff; border-color: var(--sh-line); color: var(--sh-ink); }
.sh-kids .sh-card            { background: #fff; border-color: var(--sh-line); }
.sh-kids .sh-card:hover      { box-shadow: 0 16px 48px rgba(107,78,230,0.12); }
.sh-kids .sh-card__img-placeholder { background: linear-gradient(160deg, #EDE8FC 0%, #C4B5FD 100%); }
.sh-kids .sh-card__name      { color: var(--sh-ink); }
.sh-kids .sh-card__price     { color: var(--sh-ink); }
.sh-kids .sh-card__size      { background: var(--sh-cream); border-color: var(--sh-line); color: var(--sh-gray); }

        .sh-kids-banner__content {
  background: var(--sh-deep);
  padding: 48px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
}
.sh-kids-banner__eyebrow {
  font-family: 'Space Mono', monospace;
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--sh-accent);
}
.sh-kids-banner__title {
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  font-weight: 300;
  font-size: clamp(32px, 4vw, 52px);
  line-height: 1.05;
  color: #fff;
}
.sh-kids-banner__desc {
  font-size: 14px;
  color: rgba(255,255,255,0.5);
  line-height: 1.7;
  max-width: 300px;
}
.sh-kids-banner__tags { display: flex; gap: 8px; flex-wrap: wrap; }
.sh-kids-banner__tag {
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 5px 12px;
  border-radius: 999px;
  border: 1px solid rgba(107,78,230,0.4);
  color: rgba(255,255,255,0.6);
}

/* Age cards - light theme */
.sh-kids-age-card {
  border-radius: 20px;
  padding: 32px 24px;
  text-align: center;
  border: 1px solid var(--sh-line);
  background: #fff;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
  position: relative;
  overflow: hidden;
}
.sh-kids-age-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(107,78,230,0.12);
  border-color: var(--sh-accent);
}
.sh-kids-age-card::before {
  content: '';
  position: absolute;
  top: -30px; right: -30px;
  width: 100px; height: 100px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(107,78,230,0.08) 0%, transparent 70%);
}
.sh-kids-age-card__range {
  font-family: 'Cormorant Garamond', serif;
  font-weight: 300;
  font-size: 28px;
  color: var(--sh-ink);
  line-height: 1;
  margin-bottom: 6px;
}
.sh-kids-age-card__label {
  font-family: 'Space Mono', monospace;
  font-size: 9px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--sh-gray);
  margin-bottom: 8px;
}
.sh-kids-age-card__sizes {
  font-family: 'Space Mono', monospace;
  font-size: 8px;
  letter-spacing: 0.1em;
  color: var(--sh-accent);
}
        @media (min-width: 768px) { .sh-kids-banner { grid-template-columns: 1fr 1fr; min-height: 440px; } }
        .sh-kids-banner__img {
          background: linear-gradient(135deg, #3D1F8C 0%, #6B4EE6 60%, #9B7EFF 100%);
          position: relative;
          min-height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .sh-kids-banner__img::before {
          content: '';
          position: absolute;
          top: -60px; right: -60px;
          width: 300px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
        }
        .sh-kids-banner__img::after {
          content: '';
          position: absolute;
          bottom: -40px; left: -40px;
          width: 200px; height: 200px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(107,78,230,0.3) 0%, transparent 70%);
        }
        .sh-kids-banner__img-inner {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          z-index: 2;
        }
        .sh-kids-banner__img-inner svg  { width: 48px; height: 48px; opacity: 0.4; color: #fff; }
        .sh-kids-banner__img-inner span {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
        }
        .sh-kids-banner__content {
          background: rgba(255,255,255,0.03);
          border-left: 1px solid rgba(255,255,255,0.06);
          padding: 48px 40px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 20px;
        }
        .sh-kids-banner__eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #9B7EFF;
        }
        .sh-kids-banner__title {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: clamp(32px, 4vw, 52px);
          line-height: 1.05;
          color: #fff;
        }
        .sh-kids-banner__desc {
          font-size: 14px;
          color: rgba(255,255,255,0.5);
          line-height: 1.7;
          max-width: 300px;
        }
        .sh-kids-banner__tags { display: flex; gap: 8px; flex-wrap: wrap; }
        .sh-kids-banner__tag {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 5px 12px;
          border-radius: 999px;
          border: 1px solid rgba(107,78,230,0.4);
          color: rgba(255,255,255,0.6);
        }

        .sh-kids-age-strip {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 48px;
        }
        @media (max-width: 640px) { .sh-kids-age-strip { grid-template-columns: 1fr; gap: 12px; } }
        .sh-kids-age-card {
          border-radius: 20px;
          padding: 32px 24px;
          text-align: center;
          border: 1px solid rgba(107,78,230,0.2);
          background: linear-gradient(135deg, rgba(107,78,230,0.08) 0%, rgba(155,126,255,0.05) 100%);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .sh-kids-age-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(107,78,230,0.2);
          border-color: rgba(107,78,230,0.5);
        }
        .sh-kids-age-card::before {
          content: '';
          position: absolute;
          top: -30px; right: -30px;
          width: 100px; height: 100px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(107,78,230,0.15) 0%, transparent 70%);
        }
        .sh-kids-age-card__emoji {
          font-size: 32px;
          margin-bottom: 12px;
          display: block;
        }
        .sh-kids-age-card__range {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 28px;
          color: #fff;
          line-height: 1;
          margin-bottom: 6px;
        }
        .sh-kids-age-card__label {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
          margin-bottom: 8px;
        }
        .sh-kids-age-card__sizes {
          font-family: 'Space Mono', monospace;
          font-size: 8px;
          letter-spacing: 0.1em;
          color: #9B7EFF;
        }

        /* ── CASUAL SECTION ── */
        .sh-casual { background: var(--sh-cream); }
        .sh-casual-hero {
          border-radius: 24px;
          background: linear-gradient(135deg, #D8D0F5 0%, #9B7EFF 50%, #6B4EE6 100%);
          padding: 56px 48px;
          margin-bottom: 48px;
          position: relative;
          overflow: hidden;
        }
        .sh-casual-hero::before {
          content: '';
          position: absolute;
          top: -80px; right: -80px;
          width: 400px; height: 400px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
        }
        .sh-casual-hero__inner { position: relative; z-index: 2; }
        .sh-casual-hero__eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.65);
          margin-bottom: 16px;
        }
        .sh-casual-hero__title {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: clamp(36px, 5vw, 64px);
          color: #fff;
          line-height: 1;
          margin-bottom: 20px;
        }
        .sh-casual-hero__desc { font-size: 14px; color: rgba(255,255,255,0.65); max-width: 420px; line-height: 1.7; margin-bottom: 32px; }
        .sh-casual-hero__row { display: flex; gap: 12px; flex-wrap: wrap; }
        .sh-casual-tag {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 10px 20px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.3);
          color: rgba(255,255,255,0.8);
          background: rgba(255,255,255,0.08);
        }

        /* ── FORMAL SECTION ── */
        .sh-formal { background: var(--sh-deep); padding: 80px 0; }
        @media (min-width: 1024px) { .sh-formal { padding: 120px 0; } }
        .sh-formal .sh-section-title   { color: #fff; }
        .sh-formal .sh-section-eyebrow { color: #9B7EFF; }
        .sh-formal .sh-view-all        { color: rgba(255,255,255,0.6); border-color: rgba(255,255,255,0.2); }
        .sh-formal .sh-view-all:hover  { background: rgba(255,255,255,0.08); color: #fff; }
        .sh-formal .sh-chip            { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.12); color: rgba(255,255,255,0.5); }
        .sh-formal .sh-chip:hover      { border-color: var(--sh-accent); color: #C4B5FD; }
        .sh-formal .sh-chip--active    { background: var(--sh-accent); border-color: var(--sh-accent); color: #fff; }
        .sh-formal .sh-sort label      { color: rgba(255,255,255,0.4); }
        .sh-formal .sh-sort select     { background-color: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.12); color: #fff; }
        .sh-formal .sh-card            { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.08); }
        .sh-formal .sh-card:hover      { box-shadow: 0 16px 48px rgba(0,0,0,0.4); }
        .sh-formal .sh-card__img-placeholder { background: linear-gradient(160deg, #2A1A5E 0%, #1A0E3A 100%); }
        .sh-formal .sh-card__name      { color: #fff; }
        .sh-formal .sh-card__price     { color: #C4B5FD; }
        .sh-formal .sh-card__size      { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.1); color: rgba(255,255,255,0.4); }
        .sh-formal-feature {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          margin-bottom: 48px;
        }
        @media (min-width: 768px) { .sh-formal-feature { grid-template-columns: 1.4fr 1fr; gap: 20px; } }
        .sh-formal-card {
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.06);
          transition: transform 0.3s cubic-bezier(0.22,1,0.36,1);
          min-height: 320px;
        }
        .sh-formal-card:hover { transform: scale(1.015); }
        .sh-formal-card__bg {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .sh-formal-card__bg svg  { width: 40px; height: 40px; opacity: 0.25; }
        .sh-formal-card__bg span {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          opacity: 0.35;
        }
        .sh-formal-card--a .sh-formal-card__bg { background: linear-gradient(160deg, #1E1147 0%, #2D1B69 50%, #1A0E3A 100%); color: rgba(255,255,255,0.9); }
        .sh-formal-card--b .sh-formal-card__bg { background: linear-gradient(160deg, #160E2B 0%, #4C35A0 100%); color: rgba(255,255,255,0.9); }
        .sh-formal-card__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(22,14,43,0.9) 0%, rgba(22,14,43,0.1) 60%, transparent 100%);
          z-index: 2;
        }
        .sh-formal-card__info { position: absolute; bottom: 0; left: 0; right: 0; padding: 28px; z-index: 3; }
        .sh-formal-card__eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.45);
          margin-bottom: 8px;
        }
        .sh-formal-card__title {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 500;
          font-size: 28px;
          color: #fff;
          margin-bottom: 16px;
          line-height: 1.1;
        }
        .sh-formal-card__cta {
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
        .sh-formal-card__cta:hover { background: var(--sh-accent); }

        /* ── SPORTS SECTION ── */
        .sh-sports { background: var(--sh-cream); border-top: 1px solid var(--sh-line); }
        .sh-perf-strip {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 48px;
        }
        @media (min-width: 768px) { .sh-perf-strip { grid-template-columns: repeat(4, 1fr); gap: 16px; } }
        .sh-perf-card {
          border-radius: 16px;
          padding: 24px 20px;
          background: linear-gradient(135deg, var(--sh-deep) 0%, #2A1A5E 100%);
          border: 1px solid rgba(107,78,230,0.2);
          text-align: center;
          position: relative;
          overflow: hidden;
        }
        .sh-perf-card::before {
          content: '';
          position: absolute;
          top: -20px; right: -20px;
          width: 80px; height: 80px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(107,78,230,0.2) 0%, transparent 70%);
        }
        .sh-perf-card__icon { font-size: 24px; margin-bottom: 10px; display: block; }
        .sh-perf-card__num {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 300;
          font-size: 32px;
          color: #fff;
          line-height: 1;
          margin-bottom: 6px;
        }
        .sh-perf-card__num span { font-size: 18px; color: var(--sh-accent); }
        .sh-perf-card__label {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
        }
        .sh-sports-hero {
          border-radius: 24px;
          background: linear-gradient(135deg, #2A1A5E 0%, #6B4EE6 50%, #9B7EFF 100%);
          padding: 56px 48px;
          margin-bottom: 48px;
          position: relative;
          overflow: hidden;
        }
        .sh-sports-hero::before {
          content: '';
          position: absolute;
          bottom: -80px; right: -40px;
          width: 400px; height: 400px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.06);
        }
        .sh-sports-hero__inner { position: relative; z-index: 2; max-width: 560px; }
        .sh-sports-hero__eyebrow {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.55);
          margin-bottom: 16px;
        }
        .sh-sports-hero__title {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: clamp(36px, 5vw, 64px);
          color: #fff;
          line-height: 1;
          margin-bottom: 20px;
        }
        .sh-sports-hero__desc { font-size: 14px; color: rgba(255,255,255,0.6); max-width: 400px; line-height: 1.7; margin-bottom: 32px; }
        .sh-sports-hero__features { display: flex; gap: 16px; flex-wrap: wrap; }
        .sh-sports-feature { display: flex; align-items: center; gap: 8px; }
        .sh-sports-feature__dot { width: 6px; height: 6px; border-radius: 50%; background: var(--sh-accent); flex-shrink: 0; }
        .sh-sports-feature span {
          font-family: 'Space Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.6);
        }

        /* ── SIZE GUIDE ── */
        .sh-size-guide { background: #fff; border-top: 1px solid var(--sh-line); border-bottom: 1px solid var(--sh-line); padding: 48px 0; }
        .sh-size-guide__inner { display: flex; align-items: center; justify-content: space-between; gap: 32px; flex-wrap: wrap; }
        .sh-size-guide__text-col { display: flex; align-items: center; gap: 20px; }
        .sh-size-guide__icon { font-size: 40px; flex-shrink: 0; }
        .sh-size-guide__title { font-family: 'Cormorant Garamond', serif; font-weight: 500; font-size: 24px; color: var(--sh-ink); margin-bottom: 4px; }
        .sh-size-guide__sub { font-size: 13px; color: var(--sh-gray); line-height: 1.5; }
        .sh-size-guide__chips { display: flex; gap: 8px; flex-wrap: wrap; }
        .sh-size-guide__chip {
          font-family: 'Space Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 8px 16px;
          border-radius: 999px;
          border: 1px solid var(--sh-line);
          background: var(--sh-cream);
          color: var(--sh-gray);
        }

        /* ── SCROLL REVEAL ── */
        .sh-reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1);
        }
        .sh-reveal--visible  { opacity: 1; transform: translateY(0); }
        .sh-reveal--delay-1  { transition-delay: 0.1s; }
        .sh-reveal--delay-2  { transition-delay: 0.2s; }
        .sh-reveal--delay-3  { transition-delay: 0.3s; }
        .sh-reveal--delay-4  { transition-delay: 0.4s; }
      `}</style>

      {/* ── HERO ── */}
      <section className="sh-hero" aria-label="DJONOVA Shoes hero">
        <div className="sh-hero__bg" />
        <div className="sh-hero__noise" />
        <div className="sh-hero__sole-ring" />
        <div className="sh-hero__content">
          <p className="sh-hero__eyebrow">DJONOVA · SS2025 Footwear</p>
          <h1 className="sh-hero__title">
            SHOES /<br />
            for every <em>step.</em>
          </h1>
          <p className="sh-hero__sub">
            From first light to midnight — footwear engineered for every moment, every terrain, every you.
          </p>
          <div className="sh-hero__sizes">
            <span className="sh-hero__size-label">Sizes available:</span>
            <span className="sh-hero__size-chip">EU 36–48</span>
            <span className="sh-hero__size-chip">US 4–14</span>
            <span className="sh-hero__size-chip">UK 3–13</span>
          </div>
          <div className="sh-hero__cta-row">
            <a href="#women" className="sh-btn sh-btn--primary">Shop Women&apos;s →</a>
            <a href="#sports" className="sh-btn sh-btn--ghost">View Sports Range</a>
          </div>
        </div>
        <div className="sh-hero__scroll">
          <div className="sh-hero__scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* ── CATEGORY STRIP ── */}
      <div className="sh-cat-strip sh-reveal">
        <div className="sh-container">
          <div className="sh-cat-strip__grid">
            {[
              { cls: "women",  label: "Women",  count: "72 styles", href: "#women"  },
              { cls: "men",    label: "Men",    count: "58 styles", href: "#men"    },
              { cls: "kids",   label: "Kids",   count: "40 styles", href: "#kids"   },
              { cls: "casual", label: "Casual", count: "44 styles", href: "#casual" },
              { cls: "formal", label: "Formal", count: "36 styles", href: "#formal" },
              { cls: "sports", label: "Sports", count: "30 styles", href: "#sports" },
            ].map((item) => (
              <a
                key={item.cls}
                href={item.href}
                className={`sh-cat-strip__card sh-cat-strip__card--${item.cls}`}
              >
                <div className="sh-cat-strip__card-inner">
                  <div className="sh-cat-strip__img-placeholder">
                    {svgPlaceholder}
                    <span>400 × 533 px</span>
                  </div>
                </div>
                <div className="sh-cat-strip__label">
                  <span className="sh-cat-strip__label-name">{item.label}</span>
                  <div className="sh-cat-strip__label-count">{item.count}</div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── WOMEN'S SHOES ── */}
      <section className="sh-section sh-women" id="women" aria-label="Women's Shoes">
        <div className="sh-container">
          <div className="sh-section-header sh-reveal">
            <div>
              <p className="sh-section-eyebrow">01 — Women&apos;s Shoes</p>
              <h2 className="sh-section-title">Walk in <em>your story.</em></h2>
            </div>
            <a href="/categories/shoes/womenshoes" className="sh-view-all">View All →</a>
          </div>

          <div className="sh-women-banner sh-reveal sh-reveal--delay-1">
            <div className="sh-women-banner__img">
              <div className="sh-women-banner__img-inner">
                {svgPlaceholder}
                <span>800 × 600 px</span>
              </div>
            </div>
            <div className="sh-women-banner__content">
              <p className="sh-women-banner__eyebrow">Spring Edit 2025</p>
              <h3 className="sh-women-banner__title">Every heel<br />tells a story.</h3>
              <p className="sh-women-banner__desc">From block heels to ballet flats — crafted for comfort without compromise.</p>
              <div className="sh-women-banner__tags">
                <span className="sh-women-banner__tag">Heels</span>
                <span className="sh-women-banner__tag">Flats</span>
                <span className="sh-women-banner__tag">Boots</span>
                <span className="sh-women-banner__tag">Trainers</span>
              </div>
              <div>
                <a href="/categories/shoes/womenshoes" className="sh-btn sh-btn--primary">Shop Women&apos;s</a>
              </div>
            </div>
          </div>

          <div className="sh-filter-bar sh-reveal sh-reveal--delay-2" id="sh-women-filters">
            <div className="sh-chips" role="group">
              {["All", "Heels", "Flats", "Boots", "Trainers", "Sandals"].map((f, i) => (
                <button key={f} className={`sh-chip${i === 0 ? " sh-chip--active" : ""}`} data-group="women">{f}</button>
              ))}
            </div>
            <div className="sh-sort">
              <label htmlFor="sh-sort-women">Sort</label>
              <select id="sh-sort-women">
                <option>Newest</option>
                <option>Price: Low–High</option>
                <option>Price: High–Low</option>
                <option>Best Sellers</option>
              </select>
            </div>
          </div>

          <div className="sh-product-grid sh-reveal sh-reveal--delay-3">
            {[
              { cat: "Heels",    name: "Velvet Block Heel",  price: "£148.00", badge: "new",  sizes: ["UK 3","UK 4","UK 5","UK 6","UK 7"], outSizes: ["UK 6"] },
              { cat: "Flats",    name: "Ballet Satin Flat",  price: "£76.00",  badge: "sale", saleLabel: "−20%", oldPrice: "£95.00", sizes: ["UK 3","UK 4","UK 5","UK 6"], outSizes: ["UK 5"] },
              { cat: "Boots",    name: "Knee High Chelsea",  price: "£215.00", sizes: ["UK 4","UK 5","UK 6","UK 7"] },
              { cat: "Trainers", name: "Cloud Knit Runner",  price: "£128.00", badge: "new",  sizes: ["UK 3","UK 4","UK 5","UK 6","UK 7"] },
            ].map((item, i) => (
              <article className="sh-card" key={i}>
                <div className="sh-card__img">
                  <div className="sh-card__img-placeholder">{svgPlaceholder}<span>600 × 800 px</span></div>
                  {item.badge === "new"  && <span className="sh-card__badge sh-card__badge--new">New</span>}
                  {item.badge === "sale" && <span className="sh-card__badge sh-card__badge--sale">{item.saleLabel}</span>}
                  <div className="sh-card__wish" aria-label="Add to wishlist">♡</div>
                </div>
                <div className="sh-card__body">
                  <p className="sh-card__cat">{item.cat}</p>
                  <h3 className="sh-card__name">{item.name}</h3>
                  <div className="sh-card__sizes">
                    {item.sizes?.map((s) => (
                      <span key={s} className={`sh-card__size${item.outSizes?.includes(s) ? " sh-card__size--out" : ""}`}>{s}</span>
                    ))}
                  </div>
                  <div className="sh-card__footer">
                    <span className="sh-card__price">{item.oldPrice && <s>{item.oldPrice}</s>}{item.price}</span>
                    <button className="sh-card__add" aria-label="Add to bag">+</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEN'S SHOES ── */}
      <section className="sh-section sh-men" id="men" aria-label="Men's Shoes">
        <div className="sh-container">
          <div className="sh-section-header sh-reveal">
            <div>
              <p className="sh-section-eyebrow">02 — Men&apos;s Shoes</p>
              <h2 className="sh-section-title">Built to <em>last.</em></h2>
              <div className="sh-men__accent-bar" />
            </div>
            <a href="/categories/shoes/menshoes" className="sh-view-all">View All →</a>
          </div>

          <div className="sh-filter-bar sh-reveal sh-reveal--delay-1" id="sh-men-filters">
            <div className="sh-chips" role="group">
              {["All", "Trainers", "Boots", "Loafers", "Derby", "Slip-on"].map((f, i) => (
                <button key={f} className={`sh-chip${i === 0 ? " sh-chip--active" : ""}`} data-group="men">{f}</button>
              ))}
            </div>
            <div className="sh-sort">
              <label htmlFor="sh-sort-men">Sort</label>
              <select id="sh-sort-men">
                <option>Newest</option>
                <option>Price: Low–High</option>
                <option>Price: High–Low</option>
                <option>Best Sellers</option>
              </select>
            </div>
          </div>

          <div className="sh-product-grid sh-reveal sh-reveal--delay-2">
            {[
              { cat: "Trainers", name: "AURA Low Pro",       price: "£189.00", badge: "new",  sizes: ["UK 7","UK 8","UK 9","UK 10","UK 11"] },
              { cat: "Boots",    name: "Suede Desert Boot",  price: "£162.00", sizes: ["UK 7","UK 8","UK 9","UK 10"], outSizes: ["UK 8"] },
              { cat: "Loafers",  name: "Penny Loafer Ink",   price: "£117.30", badge: "sale", saleLabel: "−15%", oldPrice: "£138.00", sizes: ["UK 7","UK 8","UK 9","UK 10","UK 11"] },
              { cat: "Derby",    name: "Smooth Derby Noir",  price: "£175.00", badge: "new",  sizes: ["UK 8","UK 9","UK 10","UK 11"] },
            ].map((item, i) => (
              <article className="sh-card" key={i}>
                <div className="sh-card__img">
                  <div className="sh-card__img-placeholder">{svgPlaceholder}<span>600 × 800 px</span></div>
                  {item.badge === "new"  && <span className="sh-card__badge sh-card__badge--new">New</span>}
                  {item.badge === "sale" && <span className="sh-card__badge sh-card__badge--sale">{item.saleLabel}</span>}
                  <div className="sh-card__wish" aria-label="Add to wishlist">♡</div>
                </div>
                <div className="sh-card__body">
                  <p className="sh-card__cat">{item.cat}</p>
                  <h3 className="sh-card__name">{item.name}</h3>
                  <div className="sh-card__sizes">
                    {item.sizes?.map((s) => (
                      <span key={s} className={`sh-card__size${item.outSizes?.includes(s) ? " sh-card__size--out" : ""}`}>{s}</span>
                    ))}
                  </div>
                  <div className="sh-card__footer">
                    <span className="sh-card__price">{item.oldPrice && <s>{item.oldPrice}</s>}{item.price}</span>
                    <button className="sh-card__add" aria-label="Add to bag">+</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── KIDS' SHOES ── */}
      <section className="sh-kids" id="kids" aria-label="Kids' Shoes">
        <div className="sh-container">

          <div className="sh-section-header sh-reveal">
            <div>
              <p className="sh-section-eyebrow">03 — Kids&apos; Shoes</p>
              <h2 className="sh-section-title">Little feet, <em>big adventures.</em></h2>
            </div>
            <a href="/categories/shoes/kidsshoes" className="sh-view-all">View All →</a>
          </div>

          <div className="sh-kids-banner sh-reveal sh-reveal--delay-1">
            <div className="sh-kids-banner__img">
              <div className="sh-kids-banner__img-inner">
                {svgPlaceholder}
                <span>800 × 600 px</span>
              </div>
            </div>
            <div className="sh-kids-banner__content">
              <p className="sh-kids-banner__eyebrow">Spring Collection 2025</p>
              <h3 className="sh-kids-banner__title">Shoes that<br />keep up with them.</h3>
              <p className="sh-kids-banner__desc">
                Durable, fun, and designed to support growing feet — from first steps to the playground.
              </p>
              <div className="sh-kids-banner__tags">
                <span className="sh-kids-banner__tag">Trainers</span>
                <span className="sh-kids-banner__tag">School</span>
                <span className="sh-kids-banner__tag">Sandals</span>
                <span className="sh-kids-banner__tag">Boots</span>
                <span className="sh-kids-banner__tag">Velcro</span>
              </div>
              <div>
                <a href="/categories/shoes/kidsshoes" className="sh-btn sh-btn--primary">
                  Shop Kids&apos;
                </a>
              </div>
            </div>
          </div>

          <div className="sh-kids-age-strip sh-reveal sh-reveal--delay-2">
            {[
              { emoji: "👶", range: "EU 16–22", label: "Toddler",    sizes: "UK 0 – UK 5½" },
              { emoji: "🧒", range: "EU 23–32", label: "Little Kid", sizes: "UK 6 – UK 13½" },
              { emoji: "🧑", range: "EU 33–38", label: "Big Kid",    sizes: "UK 1 – UK 5½"  },
            ].map((age) => (
              <div className="sh-kids-age-card" key={age.label}>
                <span className="sh-kids-age-card__emoji">{age.emoji}</span>
                <div className="sh-kids-age-card__range">{age.range}</div>
                <div className="sh-kids-age-card__label">{age.label}</div>
                <div className="sh-kids-age-card__sizes">{age.sizes}</div>
              </div>
            ))}
          </div>

          <div className="sh-filter-bar sh-reveal sh-reveal--delay-2" id="sh-kids-filters">
            <div className="sh-chips" role="group">
              {["All", "Trainers", "School", "Sandals", "Boots", "Velcro"].map((f, i) => (
                <button
                  key={f}
                  className={`sh-chip${i === 0 ? " sh-chip--active" : ""}`}
                  data-group="kids"
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="sh-sort">
              <label htmlFor="sh-sort-kids">Sort</label>
              <select id="sh-sort-kids">
                <option>Newest</option>
                <option>Price: Low–High</option>
                <option>Price: High–Low</option>
                <option>Best Sellers</option>
              </select>
            </div>
          </div>

          <div className="sh-product-grid sh-reveal sh-reveal--delay-3">
            {[
              {
                cat: "Trainers",
                name: "SPARK Kids Runner",
                price: "£58.00",
                badge: "new",
                sizes: ["EU 28","EU 29","EU 30","EU 31","EU 32"],
                outSizes: [] as string[],
              },
              {
                cat: "School",
                name: "Classic Leather School",
                price: "£52.00",
                sizes: ["EU 30","EU 31","EU 32","EU 33","EU 34"],
                outSizes: ["EU 32"],
              },
              {
                cat: "Sandals",
                name: "Summer Strap Sandal",
                price: "£38.00",
                badge: "sale",
                saleLabel: "−15%",
                oldPrice: "£45.00",
                sizes: ["EU 24","EU 25","EU 26","EU 27","EU 28"],
                outSizes: [] as string[],
              },
              {
                cat: "Boots",
                name: "Mini Chelsea Boot",
                price: "£72.00",
                badge: "new",
                sizes: ["EU 26","EU 27","EU 28","EU 29","EU 30","EU 31"],
                outSizes: [] as string[],
              },
            ].map((item, i) => (
              <article className="sh-card" key={i}>
                <div className="sh-card__img">
                  <div className="sh-card__img-placeholder">
                    {svgPlaceholder}
                    <span>600 × 800 px</span>
                  </div>
                  {item.badge === "new"  && <span className="sh-card__badge sh-card__badge--new">New</span>}
                  {item.badge === "sale" && <span className="sh-card__badge sh-card__badge--sale">{item.saleLabel}</span>}
                  <div className="sh-card__wish" aria-label="Add to wishlist">♡</div>
                </div>
                <div className="sh-card__body">
                  <p className="sh-card__cat">{item.cat}</p>
                  <h3 className="sh-card__name">{item.name}</h3>
                  <div className="sh-card__sizes">
                    {item.sizes?.map((s) => (
                      <span
                        key={s}
                        className={`sh-card__size${item.outSizes?.includes(s) ? " sh-card__size--out" : ""}`}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="sh-card__footer">
                    <span className="sh-card__price">
                      {item.oldPrice && <s>{item.oldPrice}</s>}
                      {item.price}
                    </span>
                    <button className="sh-card__add" aria-label="Add to bag">+</button>
                  </div>
                </div>
              </article>
            ))}
          </div>

        </div>
      </section>

      {/* ── CASUAL ── */}
      <section className="sh-section sh-casual" id="casual" aria-label="Casual Shoes">
        <div className="sh-container">
          <div className="sh-section-header sh-reveal">
            <div>
              <p className="sh-section-eyebrow">04 — Casual</p>
              <h2 className="sh-section-title">Easy. <em>Effortless.</em></h2>
            </div>
            <a href="/categories/shoes/casualshoes" className="sh-view-all">View All →</a>
          </div>

          <div className="sh-casual-hero sh-reveal sh-reveal--delay-1">
            <div className="sh-casual-hero__inner">
              <p className="sh-casual-hero__eyebrow">Everyday Footwear</p>
              <h3 className="sh-casual-hero__title">Made for<br />the long walk.</h3>
              <p className="sh-casual-hero__desc">Slip-ons, low-tops, and everyday favourites — because comfort should never be a compromise.</p>
              <div className="sh-casual-hero__row">
                {["Slip-on", "Low-top", "Canvas", "Suede", "All-day Comfort"].map((t) => (
                  <span key={t} className="sh-casual-tag">{t}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="sh-filter-bar sh-reveal sh-reveal--delay-2" id="sh-casual-filters">
            <div className="sh-chips" role="group">
              {["All", "Slip-on", "Low-top", "Canvas", "Suede"].map((f, i) => (
                <button key={f} className={`sh-chip${i === 0 ? " sh-chip--active" : ""}`} data-group="casual">{f}</button>
              ))}
            </div>
            <div className="sh-sort">
              <label htmlFor="sh-sort-casual">Sort</label>
              <select id="sh-sort-casual">
                <option>Newest</option>
                <option>Price: Low–High</option>
                <option>Price: High–Low</option>
                <option>Best Sellers</option>
              </select>
            </div>
          </div>

          <div className="sh-product-grid sh-reveal sh-reveal--delay-3">
            {[
              { cat: "Slip-on",  name: "NOVA Canvas Slip",   price: "£72.00",  badge: "new",  sizes: ["UK 5","UK 6","UK 7","UK 8","UK 9"] },
              { cat: "Low-top",  name: "DRIFT Low Canvas",   price: "£85.00",  sizes: ["UK 5","UK 6","UK 7","UK 8"], outSizes: ["UK 7"] },
              { cat: "Suede",    name: "Tonal Suede Crepe",  price: "£99.00",  badge: "sale", saleLabel: "−10%", oldPrice: "£110.00", sizes: ["UK 6","UK 7","UK 8","UK 9"] },
              { cat: "Canvas",   name: "Weekend High-top",   price: "£92.00",  badge: "new",  sizes: ["UK 5","UK 6","UK 7","UK 8","UK 9","UK 10"] },
            ].map((item, i) => (
              <article className="sh-card" key={i}>
                <div className="sh-card__img">
                  <div className="sh-card__img-placeholder">{svgPlaceholder}<span>600 × 800 px</span></div>
                  {item.badge === "new"  && <span className="sh-card__badge sh-card__badge--new">New</span>}
                  {item.badge === "sale" && <span className="sh-card__badge sh-card__badge--sale">{item.saleLabel}</span>}
                  <div className="sh-card__wish" aria-label="Add to wishlist">♡</div>
                </div>
                <div className="sh-card__body">
                  <p className="sh-card__cat">{item.cat}</p>
                  <h3 className="sh-card__name">{item.name}</h3>
                  <div className="sh-card__sizes">
                    {item.sizes?.map((s) => (
                      <span key={s} className={`sh-card__size${item.outSizes?.includes(s) ? " sh-card__size--out" : ""}`}>{s}</span>
                    ))}
                  </div>
                  <div className="sh-card__footer">
                    <span className="sh-card__price">{item.oldPrice && <s>{item.oldPrice}</s>}{item.price}</span>
                    <button className="sh-card__add" aria-label="Add to bag">+</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FORMAL ── */}
      <section className="sh-formal" id="formal" aria-label="Formal Shoes">
        <div className="sh-container">
          <div className="sh-section-header sh-reveal">
            <div>
              <p className="sh-section-eyebrow">05 — Formal</p>
              <h2 className="sh-section-title">Power in <em>every step.</em></h2>
            </div>
            <a href="/categories/shoes/formalshoes" className="sh-view-all">View All →</a>
          </div>

          <div className="sh-formal-feature sh-reveal sh-reveal--delay-1">
            <div className="sh-formal-card sh-formal-card--a">
              <div className="sh-formal-card__bg">{svgPlaceholder}<span>700 × 600 px</span></div>
              <div className="sh-formal-card__overlay" />
              <div className="sh-formal-card__info">
                <p className="sh-formal-card__eyebrow">SS25 Formal Edit</p>
                <h3 className="sh-formal-card__title">The Oxford<br />Collection</h3>
                <a href="/categories/shoes/formalshoes" className="sh-formal-card__cta">Shop Oxfords</a>
              </div>
            </div>
            <div className="sh-formal-card sh-formal-card--b">
              <div className="sh-formal-card__bg">{svgPlaceholder}<span>500 × 600 px</span></div>
              <div className="sh-formal-card__overlay" />
              <div className="sh-formal-card__info">
                <p className="sh-formal-card__eyebrow">New In</p>
                <h3 className="sh-formal-card__title">Derby &amp;<br />Brogues</h3>
                <a href="/categories/shoes/formalshoes" className="sh-formal-card__cta">Shop Derby</a>
              </div>
            </div>
          </div>

          <div className="sh-filter-bar sh-reveal sh-reveal--delay-2" id="sh-formal-filters">
            <div className="sh-chips" role="group">
              {["All", "Oxfords", "Derby", "Brogues", "Monk Strap"].map((f, i) => (
                <button key={f} className={`sh-chip${i === 0 ? " sh-chip--active" : ""}`} data-group="formal">{f}</button>
              ))}
            </div>
            <div className="sh-sort">
              <label htmlFor="sh-sort-formal">Sort</label>
              <select id="sh-sort-formal">
                <option>Newest</option>
                <option>Price: Low–High</option>
                <option>Price: High–Low</option>
                <option>Best Sellers</option>
              </select>
            </div>
          </div>

          <div className="sh-product-grid sh-reveal sh-reveal--delay-3">
            {[
              { cat: "Oxfords",     name: "Cap Toe Oxford",      price: "£245.00", badge: "new",  sizes: ["UK 7","UK 8","UK 9","UK 10"] },
              { cat: "Derby",       name: "Leather Plain Derby",  price: "£198.00", sizes: ["UK 7","UK 8","UK 9","UK 10","UK 11"], outSizes: ["UK 8"] },
              { cat: "Brogues",     name: "Full Brogue Wingtip",  price: "£176.00", badge: "sale", saleLabel: "−20%", oldPrice: "£220.00", sizes: ["UK 8","UK 9","UK 10"] },
              { cat: "Monk Strap",  name: "Double Monk Cognac",   price: "£232.00", badge: "new",  sizes: ["UK 7","UK 8","UK 9","UK 10","UK 11"] },
            ].map((item, i) => (
              <article className="sh-card" key={i}>
                <div className="sh-card__img">
                  <div className="sh-card__img-placeholder">{svgPlaceholder}<span>600 × 800 px</span></div>
                  {item.badge === "new"  && <span className="sh-card__badge sh-card__badge--new">New</span>}
                  {item.badge === "sale" && <span className="sh-card__badge sh-card__badge--sale">{item.saleLabel}</span>}
                  <div className="sh-card__wish" aria-label="Add to wishlist">♡</div>
                </div>
                <div className="sh-card__body">
                  <p className="sh-card__cat">{item.cat}</p>
                  <h3 className="sh-card__name">{item.name}</h3>
                  <div className="sh-card__sizes">
                    {item.sizes?.map((s) => (
                      <span key={s} className={`sh-card__size${item.outSizes?.includes(s) ? " sh-card__size--out" : ""}`}>{s}</span>
                    ))}
                  </div>
                  <div className="sh-card__footer">
                    <span className="sh-card__price">{item.oldPrice && <s>{item.oldPrice}</s>}{item.price}</span>
                    <button className="sh-card__add" aria-label="Add to bag">+</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── SIZE GUIDE ── */}
      <div className="sh-size-guide sh-reveal">
        <div className="sh-container">
          <div className="sh-size-guide__inner">
            <div className="sh-size-guide__text-col">
              <div className="sh-size-guide__icon">📏</div>
              <div>
                <h3 className="sh-size-guide__title">Not sure of your size?</h3>
                <p className="sh-size-guide__sub">Use our interactive shoe size guide for accurate EU, US and UK measurements</p>
              </div>
            </div>
            <div className="sh-size-guide__chips">
              {["EU 36–48", "US 4–14", "UK 3–13", "Half sizes"].map((s) => (
                <span key={s} className="sh-size-guide__chip">{s}</span>
              ))}
            </div>
            <a href="#" className="sh-btn sh-btn--primary">Open Size Guide</a>
          </div>
        </div>
      </div>

      {/* ── SPORTS ── */}
      <section className="sh-section sh-sports" id="sports" aria-label="Sports Shoes">
        <div className="sh-container">
          <div className="sh-section-header sh-reveal">
            <div>
              <p className="sh-section-eyebrow">06 — Sports</p>
              <h2 className="sh-section-title">Push <em>further.</em></h2>
            </div>
            <a href="/categories/shoes/sportshoes" className="sh-view-all">View All →</a>
          </div>

          <div className="sh-perf-strip sh-reveal sh-reveal--delay-1">
            {[
              { icon: "⚡", num: "AURA", sup: "™",  label: "Cushioning System" },
              { icon: "💧", num: "IPX",  sup: "5",  label: "Water Resistant"   },
              { icon: "🌱", num: "30",   sup: "%",  label: "Recycled Materials" },
              { icon: "🏅", num: "4.9",  sup: "★",  label: "Average Rating"    },
            ].map((s) => (
              <div className="sh-perf-card" key={s.label}>
                <span className="sh-perf-card__icon">{s.icon}</span>
                <div className="sh-perf-card__num">{s.num}<span>{s.sup}</span></div>
                <div className="sh-perf-card__label">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="sh-sports-hero sh-reveal sh-reveal--delay-2">
            <div className="sh-sports-hero__inner">
              <p className="sh-sports-hero__eyebrow">Performance Footwear</p>
              <h3 className="sh-sports-hero__title">Every surface.<br />Every distance.</h3>
              <p className="sh-sports-hero__desc">Engineered with our AURA cushioning system and precision-fit last — built for athletes and everyday movers alike.</p>
              <div className="sh-sports-hero__features">
                {["AURA Cushioning", "Breathable Mesh", "Anti-slip Sole", "Lightweight"].map((f) => (
                  <div className="sh-sports-feature" key={f}>
                    <div className="sh-sports-feature__dot" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sh-filter-bar sh-reveal sh-reveal--delay-3" id="sh-sports-filters">
            <div className="sh-chips" role="group">
              {["All", "Running", "Training", "Basketball", "Trail"].map((f, i) => (
                <button key={f} className={`sh-chip${i === 0 ? " sh-chip--active" : ""}`} data-group="sports">{f}</button>
              ))}
            </div>
            <div className="sh-sort">
              <label htmlFor="sh-sort-sports">Sort</label>
              <select id="sh-sort-sports">
                <option>Newest</option>
                <option>Price: Low–High</option>
                <option>Price: High–Low</option>
                <option>Best Sellers</option>
              </select>
            </div>
          </div>

          <div className="sh-product-grid sh-reveal sh-reveal--delay-4">
            {[
              { cat: "Running",    name: "PULSE Race Pro",     price: "£152.00", badge: "new",  sizes: ["UK 6","UK 7","UK 8","UK 9","UK 10"] },
              { cat: "Training",   name: "GRID Cross Trainer", price: "£138.00", sizes: ["UK 6","UK 7","UK 8","UK 9","UK 10"], outSizes: ["UK 8"] },
              { cat: "Trail",      name: "TERRA Trail Boot",   price: "£151.30", badge: "sale", saleLabel: "−15%", oldPrice: "£178.00", sizes: ["UK 7","UK 8","UK 9","UK 10"] },
              { cat: "Basketball", name: "COURT High Purple",  price: "£165.00", badge: "new",  sizes: ["UK 7","UK 8","UK 9","UK 10","UK 11"] },
            ].map((item, i) => (
              <article className="sh-card" key={i}>
                <div className="sh-card__img">
                  <div className="sh-card__img-placeholder">{svgPlaceholder}<span>600 × 800 px</span></div>
                  {item.badge === "new"  && <span className="sh-card__badge sh-card__badge--new">New</span>}
                  {item.badge === "sale" && <span className="sh-card__badge sh-card__badge--sale">{item.saleLabel}</span>}
                  <div className="sh-card__wish" aria-label="Add to wishlist">♡</div>
                </div>
                <div className="sh-card__body">
                  <p className="sh-card__cat">{item.cat}</p>
                  <h3 className="sh-card__name">{item.name}</h3>
                  <div className="sh-card__sizes">
                    {item.sizes?.map((s) => (
                      <span key={s} className={`sh-card__size${item.outSizes?.includes(s) ? " sh-card__size--out" : ""}`}>{s}</span>
                    ))}
                  </div>
                  <div className="sh-card__footer">
                    <span className="sh-card__price">{item.oldPrice && <s>{item.oldPrice}</s>}{item.price}</span>
                    <button className="sh-card__add" aria-label="Add to bag">+</button>
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
