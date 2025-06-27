'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  phone: string;
  address: { city: string; street: string };
  bio: string;
  rating: number;
  department: string;
};

export default function EmployeeDetailPage() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'feedback'>('overview');
  const [feedbackText, setFeedbackText] = useState('');
  const [submittedFeedbacks, setSubmittedFeedbacks] = useState<string[]>([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch(`https://dummyjson.com/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const enrichedUser: User = {
          ...data,
          bio: `Passionate and result-oriented team player with experience in ${mockSkill()}.`,
          rating: Math.floor(Math.random() * 5) + 1,
          department: mockDepartment(),
        };
        setUser(enrichedUser);
      });
  }, [id]);

  const mockSkill = () => {
    const skills = ['Software Engineering', 'Marketing Strategy', 'Sales Ops', 'UI Design', 'Data Analysis'];
    return skills[Math.floor(Math.random() * skills.length)];
  };

  const mockDepartment = () => {
    const depts = ['Engineering', 'Marketing', 'Sales', 'HR', 'Design'];
    return depts[Math.floor(Math.random() * depts.length)];
  };

  const handleFeedbackSubmit = () => {
    if (!feedbackText.trim()) {
      setStatus('⚠️ Please enter feedback before submitting.');
      return;
    }
    setSubmittedFeedbacks((prev) => [...prev, feedbackText.trim()]);
    setFeedbackText('');
    setStatus('✅ Feedback submitted!');
    setTimeout(() => setStatus(''), 2000);
  };

  if (!user) return <p className="p-6 text-gray-500">Loading employee details...</p>;

  return (
    <main className="p-6">
      <Link href="/" className="text-sm text-blue-600 hover:underline mb-6 inline-block">
        ← Back to Dashboard
      </Link>

      <motion.div
        className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-md max-w-3xl mx-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-2xl font-bold mb-1">
          {user.firstName} {user.lastName}
        </h1>
        <p className="text-gray-600 mb-4">{user.email}</p>

        <div className="flex flex-wrap gap-4 mb-6">
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
            Dept: {user.department}
          </span>
          <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-1 rounded-full">
            {user.rating} ★ Rating
          </span>
          <span className="text-sm text-gray-500">Age: {user.age}</span>
          <span className="text-sm text-gray-500">Phone: {user.phone}</span>
        </div>

        <div className="mb-4 flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className={i < user.rating ? 'text-yellow-400' : 'text-gray-300'}>
              ★
            </span>
          ))}
        </div>

        <div className="mb-6">
          <p className="font-medium text-gray-700 mb-1">Address:</p>
          <p className="text-sm text-gray-600">
            {user.address.street}, {user.address.city}
          </p>
        </div>

        <div className="mb-6">
          <p className="font-medium text-gray-700 mb-1">Bio:</p>
          <p className="text-sm text-gray-600">{user.bio}</p>
        </div>

        <div>
          <div className="flex gap-6 border-b border-gray-300 dark:border-gray-700 mb-4">
            {['overview', 'projects', 'feedback'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`py-2 text-sm capitalize font-medium transition-colors duration-150 ${
                  activeTab === tab
                    ? 'text-blue-600 border-b-2 border-blue-500'
                    : 'text-gray-500 hover:text-blue-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-gray-700 dark:text-gray-300"
            >
              {activeTab === 'overview' && (
                <p>
                  {user.firstName} has consistently contributed to their department with strong KPIs and collaborative spirit.
                </p>
              )}

              {activeTab === 'projects' && (
                <ul className="list-disc ml-5 space-y-1">
                  <li>Project Apollo — Lead Developer</li>
                  <li>Website Redesign Initiative</li>
                  <li>Internal HR Portal Enhancements</li>
                </ul>
              )}

              {activeTab === 'feedback' && (
                <div className="space-y-4">
                  {submittedFeedbacks.length > 0 && (
                    <div className="italic text-gray-600 dark:text-gray-400 space-y-1">
                      {submittedFeedbacks.map((fb, idx) => (
                        <p key={idx}>"{fb}"</p>
                      ))}
                    </div>
                  )}

                  <div>
                    <textarea
                      rows={3}
                      placeholder="Write feedback here..."
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={feedbackText}
                      onChange={(e) => setFeedbackText(e.target.value)}
                    />
                    <button
                      onClick={handleFeedbackSubmit}
                      className="mt-2 bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 transition text-sm"
                    >
                      Submit Feedback
                    </button>
                    {status && (
                      <p className="text-xs mt-1 text-green-600 dark:text-green-400">
                        {status}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </main>
  );
}
