import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

// Get upload directory from environment or use default
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

// POST /api/upload/multiple - Upload multiple files
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }

    // Get max files from environment or use default
    const maxFiles = process.env.MAX_FILES ? parseInt(process.env.MAX_FILES, 10) : 10;

    if (files.length > maxFiles) {
      return NextResponse.json(
        { error: `Maximum ${maxFiles} files allowed` },
        { status: 400 }
      );
    }

    // Check file size (5MB default)
    const maxFileSize = process.env.MAX_FILE_SIZE
      ? parseInt(process.env.MAX_FILE_SIZE, 10)
      : 5 * 1024 * 1024;

    const uploadDir = getUploadDir();

    // Ensure upload directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const uploadedFiles = [];

    for (const file of files) {
      // Validate file type
      if (!isValidImageType(file.type, file.name)) {
        return NextResponse.json(
          { error: `Invalid file type: ${file.name}. Only image files are allowed (jpeg, jpg, png, gif, webp)` },
          { status: 400 }
        );
      }

      // Check file size
      if (file.size > maxFileSize) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds ${maxFileSize / 1024 / 1024}MB limit` },
          { status: 400 }
        );
      }

      // Generate unique filename
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const filename = `files-${uniqueSuffix}${path.extname(file.name)}`;
      const filepath = path.join(uploadDir, filename);

      // Convert file to buffer and write to disk
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);

      uploadedFiles.push({
        filename,
        originalname: file.name,
        mimetype: file.type,
        size: file.size,
        path: `/uploads/${filename}`
      });
    }

    return NextResponse.json(
      {
        message: 'Files uploaded successfully',
        files: uploadedFiles
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error uploading files:', error);
    return NextResponse.json({ error: 'Failed to upload files' }, { status: 500 });
  }
}
