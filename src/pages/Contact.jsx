import React from 'react';
import PageHeader from '../components/PageHeader';
import ContactInfo from '../components/ContactInfo';
import ContactForm from '../components/ContactForm';
import MapSection from '../components/MapSection';
import './Contact.css';

const Contact = () => {
    return (
        <div className="contact-page">
            {/* Hero Section */}
            <PageHeader
                title="Get in Touch"
                description="We'd love to hear from you. Our team is always here to help."
            />

            <section className="contact-content container">
                <div className="contact-grid">
                    {/* Contact Information */}
                    <ContactInfo />

                    {/* Contact Form */}
                    <ContactForm />
                </div>
            </section>

            {/* Map Section */}
            <MapSection />
        </div>
    );
};

export default Contact;
