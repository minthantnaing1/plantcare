"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

// Inline PlantCard component with Select/Remove toggle
function PlantCard({ plant }) {
  const [isSelected, setIsSelected] = useState(false);

  // Check localStorage on mount to see if this plant is selected
  useEffect(() => {
    const selectedPlants = JSON.parse(localStorage.getItem("selectedPlants")) || [];
    setIsSelected(selectedPlants.some(p => p.PLANT_ID === plant.PLANT_ID));
  }, [plant.PLANT_ID]);

  const handleSelectPlant = () => {
    let selectedPlants = JSON.parse(localStorage.getItem("selectedPlants")) || [];
    if (!selectedPlants.some(p => p.PLANT_ID === plant.PLANT_ID)) {
      selectedPlants.push(plant);
      localStorage.setItem("selectedPlants", JSON.stringify(selectedPlants));
      setIsSelected(true);
      alert(`${plant.NAME} has been added to home.`);
    }
  };

  const handleRemovePlant = () => {
    let selectedPlants = JSON.parse(localStorage.getItem("selectedPlants")) || [];
    selectedPlants = selectedPlants.filter(p => p.PLANT_ID !== plant.PLANT_ID);
    localStorage.setItem("selectedPlants", JSON.stringify(selectedPlants));
    setIsSelected(false);
    alert(`${plant.NAME} has been removed from home.`);
  };

  return (
    <div className="border bg-white shadow-md p-6 rounded-md text-center">
      <h3 className="text-xl font-semibold text-green-700">
        {plant.NAME || "Unknown Plant"}
      </h3>
      <p className="text-sm text-gray-600">
        {plant.SPECIES || "No species info"}
      </p>
      <div className="mt-4 flex justify-around items-center">
        {plant.PLANT_ID ? (
          <Link href={`/plant/${plant.PLANT_ID}`}>
            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              📄 Details
            </button>
          </Link>
        ) : (
          <button className="px-4 py-2 bg-gray-500 text-white rounded" disabled>
            🚫 No Details
          </button>
        )}
        {isSelected ? (
          <button
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
            onClick={handleRemovePlant}
          >
            ❌ Remove
          </button>
        ) : (
          <button
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition"
            onClick={handleSelectPlant}
          >
            ⭐ Select
          </button>
        )}
      </div>
    </div>
  );
}

export default function PlantSelection() {
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    fetch("/api/plants/route")
      .then((res) => res.json())
      .then((data) => setPlants(data))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-blue-100 p-8">
      <h1 className="text-4xl font-bold mb-8 text-green-800 text-center">
        🌿 Select a Plant
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {plants.map((plant) => (
          <PlantCard key={plant.PLANT_ID} plant={plant} />
        ))}
      </div>
    </div>
  );
}
