import React, { useState } from 'react';

interface KeyValue {
  key: string;
  value: string;
}

export const KeyValueFormPage: React.FC = () => {
  const [pairs, setPairs] = useState<KeyValue[]>([]);
  const [current, setCurrent] = useState<KeyValue>({ key: '', value: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrent({ ...current, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (current.key.trim() && current.value.trim()) {
      setPairs([...pairs, current]);
      setCurrent({ key: '', value: '' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let updatedPairs = pairs;
    if (current.key.trim() && current.value.trim()) {
      updatedPairs = [...pairs, current];
      setPairs(updatedPairs);
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-4">
        <h2 className="text-lg font-bold mb-4">Submitted Key-Value Pairs</h2>
        <table className="min-w-full border">
          <thead>
            <tr>
              <th className="border px-4 py-2">Key</th>
              <th className="border px-4 py-2">Value</th>
            </tr>
          </thead>
          <tbody>
            {pairs.map((pair, idx) => (
              <tr key={idx}>
                <td className="border px-4 py-2">{pair.key}</td>
                <td className="border px-4 py-2">{pair.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <form className="p-4 max-w-md mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-lg font-bold mb-4">Enter Key-Value Pairs</h2>
      <div className="mb-2">
        <label className="block mb-1">Key</label>
        <input
          name="key"
          value={current.key}
          onChange={handleChange}
          className="border px-2 py-1 w-full"
          required
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1">Value</label>
        <input
          name="value"
          value={current.value}
          onChange={handleChange}
          className="border px-2 py-1 w-full"
          required
        />
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleNext}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={!current.key.trim() || !current.value.trim()}
        >
          Next
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={pairs.length === 0}
        >
          Submit
        </button>
      </div>
      {pairs.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Current Pairs:</h3>
          <ul className="list-disc pl-5">
            {pairs.map((pair, idx) => (
              <li key={idx}>
                <span className="font-mono">{pair.key}</span>: <span className="font-mono">{pair.value}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};