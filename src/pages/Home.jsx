// v1.0.2
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useShop } from "../context/ShopContext";
import ProductCard from "../components/ProductCard";
import { Leaf, ShieldCheck } from "lucide-react";
import "./Home.css";

const getSlidePos = (i, current, total) => {
  const diff = ((i - current) % total + total) % total;
  if (diff === 0) return 'center';
  if (diff === 1) return 'right';
  if (diff === total - 1) return 'left';
  return diff < total / 2 ? 'far-right' : 'far-left';
};

const HERO_SLIDES = [
  { src: '/assets/diabocare-kit-view.png',      alt: 'Diabocare — Blood Sugar Support' },
  { src: '/assets/arthoplus-capsules-both.png', alt: 'Arthroplus — Joint Care' },
  { src: '/assets/garcinia-plus-all.png',       alt: 'Garcinia Plus — Weight Management' },
  { src: '/assets/hcare-capsules-both.png',     alt: 'H-Care — Heart Health' },
  { src: '/assets/lcare-all.png',               alt: 'L-Care — Liver & Digestive Health' },
];

const Home = () => {
  const { products } = useShop();
  const featuredProducts = products.slice(0, 5);
  const heroRef = useRef(null);
  const carouselRef = useRef(null);
  const timerRef = useRef(null);
  const [slide, setSlide] = useState(0);
  const total = HERO_SLIDES.length;

  const startAutoPlay = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setSlide(s => (s + 1) % total), 3500);
  };

  // Auto-advance carousel
  useEffect(() => {
    startAutoPlay();
    return () => clearInterval(timerRef.current);
  }, []);

  // Drag / swipe
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    let startX = 0;
    let isDragging = false;

    const onDown = (e) => {
      startX = (e.touches?.[0] ?? e).clientX;
      isDragging = true;
    };
    const onUp = (e) => {
      if (!isDragging) return;
      isDragging = false;
      const endX = (e.changedTouches?.[0] ?? e).clientX;
      const delta = endX - startX;
      if (Math.abs(delta) < 50) return;
      const dir = delta < 0 ? 1 : -1;
      setSlide(s => (s + dir + total) % total);
      startAutoPlay();
    };

    el.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);      // window catches release anywhere
    el.addEventListener('touchstart', onDown, { passive: true });
    el.addEventListener('touchend', onUp);
    return () => {
      el.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      el.removeEventListener('touchstart', onDown);
      el.removeEventListener('touchend', onUp);
    };
  }, []); // eslint-disable-line

  // Cursor glow + magnetic text
  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    // activate magnetic only after entrance animations finish
    let magneticActive = false;
    const enableTimer = setTimeout(() => { magneticActive = true; }, 1400);

    const magnets = el.querySelectorAll('[data-magnetic]');

    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--gx', `${e.clientX - r.left}px`);
      el.style.setProperty('--gy', `${e.clientY - r.top}px`);
      el.style.setProperty('--glow-op', '1');

      if (!magneticActive) return;
      magnets.forEach((m) => {
        const mr = m.getBoundingClientRect();
        const cx = mr.left + mr.width / 2;
        const cy = mr.top + mr.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const radius = 200;
        if (dist < radius) {
          const pull = (1 - dist / radius) * 10;
          m.style.transform = `translate(${(dx / dist) * pull}px, ${(dy / dist) * pull}px)`;
        } else {
          m.style.transform = '';
        }
      });
    };

    const onLeave = () => {
      el.style.setProperty('--glow-op', '0');
      magnets.forEach((m) => { m.style.transform = ''; });
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      clearTimeout(enableTimer);
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  // Scroll-reveal
  useEffect(() => {
    const els = document.querySelectorAll('.anim-scroll:not(.anim-in)');
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) {
          const delay = e.target.dataset.delay || 0;
          e.target.style.transitionDelay = `${delay}ms`;
          e.target.classList.add('anim-in');
          io.unobserve(e.target);
        }
      }),
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [products]);

  return (
    <div className="home-page">

      {/* ── Hero ── */}
      <section className="hero-section" ref={heroRef}>
        <div className="hero-bg"      aria-hidden="true"/>
        <div className="hero-overlay" aria-hidden="true"/>
        <div className="hero-glow" aria-hidden="true"/>
        <div className="hero-left">
          <span className="hero-eyebrow hero-anim-1" data-magnetic><Leaf size={11}/> Pure · Potent · Chemical-Free · GMP Certified</span>
          <h1 className="hero-heading">
            <span className="hero-line hero-anim-2" data-magnetic>Your Body</span>
            <br/>
            <span className="hero-line hero-anim-3" data-magnetic>Knows <em>Nature</em>.</span>
            <br/>
            <span className="hero-line hero-anim-4" data-magnetic>So Do We.</span>
          </h1>
          <p className="hero-tagline hero-anim-5" data-magnetic>
            Vedayura formulates pure Ayurvedic remedies the way they were always meant to be — no fillers, no chemicals, just herbs that have healed for millennia.
          </p>
          <div className="hero-cta-group hero-anim-6">
            <Link to="/shop" className="hero-cta">Explore Products</Link>
            <Link to="/about" className="hero-cta-ghost">Our Story →</Link>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-carousel" ref={carouselRef}>
            {HERO_SLIDES.map((s, i) => {
              const pos = getSlidePos(i, slide, HERO_SLIDES.length);
              return (
                <div
                  key={s.src}
                  className={`hero-cs-item hero-cs-${pos}`}
                  onClick={() => { if (pos === 'right') { setSlide(i); startAutoPlay(); } }}
                >
                  <img src={s.src} alt={s.alt} draggable={false} />
                </div>
              );
            })}
          </div>
          <div className="hero-carousel-dots">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                className={`hero-dot${i === slide ? ' active' : ''}`}
                onClick={() => { setSlide(i); startAutoPlay(); }}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section — 12A redesign */}
      <section className="about-12a">

        {/* ── Quote zone ── */}
        <div className="about-quote-zone">

          {/* Botanical ink watermark */}
          <div className="about-botanical-bg" aria-hidden="true">
            <svg viewBox="0 0 1000 480" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#175333" strokeLinecap="round" strokeLinejoin="round">
              <path d="M0,460 C150,380 350,300 560,248 C710,210 860,172 1000,130" strokeWidth="2.5"/>
              <path d="M178,398 C138,352 120,290 182,264 C218,310 212,372 178,398Z" strokeWidth="1.5"/>
              <line x1="180" y1="398" x2="184" y2="264" strokeWidth="0.8"/>
              <path d="M177,378 C160,362 150,344 155,326" strokeWidth="0.5"/>
              <path d="M179,354 C196,340 202,320 196,302" strokeWidth="0.5"/>
              <path d="M180,330 C165,314 158,296 163,280" strokeWidth="0.5"/>
              <path d="M330,322 C292,278 278,216 340,192 C374,238 368,300 330,322Z" strokeWidth="1.5"/>
              <line x1="332" y1="322" x2="342" y2="192" strokeWidth="0.8"/>
              <path d="M329,302 C312,286 304,268 310,250" strokeWidth="0.5"/>
              <path d="M332,278 C348,264 352,246 346,228" strokeWidth="0.5"/>
              <path d="M498,265 C466,228 456,176 510,154 C538,194 530,250 498,265Z" strokeWidth="1.5"/>
              <line x1="500" y1="265" x2="512" y2="154" strokeWidth="0.8"/>
              <path d="M497,246 C481,232 474,215 479,198" strokeWidth="0.5"/>
              <path d="M500,222 C515,208 520,190 514,173" strokeWidth="0.5"/>
              <path d="M668,218 C640,184 632,138 681,118 C705,154 696,200 668,218Z" strokeWidth="1.5"/>
              <line x1="671" y1="218" x2="683" y2="118" strokeWidth="0.8"/>
              <path d="M667,198 C651,182 644,165 650,148" strokeWidth="0.5"/>
              <path d="M425,278 C398,238 378,192 408,150" strokeWidth="1.5"/>
              <path d="M408,232 C388,215 382,192 400,184 C413,202 411,222 408,232Z" strokeWidth="1"/>
              <path d="M406,195 C427,178 434,154 415,146 C402,163 404,185 406,195Z" strokeWidth="1"/>
              <path d="M608,248 C630,288 640,330 624,375" strokeWidth="1.5"/>
              <path d="M616,278 C637,264 645,242 628,232 C614,246 614,268 616,278Z" strokeWidth="1"/>
              <path d="M622,322 C604,308 600,286 617,277 C630,292 630,312 622,322Z" strokeWidth="1"/>
              <circle cx="452" cy="248" r="5.5" strokeWidth="1.2"/>
              <circle cx="463" cy="240" r="4.5" strokeWidth="1.2"/>
              <circle cx="443" cy="239" r="4" strokeWidth="1.2"/>
              <circle cx="454" cy="231" r="3.5" strokeWidth="1.2"/>
              <path d="M452,242 L460,233 L444,233 L450,226" strokeWidth="0.8"/>
              <path d="M858,168 C842,150 838,128 857,120 C870,136 866,156 858,168Z" strokeWidth="1.2"/>
              <path d="M878,152 C896,136 898,114 880,106 C866,122 868,144 878,152Z" strokeWidth="1.2"/>
              <line x1="866" y1="168" x2="868" y2="106" strokeWidth="0.8"/>
              <circle cx="262" cy="298" r="2.5" strokeWidth="0.8"/>
              <circle cx="758" cy="188" r="2" strokeWidth="0.8"/>
              <circle cx="282" cy="310" r="2" strokeWidth="0.8"/>
              <circle cx="920" cy="148" r="2.5" strokeWidth="0.8"/>
            </svg>
          </div>

          <span className="about-eyebrow anim-scroll" data-delay="0">Our Philosophy</span>
          <blockquote className="about-quote-block anim-scroll" data-delay="120">
            <p className="about-quote-text">
              "We honor the natural healing power of Ayurveda — pure ingredients, ancient knowledge, real results."
            </p>
            <cite className="about-quote-cite anim-scroll" data-delay="240">— Vedayura, Rooted in Tradition</cite>
          </blockquote>

          <div className="about-ink-divider anim-scroll anim-scale" data-delay="340" aria-hidden="true">
            <svg viewBox="0 0 560 52" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="#175333" strokeLinecap="round">
              <path d="M20,26 C70,26 120,22 200,26 C230,28 238,26 244,26" strokeWidth="0.9" opacity="0.35"/>
              <path d="M316,26 C322,26 330,28 360,26 C440,22 490,26 540,26" strokeWidth="0.9" opacity="0.35"/>
              <path d="M248,32 C240,20 250,8 260,13 C264,22 258,30 248,32Z" strokeWidth="1.1" opacity="0.55"/>
              <path d="M312,32 C320,20 310,8 300,13 C296,22 302,30 312,32Z" strokeWidth="1.1" opacity="0.55"/>
              <line x1="260" y1="13" x2="280" y2="38" strokeWidth="0.9" opacity="0.5"/>
              <line x1="300" y1="13" x2="280" y2="38" strokeWidth="0.9" opacity="0.5"/>
              <circle cx="280" cy="40" r="2.5" strokeWidth="1" opacity="0.5"/>
              <path d="M234,26 C232,20 236,14 242,16 C244,21 240,25 234,26Z" strokeWidth="0.9" opacity="0.4"/>
              <path d="M326,26 C328,20 324,14 318,16 C316,21 320,25 326,26Z" strokeWidth="0.9" opacity="0.4"/>
            </svg>
          </div>
        </div>

        {/* ── Content zone ── */}
        <div className="about-content-zone">

          <div className="about-img-col anim-scroll anim-from-left" data-delay="0">
            <div className="about-img-frame">
              <div className="about-img-accent-block" aria-hidden="true" />
              <div className="about-img-inner">
                <img src="/ancient_wisdom.png" alt="Ancient Ayurvedic ingredients and wisdom" loading="lazy" />
              </div>
            </div>
          </div>

          <div className="about-text-col">
            <span className="about-eyebrow anim-scroll" data-delay="80">Our Story</span>
            <div className="about-spine anim-scroll anim-spine" data-delay="160"></div>
            <h2 className="about-heading anim-scroll" data-delay="200">
              Ancient Wisdom,<br /><em>Modern Purity</em>
            </h2>

            <div className="about-stats-row anim-scroll" data-delay="300">
              <div className="about-stat">
                <span className="about-stat-num">15+</span>
                <span className="about-stat-label">Years of Research</span>
              </div>
              <div className="about-stat-sep" />
              <div className="about-stat">
                <span className="about-stat-num">50+</span>
                <span className="about-stat-label">Products</span>
              </div>
              <div className="about-stat-sep" />
              <div className="about-stat">
                <span className="about-stat-num">10K+</span>
                <span className="about-stat-label">Happy Customers</span>
              </div>
            </div>

            <p className="about-body anim-scroll" data-delay="380">
              At Vedayura, we bring traditional, authentic Ayurvedic remedies into the modern world — preserving their purity and effectiveness. Each product is crafted with sustainably sourced herbs, based on age-old formulations passed down through generations.
            </p>

            <div className="about-badges-row anim-scroll" data-delay="440">
              <div className="about-badge-item">
                <Leaf size={18} />
                <span>100% Natural</span>
              </div>
              <div className="about-badge-item">
                <ShieldCheck size={18} />
                <span>GMP Certified</span>
              </div>
            </div>

            <Link to="/about" className="about-cta-btn anim-scroll" data-delay="500">Read Our Story</Link>
          </div>
        </div>

      </section>

      {/* Featured Collections */}
      <section className="featured-section">
        <div className="featured-inner">

          <div className="featured-header">
            <span className="about-eyebrow anim-scroll" data-delay="0">Handcrafted for You</span>
            <div className="about-spine anim-scroll anim-spine" data-delay="80"></div>
            <h2 className="featured-heading anim-scroll" data-delay="140">
              Featured <em>Collections</em>
            </h2>
            <p className="featured-subtext anim-scroll" data-delay="220">
              Ayurvedic essentials — pure ingredients, ancient wisdom, modern results.
            </p>
          </div>

          <div className="product-grid">
            {featuredProducts.map((product, i) => (
              <div className="featured-card-wrap anim-scroll" data-delay={i * 70} key={product.id}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <div className="featured-cta-row anim-scroll" data-delay="180">
            <Link to="/shop" className="about-cta-btn">View All Products</Link>
            <Link to="/catalog" className="featured-catalog-link">Browse Catalog →</Link>
          </div>

        </div>
      </section>

      <section className="bg-testimonials">
        <div className="testimonials-inner">

          <div className="testimonials-header">
            <span className="about-eyebrow anim-scroll" data-delay="0">Real Experiences</span>
            <div className="about-spine anim-scroll anim-spine" data-delay="80" style={{margin: '0 auto 16px'}}></div>
            <h2 className="featured-heading anim-scroll" data-delay="140">Stories of <em>Healing</em></h2>
            <p className="featured-subtext anim-scroll" data-delay="210">
              Hear from customers who experienced the power of Ayurveda with Vedayura.
            </p>
          </div>

          <div className="testimonials-grid">

            <div className="testimonial-card anim-scroll" data-delay="0">
              <div className="tcard-top">
                <div className="tcard-avatar">A</div>
                <div>
                  <h4 className="testimonial-name">Anjali Sharma</h4>
                  <div className="stars">★★★★★</div>
                </div>
              </div>
              <p className="testimonial-text">
                "Nothing comes close to the authenticity of Vedayura. The <strong>Arthroplus</strong> capsules are a game-changer — my joints feel more flexible and the pain has significantly reduced."
              </p>
            </div>

            <div className="testimonial-card anim-scroll" data-delay="100">
              <div className="tcard-top">
                <div className="tcard-avatar">R</div>
                <div>
                  <h4 className="testimonial-name">Rahul Khanna</h4>
                  <div className="stars">★★★★★</div>
                </div>
              </div>
              <p className="testimonial-text">
                "Finally found a <strong>Diabocare</strong> juice that is pure and effective. My sugar levels are better controlled and I feel more energized throughout the day."
              </p>
            </div>

            <div className="testimonial-card anim-scroll" data-delay="200">
              <div className="tcard-top">
                <div className="tcard-avatar">P</div>
                <div>
                  <h4 className="testimonial-name">Priya Menon</h4>
                  <div className="stars">★★★★★</div>
                </div>
              </div>
              <p className="testimonial-text">
                "The <strong>Garcinia Plus</strong> capsules helped me with weight loss. I've noticed a real decrease in cravings and my metabolism is much better now."
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterHomeWrapper />
    </div>
  );
};

// Internal Component for functional newsletter
const NewsletterHomeWrapper = () => {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address", {
        style: {
          borderRadius: '14px',
          background: '#1e293b',
          color: '#f8fafc',
          padding: '12px 20px',
          fontSize: '0.9rem',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
        },
        icon: '✉️',
        position: 'top-center',
        duration: 3000,
      });
      return;
    }
    setStatus('sending');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  return (
    <section className="nl-section">
      <div className="nl-dot-grid" aria-hidden="true" />

      <div className="nl-inner">
        <span className="nl-eyebrow anim-scroll" data-delay="0">Join the Family</span>
        <div className="about-spine anim-scroll anim-spine nl-spine" data-delay="80" />
        <h2 className="nl-heading anim-scroll" data-delay="140">
          Experience Wellness,<br /><em>the Ayurvedic Way</em>
        </h2>
        <p className="nl-subtext anim-scroll" data-delay="200">
          Subscribe to our weekly wellness guide and get exclusive Ayurveda tips, health practices, and a special <span className="nl-highlight">10% OFF</span> on your first order.
        </p>

        <div className="nl-benefits anim-scroll" data-delay="270">
          <span className="nl-benefit"><Leaf size={13} /> Weekly Insights</span>
          <span className="nl-benefit"><ShieldCheck size={13} /> Exclusive Offers</span>
          <span className="nl-benefit"><Leaf size={13} /> Early Access</span>
        </div>

        {status === 'success' ? (
          <div className="nl-success anim-scroll" data-delay="0">
            <div className="nl-success-check">✓</div>
            <h4>Welcome to Vedayura!</h4>
            <p>Your 10% discount code <strong>VEDA10</strong> has been sent to your email.</p>
            <button onClick={() => setStatus('')} className="nl-reset-btn">Subscribe another email</button>
          </div>
        ) : (
          <form className="nl-form anim-scroll" data-delay="330" onSubmit={handleSubscribe}>
            <input
              type="email"
              className="nl-input"
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === 'sending'}
            />
            <button type="submit" className="nl-submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'Joining...' : 'Subscribe Now'}
            </button>
          </form>
        )}

        <p className="nl-privacy">No spam, ever. Unsubscribe anytime.</p>
      </div>
    </section>
  );
};

export default Home;
