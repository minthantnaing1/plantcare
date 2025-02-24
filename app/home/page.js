"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home() {
  const [selectedPlants, setSelectedPlants] = useState([]);

  useEffect(() => {
    const storedPlants = JSON.parse(localStorage.getItem("selectedPlants")) || [];
    setSelectedPlants(storedPlants);
  }, []);

  const handleRemovePlant = (plantId) => {
    const updatedPlants = selectedPlants.filter((p) => p.PLANT_ID !== plantId);
    setSelectedPlants(updatedPlants);
    localStorage.setItem("selectedPlants", JSON.stringify(updatedPlants));
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-blue-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-green-800 text-center">
        🌱 My Plants
      </h1>

      <div className="flex justify-center gap-4 mb-8">
        <Link href="/plant">
          <button className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
            ➕ Add Plant
          </button>
        </Link>
        <Link href="/history">
          <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            📜 History
          </button>
        </Link>
      </div>

      {selectedPlants.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">
          No plants selected yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {selectedPlants.map((plant) => (
            <div
              key={plant.PLANT_ID}
              className="border bg-white shadow-md p-6 rounded-md text-center"
            >
              <h3 className="text-xl font-semibold text-green-700">
                {plant.NAME}
              </h3>
              <p className="text-sm text-gray-600">{plant.SPECIES}</p>
              <button
                onClick={() => handleRemovePlant(plant.PLANT_ID)}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                ❌ Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
