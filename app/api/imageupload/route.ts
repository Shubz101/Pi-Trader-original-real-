import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    try {
        const { telegramId, isUpload } = await req.json()

        if (!telegramId) {
            return NextResponse.json({ error: 'Invalid telegramId' }, { status: 400 })
        }

        const updatedUser = await prisma.user.update({
            where: { telegramId },
            data: {
                isUpload
            }
        })

        return NextResponse.json({ 
            success: true, 
            isUpload: updatedUser.isUpload
        })
    } catch (error) {
        console.error('Error updating image upload status:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
