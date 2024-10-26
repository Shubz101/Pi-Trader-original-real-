'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './page.css';

interface PaymentMethod {
  id: string;
  label: string;
  placeholder: string;
  image: string;
}

const PaymentOptions: React.FC = () => {
  const router = useRouter();
  const [visibleInput, setVisibleInput] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [paymentAddress, setPaymentAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);

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
    },
    {
      id: 'mastercard',
      label: '•••• 2766',
      placeholder: 'Enter Mastercard details',
      image: 'https://storage.googleapis.com/a1aa/image/XBvmqXf3efCHMIrLcbgQfNciUh1kUfjmogYgjIg8xeoIeveoTA.jpg',
    },
  ];

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

  const handleConnectPayment = () => {
    setIsConnected(!isConnected);
  };

  const handleContinue = () => {
    router.push('/verify');
  };

  const isValidPaymentAddress = paymentAddress.length > 0;
  const canConnect = selectedPayment && isValidPaymentAddress && !isConnected;
  const canContinue = isConnected;

  return (
    <div className="payment-container">
      <div className="payment-header">
        <div className="header-content">
          <i className="fas fa-arrow-left back-icon"></i>
          <h1 className="page-title">Payment Methods</h1>
        </div>
        
        <div className="payment-methods">
          {paymentMethods.map(({ id, label, placeholder, image }) => (
            <div key={id}>
              <div
                className={`payment-method-box ${
                  isConnected && selectedPayment === id
                    ? 'connected'
                    : isConnected
                    ? 'disabled'
                    : ''
                }`}
                onClick={() => toggleInput(id)}
              >
                <div className="payment-method-info">
                  <img alt={`${label} logo`} className="payment-logo" src={image} />
                  <span className="payment-label">{label}</span>
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
              canConnect || isConnected ? 'active' : 'disabled'
            }`}
            onClick={handleConnectPayment}
            disabled={!canConnect && !isConnected}
          >
            {isConnected ? 'Disconnect Payment Method' : 'Connect Payment Method'}
          </button>
        </div>
      </div>

      <div className="action-buttons">
        <button className="cancel-button">
          Cancel
        </button>
        <button
          className={`continue-button ${canContinue ? 'active' : 'disabled'}`}
          onClick={handleContinue}
          disabled={!canContinue}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default page;
