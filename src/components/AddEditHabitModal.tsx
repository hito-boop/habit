import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Habit, HabitColor } from '../types';
import { COLOR_PALETTES } from '../constants';
import { getTodayStr } from '../utils/dateUtils';

interface AddEditHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (habitData: Partial<Habit>) => void;
  editingHabit?: Habit | null;
}

export const AddEditHabitModal: React.FC<AddEditHabitModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingHabit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState<HabitColor>('pink');

  useEffect(() => {
    if (editingHabit) {
      setTitle(editingHabit.title);
      setDescription(editingHabit.description);
      setColor(editingHabit.color);
    } else {
      setTitle('');
      setDescription('');
      setColor('pink');
    }
  }, [editingHabit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      ...(editingHabit ? { id: editingHabit.id } : {}),
      title: title.trim(),
      description: description.trim(),
      icon: editingHabit?.icon || 'sparkles',
      color,
      completedDates: editingHabit ? editingHabit.completedDates : [],
      createdAt: editingHabit ? editingHabit.createdAt : getTodayStr(),
    });

    onClose();
  };

  const selectedPalette = COLOR_PALETTES[color];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 animate-fade-in">
      <div
        className="fixed inset-0"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-zinc-900 rounded-3xl shadow-2xl overflow-hidden z-10 p-6 text-white border border-zinc-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <h2 className="text-lg font-bold tracking-tight text-white">
            {editingHabit ? 'Edit Habit' : 'Create New Habit'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-2xl text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Habit Name input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-1.5">
              Habit Name *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Reading, Running, Meditation"
              required
              className="w-full bg-zinc-800 border border-zinc-700 focus:border-zinc-500 rounded-2xl px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-none transition-all"
            />
          </div>

          {/* Color selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
              Color
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
              {(Object.keys(COLOR_PALETTES) as HabitColor[]).map((cKey) => {
                const pal = COLOR_PALETTES[cKey];
                const isSelected = color === cKey;
                return (
                  <button
                    key={cKey}
                    type="button"
                    onClick={() => setColor(cKey)}
                    className={`w-full aspect-square rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                      isSelected ? 'scale-110 ring-2 ring-white ring-offset-2 ring-offset-black shadow-lg' : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: pal.hex }}
                    title={pal.name}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl text-sm font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-5 py-2.5 rounded-2xl text-sm font-semibold text-white shadow-xl transition-all cursor-pointer active:scale-95 ${selectedPalette.activeBg}`}
            >
              {editingHabit ? 'Save Changes' : 'Create Habit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
