'use client';

import Link from 'next/link';
import { FC } from 'react';

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  department: string;
  rating: number;
  level?: number; // 👈 Added
  lastPromotedAt?: string; // 👈 Added
};

type Props = {
  user: User;
  onBookmark: (id: number) => void;
  isBookmarked: boolean;
  onPromote: (id: number) => void;
};

const UserCard: FC<Props> = ({ user, onBookmark, isBookmarked, onPromote }) => {
  return (
    <div
      className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 w-full sm:w-[300px]"
      aria-label={`Card for ${user.firstName} ${user.lastName}`}
    >
      <h2 className="text-xl font-semibold" aria-label="Employee name">
        {user.firstName} {user.lastName}
      </h2>
      <p className="text-gray-500 text-sm" aria-label="Email">{user.email}</p>
      <p className="text-sm mt-1" aria-label="Age">Age: {user.age}</p>
      <p className="text-sm" aria-label="Department">Dept: {user.department}</p>

      {user.level !== undefined && (
        <p className="text-sm mt-1" aria-label="Level">Level: {user.level}</p>
      )}

      {user.lastPromotedAt && (
        <p className="text-xs text-gray-400 italic">Last promoted: {new Date(user.lastPromotedAt).toLocaleDateString()}</p>
      )}

      <div className="mt-2 flex items-center gap-1" aria-label="User rating">
        {[...Array(5)].map((_, i) => (
          <span
            key={i}
            className={i < user.rating ? 'text-yellow-400' : 'text-gray-300'}
            aria-hidden="true"
          >
            ★
          </span>
        ))}
        <span className="sr-only">{user.rating} out of 5 stars</span>
      </div>

      <div className="mt-4 flex justify-between text-sm">
        <Link
          href={`/employee/${user.id}`}
          className="text-blue-500 hover:underline"
          aria-label={`View details for ${user.firstName}`}
        >
          View
        </Link>
        <button
          className={`font-semibold ${isBookmarked ? 'text-red-500' : 'text-green-500'}`}
          onClick={() => onBookmark(user.id)}
          aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this user'}
        >
          {isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
        </button>
        <button
          onClick={() => onPromote(user.id)}
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
          aria-label={`Promote ${user.firstName}`}
        >
          🚀 Promote
        </button>
      </div>
    </div>
  );
};

export default UserCard;
