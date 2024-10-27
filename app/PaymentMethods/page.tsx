'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './payment.css';

interface PaymentMethod {
  id: string;
  label: string;
  placeholder: string;
  image: string;
  badge?: string;
}

// Removed the problematic global declaration
// We'll just use type assertion when accessing Telegram.WebApp

const PaymentOptions: React.FC = () => {
  const router = useRouter();
  const [visibleInput, setVisibleInput] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [paymentAddress, setPaymentAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [telegramId, setTelegramId] = useState<number | null>(null);

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

  useEffect(() => {
    // Using type assertion to avoid TypeScript errors
    const tg = (window as any).Telegram?.WebApp;
    if (tg) {
      const webAppUser = tg.initDataUnsafe?.user;
      if (webAppUser) {
        setTelegramId(webAppUser.id);
        fetchPaymentData(webAppUser.id);
      }
    }
  }, []);

  const fetchPaymentData = async (userId: number) => {
    try {
      const response = await fetch(`/api/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId })
      });
      const userData = await response.json();
      
      if (userData.paymentMethod && userData.paymentAddress) {
        setSelectedPayment(userData.paymentMethod);
        setPaymentAddress(userData.paymentAddress);
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error fetching payment data:', error);
    }
  };

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
    if (isLoading || !telegramId) return;
    
    setIsLoading(true);
    
    try {
      if (!isConnected) {
        const response = await fetch('/api/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            telegramId,
            paymentMethod: selectedPayment,
            paymentAddress
          })
        });
        const data = await response.json();
        if (data.success) {
          setIsConnected(true);
        }
      } else {
        const response = await fetch('/api/payment', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telegramId })
        });
        const data = await response.json();
        if (data.success) {
          setIsConnected(false);
          setSelectedPayment(null);
          setPaymentAddress('');
          setVisibleInput(null);
        }
      }
    } catch (error) {
      console.error('Error managing payment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    router.push('/verify');
  };

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
