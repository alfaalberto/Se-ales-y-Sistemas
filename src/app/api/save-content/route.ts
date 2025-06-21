import { NextResponse, type NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const content = JSON.stringify(body, null, 2);
    
    // Define the path to 'content-backup.json' in the project root
    const filePath = path.join(process.cwd(), 'content-backup.json');

    await fs.writeFile(filePath, content, 'utf8');

    return NextResponse.json({ message: 'Content saved successfully.' }, { status: 200 });
  } catch (error) {
    console.error('API Error saving content:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ error: `Failed to save content. ${errorMessage}` }, { status: 500 });
  }
}
