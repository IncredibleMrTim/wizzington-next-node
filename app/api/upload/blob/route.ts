import { NextRequest, NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Validate file type from pathname
        const allowedExtensions = /\.(jpeg|jpg|png|gif|webp)$/i;
        if (!allowedExtensions.test(pathname)) {
          throw new Error('Invalid file type. Only image files are allowed (jpeg, jpg, png, gif, webp)');
        }

        return {
          allowedContentTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
          maximumSizeInBytes: 5 * 1024 * 1024, // 5MB
        };
      },
      onUploadCompleted: async ({ blob }) => {
        // Optional: Log upload completion or perform additional actions
        console.log('Blob upload completed:', blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error('Error handling blob upload:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to handle upload' },
      { status: 400 }
    );
  }
}
