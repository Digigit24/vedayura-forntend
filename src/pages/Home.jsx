import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import ProductCard from "../components/ProductCard";
import {
  ArrowRight,
  Leaf,
  ShieldCheck,
  Sun,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./Home.css";

const sliderData = [
  {
    subtitle: "Authentic & Natural",
    title: (
      <>
        Rediscover the <br />
        <i className="font-serif text-secondary-light">Power of Vedas</i>
      </>
    ),
    description:
      "Premium Ayurvedic formulations for holistic wellness. Flat 30% Off on Skincare Essentials.",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ad7be?q=80&w=1920&auto=format&fit=crop",
    cta: "Shop Skincare",
    link: "/shop",
  },
  {
    subtitle: "Pure Hair Care",
    title: (
      <>
        Ancient Secrets for <br />
        <i className="font-serif text-secondary-light">Radiant Hair</i>
      </>
    ),
    description:
      "Special Offer: Buy 1 Get 1 Free on all Herbal Hair Oils and Shampoos this week.",
    image:
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=1920&auto=format&fit=crop",
    cta: "Explore Haircare",
    link: "/shop",
  },
  {
    subtitle: "Holistic Wellness",
    title: (
      <>
        Elevate Your <br />
        <i className="font-serif text-secondary-light">Daily Rituals</i>
      </>
    ),
    description:
      "Join our wellness community and get 20% off on your first order. Authentic purity.",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=1920&auto=format&fit=crop",
    cta: "View All Offers",
    link: "/shop",
  },
];

const Home = () => {
  const { products } = useShop();
  const [currentSlide, setCurrentSlide] = useState(0);

  const featuredProducts = products.slice(0, 4);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === sliderData.length - 1 ? 0 : prev + 1,
      );
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? sliderData.length - 1 : prev - 1));
  };

  return (
    <div className="home-page">
      {/* Hero Slider Section */}
      <section className="hero-slider relative overflow-hidden h-screen">
        <div
          className="slider-container flex transition-transform duration-700 ease-in-out h-full"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
          }}
        >
          {sliderData.map((slide, index) => (
            <div
              key={index}
              className="slide-item min-w-full flex-shrink-0 relative h-full flex items-center justify-center text-center px-4"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                className="hero-content container relative z-10"
                style={{ maxWidth: "900px" }}
              >
                <h5 className="text-white uppercase tracking-[0.2em] mb-sm font-semibold opacity-90 animate-fade-in-up">
                  {slide.subtitle}
                </h5>
                <h1
                  className="text-white mb-md font-heading leading-tight animate-fade-in-up"
                  style={{
                    fontSize: "3.5rem",
                    textShadow: "0 4px 20px rgba(0,0,0,0.3)",
                  }}
                >
                  {slide.title}
                </h1>
                <p className="text-white text-xl mb-xl opacity-90 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100">
                  {slide.description}
                </p>
                <div className="hero-buttons flex justify-center gap-md animate-fade-in-up delay-200">
                  <Link
                    to={slide.link}
                    className="btn btn-primary hover:bg-secondary hover:text-white border-none px-2xl"
                  >
                    {slide.cta}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Slider Navigation */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-all"
        >
          <ChevronLeft size={32} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-all"
        >
          <ChevronRight size={32} />
        </button>

        {/* Slider Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {sliderData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? "bg-white w-8" : "bg-white/50 hover:bg-white/80"}`}
            />
          ))}
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
              At Vedayura, we believe in the healing power of nature. Our
              journey began with a simple mission: to bring authentic,
              time-tested Ayurvedic remedies to the modern world without
              compromising on purity.
            </p>

            <p className="text-secondary mb-lg leading-relaxed">
              Every product is crafted with sustainably sourced herbs, following
              traditional formulations that have been trusted for centuries. We
              are committed to holistic wellness that nurtures your body, mind,
              and soul.
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
            <Link to="/shop" className="btn btn-primary btn-txt">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-secondary-light">
        <div className="container">
          <h2 className="section-title text-center mb-xl">
            Stories of Healing
          </h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p className="mb-md">
                "I've tried many natural brands, but nothing comes close to the
                authenticity of Vedayura. The Saffron Night Cream is a
                game-changer!"
              </p>
              <h4 className="font-bold">- Anjali Sharma</h4>
              <span className="text-xs text-secondary">Verified Buyer</span>
            </div>
            <div className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p className="mb-md">
                "Finally found Ashwagandha tablets that are pure and effective.
                My stress levels have significantly gone down."
              </p>
              <h4 className="font-bold">- Rahul Khanna</h4>
              <span className="text-xs text-secondary">Verified Buyer</span>
            </div>
            <div className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p className="mb-md">
                "The hair oil is magic. Hairfall stopped in just 2 weeks. The
                earthy fragrance tells you it's the real deal."
              </p>
              <h4 className="font-bold">- Priya Menon</h4>
              <span className="text-xs text-secondary">Verified Buyer</span>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section newsletter-section bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-white mb-sm">Join Our Wellness Community</h2>
          <p className="text-white opacity-90 mb-lg">
            Subscribe to receive holistic health tips, exclusive offers, and
            early access to new launches.
          </p>
          <form
            className="home-newsletter-form"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="border-none"
            />
            <button
              type="submit"
              className="btn bg-secondary text-white hover-dark"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;
