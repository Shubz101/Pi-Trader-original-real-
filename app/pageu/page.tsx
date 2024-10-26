'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function PageU() {
  const router = useRouter()

  useEffect(() => {
    const updatePaymentMethod = async () => {
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp
        const user = tg.initDataUnsafe?.user

        if (user) {
          try {
            await fetch('/api/user', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ ...user, paymentMethod: 'upi' }),
            })
          } catch (error) {
            console.error('Failed to update payment method:', error)
          }
        }
      }
    }

    updatePaymentMethod()
  }, [])

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">UPI Payment Page</h1>
      <p className="text-xl">This is where you would handle UPI payments.</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => router.push('/')}
      >
        Go back to Home
      </button>
    </div>
  )
}
