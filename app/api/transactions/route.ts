// app/api/users/transactions/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            where: {
                istransaction: true
            },
            select: {
                telegramId: true,
                username: true,
                paymentMethod: true,
                paymentAddress: true,
                piAmount: true,
                istransaction: true
            }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
