'use client'

import React, { useState } from 'react';
import './page.css';

const PaymentOptions: React.FC = () => {
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

  const [visibleInput, setVisibleInput] = useState<string | null>(null);

  const toggleInput = (id: string) => {
    setVisibleInput((prev) => (prev === id ? null : id));
  };

  return (
    <div className="bg-white h-screen flex flex-col justify-between">
      <div className="p-4">
        <div className="flex items-center mb-4">
          <i className="fas fa-arrow-left text-xl"></i>
          <h1 className="text-xl font-semibold ml-4">Payment Methods</h1>
        </div>
        <div className="space-y-4">
          {paymentMethods.map(({ id, label, placeholder, image }) => (
            <div
              key={id}
              className="flex items-center justify-between p-4 bg-gray-100 rounded-lg cursor-pointer"
              onClick={() => toggleInput(id)}
            >
              <div className="flex items-center">
                <img alt={`${label} logo`} className="w-10 h-10" src={image} />
                <span className="ml-4 text-lg">{label}</span>
              </div>
              <span className="text-purple-600">Connected</span>
            </div>
          ))}

          {paymentMethods.map(({ id, placeholder }) => (
            <div key={`${id}-input`} className={`p-4 bg-gray-100 rounded-lg ${visibleInput === id ? '' : 'hidden'}`}>
              <input
                type="text"
                placeholder={placeholder}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          ))}
        </div>
        <div className="mt-8">
          <button className="w-full py-4 bg-purple-100 text-purple-600 rounded-lg">Add New Card</button>
        </div>
      </div>
      <div className="flex justify-between p-4">
        <button className="w-1/2 py-4 bg-purple-100 text-purple-600 rounded-lg mr-2">Cancel</button>
        <button className="w-1/2 py-4 bg-purple-600 text-white rounded-lg ml-2">Continue</button>
      </div>
    </div>
  );
};

export default PaymentOptions;
