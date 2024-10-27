import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    try {
        const { telegramId, amount } = await req.json()

        if (!telegramId) {
            return NextResponse.json({ error: 'Invalid telegramId' }, { status: 400 })
        }

        const updatedUser = await prisma.user.update({
            where: { telegramId },
            data: {
                piAmount: {
                    push: parseInt(amount)
                }
            }
        })

        return NextResponse.json({ 
            success: true,
            piAmount: updatedUser.piAmount
        })
    } catch (error) {
        console.error('Error updating pi amount:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
