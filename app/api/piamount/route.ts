import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    try {
        const { telegramId, amount, amount1, imageUrl,  PiAddress } = await req.json()
        
        if (!telegramId) {
            return NextResponse.json({ error: 'Invalid telegramId or Pi Address' }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { telegramId }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        const updatedUser = await prisma.user.update({
            where: { telegramId },
            data: {
                piAmount: {
                    push: parseInt(amount)
                },
                finalpis: {
                  push: parseInt(amount1)
                },
                savedImages: {
                    push: imageUrl  // Add the current imageUrl to savedImages array
                },
                PiAddress: PiAddress, // Store the Pi wallet address
                imageUrl: null,     // Clear the temporary imageUrl
                isUpload: false     // Reset upload status
            }
        })

        return NextResponse.json({ 
            success: true,
            piAmount: updatedUser.piAmount,
            finalpis: updatedUser.finalpis,
            PiAddress: updatedUser.PiAddress,
            savedImages: updatedUser.savedImages
        })
    } catch (error) {
        console.error('Error updating pi amount:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
