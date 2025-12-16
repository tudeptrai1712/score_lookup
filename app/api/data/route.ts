import fs from 'fs/promises'
import path from 'path'
import { NextResponse } from 'next/server'

export async function GET() {
  const candidates = [
    path.join(process.cwd(), 'assess', 'data', 'điểm khối 12.jsonl'),
    path.join(process.cwd(), 'assess', 'data', 'diem-khoi-12.jsonl'),
    path.join(process.cwd(), 'public', 'data', 'điểm khối 12.jsonl'),
    path.join(process.cwd(), 'public', 'data', 'diem-khoi-12.jsonl'),
  ]

  for (const file of candidates) {
    try {
      const text = await fs.readFile(file, 'utf8')
      const arr = text
        .trim()
        .split('\n')
        .filter(Boolean)
        .map((l) => JSON.parse(l))

      return NextResponse.json({ source: file, data: arr })
    } catch (err) {
      // try next
    }
  }

  return NextResponse.json({ error: 'could not read any data file' }, { status: 500 })
}
