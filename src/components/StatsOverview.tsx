import React from 'react';
import { Flame, CheckCircle2, Circle, Trophy } from 'lucide-react';
import { Habit } from '../types';
import { calculateStreak } from '../utils/dateUtils';

interface StatsOverviewProps {
  habits: Habit[];
  todayStr: string;
  activeFilter: 'all' | 'pending' | 'completed';
  setActiveFilter: (filter: 'all' | 'pending' | 'completed') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  habits,
  todayStr,
  activeFilter,
  setActiveFilter,
  searchQuery,
  setSearchQuery,
}) => {
  const completedTodayCount = habits.filter((h) =>
    h.completedDates.includes(todayStr)
  ).length;

  const pendingTodayCount = habits.length - completedTodayCount;

  // Calculate top current streak across habits
  const maxStreak = habits.reduce((max, h) => {
    const s = calculateStreak(h.completedDates, todayStr);
    return Math.max(max, s.currentStreak);
  }, 0);

  return (
    <div className="space-y-3 mb-5">
      {/* Overview Cards Row */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
        <div className="bg-[#151519] border border-zinc-800/80 p-3 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] sm:text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Done
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-bold text-white">
              {completedTodayCount}
            </span>
            <span className="text-xs text-zinc-500">/ {habits.length}</span>
          </div>
        </div>

        <div className="bg-[#151519] border border-zinc-800/80 p-3 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] sm:text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <Circle className="w-3.5 h-3.5 text-amber-400" /> Pending
          </span>
          <div className="mt-1">
            <span className="text-xl sm:text-2xl font-bold text-white">
              {pendingTodayCount}
            </span>
          </div>
        </div>

        <div className="bg-[#151519] border border-zinc-800/80 p-3 rounded-xl flex flex-col justify-between">
          <span className="text-[10px] sm:text-xs font-medium text-zinc-400 uppercase tracking-wider flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-pink-500 fill-pink-500/20" /> Best Streak
          </span>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-bold text-white">
              {maxStreak}
            </span>
            <span className="text-xs text-zinc-500">days</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-1 bg-[#151519] border border-zinc-800/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeFilter === 'all'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            All ({habits.length})
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeFilter === 'pending'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            To Do ({pendingTodayCount})
          </button>
          <button
            onClick={() => setActiveFilter('completed')}
            className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeFilter === 'completed'
                ? 'bg-zinc-800 text-white shadow-sm'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Done ({completedTodayCount})
          </button>
        </div>

        {/* Search input if habits count > 3 */}
        {habits.length > 3 && (
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search habits..."
            className="bg-[#151519] border border-zinc-800/80 text-xs text-white placeholder-zinc-500 px-3 py-1.5 rounded-xl focus:outline-none focus:border-zinc-700 transition-colors w-full sm:w-48"
          />
        )}
      </div>
    </div>
  );
};
