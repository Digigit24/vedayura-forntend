import React from 'react';
import '../pages/Contact.css'; // Reusing styles

const InfoCard = ({ icon, title, details, subDetails }) => {
    return (
        <div className="info-card">
            <div className="icon-box">
                {icon}
            </div>
            <div className="info-text">
                <h3>{title}</h3>
                <p className="main-detail">{details}</p>
                <p className="sub-detail">{subDetails}</p>
            </div>
        </div>
    );
};

export default InfoCard;
