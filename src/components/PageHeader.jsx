import React from 'react';
import { motion } from 'framer-motion';
import '../pages/Contact.css'; // Reusing the exist styles for now

const PageHeader = ({ title, description }) => {
    return (
        <section className="contact-hero">
            <motion.div
                className="container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1>{title}</h1>
                {description && <p>{description}</p>}
            </motion.div>
        </section>
    );
};

export default PageHeader;
