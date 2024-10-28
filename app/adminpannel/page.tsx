'use client'

import { useEffect, useState } from 'react';

// Type definition for our user data
type User = {
  telegramId: number;
  username: string;
  paymentMethod: string;
  paymentAddress: string;
  piAmount: number[];
  istransaction: boolean;
};

export default function PaymentCardsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Log the fetch attempt
        console.log('Fetching users...');
        
        const response = await fetch('/api/transactions');
        console.log('Response status:', response.status);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch users');
        }
        
        const data = await response.json();
        console.log('Fetched data:', data);
        
        // Filter users with istransaction = true
        const transactionUsers = data.filter((user: User) => user.istransaction);
        console.log('Filtered users:', transactionUsers);
        
        setUsers(transactionUsers);
      } catch (err) {
        console.error('Detailed error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load payment data');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">
          <p>Error: {error}</p>
          <p className="text-sm mt-2">Please check the console for more details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Payment Transactions</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div 
            key={user.telegramId} 
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-4">
              {user.username || `User ${user.telegramId}`}
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Telegram ID:</span>
                <span>{user.telegramId}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Payment Method:</span>
                <span>{user.paymentMethod || 'Not specified'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Payment Address:</span>
                <span className="text-right break-all">
                  {user.paymentAddress || 'Not specified'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Pi Amount:</span>
                <span>{user.piAmount[user.piAmount.length - 1] || 0} Pi</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {users.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No completed transactions found.
        </div>
      )}
    </div>
  );
}
