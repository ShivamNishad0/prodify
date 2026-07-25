"use client";
import React, { useState } from "react";

export default function CreateLedger() {
  const [entries, setEntries] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  // Handler to add a new entry
  const addEntry = () => {
    if (description && amount) {
      const newEntry = {
        description,
        amount: parseFloat(amount),
        id: Date.now(),
      };
      setEntries([...entries, newEntry]);
      setDescription("");
      setAmount("");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-semibold mb-4">Ledger</h2>

      <div className="mb-4">
        <input
          className="border p-2 w-full mb-2"
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          aria-label="Description"
        />
        <input
          className="border p-2 w-full"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          aria-label="Amount"
        />
      </div>

      <button
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        onClick={addEntry}
      >
        Add Entry
      </button>

      {/* Display the ledger entries */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Entries</h3>
        {entries.length === 0 ? (
          <p className="text-gray-600">No entries yet</p>
        ) : (
          <ul>
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="mb-2 flex justify-between border-b pb-2"
              >
                <span>{entry.description}</span>
                <span>${entry.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
