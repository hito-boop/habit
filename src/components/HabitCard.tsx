import React, { useState } from 'react';
import { Check, Trash2 } from 'lucide-react';
import { Habit } from '../types';
import { COLOR_PALETTES } from '../constants';
import { calculateStreak, buildDotMatrix, MatrixCell } from '../utils/dateUtils';

interface HabitCardProps {
  habit: Habit;
  todayStr: string;
  onToggleDate: (habitId: string, dateStr: string) => void;
  onDeleteHabit: (habitId: string) => void;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  todayStr,
  onToggleDate,
  onDeleteHabit,
}) => {
  const [hoveredCell, setHoveredCell] = useState<MatrixCell | null>(null);

  const palette = COLOR_PALETTES[habit.color] || COLOR_PALETTES.pink;
  const stats = calculateStreak(habit.completedDates, todayStr);

  // Build matrix with 6 rows and 24 columns (144 total days history)
  const rows = 6;
  const cols = 24;
  const matrix = buildDotMatrix(habit.completedDates, todayStr, rows, cols);

  const isCompletedToday = stats.completedToday;

  return (
    <div className="group relative bg-zinc-900 border border-zinc-800 rounded-3xl p-5 sm:p-6 transition-all duration-300 hover:border-zinc-700">
      {/* Header Row */}
      <div className="flex items-center justify-between gap-3 mb-4">
        {/* Left: Habit Title */}
        <div className="min-w-0 flex-1">
          <h3 className="text-white font-semibold text-base sm:text-lg tracking-tight truncate">
            {habit.title}
          </h3>
          {habit.description && (
            <p className="text-zinc-400 text-xs sm:text-sm font-normal truncate mt-0.5">
              {habit.description}
            </p>
          )}
        </div>

        {/* Right Controls: Delete & Today Check Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onDeleteHabit(habit.id)}
            className="p-2.5 rounded-2xl text-zinc-400 hover:text-rose-300 bg-zinc-800/80 hover:bg-rose-500/20 border border-zinc-700 hover:border-rose-500/30 transition-all cursor-pointer active:scale-95"
            title="Delete habit"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onToggleDate(habit.id, todayStr)}
            title={isCompletedToday ? 'Mark as incomplete for today' : 'Mark as completed today'}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-300 cursor-pointer ml-1 ${
              isCompletedToday
                ? `${palette.activeBg} ${palette.glow} scale-100 border border-white/40 shadow-lg`
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400 border border-zinc-700 hover:border-zinc-600 hover:scale-105 active:scale-95'
            }`}
          >
            <Check className={`w-5 h-5 stroke-[3] ${isCompletedToday ? 'text-white' : 'text-zinc-400'}`} />
          </button>
        </div>
      </div>

      {/* Matrix Heatmap Grid */}
      <div className="w-full overflow-x-auto no-scrollbar py-1">
        <div className="min-w-fit flex flex-col gap-[4px] sm:gap-[5px]">
          {matrix.map((row, rowIndex) => (
            <div key={rowIndex} className="flex gap-[4px] sm:gap-[5px]">
              {row.map((cell) => {
                const isHovered = hoveredCell?.dateStr === cell.dateStr;

                return (
                  <button
                    key={cell.dateStr}
                    onClick={() => onToggleDate(habit.id, cell.dateStr)}
                    onMouseEnter={() => setHoveredCell(cell)}
                    onMouseLeave={() => setHoveredCell(null)}
                    title={`${cell.formattedDate}: ${cell.isCompleted ? 'Completed' : 'Not completed'}`}
                    className={`w-[9.5px] h-[9.5px] sm:w-[11px] sm:h-[11px] rounded-[3px] transition-all duration-150 cursor-pointer ${
                      cell.isCompleted
                        ? `${palette.activeDot} ${isHovered ? 'scale-125 z-10 brightness-125 shadow-md' : ''}`
                        : `bg-zinc-800 hover:bg-zinc-700 ${isHovered ? 'scale-125 z-10 bg-zinc-600' : ''}`
                    } ${cell.isToday ? 'ring-1.5 ring-white ring-offset-1 ring-offset-black' : ''}`}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
