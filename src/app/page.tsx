'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserCard from '../components/UserCard';
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

export default function HomePage() {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [bookmarked, setBookmarked] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDepts, setSelectedDepts] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [showRatingDropdown, setShowRatingDropdown] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('demoUser');
    if (!user) {
      setAuthenticated(false);
      router.replace('/login');
    } else {
      setAuthenticated(true);
    }
  }, [router]);

  useEffect(() => {
    const stored = localStorage.getItem('bookmarks');
    if (stored) setBookmarked(JSON.parse(stored));
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    fetch('https://dummyjson.com/users?limit=20')
      .then((res) => res.json())
      .then((data) => {
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
      .catch(() => {
        setError('Failed to load users.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarked));
  }, [bookmarked]);

  const mockDepartment = () => {
    const depts = ['Engineering', 'Marketing', 'Sales', 'HR', 'Design'];
    return depts[Math.floor(Math.random() * depts.length)];
  };

  const toggleBookmark = (id: number) => {
    setBookmarked((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleDept = (dept: string) => {
    setSelectedDepts((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    );
  };

  const toggleRating = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating) ? prev.filter((r) => r !== rating) : [...prev, rating]
    );
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const handlePromote = (id: number) => {
    const promotedUser = users.find((user) => user.id === id);
    if (promotedUser) {
      alert(`${promotedUser.firstName} ${promotedUser.lastName} has been promoted! 🚀`);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDept =
      selectedDepts.length === 0 || selectedDepts.includes(user.department);
    const matchesRating =
      selectedRatings.length === 0 || selectedRatings.includes(user.rating);

    return matchesSearch && matchesDept && matchesRating;
  });

  if (authenticated === null) {
    return <main className="min-h-screen flex items-center justify-center">Checking auth...</main>;
  }

  return (
    <main className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">HR Performance Dashboard</h1>
        <button
          onClick={() => {
            localStorage.removeItem('demoUser');
            router.replace('/login');
          }}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          🚪 Logout
        </button>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center flex-wrap">
        <input
          type="text"
          placeholder="Search by name, email, or department"
          className="border border-gray-300 rounded px-3 py-2 w-full sm:w-80"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="relative">
          <button
            className="bg-white text-black dark:bg-gray-900 dark:text-white border border-gray-300 rounded px-3 py-2"
            onClick={() => setShowDeptDropdown((prev) => !prev)}
          >
            Filter by Department ⏷
          </button>
          {showDeptDropdown && (
            <div className="absolute z-10 bg-white dark:bg-gray-800 shadow p-3 rounded mt-1 space-y-1">
              {['Engineering', 'Marketing', 'Sales', 'HR', 'Design'].map((dept) => (
                <label key={dept} className="block text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedDepts.includes(dept)}
                    onChange={() => toggleDept(dept)}
                    className="mr-2"
                  />
                  {dept}
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            className="bg-white text-black dark:bg-gray-900 dark:text-white border border-gray-300 rounded px-3 py-2"
            onClick={() => setShowRatingDropdown((prev) => !prev)}
          >
            Filter by Rating ⏷
          </button>
          {showRatingDropdown && (
            <div className="absolute z-10 bg-white dark:bg-gray-800 shadow p-3 rounded mt-1 space-y-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <label key={rating} className="block text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedRatings.includes(rating)}
                    onChange={() => toggleRating(rating)}
                    className="mr-2"
                  />
                  {rating} ★
                </label>
              ))}
            </div>
          )}
        </div>

        <Link
          href="/bookmarks"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          📌 Bookmarks
        </Link>

        <Link
          href="/analytics"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          📊 Analytics Dashboard
        </Link>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.p
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-gray-600 dark:text-gray-400"
          >
            Loading users...
          </motion.p>
        ) : error ? (
          <motion.p
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-red-600 dark:text-red-400"
          >
            {error}
          </motion.p>
        ) : (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            {filteredUsers.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onBookmark={toggleBookmark}
                isBookmarked={bookmarked.includes(user.id)}
                onPromote={handlePromote}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
