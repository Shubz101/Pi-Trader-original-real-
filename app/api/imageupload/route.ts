import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const telegramId = formData.get('telegramId') as string;

        if (!file || !telegramId) {
            return NextResponse.json({ error: 'Missing file or telegramId' }, { status: 400 })
        }

        // Convert the file to base64 for storage
        // Note: In a production environment, you should use a proper cloud storage service
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64String = `data:${file.type};base64,${buffer.toString('base64')}`

        const updatedUser = await prisma.user.update({
            where: { telegramId: parseInt(telegramId) },
            data: {
                isUpload: true,
                imageUrl: base64String
            }
        })

        return NextResponse.json({ 
            success: true, 
            isUpload: updatedUser.isUpload,
            imageUrl: updatedUser.imageUrl
        })
    } catch (error) {
        console.error('Error updating image upload status:', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
