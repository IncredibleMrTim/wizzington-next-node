import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

// GET upload directory from environment or use default
const getUploadDir = () => {
  return process.env.UPLOAD_DIR
    ? path.resolve(process.cwd(), process.env.UPLOAD_DIR)
    : path.join(process.cwd(), 'uploads');
};

// Validate file type
const isValidImageType = (mimetype: string, filename: string): boolean => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(filename).toLowerCase());
  const mimetypeValid = allowedTypes.test(mimetype);
  return mimetypeValid && extname;
};

// POST /api/upload/single - Upload a single file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    if (!isValidImageType(file.type, file.name)) {
      return NextResponse.json(
        { error: 'Only image files are allowed (jpeg, jpg, png, gif, webp)' },
        { status: 400 }
      );
    }

    // Check file size (5MB default)
    const maxFileSize = process.env.MAX_FILE_SIZE
      ? parseInt(process.env.MAX_FILE_SIZE, 10)
      : 5 * 1024 * 1024;

    if (file.size > maxFileSize) {
      return NextResponse.json(
        { error: `File size exceeds ${maxFileSize / 1024 / 1024}MB limit` },
        { status: 400 }
      );
    }

    const uploadDir = getUploadDir();

    // Ensure upload directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = `file-${uniqueSuffix}${path.extname(file.name)}`;
    const filepath = path.join(uploadDir, filename);

    // Convert file to buffer and write to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    return NextResponse.json(
      {
        message: 'File uploaded successfully',
        file: {
          filename,
          originalname: file.name,
          mimetype: file.type,
          size: file.size,
          path: `/uploads/${filename}`
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}
