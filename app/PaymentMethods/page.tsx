'use client'

import React, { useState } from 'react';
import './payment.css';

const PaymentPage = () => {
  const [openInput, setOpenInput] = useState<string | null>(null);

  const toggleBox = (boxId: string) => {
    setOpenInput(openInput === boxId ? null : boxId);
  };

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <div className="header">
          <i className="fas fa-arrow-left"></i>
          <h1>Payment Methods</h1>
        </div>
        
        <div className="payment-methods">
          <div id="paypal-box" className="payment-box" onClick={() => toggleBox('paypal')}>
            <div className="payment-info">
              <img alt="PayPal logo" src="https://storage.googleapis.com/a1aa/image/LM00lHy4e4VEfEwshfXBUMcJYM0B328inIsGRj7TYfhafrHdC.jpg"/>
              <span>Binance</span>
            </div>
            <span className="status">Not Connected</span>
          </div>
          <div id="paypal-input" className={`payment-input ${openInput !== 'paypal' ? 'hidden' : ''}`}>
            <input type="text" placeholder="Enter PayPal address"/>
          </div>

          <div id="googlepay-box" className="payment-box" onClick={() => toggleBox('googlepay')}>
            <div className="payment-info">
              <img alt="Google Pay logo" src="https://storage.googleapis.com/a1aa/image/SvKY98RDkvYhENmLE9Ukt5u94yGsWNixkJM5U691UbdeveoTA.jpg"/>
              <span>Kucoin</span>
            </div>
            <span className="status">Not Connected</span>
          </div>
          <div id="googlepay-input" className={`payment-input ${openInput !== 'googlepay' ? 'hidden' : ''}`}>
            <input type="text" placeholder="Enter Google Pay address"/>
          </div>

          <div id="applepay-box" className="payment-box" onClick={() => toggleBox('applepay')}>
            <div className="payment-info">
              <img alt="Apple Pay logo" src="https://storage.googleapis.com/a1aa/image/YqpCh7xg0Ab9N17SKmdPm6cBYfCqsSwebOnsx553IeS1f1jOB.jpg"/>
              <span>Trust Wallet</span>
            </div>
            <span className="status">Not Connected</span>
          </div>
          <div id="applepay-input" className={`payment-input ${openInput !== 'applepay' ? 'hidden' : ''}`}>
            <input type="text" placeholder="Enter Apple Pay address"/>
          </div>

          <div id="mastercard-box" className="payment-box" onClick={() => toggleBox('mastercard')}>
            <div className="payment-info">
              <img alt="Mastercard logo" src="https://storage.googleapis.com/a1aa/image/XBvmqXf3efCHMIrLcbgQfNciUh1kUfjmogYgjIg8xeoIeveoTA.jpg"/>
              <span>Upi</span>
            </div>
            <span className="status">Not Connected</span>
          </div>
          <div id="mastercard-input" className={`payment-input ${openInput !== 'mastercard' ? 'hidden' : ''}`}>
            <input type="text" placeholder="Enter Mastercard details"/>
          </div>
        </div>

        <div className="connect-button">
          <button>Connect Payment Address</button>
        </div>
      </div>

      <div className="bottom-buttons">
        <button className="cancel-button">Cancel</button>
        <button className="continue-button">Continue</button>
      </div>
    </div>
  );
};

export default PaymentPage;
