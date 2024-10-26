import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    try {
        const userData = await req.json()

        if (!userData || !userData.id) {
            return NextResponse.json({ error: 'Invalid user data' }, { status: 400 })
        }

        let user = await prisma.user.findUnique({
            where: { telegramId: userData.id }
        })

        if (!user) {
            user = await prisma.user.create({
                data: {
                    telegramId: userData.id,
                    username: userData.username || '',
                    firstName: userData.first_name || '',
                    lastName: userData.last_name || ''
                }
            })
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error('Error processing user data:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}

// Add GET handler to fetch user data
export async function GET(req: NextRequest) {
    try {
        // Get telegramId from the session or query parameter
        // This depends on how you're passing the telegram ID
        const url = new URL(req.url)
        const telegramId = url.searchParams.get('telegramId')

        if (!telegramId) {
            return NextResponse.json({ error: 'Telegram ID required' }, { status: 400 })
        }

        const user = await prisma.user.findUnique({
            where: { telegramId: parseInt(telegramId) }
        })

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 })
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error('Error fetching user data:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
