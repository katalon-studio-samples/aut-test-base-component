import { useState } from "react";
import { MAX_ROWS, rowCountError } from "./orders";

interface Props {
  count: number;
  allRows: boolean;
  onGenerate: (count: number) => void;
  onAllRows: (value: boolean) => void;
}

export function WorkloadControls({
  count,
  allRows,
  onGenerate,
  onAllRows,
}: Props) {
  const [rowCount, setRowCount] = useState("250");
  const [minimum, setMinimum] = useState("100");
  const [maximum, setMaximum] = useState("1000");
  const [error, setError] = useState("");

  const generate = (random: boolean) => {
    const validation = random
      ? rowCountError(minimum) || rowCountError(maximum)
      : rowCountError(rowCount);
    if (validation) {
      setError(validation);
      return;
    }
    if (random && Number(minimum) > Number(maximum)) {
      setError("Minimum rows must not exceed maximum rows.");
      return;
    }
    const nextCount = random
      ? Math.floor(Math.random() * (Number(maximum) - Number(minimum) + 1)) +
        Number(minimum)
      : Number(rowCount);
    setError("");
    setRowCount(String(nextCount));
    onGenerate(nextCount);
  };

  return (
    <details className="workload-controls" open>
      <summary>
        Performance workload{" "}
        <span>{count.toLocaleString("en-US")} synthetic orders</span>
      </summary>
      <div className="workload-fields">
        <label>
          Row count
          <input
            type="number"
            min="1"
            max={MAX_ROWS}
            step="1"
            value={rowCount}
            onChange={(event) => setRowCount(event.target.value)}
          />
        </label>
        <button onClick={() => generate(false)}>Generate rows</button>
        <label>
          Minimum rows
          <input
            type="number"
            min="1"
            max={MAX_ROWS}
            step="1"
            value={minimum}
            onChange={(event) => setMinimum(event.target.value)}
          />
        </label>
        <label>
          Maximum rows
          <input
            type="number"
            min="1"
            max={MAX_ROWS}
            step="1"
            value={maximum}
            onChange={(event) => setMaximum(event.target.value)}
          />
        </label>
        <button onClick={() => generate(true)}>Randomize rows</button>
        <label className="all-rows">
          <input
            type="checkbox"
            checked={allRows}
            onChange={(event) => onAllRows(event.target.checked)}
          />
          Render all rows (no pagination)
        </label>
      </div>
      <p>
        1–10,000 rows. Each mounted row includes PO #, quantity, notes and
        selection inputs. Generating rows resets edits and filters.
      </p>
      {error && (
        <p role="alert" className="workload-error">
          {error}
        </p>
      )}
    </details>
  );
}
