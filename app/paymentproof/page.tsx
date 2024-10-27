import React, { useState, useRef } from 'react';
import Link from 'next/link';

const PaymentProof = () => {
  const [piAmount, setPiAmount] = useState('');
  const [imageUploaded, setImageUploaded] = useState(false);
  const [copied, setCopied] = useState(false);
  const walletAddress = 'GHHHjJhGgGfFfHjIuYrDc';
  const fileInputRef = useRef(null);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageUploaded(true);
    }
  };

  const calculateUSDT = (pi) => {
    const amount = parseFloat(pi);
    return amount ? (amount * 0.65).toFixed(2) : '0.00';
  };

  const isButtonEnabled = piAmount && imageUploaded;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <div className="w-full bg-[#670773] text-white p-4 shadow-lg">
        <h1 className="text-2xl font-bold text-center">Pi Trader</h1>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="space-y-6">
          {/* Wallet Section */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-lg font-semibold text-[#670773] mb-3">
              Send your Pi to this wallet address
            </h2>
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-100 p-3 rounded-lg font-mono text-sm break-all">
                {walletAddress}
              </div>
              <button
                onClick={handleCopyAddress}
                className="bg-[#670773] text-white p-2 rounded-lg hover:bg-[#7a1b86] transition-colors"
              >
                {copied ? (
                  <i className="fas fa-check text-lg"></i>
                ) : (
                  <i className="fas fa-copy text-lg"></i>
                )}
              </button>
            </div>
          </div>

          {/* Amount Section */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-lg font-semibold text-[#670773] mb-3">
              How many Pi you want to sell?
            </h2>
            <input
              type="number"
              value={piAmount}
              onChange={(e) => setPiAmount(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#670773]"
              placeholder="Enter amount"
            />
            {piAmount && (
              <p className="mt-3 text-[#670773] font-medium">
                You will receive {calculateUSDT(piAmount)} USDT
              </p>
            )}
          </div>

          {/* Image Upload Section */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-lg font-semibold text-[#670773] mb-3">
              Payment Proof Screenshot
            </h2>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                ${imageUploaded ? 'border-[#670773] bg-purple-50' : 'border-gray-300'}`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              {imageUploaded ? (
                <div className="text-[#670773]">
                  <i className="fas fa-check-circle text-3xl mb-2"></i>
                  <p>Image uploaded successfully</p>
                </div>
              ) : (
                <div className="text-gray-500">
                  <i className="fas fa-cloud-upload-alt text-3xl mb-2"></i>
                  <p>Click to upload screenshot</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-8 flex justify-end">
          <Link href="/next-page">
            <button
              disabled={!isButtonEnabled}
              className={`px-8 py-3 rounded-full text-white font-bold text-lg transition-all
                ${isButtonEnabled 
                  ? 'bg-[#670773] hover:bg-[#7a1b86] transform hover:scale-105'
                  : 'bg-gray-400 cursor-not-allowed'}`}
            >
              Continue
            </button>
          </Link>
        </div>
      </div>

      {/* Notification for copy */}
      {copied && (
        <div className="fixed bottom-4 right-4 bg-[#670773] text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          Address copied!
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default PaymentProof;
