'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './payment.css';

const PaymentPage = () => {
  const router = useRouter();
  const [openInput, setOpenInput] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [paymentAddress, setPaymentAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Fetch user data when component mounts
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          
          // If user already has a payment method, set the connected state
          if (data.isPaymentMethod) {
            setIsConnected(true);
            setPaymentAddress(data.paymentAddress || '');
            setSelectedPayment(data.paymentMethod || '');
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const toggleBox = (boxId: string) => {
    setOpenInput(openInput === boxId ? null : boxId);
    setSelectedPayment(getPaymentMethod(boxId));
  };

  const getPaymentMethod = (boxId: string) => {
    switch(boxId) {
      case 'paypal': return 'binance';
      case 'googlepay': return 'kucoin';
      case 'applepay': return 'trust_wallet';
      case 'mastercard': return 'upi';
      default: return '';
    }
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentAddress(e.target.value);
  };

  const handleConnectPayment = async () => {
    if (!selectedPayment || !paymentAddress || !userData?.telegramId) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          telegramId: userData.telegramId,
          paymentMethod: selectedPayment,
          paymentAddress: paymentAddress,
        }),
      });

      if (response.ok) {
        setIsConnected(true);
      }
    } catch (error) {
      console.error('Error connecting payment:', error);
    }
    setIsLoading(false);
  };

  const handleContinue = () => {
    if (isConnected) {
      router.push('/verify');
    }
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
            <span className="status">
              {userData?.paymentMethod === 'binance' ? 'Connected' : 
               openInput === 'paypal' ? 'Selected' : 'Not Connected'}
            </span>
          </div>
          <div id="paypal-input" className={`payment-input ${openInput !== 'paypal' ? 'hidden' : ''}`}>
            <input 
              type="text" 
              placeholder="Enter Binance address"
              onChange={handleAddressChange}
              value={userData?.paymentMethod === 'binance' ? userData.paymentAddress : 
                     openInput === 'paypal' ? paymentAddress : ''}
            />
          </div>

          <div id="googlepay-box" className="payment-box" onClick={() => toggleBox('googlepay')}>
            <div className="payment-info">
              <img alt="Google Pay logo" src="https://storage.googleapis.com/a1aa/image/SvKY98RDkvYhENmLE9Ukt5u94yGsWNixkJM5U691UbdeveoTA.jpg"/>
              <span>Kucoin</span>
            </div>
            <span className="status">
              {userData?.paymentMethod === 'kucoin' ? 'Connected' : 
               openInput === 'googlepay' ? 'Selected' : 'Not Connected'}
            </span>
          </div>
          <div id="googlepay-input" className={`payment-input ${openInput !== 'googlepay' ? 'hidden' : ''}`}>
            <input 
              type="text" 
              placeholder="Enter Kucoin address"
              onChange={handleAddressChange}
              value={userData?.paymentMethod === 'kucoin' ? userData.paymentAddress :
                     openInput === 'googlepay' ? paymentAddress : ''}
            />
          </div>

          <div id="applepay-box" className="payment-box" onClick={() => toggleBox('applepay')}>
            <div className="payment-info">
              <img alt="Apple Pay logo" src="https://storage.googleapis.com/a1aa/image/YqpCh7xg0Ab9N17SKmdPm6cBYfCqsSwebOnsx553IeS1f1jOB.jpg"/>
              <span>Trust Wallet</span>
            </div>
            <span className="status">
              {userData?.paymentMethod === 'trust_wallet' ? 'Connected' : 
               openInput === 'applepay' ? 'Selected' : 'Not Connected'}
            </span>
          </div>
          <div id="applepay-input" className={`payment-input ${openInput !== 'applepay' ? 'hidden' : ''}`}>
            <input 
              type="text" 
              placeholder="Enter Trust Wallet address"
              onChange={handleAddressChange}
              value={userData?.paymentMethod === 'trust_wallet' ? userData.paymentAddress :
                     openInput === 'applepay' ? paymentAddress : ''}
            />
          </div>

          <div id="mastercard-box" className="payment-box" onClick={() => toggleBox('mastercard')}>
            <div className="payment-info">
              <img alt="Mastercard logo" src="https://storage.googleapis.com/a1aa/image/XBvmqXf3efCHMIrLcbgQfNciUh1kUfjmogYgjIg8xeoIeveoTA.jpg"/>
              <span>Upi</span>
            </div>
            <span className="status">
              {userData?.paymentMethod === 'upi' ? 'Connected' : 
               openInput === 'mastercard' ? 'Selected' : 'Not Connected'}
            </span>
          </div>
          <div id="mastercard-input" className={`payment-input ${openInput !== 'mastercard' ? 'hidden' : ''}`}>
            <input 
              type="text" 
              placeholder="Enter UPI address"
              onChange={handleAddressChange}
              value={userData?.paymentMethod === 'upi' ? userData.paymentAddress :
                     openInput === 'mastercard' ? paymentAddress : ''}
            />
          </div>
        </div>

        <div className="connect-button">
          <button 
            onClick={handleConnectPayment}
            disabled={!selectedPayment || !paymentAddress || isLoading || !userData}
          >
            {isLoading ? 'Connecting...' : 'Connect Payment Address'}
          </button>
        </div>
      </div>

      <div className="bottom-buttons">
        <button className="cancel-button">Cancel</button>
        <button 
          className="continue-button"
          disabled={!isConnected}
          onClick={handleContinue}
        >
          {isConnected ? 'Next Step' : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
