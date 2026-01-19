import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/ProductCard';
import { ArrowRight, Leaf, ShieldCheck, Sun } from 'lucide-react';
import './Home.css';

const Home = () => {
    const { products } = useShop();

    const featuredProducts = products.slice(0, 4);
    

    return (
        <div className="home-page">
            {/* Hero Section */}
            <section className="hero-section text-center flex items-center justify-center">
                <div className="hero-content container" style={{ maxWidth: '900px' }}>
                    <h5 className="text-white uppercase tracking-[0.2em] mb-sm font-semibold opacity-90 animate-fade-in-up">Authentic & Natural</h5>
                    <h1 className="text-white mb-md font-heading leading-tight animate-fade-in-up" style={{ fontSize: '3.5rem', textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
                        Rediscover the <br /><i className="font-serif text-secondary-light">Power of Vedas</i>
                    </h1>
                    <p className="text-white text-xl mb-xl opacity-90 max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100">
                        Premium Ayurvedic formulations for holistic wellness, crafted with purity and tradition from Pune, Ravet.
                    </p>
                    <div className="hero-buttons flex justify-center gap-md animate-fade-in-up delay-200">
                        <Link to="/shop" className="btn btn-primary hover:bg-secondary hover:text-white border-none px-2xl">Shop Collection</Link>
                    </div>
                </div>
            </section>

            {/* About Us Section */}
            <section className="section about-section bg-light relative overflow-hidden">
  <div className="about-bg-leaf"></div>

  <div className="container grid-2-col items-center gap-xl relative z-10">
   <div className="about-image-wrapper highlight-frame">
  <img
    src="https://placehold.co/600x500/2F6F4E/FFFFFF?text=Our+Story"
    alt="Ayurvedic herbs"
    className="rounded-lg shadow-lg"
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
        At Vedayura, we believe in the healing power of nature. Our journey began with a simple mission: to bring authentic, time-tested Ayurvedic remedies to the modern world without compromising on purity.
      </p>

      <p className="text-secondary mb-lg leading-relaxed">
        Every product is crafted with sustainably sourced herbs, following traditional formulations that have been trusted for centuries. We are committed to holistic wellness that nurtures your body, mind, and soul.
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
                        <p className="text-secondary">Handpicked essentials for your daily wellness routine.</p>
                    </div>

                    <div className="product-grid">
                        {featuredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    <div className="text-center mt-2xl pt-lg">
                        <Link to="/shop" className="btn btn-primary btn-txt btn-txt">View All Products</Link>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="section bg-secondary-light">
                <div className="container">
                    <h2 className="section-title text-center mb-xl">Stories of Healing</h2>
                    <div className="testimonials-grid">
                        <div className="testimonial-card">
                            <div className="stars">★★★★★</div>
                            <p className="mb-md">"I've tried many natural brands, but nothing comes close to the authenticity of Vedayura. The Saffron Night Cream is a game-changer!"</p>
                            <h4 className="font-bold">- Anjali Sharma</h4>
                            <span className="text-xs text-secondary">Verified Buyer</span>
                        </div>
                        <div className="testimonial-card">
                            <div className="stars">★★★★★</div>
                            <p className="mb-md">"Finally found Ashwagandha tablets that are pure and effective. My stress levels have significantly gone down."</p>
                            <h4 className="font-bold">- Rahul Khanna</h4>
                            <span className="text-xs text-secondary">Verified Buyer</span>
                        </div>
                        <div className="testimonial-card">
                            <div className="stars">★★★★★</div>
                            <p className="mb-md">"The hair oil is magic. Hairfall stopped in just 2 weeks. The earthy fragrance tells you it's the real deal."</p>
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
                    <p className="text-white opacity-90 mb-lg">Subscribe to receive holistic health tips, exclusive offers, and early access to new launches.</p>
                    <form className="home-newsletter-form" onSubmit={(e) => e.preventDefault()}>
                        <input type="email" placeholder="Enter your email address" className="border-none" />
                        <button type="submit" className="btn bg-secondary text-white hover-dark">Subscribe</button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default Home;
