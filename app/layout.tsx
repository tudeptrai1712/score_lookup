import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tra cứu điểm thi',
  description: 'Tra cứu điểm thi — tra cứu điểm từ dữ liệu tĩnh',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}
