import React from 'react';
import '../pages/Contact.css'; // Reusing existing styles if needed or we can override inline for iframe

const MapSection = () => {
    return (
        <section className="map-section">
            <div style={{ width: '100%', height: '100%', display: 'flex' }}>
                <iframe
                    title="Vedayura Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.0883101890184!2d76.2711!3d9.9312!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d514abec6bf%3A0xbd582caa5844192!2sKochi%2C%20Kerala%2C%20India!5e0!3m2!1sen!2sus!4v1625482354890!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                ></iframe>
            </div>
        </section>
    );
};

export default MapSection;
