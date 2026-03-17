import "./TopMarquee.css";

const items = [
  "Free Shipping on orders above ₹999",
  "100% Natural & Ayurvedic Ingredients",
  "Certified & Lab Tested Products",
  "New Arrivals — Shop the Collection",
  "Authentic Vedic Wellness Products",
  "Easy Returns within 7 Days",
];

const TopMarquee = () => {
  const text = items.map((item, i) => (
    <span key={i} className="marquee-item">
      {item} <span className="marquee-dot">✦</span>
    </span>
  ));

  return (
    <div className="top-marquee">
      <div className="marquee-track">
        {text}
        {text}
      </div>
    </div>
  );
};

export default TopMarquee;
