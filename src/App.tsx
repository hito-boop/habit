import React, { useState, useEffect } from 'react';
import { Plus, Sparkles, AlertCircle, Lock } from 'lucide-react';
import { Habit } from './types';
import { getTodayStr } from './utils/dateUtils';
import { HabitCard } from './components/HabitCard';
import { AddEditHabitModal } from './components/AddEditHabitModal';
import { AuthAndPinModal, UserProfile } from './components/AuthAndPinModal';

const STORAGE_HABITS_KEY = 'daily_tracker_habits_v3';
const STORAGE_USER_KEY = 'daily_tracker_user_profile_v3';

export default function App() {
  const [todayStr, setTodayStr] = useState<string>(getTodayStr());

  // Purge any old habit data stored under previous keys
  useEffect(() => {
    ['daily_tracker_habits_clean_v1', 'daily_tracker_habits_v1', 'daily_tracker_habits_v2'].forEach(
      (key) => localStorage.removeItem(key)
    );
  }, []);

  // User profile & PIN unlock state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to load user profile:', e);
    }
    return null;
  });

  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_USER_KEY);
    return !saved;
  });

  // Habits state (defaults to empty array)
  const [habits, setHabits] = useState<Habit[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_HABITS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load saved habits:', e);
    }
    return [];
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Keep today's date updated
  useEffect(() => {
    const interval = setInterval(() => {
      const nowStr = getTodayStr();
      if (nowStr !== todayStr) {
        setTodayStr(nowStr);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [todayStr]);

  // Persist habits to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_HABITS_KEY, JSON.stringify(habits));
    } catch (e) {
      console.error('Failed to save habits to localStorage:', e);
    }
  }, [habits]);

  // Save User Profile
  const handleSaveProfile = (profile: UserProfile) => {
    try {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(profile));
      setUserProfile(profile);
      setIsUnlocked(true);
      showToast(`Welcome, ${profile.name}!`);
    } catch (e) {
      console.error('Failed to save user profile:', e);
    }
  };

  // Erase All Data (PIN Recovery)
  const handleEraseAllData = () => {
    localStorage.removeItem(STORAGE_USER_KEY);
    localStorage.removeItem(STORAGE_HABITS_KEY);
    setUserProfile(null);
    setHabits([]);
    setIsUnlocked(false);
    showToast('All data erased.');
  };

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // Toggle completion state for a given date
  const handleToggleDate = (habitId: string, dateStr: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== habitId) return h;
        const exists = h.completedDates.includes(dateStr);
        const updatedDates = exists
          ? h.completedDates.filter((d) => d !== dateStr)
          : [...h.completedDates, dateStr];

        if (dateStr === todayStr && !exists) {
          showToast(`Completed "${h.title}" for today! 🎉`);
        }

        return {
          ...h,
          completedDates: updatedDates,
        };
      })
    );
  };

  // Create or Update Habit
  const handleSaveHabit = (habitData: Partial<Habit>) => {
    if (habitData.id) {
      setHabits((prev) =>
        prev.map((h) => (h.id === habitData.id ? ({ ...h, ...habitData } as Habit) : h))
      );
      showToast('Habit updated!');
    } else {
      const newHabit: Habit = {
        id: `habit-${Date.now()}`,
        title: habitData.title || 'New Habit',
        description: habitData.description || '',
        icon: habitData.icon || 'sparkles',
        color: habitData.color || 'pink',
        completedDates: habitData.completedDates || [],
        createdAt: habitData.createdAt || todayStr,
      };
      setHabits((prev) => [newHabit, ...prev]);
      showToast('New habit created!');
    }
  };

  // Delete Habit
  const handleDeleteHabit = (habitId: string) => {
    const habitToDelete = habits.find((h) => h.id === habitId);
    if (confirm(`Are you sure you want to delete "${habitToDelete?.title || 'this habit'}"?`)) {
      setHabits((prev) => prev.filter((h) => h.id !== habitId));
      showToast('Habit deleted.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-white selection:text-black pb-20 no-scrollbar overflow-x-hidden">
      {/* Auth / PIN Modal */}
      {(!userProfile || !isUnlocked) && (
        <AuthAndPinModal
          userProfile={userProfile}
          onSaveProfile={handleSaveProfile}
          onUnlock={() => setIsUnlocked(true)}
          onEraseAllData={handleEraseAllData}
        />
      )}

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:right-6 z-50 bg-zinc-900 border border-zinc-700 text-white px-5 py-3 rounded-full shadow-2xl text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header Greeting (No date, no bottom line) */}
      {userProfile && isUnlocked && (
        <header className="sticky top-0 z-30 w-full bg-black px-4 py-4">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Hello, {userProfile.name}
            </h1>

            <button
              onClick={() => setIsUnlocked(false)}
              className="p-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all cursor-pointer border border-zinc-800 active:scale-95 flex items-center gap-1.5 text-xs font-medium"
              title="Lock Screen"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock</span>
            </button>
          </div>
        </header>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 py-6 space-y-5 no-scrollbar">
        {/* Habit List */}
        {habits.length > 0 ? (
          <div className="space-y-4">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                todayStr={todayStr}
                onToggleDate={handleToggleDate}
                onDeleteHabit={handleDeleteHabit}
              />
            ))}
          </div>
        ) : (
          <div className="bg-zinc-900/90 rounded-3xl p-8 text-center space-y-4 my-auto mt-8 border border-zinc-800 shadow-xl">
            <div className="w-12 h-12 rounded-full bg-zinc-800 text-white flex items-center justify-center mx-auto border border-zinc-700">
              <AlertCircle className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div>
              <h3 className="text-white font-bold text-base sm:text-lg tracking-tight">
                No Habits Added
              </h3>
              <p className="text-zinc-400 text-xs sm:text-sm max-w-xs mx-auto mt-1 leading-relaxed font-normal">
                Start tracking your daily routines. Tap below to create your first habit.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-white hover:bg-zinc-200 text-black font-semibold px-5 py-3 rounded-full text-xs sm:text-sm inline-flex items-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" /> Create Habit
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Floating Action Button (FAB) Solid Dark / Light Style */}
      {userProfile && isUnlocked && (
        <button
          onClick={() => {
            setEditingHabit(null);
            setIsAddModalOpen(true);
          }}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-white hover:bg-zinc-200 text-black flex items-center justify-center shadow-2xl active:scale-90 transition-all cursor-pointer border border-zinc-300"
          title="Add Habit"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>
      )}

      {/* Add / Edit Habit Modal */}
      <AddEditHabitModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveHabit}
        editingHabit={editingHabit}
      />
    </div>
  );
}
