'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './payment.css';

const PaymentPage = () => {
  const router = useRouter();
  const [openInput, setOpenInput] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [paymentAddress, setPaymentAddress] = useState<string>('');
  const [isAddressConnected, setIsAddressConnected] = useState(false);
  const [isContinueEnabled, setIsContinueEnabled] = useState(false);

  // Check if payment method exists in database on component mount
  useEffect(() => {
    const checkPaymentMethod = async () => {
      try {
        const response = await fetch('/api/user/current'); // You'll need to implement this endpoint
        const userData = await response.json();
        if (userData.paymentMethod) {
          setIsContinueEnabled(true);
        }
      } catch (error) {
        console.error('Error checking payment method:', error);
      }
    };
    checkPaymentMethod();
  }, []);

  const toggleBox = (boxId: string) => {
    setOpenInput(openInput === boxId ? null : boxId);
    setSelectedMethod(boxId);
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentAddress(e.target.value);
  };

  const handleConnectAddress = async () => {
    if (!selectedMethod || !paymentAddress) return;

    try {
      const response = await fetch('/api/user/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegramId: 123, // Replace with actual telegram ID from your auth context
          paymentMethod: selectedMethod,
          paymentAddress: paymentAddress,
        }),
      });

      if (response.ok) {
        setIsAddressConnected(true);
        setIsContinueEnabled(true);
      }
    } catch (error) {
      console.error('Error connecting payment address:', error);
    }
  };

  const handleContinue = () => {
    if (isContinueEnabled) {
      router.push('/verify');
    }
  };

  const getPaymentMethodName = (method: string) => {
    const methodMap: { [key: string]: string } = {
      'paypal': 'Binance',
      'googlepay': 'Kucoin',
      'applepay': 'Trust Wallet',
      'mastercard': 'UPI'
    };
    return methodMap[method] || method;
  };

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <div className="header">
          <i className="fas fa-arrow-left"></i>
          <h1>Payment Methods</h1>
        </div>
        
        <div className="payment-methods">
          {['paypal', 'googlepay', 'applepay', 'mastercard'].map((method) => (
            <React.Fragment key={method}>
              <div 
                id={`${method}-box`} 
                className="payment-box" 
                onClick={() => toggleBox(method)}
              >
                <div className="payment-info">
                  <img 
                    alt={`${getPaymentMethodName(method)} logo`} 
                    src={`https://storage.googleapis.com/a1aa/image/${method}.jpg`}
                  />
                  <span>{getPaymentMethodName(method)}</span>
                </div>
                <span className="status">
                  {selectedMethod === method && isAddressConnected ? 'Connected' : 'Not Connected'}
                </span>
              </div>
              <div 
                id={`${method}-input`} 
                className={`payment-input ${openInput !== method ? 'hidden' : ''}`}
              >
                <input 
                  type="text" 
                  placeholder={`Enter ${getPaymentMethodName(method)} address`}
                  onChange={handleAddressChange}
                  value={selectedMethod === method ? paymentAddress : ''}
                />
              </div>
            </React.Fragment>
          ))}
        </div>

        <div className="connect-button">
          <button 
            onClick={handleConnectAddress}
            disabled={!selectedMethod || !paymentAddress}
          >
            Connect Payment Address
          </button>
        </div>
      </div>

      <div className="bottom-buttons">
        <button className="cancel-button">Cancel</button>
        <button 
          className={`continue-button ${isContinueEnabled ? 'enabled' : ''}`}
          onClick={handleContinue}
          disabled={!isContinueEnabled}
        >
          {isContinueEnabled ? 'Next Step' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
