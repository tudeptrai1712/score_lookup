const fs = require('fs')
const path = require('path')

const src = path.join(process.cwd(), 'assess', 'data', 'diem-khoi-12.jsonl')
const dest = path.join(process.cwd(), 'assess', 'data', 'điểm khối 12.jsonl')

async function run() {
  try {
    const txt = await fs.promises.readFile(src, 'utf8')
    await fs.promises.writeFile(dest, txt, 'utf8')
    console.log('copied', src, '->', dest)
  } catch (err) {
    console.error('copy failed:', err && err.message)
    process.exitCode = 1
  }
}

run()
