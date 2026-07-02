import NewArrivals from "@modules/home/components/new-arrivals"
// DJONOVA Homepage v2
export default async function Home({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params

  return (
    <main>

      {/* ======================== TICKER ======================== */}
      <div className="ticker-wrap">
        <div className="ticker-track">
          <span className="ticker-item">Free shipping on orders over £40 <span className="dot"></span></span>
          <span className="ticker-item">SS26 Collection — Now Live <span className="dot"></span></span>
          <span className="ticker-item">Use code DJNV20 for 10% off your first order <span className="dot"></span></span>
          <span className="ticker-item">New footwear drops every Friday <span className="dot"></span></span>
          <span className="ticker-item">Join DJONOVA Members Club — Earn points on every purchase <span className="dot"></span></span>
          <span className="ticker-item">Kids & Toddlers range — now available <span className="dot"></span></span>
          <span className="ticker-item">Tech Essentials — Smart accessories for modern living <span className="dot"></span></span>
          <span className="ticker-item">Free shipping on orders over £40 <span className="dot"></span></span>
          <span className="ticker-item">SS26 Collection — Now Live <span className="dot"></span></span>
          <span className="ticker-item">Use code DJNV20 for 10% off your first order <span className="dot"></span></span>
          <span className="ticker-item">New footwear drops every Friday <span className="dot"></span></span>
          <span className="ticker-item">Join DJONOVA Members Club — Earn points on every purchase <span className="dot"></span></span>
          <span className="ticker-item">Kids & Toddlers range — now available <span className="dot"></span></span>
          <span className="ticker-item">Tech Essentials — Smart accessories for modern living <span className="dot"></span></span>
        </div>
      </div>

      {/* ======================== HERO ======================== */}
      <section className="hero">
        <div className="hero-left">
          <p className="hero-eyebrow fade-up fade-up-1">Spring / Summer 2026 Collection</p>
          <h1 className="hero-heading fade-up fade-up-2">
            Style<br/>
            for <em>Everyone,</em><br/>
            Priced<br/>
            for Real Life.
          </h1>
          <p className="hero-desc fade-up fade-up-3">
            DJONOVA is a fashion and lifestyle brand built for families,individuals,
            and everyone in between- shoes,clothing,and essentials that look good 
            without the markup.
           </p>
          <div className="hero-btns fade-up fade-up-4">
            <a href="/gb/store" className="btn btn-primary">Shop SS26 ↗</a>
            <a href="#lookbook" className="btn btn-outline">View Lookbook</a>
          </div>
          <span className="hero-scroll-hint">Scroll to explore</span>
        </div>
        <div className="hero-right">
  <div className="ss26-badge">SS26 Drop</div>
  <div className="hero-circle-wrap fade-up fade-up-3">
    <img
      src="https://res.cloudinary.com/dhrzk7wrs/image/upload/q_auto/f_auto/v1779807495/ChatGPT_Image_May_26_2026_03_57_46_PM_c6izks.png"
      alt="DJONOVA SS26 Shoe"
      className="hero-product-image"
    />
  </div>
  <div className="hero-tag">
    <div className="hero-tag-icon">✦</div>
    <div className="hero-tag-text">
      <strong>New Season Drop</strong>
      60+ styles — men, women, kids & tech
    </div>
  </div>
</div>
      </section>

   {/* ======================== CAMPAIGN GALLERY STRIP ======================== */}
<section className="campaign-gallery-strip">
  <div className="container">
    <div className="campaign-gallery-header fade-up">
      <span className="section-label">SS26 Visual Diary</span>

      <h2 className="campaign-gallery-title">
        A closer look at the new season.
      </h2>

      <p className="campaign-gallery-desc">
        Clean silhouettes, future footwear, and everyday essentials designed for
        movement, comfort, and presence.
      </p>
    </div>

    <div className="campaign-gallery-grid">
      <a href="/gb/store" className="campaign-gallery-card fade-up fade-up-1">
        <img
          src="https://res.cloudinary.com/dhrzk7wrs/image/upload/q_auto/f_auto/v1779807495/ChatGPT_Image_May_26_2026_03_57_46_PM_c6izks.png"
          alt="DJONOVA SS26 footwear"
        />

        <div className="campaign-card-content">
          <span>01</span>
          <strong>Future Footwear</strong>
        </div>
      </a>

      <a href="/gb/store" className="campaign-gallery-card fade-up fade-up-2">
        <img
          src="https://res.cloudinary.com/dhrzk7wrs/image/upload/q_auto/f_auto/v1779807495/ChatGPT_Image_May_26_2026_03_57_46_PM_c6izks.png"
          alt="DJONOVA SS26 streetwear"
        />

        <div className="campaign-card-content">
          <span>02</span>
          <strong>Street Luxury</strong>
        </div>
      </a>

      <a href="/gb/store" className="campaign-gallery-card fade-up fade-up-3">
        <img
          src="https://res.cloudinary.com/dhrzk7wrs/image/upload/q_auto/f_auto/v1779807495/ChatGPT_Image_May_26_2026_03_57_46_PM_c6izks.png"
          alt="DJONOVA SS26 daily essentials"
        />

        <div className="campaign-card-content">
          <span>03</span>
          <strong>Daily Essentials</strong>
        </div>
      </a>
    </div>
  </div>
</section>
      
      {/* ======================== STATS BAR ======================== */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item fade-up fade-up-1">
              <div className="stat-num">24/7<span>+</span></div>
              <div className="stat-label">Customer Assistance</div>
            </div>
            <div className="stat-item fade-up fade-up-2">
              <div className="stat-num">320<span>+</span></div>
              <div className="stat-label">Styles Available</div>
            </div>
            <div className="stat-item fade-up fade-up-3">
              <div className="stat-num">18<span>+</span></div>
              <div className="stat-label">Countries Shipped</div>
            </div>
            <div className="stat-item fade-up fade-up-4">
              <div className="stat-num">100%<span>★</span></div>
              <div className="stat-label">Tracked & Secure Delivery</div>
            </div>
          </div>
        </div>
      </section>

     {/* ======================== EDITORIAL IMAGE SPLIT ======================== */}
<section className="editorial-split">
  <div className="container">
    <div className="editorial-grid">
      <div className="editorial-copy fade-up fade-up-1">
        <span className="section-label">Designed for everyday movement</span>

        <h2 className="section-heading">
          Soft structure, sharp details,{" "}
          <em style={{ fontStyle: "italic", color: "var(--accent)" }}>
            made to stand out.
          </em>
        </h2>

        <p className="editorial-text">
          DJONOVA brings together footwear, apparel, and essentials with a clean
          luxury feel — pieces that work from daily wear to statement styling.
        </p>

        <a href="/gb/store" className="btn btn-primary">
          Shop New Arrivals ↗
        </a>
      </div>

      <div className="editorial-images fade-up fade-up-2">
        <div className="editorial-img-card editorial-img-large">
          <img
            src="https://res.cloudinary.com/dhrzk7wrs/image/upload/q_auto/f_auto/v1779807495/ChatGPT_Image_May_26_2026_03_57_46_PM_c6izks.png"
            alt="DJONOVA editorial look"
          />
        </div>

        <div className="editorial-img-card editorial-img-small">
          <img
            src="https://res.cloudinary.com/dhrzk7wrs/image/upload/q_auto/f_auto/v1779807495/ChatGPT_Image_May_26_2026_03_57_46_PM_c6izks.png"
            alt="DJONOVA product detail"
          />
        </div>
      </div>
    </div>
  </div>
</section>
      
      {/* ======================== CATEGORIES ======================== */}
      <section className="categories">
        <div className="container">
          <div className="cat-header fade-up">
            <span className="section-label" style={{justifyContent:'center'}}>Shop by Category</span>
            <h2 className="section-heading">Everything<br/><em style={{fontStyle:'italic',color:'var(--accent)'}}>DJONOVA</em></h2>
          </div>
          <div className="cat-grid">
            <div className="cat-card cat-footwear fade-up fade-up-1">
              <div className="cat-card-bg"></div>
              <div className="cat-card-overlay"></div>
              <span className="cat-icon">👟</span>
              <div className="cat-card-content">
                <div className="cat-name">Footwear</div>
                <div className="cat-count">140+ styles</div>
              </div>
              <div className="cat-arrow">↗</div>
            </div>
            <div className="cat-card cat-mens fade-up fade-up-2">
              <div className="cat-card-bg"></div>
              <div className="cat-card-overlay"></div>
              <span className="cat-icon">🧥</span>
              <div className="cat-card-content">
                <div className="cat-name">Men&apos;s</div>
                <div className="cat-count">68 pieces</div>
              </div>
              <div className="cat-arrow">↗</div>
            </div>
            <div className="cat-card cat-womens fade-up fade-up-3">
              <div className="cat-card-bg"></div>
              <div className="cat-card-overlay"></div>
              <span className="cat-icon">👗</span>
              <div className="cat-card-content">
                <div className="cat-name">Women&apos;s</div>
                <div className="cat-count">84 pieces</div>
              </div>
              <div className="cat-arrow">↗</div>
            </div>
            <div className="cat-card cat-kids fade-up fade-up-4">
              <div className="cat-card-bg"></div>
              <div className="cat-card-overlay"></div>
              <span className="cat-icon">🧸</span>
              <div className="cat-card-content">
                <div className="cat-name">Kids</div>
                <div className="cat-count">42 pieces</div>
              </div>
              <div className="cat-arrow">↗</div>
            </div>
            <div className="cat-card cat-tech fade-up fade-up-5">
              <div className="cat-card-bg"></div>
              <div className="cat-card-overlay"></div>
              <span className="cat-icon">🎧</span>
              <div className="cat-card-content">
                <div className="cat-name">Tech</div>
                <div className="cat-count">28 products</div>
              </div>
              <div className="cat-arrow">↗</div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== LOOKBOOK ======================== */}
      <section className="lookbook" id="lookbook">
        <div className="container">
          <div className="lookbook-header fade-up">
            <span className="section-label" style={{justifyContent:'center',color:'rgba(255,255,255,.4)'}}>SS26 Lookbook</span>
            <h2 className="section-heading light">The <em style={{fontStyle:'italic',color:'var(--accent)'}}>Edit</em></h2>
          </div>
          <div className="lookbook-grid">
            <div className="lb-item">
              <div className="lb-bg"></div>
              <div className="lb-overlay"></div>
              <span className="lb-icon">👟</span>
              <span className="lb-label">Campaign I — Footwear</span>
              <span className="lb-shop-tag">Shop Look</span>
            </div>
            <div className="lb-item">
              <div className="lb-bg"></div>
              <div className="lb-overlay"></div>
              <span className="lb-icon">🧥</span>
              <span className="lb-label">Men&apos;s Edit</span>
              <span className="lb-shop-tag">Shop Look</span>
            </div>
            <div className="lb-item">
              <div className="lb-bg"></div>
              <div className="lb-overlay"></div>
              <span className="lb-icon">👗</span>
              <span className="lb-label">Women&apos;s Edit</span>
              <span className="lb-shop-tag">Shop Look</span>
            </div>
            <div className="lb-item">
              <div className="lb-bg"></div>
              <div className="lb-overlay"></div>
              <span className="lb-icon">🧸</span>
              <span className="lb-label">Kids&apos; World</span>
              <span className="lb-shop-tag">Shop Look</span>
            </div>
            <div className="lb-item">
              <div className="lb-bg"></div>
              <div className="lb-overlay"></div>
              <span className="lb-icon">🎧</span>
              <span className="lb-label">Tech Essentials</span>
              <span className="lb-shop-tag">Shop Look</span>
            </div>
          </div>
          <div style={{textAlign:'center',marginTop:'44px'}}>
            <a href="#" className="btn btn-outline">View Full Lookbook →</a>
          </div>
        </div>
      </section>

      {/* ======================== NEW ARRIVALS ======================== */}
      <NewArrivals countryCode={countryCode} />

      {/* ======================== GENDER SPLIT ======================== */}
      <section className="gender-split">
        <div className="gender-panel gender-mens">
          <div className="gender-panel-bg"></div>
          <div className="gender-panel-overlay"></div>
          <span className="gender-panel-tag">68 Pieces</span>
          <div className="gender-panel-content">
            <div className="gender-icon">🧔</div>
            <h3 className="gender-title">Men&apos;s</h3>
            <p className="gender-sub">Sharp. Refined. Effortless.</p>
            <a href="/gb/store" className="btn btn-outline">Shop Men&apos;s</a>
          </div>
        </div>
        <div className="gender-panel gender-womens">
          <div className="gender-panel-bg"></div>
          <div className="gender-panel-overlay"></div>
          <span className="gender-panel-tag">84 Pieces</span>
          <div className="gender-panel-content">
            <div className="gender-icon">👩</div>
            <h3 className="gender-title">Women&apos;s</h3>
            <p className="gender-sub">Bold. Fluid. Expressive.</p>
            <a href="/gb/store" className="btn btn-outline">Shop Women&apos;s</a>
          </div>
        </div>
        <div className="gender-panel gender-kids">
          <div className="gender-panel-bg"></div>
          <div className="gender-panel-overlay"></div>
          <span className="gender-panel-tag">42 Styles</span>
          <div className="gender-panel-content">
            <div className="gender-icon">🧒</div>
            <h3 className="gender-title">Kids &amp; Toddlers</h3>
            <p className="gender-sub">Playful. Durable. Bright.</p>
            <a href="/gb/store" className="btn btn-outline">Shop Kids</a>
          </div>
        </div>
      </section>

       {/* ======================== TECH SECTION ======================== */}
      <section className="tech-section">
        <div className="container">
          <div className="tech-header fade-up">
            <span className="section-label" style={{justifyContent:'center',color:'rgba(255,255,255,.35)'}}>Smart Living</span>
            <h2 className="section-heading light">Tech <em style={{fontStyle:'italic',color:'var(--accent)'}}>Essentials</em></h2>
            <p style={{color:'rgba(255,255,255,.38)',maxWidth:'480px',margin:'16px auto 0',fontSize:'.95rem',lineHeight:1.7,textAlign:'center'}}>
              Accessories and devices designed to complement your lifestyle — not compete with it.
            </p>
          </div>
          <div className="tech-grid">
            <div className="tech-card tc1 fade-up fade-up-1">
              <div className="tech-card-img">
                <span className="tech-img-icon">🎧</span>
              </div>
              <div className="tech-card-info">
                <div className="tech-tag">Bestseller</div>
                <div className="tech-name">PULSE Pro Buds</div>
                <div className="tech-desc">40hr battery · ANC · Water-resistant IPX5 · DJONOVA signature tuning</div>
                <div className="tech-price-row">
                  <div className="tech-price">£129</div>
                  <button className="tech-add-btn">+</button>
                </div>
              </div>
            </div>
            <div className="tech-card tc2 fade-up fade-up-2">
              <div className="tech-card-img">
                <span className="tech-img-icon">⌚</span>
              </div>
              <div className="tech-card-info">
                <div className="tech-tag">New</div>
                <div className="tech-name">FLOW Smart Watch</div>
                <div className="tech-desc">Health monitoring · 7-day battery · AMOLED · Interchangeable bands</div>
                <div className="tech-price-row">
                  <div className="tech-price">£289</div>
                  <button className="tech-add-btn">+</button>
                </div>
              </div>
            </div>
            <div className="tech-card tc3 fade-up fade-up-3">
              <div className="tech-card-img">
                <span className="tech-img-icon">🎒</span>
              </div>
              <div className="tech-card-info">
                <div className="tech-tag">Limited</div>
                <div className="tech-name">GRID Tech Bag</div>
                <div className="tech-desc">USB-C charging pocket · RFID-safe · 30L · Water-repellent shell</div>
                <div className="tech-price-row">
                  <div className="tech-price">£195</div>
                  <button className="tech-add-btn">+</button>
                </div>
              </div>
            </div>
          </div>
          <div style={{textAlign:'center',marginTop:'52px'}}>
            <a href="/gb/store" className="btn btn-accent-outline">Shop All Tech →</a>
          </div>
        </div>
      </section>

      {/* ======================== BRAND STORY ======================== */}
      <section className="brand-story">
        <div className="brand-story-left fade-up">
          <span className="section-label">Our Story</span>
          <h2 className="section-heading">
            Built from<br/>
            <em style={{fontStyle:'italic',color:'var(--accent)'}}>Scratch,</em><br/>
            Made for you.
          </h2>
          <p className="brand-story-text">
            DJONOVA started with one goal: that what you wear should feel as deliberate
            as every move you make. We design footwear, clothing, and tech essentials that honour
            precision without sacrificing comfort — just a business built around making it easier
            to dress well
            
          </p>
          <a href="#" className="btn btn-accent-outline">Read Our Story →</a>
          <div className="brand-story-stats">
            <div className="story-stat">
              <div className="story-stat-num">Secure</div>
              <div className="story-stat-label">Checkout</div>
            </div>
            <div className="story-stat">
              <div className="story-stat-num">18+</div>
              <div className="story-stat-label">Countries</div>
            </div>
            <div className="story-stat">
              <div className="story-stat-num">New Drops</div>
              <div className="story-stat-label">Weekly</div>
            </div>
            <div className="story-stat">
              <div className="story-stat-num">Tracked</div>
              <div className="story-stat-label">Shipping</div>
            </div>
          </div>
        </div>
        <div className="brand-story-right">
          <div className="story-video-placeholder">
            <div className="video-play-btn" style={{margin:'0'}}>▶</div>
            <div className="story-video-label">Brand Story Film — 3:42</div>
          </div>
        </div>
      </section>

      {/* ======================== SIZE GUIDE ======================== */}
      <section className="size-guide">
        <div className="container">
          <div className="size-guide-inner">
            <div className="size-guide-text">
              <div className="size-icon">📏</div>
              <div className="size-text">
                <h3>Not Sure of Your Size?</h3>
                <p>Use our interactive size guide for footwear, clothing &amp; kids&apos; fits</p>
              </div>
            </div>
            <div className="size-chips">
              <span className="size-chip">EU 36–48</span>
              <span className="size-chip">US 4–14</span>
              <span className="size-chip">UK 3–13</span>
              <span className="size-chip">Kids 20–35</span>
              <span className="size-chip">XS–4XL</span>
            </div>
            <a href="#" className="btn btn-light">Open Size Guide</a>
          </div>
        </div>
      </section>

      {/* ======================== SOCIAL FEED ======================== */}
      <section className="social-feed">
        <div className="container">
          <div className="social-header fade-up">
            <div className="social-handle">@DJONOVA</div>
            <h2 className="section-heading">The <em style={{fontStyle:'italic',color:'var(--accent)'}}>Community</em></h2>
            <p style={{color:'var(--warm-gray)',maxWidth:'400px',margin:'10px auto 0',fontSize:'.88rem'}}>
              Tag us in your looks and join the DJONOVA world
            </p>
          </div>
          <div className="ig-grid">
            {[['👟','2.4K'],['🧥','1.8K'],['👗','3.1K'],['🎧','2.2K'],['🧸','1.5K'],['✦','4.0K']].map(([emoji,likes],i) => (
              <div key={i} className="ig-item">
                <div className="ig-bg"></div>
                <div className="ig-emoji">{emoji}</div>
                <div className="ig-overlay">♥ {likes}</div>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:'36px'}}>
            <a href="#" className="btn btn-accent-outline">Follow @DJONOVA on Instagram</a>
          </div>
        </div>
      </section>

      {/* ======================== LOYALTY ======================== */}
      <section className="loyalty">
        <div className="container">
          <div className="loyalty-header fade-up">
            <span className="section-label" style={{justifyContent:'center',color:'rgba(255,255,255,.3)'}}>Rewards Programme</span>
            <h2 className="section-heading light">DJONOVA <em style={{fontStyle:'italic',color:'var(--accent)'}}>Members</em></h2>
            <p style={{color:'rgba(255,255,255,.38)',maxWidth:'480px',margin:'14px auto 0',fontSize:'.92rem',lineHeight:1.7,textAlign:'center'}}>
              Every purchase earns points. Climb the tiers and unlock exclusive rewards.
            </p>
          </div>
          <div className="tiers-grid">
            <div className="tier-card tier-bronze fade-up fade-up-1">
              <div className="tier-glow"></div>
              <div className="tier-medal">🥉</div>
              <div className="tier-name">Bronze</div>
              <div className="tier-threshold">£0 – £99</div>
              <ul className="tier-perks">
                <li><span className="perk-check">✓</span>1 point per £1 spent</li>
                <li><span className="perk-check">✓</span>Free standard shipping over £40</li>
                <li><span className="perk-check">✓</span>Early sale access</li>
              </ul>
              <button className="tier-cta">Join Free</button>
            </div>
            <div className="tier-card tier-silver fade-up fade-up-2">
              <div className="tier-glow"></div>
              <div className="tier-medal">🥈</div>
              <div className="tier-name">Silver</div>
              <div className="tier-threshold">£100 – £299</div>
              <ul className="tier-perks">
                <li><span className="perk-check">✓</span>1.5 points per £1 spent</li>
                <li><span className="perk-check">✓</span>Free standard shipping on ALL Orders</li>
                <li><span className="perk-check">✓</span>Exclusive drops preview</li>
                <li><span className="perk-check">✓</span>Priority customer support</li>
              </ul>
              <button className="tier-cta">Learn More</button>
            </div>
            <div className="tier-card tier-gold fade-up fade-up-3">
              <div className="tier-glow"></div>
              <div className="tier-medal">🥇</div>
              <div className="tier-name">Gold</div>
              <div className="tier-threshold">£300+</div>
              <ul className="tier-perks">
                <li><span className="perk-check">✓</span>2 points per £1 spent</li>
                <li><span className="perk-check">✓</span>Free Express Shipping On ALL Orders</li>
                <li><span className="perk-check">✓</span>Exclusive Gold-only pieces</li>
                <li><span className="perk-check">✓</span>Annual gift package</li>
                <li><span className="perk-check">✓</span>Dedicated stylist access</li>
              </ul>
              <button className="tier-cta">Learn More</button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================== FAQ ======================== */}
      <section className="faq">
        <div className="container">
          <div className="faq-header fade-up">
            <span className="section-label" style={{justifyContent:'center'}}>Got Questions?</span>
            <h2 className="section-heading">FAQs</h2>
          </div>
          <div className="faq-grid">
            {[
              ['01','How long does delivery take?','Standard delivery takes 3–7 business days. Express (2-5 business days) and same-day dispatch (Gold Members) options are also available at checkout.'],
              ['02','What is your return policy?','We offer a 14-day free returns policy on all unworn items in their original packaging. Simply initiate a return from your account dashboard.'],
              ['03','Do DJONOVA shoes run true to size?','Our footwear runs true to European sizing. We recommend checking our interactive Size Guide for accurate measurements across EU, US, and UK sizes.'],
              ['04','How do I use the promo code DJNV20?','Enter DJNV20 at checkout to receive 20% off your first order. The code applies to full-price items and is valid for new customers only.'],
              ['06','Can I track my order?','Yes — once your order ships, you\'ll receive a tracking link via email and SMS. You can also track orders anytime from your DJONOVA account page.'],
              ['07','How does the Members Club work?','Sign up for free (Bronze tier) and earn 1 point per £1 spent. Redeem points for discounts, and unlock Silver and Gold as your total spend grows.'],
              ['08','Do you ship internationally?','We ship to 18+ countries worldwide. International orders typically arrive within 7–14 business days. Duties and taxes may apply depending on your location.'],
            ].map(([num,q,a]) => (
              <div key={num} className="faq-item">
                <div className="faq-q"><span className="faq-num">{num}</span>{q}</div>
                <p className="faq-a">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================== PROMO BANNER ======================== */}
      <section className="promo-banner">
        <div className="container">
          <div className="promo-content fade-up">
            <p className="promo-label">Limited Time Offer</p>
            <h2 className="promo-heading">10% Off Your First Order</h2>
            <p className="promo-sub">New to DJONOVA? Welcome to the club. Use the code below at checkout.</p>
            <div className="promo-code-box">
              <span className="promo-code-label">Promo Code</span>
              <span className="promo-code">DJNV10</span>
            </div>
            <br/>
            <a href="/gb/store" className="btn btn-light">Shop Now and Save →</a>
            <p className="promo-expiry">Valid on full-price items · New customers only · Expires 31 Dec 2027</p>
          </div>
        </div>
      </section>

      {/* ======================== NEWSLETTER ======================== */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter-inner fade-up">
            <span className="section-label" style={{justifyContent:'center'}}>Stay in the Loop</span>
            <h2 className="section-heading">
              Join the <em style={{fontStyle:'italic',color:'var(--accent)'}}>Inner Circle</em>
            </h2>
            <p style={{color:'var(--warm-gray)',fontSize:'.92rem',marginTop:'12px',lineHeight:1.7}}>
              Get early access to new drops, exclusive offers, and editorial content. No spam — ever.
            </p>
            <form className="newsletter-form">
              <input
                className="newsletter-input"
                type="email"
                placeholder="Your email address"
              />
              <button className="btn btn-primary" type="submit">Subscribe ↗</button>
            </form>
            <p className="newsletter-privacy">🔒 Your data is safe · Unsubscribe at any time</p>
          </div>
        </div>
      </section>

    </main>
  )
      }
