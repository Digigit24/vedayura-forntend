import React from 'react';
import '../pages/Contact.css';

const FormInput = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    placeholder,
    required = false,
    rows,
    as = 'input' // 'input' or 'textarea'
}) => {
    return (
        <div className="form-group">
            <label>{label}</label>
            {as === 'textarea' ? (
                <textarea
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    rows={rows || 5}
                    required={required}
                ></textarea>
            ) : (
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    required={required}
                />
            )}
        </div>
    );
};

export default FormInput;
