// app/api/imageupload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { uploadToCloudinary, validateImage } from '@/utils/cloudinary';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const telegramId = parseInt(formData.get('telegramId') as string);

    if (!file || !telegramId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate the image
    const validation = validateImage({
      size: file.size,
      type: file.type
    });

    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary
     const { publicUrl } = await uploadToCloudinary(buffer, file.name);

    // Update database with short URL
    await prisma.user.update({
      where: { telegramId },
      data: {
        imageUrl: publicUrl,
        isUpload: true
      }
    });

    return NextResponse.json({
      success: true,
      imageUrl: publicUrl // Return public URL for display
    });
  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get telegramId from the URL search params instead of request body
    const searchParams = request.nextUrl.searchParams;
    const telegramId = parseInt(searchParams.get('telegramId') || '');

    if (!telegramId) {
      return NextResponse.json(
        { success: false, error: 'Missing telegramId' },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { telegramId },
      data: {
        imageUrl: null,
        isUpload: false
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing image:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to remove image' },
      { status: 500 }
    );
  }
}
