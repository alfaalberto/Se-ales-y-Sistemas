import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'content-backup.json');

  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContent);
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return NextResponse.json({ error: 'El archivo de respaldo no ha sido creado. Guarda el contenido primero para crearlo.' }, { status: 404 });
    }
    console.error('API Error loading content:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return NextResponse.json({ error: `Failed to load content. ${errorMessage}` }, { status: 500 });
  }
}
