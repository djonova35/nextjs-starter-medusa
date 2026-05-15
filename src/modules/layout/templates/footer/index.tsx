export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">

          <div className="footer-brand">
            <div className="logo">DJONOVA</div>
            <div className="footer-tagline">Shoes. Style. Tech.</div>
            <p className="footer-desc">
              Crafted for those who move with intention. DJONOVA is where
              couture meets everyday wearability.
            </p>
            <div className="footer-socials">
              <a href="#" className="social-icon">𝕏</a>
              <a href="#" className="social-icon">📸</a>
              <a href="#" className="social-icon">▶</a>
              <a href="#" className="social-icon">in</a>
            </div>
          </div>

          <div>
            <div className="footer-col-title">Shop</div>
            <ul className="footer-links">
              <li><a href="/gb/store">New Arrivals</a></li>
              <li><a href="/gb/store">Men&apos;s</a></li>
              <li><a href="/gb/store">Women&apos;s</a></li>
              <li><a href="/gb/store">Kids</a></li>
              <li><a href="/gb/store">Tech Essentials</a></li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Help</div>
            <ul className="footer-links">
              <li><a href="#">Size Guide</a></li>
              <li><a href="#">Delivery Info</a></li>
              <li><a href="#">Returns</a></li>
              <li><a href="#">Track Order</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Company</div>
            <ul className="footer-links">
              <li><a href="#">Our Story</a></li>
              <li><a href="#">Sustainability</a></li>
              <li><a href="#">Members Club</a></li>
              <li><a href="#">Press</a></li>
              <li><a href="#">Careers</a></li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <div className="footer-copy">
            © 2026 DJONOVA. All rights reserved.
          </div>
          <div className="payment-icons">
            <span className="payment-icon">Visa</span>
            <span className="payment-icon">Mastercard</span>
            <span className="payment-icon">Amex</span>
            <span className="payment-icon">Apple Pay</span>
            <span className="payment-icon">Klarna</span>
          </div>
        </div>

      </div>
    </footer>
  )
}
