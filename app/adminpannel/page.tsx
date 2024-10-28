import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

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
        const response = await fetch('/api/users/transactions');
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();
        setUsers(data.filter((user: User) => user.istransaction));
      } catch (err) {
        setError('Failed to load payment data');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Payment Transactions</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.telegramId} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">
                {user.username || `User ${user.telegramId}`}
              </CardTitle>
            </CardHeader>
            <CardContent>
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
            </CardContent>
          </Card>
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
