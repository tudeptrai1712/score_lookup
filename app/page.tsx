"use client"

import { useState } from 'react'
import { useScoreData } from './lib/hooks/useScoreData'
import { ResultsCard } from './components/ResultsCard'

export default function Page() {
  const [sbd, setSbd] = useState('')
  const [student, setStudent] = useState<any | null>(null)
  const { loading, error, searchSbd, allScores, subjectStats, combinations } = useScoreData()

  const handleSearch = () => {
    if (loading) return
    if (error) return
    const res = searchSbd(sbd.trim())
    setStudent(res)
  }

  return (
    <main className="container">
      <h1>Tra cứu điểm thi</h1>

      <div className="search-container">
        <input id="sbd-input" value={sbd} onChange={(e) => setSbd(e.target.value)} type="text" placeholder="Nhập SBD" />
        <button id="search-btn" onClick={handleSearch} disabled={loading || !!error}>Tra cứu</button>
      </div>

      <div id="result-container">
        {loading && <p>Đang tải dữ liệu...</p>}
        {error && <p style={{ color: 'red' }}>Lỗi khi tải dữ liệu: {error}</p>}
        {!loading && !error && student == null && sbd && <p>Không tìm thấy thí sinh.</p>}
        {!loading && !error && student && (
          <ResultsCard student={student} allScores={allScores} subjectStats={subjectStats} combinations={combinations} />
        )}
      </div>
    </main>
  )
}
