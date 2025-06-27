'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type AssignmentMap = { [key: number]: string };

type AppContextType = {
  bookmarked: number[];
  toggleBookmark: (id: number) => void;

  assignments: AssignmentMap;
  assignUser: (id: number, project: string) => void;

  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

export const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [bookmarked, setBookmarked] = useState<number[]>([]);
  const [assignments, setAssignments] = useState<AssignmentMap>({});
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('bookmarks');
    if (stored) setBookmarked(JSON.parse(stored));

    const mode = localStorage.getItem('theme');
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarked));
  }, [bookmarked]);

  const toggleBookmark = (id: number) => {
    const updated = bookmarked.includes(id)
      ? bookmarked.filter((x) => x !== id)
      : [...bookmarked, id];

    setBookmarked(updated);
    localStorage.setItem('bookmarks', JSON.stringify(updated));

    // Bookmark trend tracking
    const trends = JSON.parse(localStorage.getItem('bookmarkTrends') || '{}');
    if (!bookmarked.includes(id)) trends[id] = Date.now();
    else delete trends[id];
    localStorage.setItem('bookmarkTrends', JSON.stringify(trends));
  };

  const assignUser = (id: number, project: string) => {
    setAssignments((prev) => ({ ...prev, [id]: project }));
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  return (
    <AppContext.Provider
      value={{
        bookmarked,
        toggleBookmark,
        assignments,
        assignUser,
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
