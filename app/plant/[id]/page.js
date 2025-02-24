"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function PlantDetails() {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Invalid plant ID");
      return;
    }
    fetch(`/api/plants/${id}/route`)
      .then((res) => res.json())
      .then((data) => {
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
    <div className="min-h-screen bg-gray-100 p-6 relative">
      {/* Back button at top-right corner */}
      <div className="absolute top-8 right-8">
        <Link href="/plant">
          <button className="px-7 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition">
            Back
          </button>
        </Link>
      </div>
      <div className="space-y-4 absolute left-12">
        <h1 className="text-3xl font-bold text-green-600 mt-4">{plant.PLANT_NAME}</h1>
        <p className="text-gray-600">
          <span className="font-semibold">Species:</span> {plant.SPECIES}
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Watering Frequency:</span> {plant.WATERING_FREQUENCY} days
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Fertilizing Frequency:</span> {plant.FERTILIZING_FREQUENCY} days
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Leaf Cleaning Frequency:</span> {plant.LEAFCLEANING_FREQUENCY} days
        </p>
        <p className="text-gray-600">
          <span className="font-semibold">Description:</span> {plant.DESCRIPTION}
        </p>
      </div>
    </div>
  );
}
