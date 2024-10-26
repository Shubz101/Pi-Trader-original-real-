import React, { useState } from 'react';
import type { NextPage } from 'next';
import './page.css';

interface PaymentMethod {
  id: string;
  name: string;
  logo: string;
  placeholder: string;
  value?: string;
}

const Page: NextPage = () => {
  const [activeInput, setActiveInput] = useState<string | null>(null);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'paypal',
      name: 'PayPal',
      logo: 'https://storage.googleapis.com/a1aa/image/LM00lHy4e4VEfEwshfXBUMcJYM0B328inIsGRj7TYfhafrHdC.jpg',
      placeholder: 'Enter PayPal address'
    },
    {
      id: 'googlepay',
      name: 'Google Pay',
      logo: 'https://storage.googleapis.com/a1aa/image/SvKY98RDkvYhENmLE9Ukt5u94yGsWNixkJM5U691UbdeveoTA.jpg',
      placeholder: 'Enter Google Pay address'
    },
    {
      id: 'applepay',
      name: 'Apple Pay',
      logo: 'https://storage.googleapis.com/a1aa/image/YqpCh7xg0Ab9N17SKmdPm6cBYfCqsSwebOnsx553IeS1f1jOB.jpg',
      placeholder: 'Enter Apple Pay address'
    },
    {
      id: 'mastercard',
      name: '•••• 2766',
      logo: 'https://storage.googleapis.com/a1aa/image/XBvmqXf3efCHMIrLcbgQfNciUh1kUfjmogYgjIg8xeoIeveoTA.jpg',
      placeholder: 'Enter Mastercard details'
    }
  ];

  const toggleBox = (id: string) => {
    setActiveInput(activeInput === id ? null : id);
  };

  return (
    <div className="payment-container">
      <div className="payment-content">
        <div className="header">
          <i className="fas fa-arrow-left back-arrow" />
          <h1 className="title">Payment Methods</h1>
        </div>
        
        <div className="payment-methods">
          {paymentMethods.map((method) => (
            <div key={method.id}>
              <div 
                className="payment-box"
                onClick={() => toggleBox(method.id)}
              >
                <div className="payment-info">
                  <img
                    src={method.logo}
                    alt={`${method.name} logo`}
                    className="payment-logo"
                    width="40"
                    height="40"
                  />
                  <span className="payment-name">{method.name}</span>
                </div>
                <span className="connection-status">Connected</span>
              </div>
              
              <div className={`payment-input ${activeInput === method.id ? '' : 'hidden'}`}>
                <input
                  type="text"
                  placeholder={method.placeholder}
                  className="input-field"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="add-card-container">
          <button className="add-card-button">
            Add New Card
          </button>
        </div>
      </div>

      <div className="action-buttons">
        <button className="cancel-button">
          Cancel
        </button>
        <button className="continue-button">
          Continue
        </button>
      </div>
    </div>
  );
};

export default Page;
