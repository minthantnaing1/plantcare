"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [userReminders, setUserReminders] = useState([]);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const router = useRouter();

  // First effect: retrieve user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.user_id) {
      setUser(storedUser);
    } else {
      setError("Please sign in to view your plants.");
    }
  }, []);

  // Second effect: load reminders once user is set
  useEffect(() => {
    if (user && user.user_id) {
      fetch(`/api/reminders/user?user_id=${user.user_id}`)
        .then((res) => res.json())
        .then((data) => setUserReminders(data))
        .catch((err) => setError("Failed to load your reminders."));
    }
  }, [user]);

  // Logout handler: clear localStorage and redirect to sign in page
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  // Helper function to extract only the time portion from SET_TIME
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    // Assume timestamp is in format "YYYY-MM-DD HH:MI:SS" or similar.
    // If there's a space, split and return the second part.
    if (timestamp.includes(" ")) {
      return timestamp.split(" ")[1];
    }
    // Otherwise, convert to Date object and return locale time string.
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-blue-100 p-8 relative">
      {/* Top header with greeting and logout */}
      <div className="flex justify-between items-center mb-3">
        <div className="text-2xl font-semibold text-green-800">
          {user ? `Hello, ${user.name}` : "Hello, Guest"}
        </div>
        <button
          onClick={handleLogout}
          className="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      <h1 className="text-4xl font-bold mb-8 text-green-800 text-center">
        🌱 My Plant Reminders
      </h1>

      <div className="flex justify-center gap-4 mb-8">
        <Link href="/history">
          <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
            📜 History
          </button>
        </Link>
        <Link href="/plant">
          <button className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
            Add Plant
          </button>
        </Link>
      </div>

      {error ? (
        <p className="text-center text-red-500 text-lg">{error}</p>
      ) : userReminders.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No plants added yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {userReminders.map((reminder) => (
            <div
              key={reminder.REMINDER_ID}
              className="relative border bg-white shadow-md p-6 rounded-md"
            >
              {/* Delete button positioned at top-right */}
              <button
                className="absolute top-3 right-3 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition text-xs"
                onClick={() => {
                  if (
                    confirm(
                      `Are you sure you want to delete reminder for ${reminder.PLANT_NAME}?`
                    )
                  ) {
                    fetch(`/api/reminders/${reminder.REMINDER_ID}/user`, {
                      method: "DELETE",
                    })
                      .then((res) => res.json())
                      .then((data) => {
                        if (!data.error) {
                          alert("Reminder deleted successfully.");
                          // Reload reminders after deletion
                          fetch(`/api/reminders/user?user_id=${user.user_id}`)
                            .then((res) => res.json())
                            .then((data) => setUserReminders(data))
                            .catch((err) =>
                              setError("Failed to load your reminders.")
                            );
                        } else {
                          alert(data.error || "Failed to delete reminder.");
                        }
                      })
                      .catch(() => alert("Error deleting reminder."));
                  }
                }}
              >
                Delete
              </button>

              <h3 className="text-xl font-semibold text-green-700 absolute top-3.5 left-4">
                {reminder.PLANT_NAME}
              </h3>
              <p className="text-sm text-gray-600 mt-6 mb-1">{reminder.SPECIES}</p>
              <p className="text-sm text-gray-600 mb-1 font-semibold">
                {reminder.TASK_NAME}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                Every {reminder.FREQUENCY} days
              </p>
              <p className="text-sm text-gray-600 mb-1">{reminder.DESCRIPTION}</p>
              <p className="text-sm text-gray-600 mb-1">
                Added on Date: {reminder.SET_DATE}
              </p>
              <p className="text-sm text-gray-600">
                Added on Time: {formatTime(reminder.SET_TIME)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
