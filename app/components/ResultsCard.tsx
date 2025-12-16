import { lower_bound, round2 } from "../lib/utils";

type Props = {
  student: any
  allScores: Record<string, number[]>
  subjectStats: Record<string, { avg: number }>
  combinations: Record<string, string[]>
}

export function ResultsCard({ student, allScores, subjectStats, combinations }: Props) {
  return (
    <div>
      <h2>Thông tin thí sinh</h2>
      <div className="card">
        {Object.keys(student).map((k) => {
          if (k in combinations || student[k] == null) return null;

          let pct = "";
          let avg = "";
          if (allScores[k]) {
            const sVal = Number(student[k]);
            const n = allScores[k].length;
            const c = lower_bound(allScores[k], sVal);
            const rank = n > 1 ? c / (n - 1) : 1;
            pct = Math.round(rank * 100) + "th";
            avg =
              subjectStats[k]?.avg != null
                ? `avg ${Number(round2(subjectStats[k].avg)).toFixed(2)}`
                : "";
          }

          return (
            <div className="row" key={k}>
              <div className="label">{k}</div>
              <div className="value">
                {k === "SBD"
                  ? student[k]
                  : !isNaN(Number(student[k]))
                  ? Number(round2(Number(student[k]))).toFixed(2)
                  : student[k]}
              </div>
              <div className="meta">
                <span className="pct">{pct}</span>
                <span className="avg">{avg}</span>
              </div>
            </div>
          );
        })}
      </div>

      <h2>Tổ hợp</h2>
      <div className="card">
        {Object.keys(combinations).map((k) => {
          if (student[k] == null) return null;
          const sVal = Number(student[k]);
          const n = allScores[k].length;
          const c = lower_bound(allScores[k], sVal);
          const rank = n > 1 ? c / (n - 1) : 1;
          const pct = Math.round(rank * 100) + "th";
          const avg =
            subjectStats[k]?.avg != null
              ? `avg ${Number(round2(subjectStats[k].avg)).toFixed(2)}`
              : "";

          return (
            <div className="row" key={k}>
              <div className="label">{k}</div>
              <div className="value">{Number(round2(student[k])).toFixed(2)}</div>
              <div className="meta">
                <span className="pct">{pct}</span>
                <span className="avg">{avg}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: "20px", fontSize: "0.9em", color: "#666" }}>
        <p>
          <b>Note:</b> All calculations are performed directly in your browser
          from a static data file; no backend server is used.
        </p>
        <p>
          Percentile ranks are calculated using a method equivalent to Excel's{" "}
          <code>PERCENTRANK.INC</code> formula.
        </p>
        <p>
          <b>How to read percentile:</b> A percentile of <b>75th</b> means the
          student scored higher than 75% of other students.
        </p>
      </div>
    </div>
  );
}