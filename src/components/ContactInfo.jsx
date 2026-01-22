import React from 'react';
import { Mail, Phone, MapPin, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import InfoCard from './InfoCard';

const ContactInfo = () => {
    const contactInfo = [
        {
            icon: <Phone size={24} />,
            title: "Call Us",
            details: "+91 98765 43210",
            subDetails: "Mon-Sat, 9am - 6pm"
        },
        {
            icon: <Mail size={24} />,
            title: "Email Us",
            details: "care@vedayura.com",
            subDetails: "We reply within 24 hours"
        },
        {
            icon: <MapPin size={24} />,
            title: "Visit Us",
            details: "123, Ayurveda Park,",
            subDetails: "Kerala, India - 682001"
        }
    ];

    return (
        <motion.div
            className="contact-info-wrapper"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
        >
            <h2>Contact Information</h2>
            <p className="info-intro">
                Have a question about our products or need consultation? Reach out to us through any of the following channels.
            </p>

            <div className="info-cards">
                {contactInfo.map((info, index) => (
                    <InfoCard
                        key={index}
                        icon={info.icon}
                        title={info.title}
                        details={info.details}
                        subDetails={info.subDetails}
                    />
                ))}
            </div>

            {/* <div className="faq-teaser">
                <h3><MessageSquare size={20} /> Quick Answers</h3>
                <p>Check our FAQ section for immediate answers to common questions about shipping, returns, and product usage.</p>
                <a href="/faq" className="text-link">Visit FAQ Center &rarr;</a>
            </div> */}
        </motion.div>
    );
};

export default ContactInfo;
