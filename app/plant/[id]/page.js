"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function PlantDetails() {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Invalid plant ID");
      return;
    }

    fetch(`/api/plants/${id}/route`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setPlant(data);
        }
      })
      .catch(() => setError("Failed to fetch plant details"));
  }, [id]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!plant) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-2 text-green-600">{plant.NAME}</h1>
      <p className="text-gray-600">
        <span className="font-semibold">Species:</span> {plant.SPECIES}
      </p>

      <h2 className="text-2xl font-bold mt-6 text-gray-700">Reminders</h2>
      {plant.REMINDERS.map((reminder, index) => (
        <div key={index} className="border p-2 mt-2 bg-white shadow rounded">
          <p className="text-gray-600">
            <span className="font-semibold">Task:</span> {reminder.TASK_NAME}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Description:</span> {reminder.DESCRIPTION}
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Frequency:</span> {reminder.FREQUENCY}
          </p>
        </div>
      ))}
    </div>
  );
}
