// app/api/transactions/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        console.log('API route called - fetching users');
        
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

        console.log('Found users:', users);

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
