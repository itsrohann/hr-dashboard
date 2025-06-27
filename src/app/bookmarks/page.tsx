'use client';

import { useEffect, useState } from 'react';
import UserCard from '../../components/UserCard';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  department: string;
  rating: number;
};

export default function BookmarksPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [bookmarked, setBookmarked] = useState<number[]>([]);
  const [assignments, setAssignments] = useState<{ [key: number]: string }>({});
  const [selectedProject, setSelectedProject] = useState<{ [key: number]: string }>({});
  const [showDrawer, setShowDrawer] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const projectOptions = ['Apollo', 'Orion', 'Nova', 'Zephyr'];

  useEffect(() => {
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks') || '[]');
    setBookmarked(storedBookmarks);

    fetch('https://dummyjson.com/users?limit=20')
      .then((res) => res.json())
      .then((data) => {
        const mockDepartment = () => {
          const depts = ['Engineering', 'Marketing', 'Sales', 'HR', 'Design'];
          return depts[Math.floor(Math.random() * depts.length)];
        };

        const updatedUsers = data.users.map((user: any) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          age: user.age,
          department: mockDepartment(),
          rating: Math.floor(Math.random() * 5) + 1,
        }));

        setUsers(updatedUsers);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load users');
        setLoading(false);
      });
  }, []);

  const toggleBookmark = (id: number) => {
    setBookmarked((prev) => {
      const updated = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem('bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  const handleAssign = (userId: number) => {
    if (!selectedProject[userId]) return;
    setAssignments((prev) => ({ ...prev, [userId]: selectedProject[userId] }));
    setShowDrawer(true);
  };

  const bookmarkedUsers = users.filter((user) => bookmarked.includes(user.id));

  if (loading) {
    return (
      <main className="p-6 text-center text-gray-500 dark:text-gray-400">
        Loading bookmarked employees...
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6 text-center text-red-600 dark:text-red-400">
        Error loading users: {error}
      </main>
    );
  }

  return (
    <main className="p-6 relative">
      <div className="mb-4">
        <Link href="/" className="text-blue-600 font-medium hover:underline text-sm">
          ← Back to Dashboard
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">📌 Bookmarked Employees
      </h1>

      {bookmarkedUsers.length === 0 ? (
        <p>No bookmarks yet.</p>
      ) : (
        <AnimatePresence>
          <motion.div
            key="bookmarked-users"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {bookmarkedUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 w-full"
              >
                <h2 className="text-lg font-semibold">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-sm text-gray-500 mb-1">{user.email}</p>
                <p className="text-sm mb-1">Dept: {user.department}</p>
                <p className="text-sm mb-2">Rating: {user.rating} ★</p>

                <div className="flex gap-2 text-sm">
                  <button
                    onClick={() => toggleBookmark(user.id)}
                    className="text-red-500 font-medium"
                  >
                    Remove Bookmark
                  </button>
                </div>

                <div className="mt-3">
                  <select
                    value={selectedProject[user.id] || ''}
                    onChange={(e) =>
                      setSelectedProject((prev) => ({
                        ...prev,
                        [user.id]: e.target.value,
                      }))
                    }
                    className="bg-white text-black dark:bg-gray-900 dark:text-white border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="">Assign to Project</option>
                    {projectOptions.map((proj) => (
                      <option key={proj} value={proj}>
                        {proj}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => handleAssign(user.id)}
                    className="mt-2 bg-green-600 text-white text-sm px-3 py-1 rounded hover:bg-green-700 transition w-full"
                  >
                    ✅ Confirm Assignment
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg border-l transition-transform z-50 ${
          showDrawer ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-lg font-semibold">📁 Assigned Projects</h2>
          <button
            onClick={() => setShowDrawer(false)}
            className="text-gray-500 hover:text-red-600 text-xl font-bold"
          >
            ×
          </button>
        </div>
        <div className="p-4">
          {Object.keys(assignments).length === 0 ? (
            <p className="text-sm text-gray-500">No users assigned yet.</p>
          ) : (
            <ul className="text-sm space-y-2">
              {Object.entries(assignments).map(([uid, proj]) => {
                const user = users.find((u) => u.id === Number(uid));
                return (
                  <li key={uid}>
                    <span className="font-medium">
                      {user?.firstName} {user?.lastName}
                    </span>{' '}
                    → <span className="text-blue-600 font-semibold">{proj}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
