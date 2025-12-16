"use client";

import { useEffect, useState } from "react";
import { round2, lower_bound } from "../utils";

const combinations: Record<string, string[]> = {
  A00: ["Toán", "Lí", "Hóa"],
  A01: ["Toán", "Lí", "NN"],
  B00: ["Toán", "Hóa", "Sinh"],
  C00: ["Văn", "Sử", "Địa"],
  C01: ["Văn", "Toán", "Lí"],
  C02: ["Văn", "Toán", "Hóa"],
  C04: ["Văn", "Toán", "Địa"],
  C14: ["Văn", "Toán", "GDKT&PL"],
  D01: ["Văn", "Toán", "NN"],
  D07: ["Toán", "Hóa", "NN"],
  D09: ["Toán", "NN", "Sử"],
  D14: ["Văn", "NN", "Sử"],
  D15: ["Văn", "NN", "Địa"],
  D66: ["Văn", "NN", "GDKT&PL"],
  D08: ["Toán", "Sinh", "NN"],
  D10: ["Toán", "Địa", "NN"],
  D11: ["Văn", "Lí", "NN"],
  D12: ["Văn", "Hóa", "NN"],
  D13: ["Văn", "Sinh", "NN"],
  D84: ["Toán", "GDKT&PL", "NN"],
};

export function useScoreData() {
  const [studentData, setStudentData] = useState<any[]>([]);
  const [allScores, setAllScores] = useState<Record<string, number[]>>({});
  const [subjectStats, setSubjectStats] = useState<Record<string, { avg: number }>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/data')
        if (!r.ok) throw new Error(`status ${r.status}`)
        const body = await r.json()
        const data = Array.isArray(body) ? body : body?.data
        if (!Array.isArray(data)) throw new Error('invalid data format')

        data.forEach((s: any) => {
          for (const k in combinations) {
            const subs = combinations[k];
            let sum: number | null = 0;
            for (const sub of subs) {
              if (s[sub] == null) {
                sum = null;
                break;
              }
              const v = Number(s[sub]);
              if (!Number.isFinite(v)) {
                sum = null;
                break;
              }
              sum += v;
            }
            s[k] = sum;
          }
        });

        const keys = [
          'Toán',
          'Văn',
          'NN',
          'Lí',
          'Hóa',
          'Sinh',
          'Sử',
          'Địa',
          'GDKT&PL',
          'TB',
          ...Object.keys(combinations),
        ];

        const newAllScores: Record<string, number[]> = {};
        const newSubjectStats: Record<string, { avg: number }> = {};

        keys.forEach((k) => {
          const scores = data
            .map((s) => s[k])
            .filter((v) => v != null)
            .map((v) =>
              typeof v === 'number'
                ? v
                : typeof v === 'string' && v.trim() !== '' && !isNaN(Number(v))
                ? Number(v)
                : NaN
            )
            .filter((v) => Number.isFinite(v));
          if (!scores.length) return;
          newAllScores[k] = [...scores].sort((a, b) => a - b);
          newSubjectStats[k] = {
            avg: round2(scores.reduce((a, b) => a + b, 0) / scores.length) as number,
          };
        });

        setStudentData(data);
        setAllScores(newAllScores);
        setSubjectStats(newSubjectStats);
        setLoading(false);
      } catch (err: any) {
        setLoading(false);
        setError(err?.message || String(err));
      }
    })()
  }, []);

  const searchSbd = (sbd: string) => {
    if (!studentData || !studentData.length) return null;
    return studentData.find((x) => String(x.SBD) === sbd) || null;
  };

  return { loading, error, searchSbd, allScores, subjectStats, combinations };
}