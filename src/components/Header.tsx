import React, { useState } from 'react';
import { Plus, RotateCcw, Calendar, Sparkles, Download, Upload, Trash2 } from 'lucide-react';

interface HeaderProps {
  todayStr: string;
  onOpenAddModal: () => void;
  onClearAllData: () => void;
  onExportData: () => void;
  onImportData: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Header: React.FC<HeaderProps> = ({
  todayStr,
  onOpenAddModal,
  onClearAllData,
  onExportData,
  onImportData,
}) => {
  const [showSettings, setShowSettings] = useState(false);

  // Format today's date neatly
  const parts = todayStr.split('-');
  const todayDateObj = parts.length === 3 ? new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])) : new Date();
  const dateFormatted = todayDateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-30 bg-[#0c0c0e]/95 backdrop-blur-md border-b border-zinc-800/80 px-3.5 sm:px-5 py-3">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2.5">
        {/* Brand & Date */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-pink-500 via-amber-500 to-blue-500 p-0.5 shadow-md shrink-0">
            <div className="w-full h-full bg-zinc-950 rounded-[6px] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="text-white font-bold text-base tracking-tight truncate">
                Daily Tracker
              </h1>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-zinc-800/90 text-zinc-300 border border-zinc-700/50 flex items-center gap-1 font-medium">
                <Calendar className="w-3 h-3 text-zinc-400" />
                {dateFormatted}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onOpenAddModal}
            className="bg-white hover:bg-zinc-100 text-zinc-900 font-semibold px-3 py-1.5 rounded-xl text-xs flex items-center gap-1 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add</span>
          </button>

          {/* Settings / Menu */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors cursor-pointer"
              title="Options"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {showSettings && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowSettings(false)}
                />
                <div className="absolute right-0 top-10 z-20 w-48 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-1 text-xs text-zinc-300">
                  <div className="px-3 py-1 text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                    Settings & Backup
                  </div>

                  <button
                    onClick={() => {
                      setShowSettings(false);
                      onExportData();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-zinc-800 flex items-center gap-2 text-zinc-200"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-400" />
                    Export Local Data
                  </button>

                  <label className="w-full text-left px-3 py-2 hover:bg-zinc-800 flex items-center gap-2 text-zinc-200 cursor-pointer">
                    <Upload className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Import Backup</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => {
                        setShowSettings(false);
                        onImportData(e);
                      }}
                      className="hidden"
                    />
                  </label>

                  <div className="my-1 border-t border-zinc-800" />

                  <button
                    onClick={() => {
                      setShowSettings(false);
                      onClearAllData();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-rose-500/10 flex items-center gap-2 text-rose-400"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                    Clear All Habits
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
