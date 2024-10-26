'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import './page.css';

const PaymentOptions = () => {
  const router = useRouter();
  const [visibleInput, setVisibleInput] = useState<string | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
  const [paymentAddress, setPaymentAddress] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);

  const paymentMethods = [
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
    <div className="bg-white h-screen flex flex-col justify-between">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <i className="fas fa-arrow-left text-xl"></i>
          <h1 className="text-xl font-semibold ml-4">Payment Methods</h1>
        </div>
        <div className="space-y-4">
          {paymentMethods.map(({ id, label, placeholder, image }) => (
            <div key={id}>
              <div
                className={`flex items-center justify-between p-4 rounded-lg cursor-pointer transition-colors duration-300 ${
                  isConnected && selectedPayment === id
                    ? 'bg-green-100'
                    : isConnected
                    ? 'bg-gray-200 cursor-not-allowed'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => toggleInput(id)}
              >
                <div className="flex items-center">
                  <img alt={`${label} logo`} className="w-10 h-10" src={image} />
                  <span className="ml-4 text-lg">{label}</span>
                </div>
                <span className={`${isConnected && selectedPayment === id ? 'text-green-600' : 'text-purple-600'}`}>
                  {isConnected && selectedPayment === id ? 'Connected' : 'Select'}
                </span>
              </div>

              {visibleInput === id && !isConnected && (
                <div className="p-4 bg-gray-100 rounded-lg mt-2">
                  <input
                    type="text"
                    placeholder={placeholder}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:border-purple-600 outline-none"
                    value={paymentAddress}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-8">
          <button
            className={`w-full py-4 rounded-lg transition-colors duration-300 ${
              canConnect || isConnected
                ? 'bg-purple-600 text-white hover:bg-purple-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleConnectPayment}
            disabled={!canConnect && !isConnected}
          >
            {isConnected ? 'Disconnect Payment Method' : 'Connect Payment Method'}
          </button>
        </div>
      </div>
      <div className="flex justify-between p-4">
        <button className="w-1/2 py-4 bg-purple-100 text-purple-600 rounded-lg mr-2">
          Cancel
        </button>
        <button
          className={`w-1/2 py-4 rounded-lg ml-2 transition-colors duration-300 ${
            canContinue
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
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
