'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { WebApp } from '@twa-dev/types'
import Script from 'next/script'

declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp
    }
  }
}

interface Transaction {
  piAmount: number
  paymentMethod: string
  paymentAddress: string
  status: string
  piAddress: string
  amountToReceive: number
}

interface User {
  piAmount: number[]
  paymentMethod: string[]
  paymentAddress: string[]
  transactionStatus: string[]
  piaddress: string[]
  level: number
  points: number
  totalPiSold: number
  xp: number
  baseprice: number
}

export default function TransactionHistory() {
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [expandedCards, setExpandedCards] = useState<number[]>([])

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()

      const initDataUnsafe = tg.initDataUnsafe || {}

      if (initDataUnsafe.user) {
        fetch('/api/user', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(initDataUnsafe.user),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              setError(data.error)
            } else {
              setUser(data)
            }
          })
          .catch((err) => {
            setError('Failed to fetch user data')
          })
          .finally(() => {
            setLoading(false)
          })
      } else {
        setError('No user data available')
        setLoading(false)
      }
    } else {
      setError('This App Should Be Opened On Telegram')
      setLoading(false)
    }
  }, [])

  const toggleCard = (index: number) => {
    setExpandedCards(prev => 
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const getStatusInfo = (status: string) => {
    switch (status.toLowerCase()) {
      case 'processing':
        return {
          color: 'text-yellow-500',
          icon: 'fas fa-spinner fa-spin',
          text: 'Processing'
        }
      case 'completed':
        return {
          color: 'text-green-500',
          icon: 'fas fa-check-circle',
          text: 'Completed'
        }
      case 'failed':
        return {
          color: 'text-red-500',
          icon: 'fas fa-times-circle',
          text: 'Failed'
        }
      default:
        return {
          color: 'text-gray-500',
          icon: 'fas fa-question-circle',
          text: 'Unknown'
        }
    }
  }

  const getPaymentBonus = (paymentMethod: string): number => {
    switch (paymentMethod.toLowerCase()) {
      case 'paypal':
        return 0.28;
      case 'googlepay':
        return 0.25;
      case 'applepay':
        return 0.15;
      default:
        return 0;
    }
  }

  const getLevelBonus = (level: number): number => {
    switch (level) {
      case 2:
        return 0.01;
      case 3:
        return 0.03;
      case 4:
        return 0.05;
      case 5:
        return 0.07;
      case 6:
        return 0.1;
      default:
        return 0;
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center h-screen">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-red-500 flex items-center justify-center h-screen fade-in">
        {error}
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto p-4 flex items-center justify-center h-screen">
        <div className="loading-spinner"></div>
      </div>
    )
  }

  const transactions = user.piAmount.map((amount, index) => ({
    piAmount: amount,
    paymentMethod: user.paymentMethod[index] || '',
    paymentAddress: user.paymentAddress[index] || '',
    status: user.transactionStatus[index] || 'processing',
    piAddress: user.piaddress[index] || '',
    amountToReceive: (
      user.baseprice +
      getPaymentBonus(user.paymentMethod[index] || '') +
      getLevelBonus(user.level)
    ) * amount
  }))

  return (
    <div className={`bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen ${mounted ? 'fade-in' : ''}`}>
      <Script src="https://kit.fontawesome.com/18e66d329f.js"/>
      
      <div className="w-full custom-purple text-white p-4 flex items-center justify-between shadow-lg slide-down">
        <Link href="/">
          <button className="focus:outline-none hover-scale">
            <i className="fas fa-arrow-left text-2xl"></i>
          </button>
        </Link>
        <h1 className="text-2xl font-bold">Transaction History</h1>
        <div></div>
      </div>

      <div className="container mx-auto p-4 mb-4">
        <div className="bg-white rounded-lg shadow-lg p-4 space-y-2 fade-in-up">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Level:</span>
            <span className="font-bold custom-purple-text">{user.level}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Pi Sold:</span>
            <span className="font-bold custom-purple-text">{user.piAmount.reduce((total, amount) => total + amount, 0)} Pi</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Points:</span>
            <span className="font-bold custom-purple-text">{user.points}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">XP:</span>
            <span className="font-bold custom-purple-text">{user.xp}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4 space-y-4">
        {transactions.length === 0 ? (
          <div className="text-center text-gray-500 mt-8 fade-in-up">
            No transactions yet
          </div>
        ) : (
          [...transactions].reverse().map((transaction, index) => {
            const statusInfo = getStatusInfo(transaction.status)
            const isExpanded = expandedCards.includes(index)
            
            return (
              <div 
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 space-y-3 fade-in-up transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Always visible content */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pi Amount Sold:</span>
                    <span className="font-bold custom-purple-text">{transaction.piAmount} Pi</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Amount to Receive:</span>
                    <span className="font-bold custom-purple-text">
                      ${transaction.amountToReceive.toFixed(2)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${statusInfo.color} flex items-center gap-2`}>
                      <i className={statusInfo.icon}></i>
                      {statusInfo.text}
                    </span>
                  </div>
                </div>

                {/* Expandable content */}
                <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="pt-3 border-t border-gray-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium">{transaction.paymentMethod}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Payment Address:</span>
                      <span className="font-medium break-all">{transaction.paymentAddress}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Pi Wallet Address:</span>
                      <span className="font-medium break-all">{transaction.piAddress}</span>
                    </div>
                  </div>
                </div>

                {/* Toggle button */}
                <button 
                  onClick={() => toggleCard(index)}
                  className="w-full text-center text-sm font-medium text-purple-600 hover:text-purple-800 transition-colors duration-200 mt-2"
                >
                  {isExpanded ? 'Click to collapse' : 'Click to view details'}
                </button>
              </div>
            )
          })
        )}
      </div>

      <style jsx>{`
        // Same styles as before
      `}</style>
    </div>
  )
}
