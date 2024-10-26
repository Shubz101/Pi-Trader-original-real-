import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    try {
        const { telegramId, paymentMethod, paymentAddress } = await req.json()

        if (!telegramId || !paymentMethod || !paymentAddress) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const updatedUser = await prisma.user.update({
            where: { telegramId },
            data: {
                paymentMethod,
                paymentAddress,
                isPaymentMethod: true
            }
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error('Error updating payment method:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
