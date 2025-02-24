"use client";
import { useState, useEffect } from "react";

export default function History() {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/history/route")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setHistory(data);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch history records.");
      });
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-4">📜 History</h1>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4 text-gray-600">📜 History</h1>
      {history.length === 0 ? (
        <p className="text-gray-600">No history records available.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {history.map((record) => (
            <div key={record.RECORD_ID} className="bg-white shadow rounded p-4">
              <h2 className="text-xl font-bold mb-2 text-gray-600">{record.TASK_NAME}</h2>
              <p className="text-gray-600">
                <span className="font-semibold">Record ID:</span> {record.RECORD_ID}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Reminder ID:</span> {record.REMINDER_ID}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Date Completed:</span>{" "}
                {new Date(record.DATE_COMPLETED).toLocaleDateString()}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Time Completed:</span>{" "}
                {new Date(record.TIME_COMPLETED).toLocaleTimeString()}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Status:</span> {record.STATUS}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
