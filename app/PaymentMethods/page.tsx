'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './payment.css';

interface PaymentMethod {
  id: string;
  label: string;
  placeholder: string;
  image: string;
  badge?: string;
}

const PaymentOptions: React.FC = () => {
  const router = useRouter();
  const [visibleInput, setVisibleInput] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [paymentAddress, setPaymentAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Payment methods data
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'paypal',
      label: 'PayPal',
      placeholder: 'Enter PayPal address',
      image: 'https://storage.googleapis.com/a1aa/image/LM00lHy4e4VEfEwshfXBUMcJYM0B328inIsGRj7TYfhafrHdC.jpg',
    },
    {
      id: 'googlepay',
      label: 'Google Pay',
      placeholder: 'Enter Google Pay address',
      image: 'https://storage.googleapis.com/a1aa/image/SvKY98RDkvYhENmLE9Ukt5u94yGsWNixkJM5U691UbdeveoTA.jpg',
    },
    {
      id: 'applepay',
      label: 'Apple Pay',
      placeholder: 'Enter Apple Pay address',
      image: 'https://storage.googleapis.com/a1aa/image/YqpCh7xg0Ab9N17SKmdPm6cBYfCqsSwebOnsx553IeS1f1jOB.jpg',
      badge: 'High Rate'
    },
    {
      id: 'mastercard',
      label: '•••• 2766',
      placeholder: 'Enter Mastercard details',
      image: 'https://storage.googleapis.com/a1aa/image/XBvmqXf3efCHMIrLcbgQfNciUh1kUfjmogYgjIg8xeoIeveoTA.jpg',
    },
  ];

  // Handler functions
  const handleBack = () => {
    router.push('/');
  };

  const toggleInput = (id: string) => {
    if (!isConnected) {
      setVisibleInput(prev => prev === id ? null : id);
      setSelectedPayment(id);
      setPaymentAddress('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentAddress(e.target.value);
  };

  const handleConnectPayment = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call with 2-second delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsConnected(!isConnected);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    router.push('/verify');
  };

  // Computed properties
  const isValidPaymentAddress = paymentAddress.length > 0;
  const canConnect = selectedPayment && isValidPaymentAddress && !isConnected;
  const canContinue = isConnected;

  return (
    <div className="payment-container">
      <div className="payment-content">
        <div className="payment-header">
          <i 
            className="fas fa-arrow-left header-icon clickable" 
            onClick={handleBack}
          ></i>
          <h1 className="header-title">Payment Methods</h1>
        </div>

        <div className="payment-methods-list">
          {paymentMethods.map(({ id, label, placeholder, image, badge }) => (
            <div key={id}>
              <div
                className={`payment-method-box ${
                  isConnected && selectedPayment === id
                    ? 'payment-method-connected'
                    : isConnected
                    ? 'payment-method-disabled'
                    : ''
                }`}
                onClick={() => toggleInput(id)}
              >
                <div className="payment-method-info">
                  <img alt={`${label} logo`} className="payment-method-image" src={image} />
                  <div className="payment-method-details">
                    <span className="payment-method-label">{label}</span>
                    {badge && <span className="payment-method-badge">{badge}</span>}
                  </div>
                </div>
                <span className={`payment-status ${
                  isConnected && selectedPayment === id ? 'status-connected' : ''
                }`}>
                  {isConnected && selectedPayment === id ? 'Connected' : 'Select'}
                </span>
              </div>

              {visibleInput === id && !isConnected && (
                <div className="payment-input-container">
                  <input
                    type="text"
                    placeholder={placeholder}
                    className="payment-input"
                    value={paymentAddress}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="connect-button-container">
          <button
            className={`connect-button ${
              (canConnect || isConnected) ? 'button-active' : 'button-disabled'
            } ${isLoading ? 'button-loading' : ''}`}
            onClick={handleConnectPayment}
            disabled={(!canConnect && !isConnected) || isLoading}
          >
            {isLoading ? 'Processing...' : (isConnected ? 'Disconnect Payment Method' : 'Connect Payment Method')}
          </button>
        </div>
      </div>

      <div className="bottom-buttons">
        <button 
          className="cancel-button"
          onClick={handleBack}
        >
          Cancel
        </button>
        <button
          className={`continue-button ${canContinue ? 'button-active' : 'button-disabled'}`}
          onClick={handleContinue}
          disabled={!canContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default PaymentOptions;
