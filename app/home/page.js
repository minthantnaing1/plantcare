"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const [userReminders, setUserReminders] = useState([]);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const router = useRouter();

  // Retrieve user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser && storedUser.user_id) {
      setUser(storedUser);
    } else {
      setError("Please sign in to view your plants.");
    }
  }, []);

  // Load reminders once user is set
  useEffect(() => {
    if (user && user.user_id) {
      fetch(`/api/reminders/user?user_id=${user.user_id}`)
        .then((res) => res.json())
        .then((data) => setUserReminders(data))
        .catch((err) => setError("Failed to load your reminders."));
    }
  }, [user]);

  const loadReminders = () => {
    if (user && user.user_id) {
      fetch(`/api/reminders/user?user_id=${user.user_id}`)
        .then((res) => res.json())
        .then((data) => setUserReminders(data))
        .catch((err) => setError("Failed to load your reminders."));
    }
  };

  // Helper function to extract only the time portion from SET_TIME
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    if (timestamp.includes(" ")) {
      return timestamp.split(" ")[1];
    }
    return new Date(timestamp).toLocaleTimeString();
  };

  // Toggle Settings dropdown
  const toggleSettings = () => {
    setShowSettings(!showSettings);
  };

  // Edit Profile: show modal with current user info pre-filled
  const openEditModal = () => {
    setEditName(user.name);
    setEditEmail(user.email);
    setEditPassword("");
    setShowEditModal(true);
    setShowSettings(false);
  };

  // Handle profile update
  const handleEditProfile = async () => {
    try {
      const res = await fetch("/api/auth/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
          name: editName,
          email: editEmail,
          password: editPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to update profile.");
      } else {
        alert("Profile updated successfully.");
        const updatedUser = { ...user, name: editName, email: editEmail };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setShowEditModal(false);
      }
    } catch (err) {
      alert("Error updating profile.");
    }
  };

  // Delete account handler
  const handleDeleteAccount = async () => {
    try {
      const res = await fetch("/api/auth/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.user_id }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Failed to delete account.");
      } else {
        alert("Account deleted successfully.");
        localStorage.removeItem("user");
        router.push("/");
      }
    } catch (err) {
      alert("Error deleting account.");
    }
  };

  // Logout confirmation handler: simply logs out and redirects.
  const handleLogoutConfirm = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  // Delete reminder handler remains unchanged
  const handleDelete = async (reminderId) => {
    try {
      fetch(`/api/reminders/${reminderId}/user`, {
        method: "DELETE",
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.error) {
            alert("Reminder deleted successfully.");
            loadReminders();
          } else {
            alert(data.error || "Failed to delete reminder.");
          }
        })
        .catch(() => alert("Error deleting reminder."));
    } catch (err) {
      alert("Error deleting reminder.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-blue-100 p-8 relative">
      {/* Top header with greeting and Settings button */}
      <div className="flex justify-between items-center mb-3">
        <div className="text-2xl font-semibold text-green-800">
          {user ? `Hello, ${user.name}` : "Hello, Guest"}
        </div>
        <div>
          <button
            onClick={toggleSettings}
            className="px-5 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
          >
            Settings
          </button>
          {showSettings && (
            <div className="absolute right-8 mt-1 bg-white shadow-lg rounded border z-50 flex space-x-2 p-1.5">
              <button
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                onClick={openEditModal}
              >
                Edit Profile
              </button>
              <button
                className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                onClick={() => {
                  setShowDeleteAccountModal(true);
                  setShowSettings(false);
                }}
              >
                Delete Account
              </button>
              <button
                className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                onClick={() => setShowLogoutModal(true)}
              >
                Logout
              </button>
            </div>
          )}
        </div>
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
                    handleDelete(reminder.REMINDER_ID);
                  }
                }}
              >
                Delete
              </button>

              <div className="space-y-2 mt-6">
                <h3 className="text-xl font-semibold text-green-700">
                  {reminder.PLANT_NAME}
                </h3>
                <p className="text-sm text-gray-600">{reminder.SPECIES}</p>
                <p className="text-sm text-gray-600 font-semibold">
                  {reminder.TASK_NAME}
                </p>
                <p className="text-sm text-gray-600">Every {reminder.FREQUENCY} days</p>
                <p className="text-sm text-gray-600">{reminder.DESCRIPTION}</p>
                <p className="text-sm text-gray-600">Added on {reminder.SET_DATE}</p>
                <p className="text-sm text-gray-600">Time: {formatTime(reminder.SET_TIME)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-green-700">Edit Profile</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={editPassword}
                onChange={(e) => setEditPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEditProfile}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-red-600">Delete Account</h2>
            <p className="mb-4 text-gray-700">
              Are you sure you want to permanently delete your account? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteAccountModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4 text-green-700">Logout</h2>
            <p className="mb-4 text-gray-700">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleLogoutConfirm}  // No extra confirm() here
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
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
