"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

function PlantCard({ plant }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState("Watering");
  const [calculatedFrequency, setCalculatedFrequency] = useState(null);

  // When modal opens, default to "Watering"
  useEffect(() => {
    if (showModal) {
      setSelectedTask("Watering");
      setCalculatedFrequency(plant.WATERING_FREQUENCY);
    }
  }, [showModal, plant]);

  // Update frequency when task selection changes
  useEffect(() => {
    if (selectedTask === "Watering") {
      setCalculatedFrequency(plant.WATERING_FREQUENCY);
    } else if (selectedTask === "Fertilizing") {
      setCalculatedFrequency(plant.FERTILIZING_FREQUENCY);
    } else if (selectedTask === "Leaf Cleaning") {
      setCalculatedFrequency(plant.LEAFCLEANING_FREQUENCY);
    }
  }, [selectedTask, plant]);

  const handleConfirm = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.user_id) {
      alert("Please sign in first.");
      return;
    }
    try {
      const res = await fetch("/api/plants/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plant_id: plant.PLANT_ID,
          user_id: user.user_id,
          task: selectedTask,
          frequency: calculatedFrequency,
          description: plant.DESCRIPTION
        })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to add plant.");
      } else {
        alert(`${plant.PLANT_NAME} has been added to your reminders.`);
        setShowModal(false);
      }
    } catch (err) {
      alert("Error adding plant.");
    }
  };

  return (
    <div className="border bg-white shadow-md p-6 rounded-md text-center">
      <h3 className="text-xl font-semibold text-green-700">
        {plant.PLANT_NAME || "Unknown Plant"}
      </h3>
      <p className="text-gray-500">
        <span className="font-semibold">Species:</span> {plant.SPECIES || "No SPECIES info"}
      </p>
      <div className="mt-4 flex justify-around items-center">
        <Link href={`/plant/${plant.PLANT_ID}`}>
          <button className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            📄 Details
          </button>
        </Link>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          onClick={() => setShowModal(true)}
        >
          Set Reminder
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-green-700">Select Task</h2>
            <select
              value={selectedTask}
              onChange={(e) => setSelectedTask(e.target.value)}
              className="w-full p-2.5 border rounded mb-4 text-gray-600"
            >
              <option value="Watering">Watering</option>
              <option value="Fertilizing">Fertilizing</option>
              <option value="Leaf Cleaning">Leaf Cleaning</option>
            </select>
            <p className="mb-4 text-gray-600">
              Frequency: {calculatedFrequency} days
            </p>
            <div className="flex justify-center gap-20">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlantSelection() {
  const [plants, setPlants] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/plants/route")
      .then((res) => res.json())
      .then((data) => setPlants(data))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-blue-100 p-8 relative">
      {/* Back button at top-right corner */}
      <div className="absolute top-8 right-8">
        <Link href="/home">
          <button className="px-7 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition">
            Back
          </button>
        </Link>
      </div>
      <h1 className="text-4xl font-bold mb-8 text-green-800 text-center">
        🌿 Available Plants
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {plants.map((plant) => (
          <PlantCard key={plant.PLANT_ID} plant={plant} />
        ))}
      </div>
    </div>
  );
}
