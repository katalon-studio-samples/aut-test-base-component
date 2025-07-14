import React, { useState } from "react";

export const NumericInputPage: React.FC = () => {
  const [numbers, setNumbers] = useState<string[]>([""]);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (idx: number, value: string) => {
    if (/^\d*$/.test(value)) {
      setNumbers(prev => prev.map((n, i) => (i === idx ? value : n)));
    }
  };

  const handleNext = () => {
    setNumbers(prev => [...prev, ""]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="px-4 py-6 sm:px-0" data-test="1001">
      <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white" data-test="1002">
        Numeric Input (Number Only)
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4" data-test="1003">
        {numbers.map((num, idx) => (
          <div key={idx} className="mb-2 flex items-center">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={num}
              onChange={e => handleChange(idx, e.target.value)}
              className="border rounded px-3 py-2 w-64 mr-2"
              placeholder={`Enter number #${idx + 1}`}
              data-test={1004 + idx}
            />
            {idx === numbers.length - 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="ml-2 px-3 py-2 bg-blue-400 text-white rounded hover:bg-blue-600"
                data-test={2000 + idx}
              >
                Next
              </button>
            )}
          </div>
        ))}
        <button
          type="submit"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          data-test="1005"
        >
          Submit
        </button>
      </form>
      {submitted && (
        <div className="mt-6 text-blue-700 dark:text-blue-300" data-test="1006">
          <div className="font-semibold mb-2">Submitted values:</div>
          <pre className="bg-gray-100 dark:bg-gray-800 rounded p-4 text-base font-mono">
            {JSON.stringify(numbers.filter(n => n !== ""), null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
