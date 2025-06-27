'use client';

import {
  Bar,
  Line
} from 'react-chartjs-2';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { useEffect, useState } from 'react';
import Link from 'next/link';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsPage() {
  const [departmentRatings, setDepartmentRatings] = useState<{ [dept: string]: number[] }>({});

  useEffect(() => {
    fetch('https://dummyjson.com/users?limit=20')
      .then((res) => res.json())
      .then((data) => {
        const depts = ['Engineering', 'Marketing', 'Sales', 'HR', 'Design'];
        const deptData: { [key: string]: number[] } = {};

        data.users.forEach((user: any) => {
          const dept = depts[Math.floor(Math.random() * depts.length)];
          const rating = Math.floor(Math.random() * 5) + 1;

          if (!deptData[dept]) deptData[dept] = [];
          deptData[dept].push(rating);
        });

        setDepartmentRatings(deptData);
      });
  }, []);

  const labels = Object.keys(departmentRatings);
  const avgRatings = labels.map(
    (dept) =>
      departmentRatings[dept].reduce((sum, r) => sum + r, 0) /
      departmentRatings[dept].length
  );

  const barData = {
    labels,
    datasets: [
      {
        label: 'Average Rating',
        data: avgRatings,
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderRadius: 8,
      },
    ],
  };

  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Bookmarks Added',
        data: [2, 5, 8, 6], // mocked data
        borderColor: 'rgba(255, 99, 132, 0.8)',
        backgroundColor: 'rgba(255, 99, 132, 0.3)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  return (
    <main className="p-6">
      <Link
        href="/"
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition mb-6"
      >
        ← Back to Dashboard
      </Link>

      <h1 className="text-2xl font-bold mb-6">📊 Analytics Dashboard</h1>

      <div className="mb-12 bg-white dark:bg-gray-900 shadow-md rounded-xl p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Department-wise Avg Ratings</h2>
        <Bar data={barData} />
      </div>

      <div className="bg-white dark:bg-gray-900 shadow-md rounded-xl p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Bookmark Trends</h2>
        <Line data={lineData} />
      </div>
    </main>
  );
}
