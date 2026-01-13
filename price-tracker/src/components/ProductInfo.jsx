import React from 'react';

const ProductInfo = ({ title, asin, price, lastChecked }) => {
    return (
        <div className="product-info">
            <h2>{title}</h2>
            <div className="product-details">
                <p><strong>ASIN:</strong> {asin}</p>
                <p><strong>Current Price:</strong> {price}</p>
                <p><strong>Last Checked:</strong> {lastChecked}</p>
            </div>
        </div>
    );
};

export default ProductInfo;
