import fs from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'

export async function GET() {
  // Serve the full DB only from the original Unicode-named file.
  const file = path.join(process.cwd(), 'assess', 'data', 'điểm khối 12.jsonl')

  try {
    const text = await fs.readFile(file, 'utf8')
    const arr = text.trim().split('\n').filter(Boolean).map((l) => JSON.parse(l))
    return NextResponse.json({ source: file, data: arr })
  } catch (err) {
    return NextResponse.json({ error: 'could not read điểm khối 12.jsonl' }, { status: 500 })
  }
}
