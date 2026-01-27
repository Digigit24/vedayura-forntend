import React from "react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import ProductCard from "../components/ProductCard";
import { Leaf, ShieldCheck } from "lucide-react";
import "./Home.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const { products } = useShop();
  const featuredProducts = products.slice(0, 4); // Display only first 4 products
   const floatRef = useRef(null);
    useEffect(() => {
    const el = floatRef.current;

    // Idle breathing motion
    gsap.to(el, {
      y: -8,
      duration: 5,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    // Scroll-synced motion
    gsap.to(el, {
      y: -20,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top bottom",
        end: "bottom top",
        scrub: 1,
      },
    });
  return () => {
      ScrollTrigger.getAll().forEach(st => st.kill());
      gsap.killTweensOf(el);
    };
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section (Text on the Left, Image on the Right) */}
      <section className="hero-section">
        <div className="container">
          {/* Text Section */}
          <div className="hero-content">
            <h1 className="animate-fade-in-up">
             <span> Pure Ayurveda</span> for Modern <span className="span-hero">Wellness</span>
            </h1>
            <p className="animate-fade-in-up delay-100">
              At VedAyura, we bring the timeless wisdom of Ayurveda to you with our range of natural capsules, liquids, and powders. Crafted from the finest herbs, our products support your overall health, vitality, and well-being.
            </p>
            <div className="animate-fade-in-up delay-200">
              <Link to="/shop" className="btn btn-outline">
                Shop Collection
              </Link>
            </div>
          </div>

          {/* Image Section (Desktop) */}
          <div className="hero-image animate-float">
            <img
            ref={floatRef}
              src="/assets/hero-img.png"
              alt="Ayurvedic Products"
              className="animate-float"
            />
          </div>
        </div>
        {/* Mobile Background Image with Overlay */}
        <div className="hero-mobile-bg">
          <div className="hero-overlay"></div>
          <img
            src="/assets/hero-img.png"
            alt="Background"
          />
        </div>
      </section>



      {/* About Us Section */}
      <section className="section about-section bg-light relative overflow-hidden">
        <div className="about-bg-leaf"></div>
        <div className="container grid-2-col items-center gap-xl relative z-10">
          <div className="about-image-wrapper highlight-frame">
            <img
              src="/ancient_wisdom.png"
              alt="Ancient Ayurvedic ingredients and wisdom"
              className="rounded-lg shadow-lg aspect-[4/3] object-cover"
            />
          </div>
          <div className="about-content">
            <h4 className="text-secondary uppercase tracking-wide text-sm font-bold mb-sm">
              Our Story
            </h4>
            <div className="about-spine"></div>
            <h2 className="section-title text-left mb-md">
              Ancient Wisdom, Modern Purity
            </h2>
            <p className="text-secondary mb-md leading-relaxed">
              At Vedayura, we honor the natural healing power of Ayurveda. Our mission is simple: to bring traditional, authentic Ayurvedic remedies into the modern world, preserving their purity and effectiveness.
            </p>
            <p className="text-secondary mb-lg leading-relaxed">
              Each product is meticulously crafted with sustainably sourced herbs, based on age-old formulations passed down through generations. We are dedicated to promoting holistic wellness, nurturing your body, mind, and spirit.
            </p>
            <div className="features-mini-grid">
              <div className="flex items-center gap-sm mb-sm">
                <Leaf className="text-primary" size={24} />
                <span>100% Natural Ingredients</span>
              </div>
              <div className="flex items-center gap-sm mb-sm">
                <ShieldCheck className="text-primary" size={24} />
                <span>Certified Authentic</span>
              </div>
            </div>
            <Link to="/about" className="btn btn-outline mt-md">
              Read More About Us
            </Link>
            <img
              src="/assets/about-bg.png"
              alt="Decorative Leaf"
              className="about-bg-decoration"
            />
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-xl">
            <h2 className="section-title mb-sm">Featured Collections</h2>
            <p className="text-secondary">
              Handpicked essentials for your daily wellness routine.
            </p>
          </div>
          <div className="product-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-2xl pt-lg">
            <Link to="/shop" className="btn btn-primary btn-outline  btn-txt">
              View All Products
            </Link>
          </div>
        </div>
      </section>

   
<section class="section bg-testimonials">
  <div class="container">
    <h2 class="section-title text-center">Stories of Healing</h2>
    <p class="text-secondary text-center mb-xl">Hear from our satisfied customers who experienced the power of Ayurveda with VedAyura.</p>

    <div class="testimonials-grid">
   
      <div class="testimonial-card">
        <div class="testimonial-header">
          <div class="stars">★★★★★</div>
          <h4 class="testimonial-name">Anjali Sharma</h4>
        </div>
        <p class="testimonial-text">
          "I've tried many natural brands, but nothing comes close to the authenticity of Vedayura. The <strong>Arthofit</strong> capsules are a game-changer! My joints feel more flexible, and the pain has significantly reduced."
        </p>
      </div>

   
      <div class="testimonial-card">
        <div class="testimonial-header">
          <div class="stars">★★★★★</div>
          <h4 class="testimonial-name">Rahul Khanna</h4>
        </div>
        <p class="testimonial-text">
          "Finally found <strong>Diabofit</strong> liquid that is pure and effective. My sugar levels are better controlled, and I feel more energized throughout the day."
        </p>
      </div>

      <div class="testimonial-card">
        <div class="testimonial-header">
          <div class="stars">★★★★★</div>
          <h4 class="testimonial-name">Priya Menon</h4>
        </div>
        <p class="testimonial-text">
          "The <strong>Garcinia Plus</strong> capsules helped me with weight loss. I've noticed a decrease in cravings, and my metabolism is much better now."
        </p>
      </div>
    </div>
  </div>
</section>



      {/* Newsletter Section */}
      <div className="container" style={{ marginBottom: '80px', marginTop: '60px' }}>
        <NewsletterHomeWrapper />
      </div>
    </div>
  );
};

// Internal Component for functional newsletter
const NewsletterHomeWrapper = () => {
  const [email, setEmail] = React.useState('');
  const [status, setStatus] = React.useState(''); // '', 'success', 'error'

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert("Please enter a valid email address");
      return;
    }
    // Simulate API call
    setStatus('sending');
    setTimeout(() => {
      setStatus('success');
      setEmail('');
    }, 1500);
  };

  return (
    <div className="home-newsletter-card animate-on-scroll">
      {/* Background Decor */}
      <div className="newsletter-decor-circle-1"></div>
      <div className="newsletter-decor-circle-2"></div>

      <div className="newsletter-content-wrapper">
        <div className="newsletter-badge">Join the Family</div>
        <h3>Experience Wellness, the Ayurvedic Way</h3>
        <p>
          Subscribe to our weekly wellness guide and unlock exclusive content on natural health tips, Ayurveda practices, and more. Plus, enjoy a special <span className="highlight-text">10% OFF</span> on your first order.
        </p>

        {status === 'success' ? (
          <div className="newsletter-success-msg animate-fade-in-up">
            <div className="success-icon-circle">✓</div>
            <h4>Welcome to Vedayura!</h4>
            <p>Your 10% discount code: <strong>VEDA10</strong> has been sent to your email. Thank you for joining our community!</p>
            <button onClick={() => setStatus('')} className="btn-text-only">Subscribe another email</button>
          </div>
        ) : (
          <form className="newsletter-form-modern" onSubmit={handleSubscribe}>
            <div className="input-group">
              <input
                type="email"
                placeholder="Enter your email address..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === 'sending'}
              />
              <button type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Joining...' : 'Subscribe Now'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>

  );
};

export default Home;
