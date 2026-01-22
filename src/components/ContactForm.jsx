import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import FormInput from './FormInput';

const ContactForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [formStatus, setFormStatus] = useState('idle'); // idle, submitting, success, error

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormStatus('submitting');

        // Simulate API call
        setTimeout(() => {
            setFormStatus('success');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setTimeout(() => setFormStatus('idle'), 3000);
        }, 1500);
    };

    return (
        <motion.div
            className="contact-form-wrapper"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
        >
            <form onSubmit={handleSubmit} className="contact-form">
                <h2>Send us a Message</h2>

                <FormInput
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                />

                <FormInput
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    required
                />

                <FormInput
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    required
                />

                <FormInput
                    label="Message"
                    as="textarea"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Write your message here..."
                    rows={4}
                    required
                />

                <button
                    type="submit"
                    className={`submit-btn ${formStatus}`}
                    disabled={formStatus === 'submitting' || formStatus === 'success'}
                >
                    {formStatus === 'submitting' ? (
                        <span className="loading-spinner"></span>
                    ) : formStatus === 'success' ? (
                        "Message Sent!"
                    ) : (
                        <>Send Message <Send size={18} /></>
                    )}
                </button>
            </form>
        </motion.div>
    );
};

export default ContactForm;
