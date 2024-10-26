'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './payment.css';

interface PaymentMethod {
  id: string;
  label: string;
  placeholder: string;
  image: string;
  highRate?: boolean;
}

const PaymentOptions: React.FC = () => {
  const router = useRouter();
  const [visibleInput, setVisibleInput] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [paymentAddress, setPaymentAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      id: 'binance',
      label: 'Binance',
      placeholder: 'Enter Binance details',
      image: 'https://storage.googleapis.com/a1aa/image/XBvmqXf3efCHMIrLcbgQfNciUh1kUfjmogYgjIg8xeoIeveoTA.jpg',
      highRate: true,
    },
  ];

  const toggleInput = (id: string) => {
    if (!isConnected && !isLoading) {
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
    
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsConnected(!isConnected);
    setIsLoading(false);
  };

  const handleContinue = () => {
    router.push('/verify');
  };

  const handleBack = () => {
    router.push('/');
  };

  const isValidPaymentAddress = paymentAddress.length > 0;
  const canConnect = selectedPayment && isValidPaymentAddress && !isConnected && !isLoading;
  const canContinue = isConnected;

  return (
    <div className="payment-container">
      <div className="payment-content">
        <div className="payment-header">
          <i className="fas fa-arrow-left header-icon" onClick={handleBack}></i>
          <h1 className="header-title">Payment Methods</h1>
        </div>

        <div className="payment-methods-list">
          {paymentMethods.map(({ id, label, placeholder, image, highRate }) => (
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
                    {highRate && <span className="high-rate-badge">High Rate</span>}
                    <span className="payment-method-label">{label}</span>
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
              canConnect || isConnected ? 'button-active' : 'button-disabled'
            } ${isLoading ? 'button-loading' : ''}`}
            onClick={handleConnectPayment}
            disabled={(!canConnect && !isConnected) || isLoading}
          >
            {isLoading ? 'Processing...' : isConnected ? 'Disconnect Payment Method' : 'Connect Payment Method'}
          </button>
        </div>
      </div>

      <div className="bottom-buttons">
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
