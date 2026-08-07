import React, { useState } from 'react';
import { User, ArrowRight, Delete, Trash2, ShieldAlert } from 'lucide-react';

export interface UserProfile {
  name: string;
  pin: string;
}

interface AuthAndPinModalProps {
  userProfile: UserProfile | null;
  onSaveProfile: (profile: UserProfile) => void;
  onUnlock: () => void;
  onEraseAllData: () => void;
}

export const AuthAndPinModal: React.FC<AuthAndPinModalProps> = ({
  userProfile,
  onSaveProfile,
  onUnlock,
  onEraseAllData,
}) => {
  // Onboarding steps: 'name' -> 'pin'
  const [setupStep, setSetupStep] = useState<'name' | 'pin'>('name');
  const [setupName, setSetupName] = useState('');
  const [setupPin, setSetupPin] = useState('');

  // Unlock state
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [showEraseConfirm, setShowEraseConfirm] = useState(false);

  // Keypad button press handler
  const handleNumClick = (num: number) => {
    if (!userProfile) {
      if (setupStep === 'pin' && setupPin.length < 5) {
        const nextPin = setupPin + num.toString();
        setSetupPin(nextPin);
        if (nextPin.length === 5) {
          setTimeout(() => {
            onSaveProfile({
              name: setupName.trim(),
              pin: nextPin,
            });
          }, 150);
        }
      }
    } else {
      if (enteredPin.length < 5) {
        setPinError(false);
        const nextPin = enteredPin + num.toString();
        setEnteredPin(nextPin);
        if (nextPin.length === 5) {
          if (nextPin === userProfile.pin) {
            setTimeout(() => onUnlock(), 150);
          } else {
            setTimeout(() => {
              setPinError(true);
              setEnteredPin('');
            }, 250);
          }
        }
      }
    }
  };

  const handleBackspace = () => {
    if (!userProfile) {
      if (setupStep === 'pin' && setupPin.length > 0) {
        setSetupPin((prev) => prev.slice(0, -1));
      }
    } else {
      if (enteredPin.length > 0) {
        setPinError(false);
        setEnteredPin((prev) => prev.slice(0, -1));
      }
    }
  };

  // STEP 1: ASK FOR NAME FIRST
  if (!userProfile && setupStep === 'name') {
    const handleNameNext = (e: React.FormEvent) => {
      e.preventDefault();
      if (setupName.trim()) {
        setSetupStep('pin');
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 animate-fade-in text-white">
        <div className="relative w-full max-w-sm bg-zinc-900 rounded-3xl p-7 shadow-2xl border border-zinc-800 text-center">
          <div className="w-14 h-14 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center mx-auto mb-4">
            <User className="w-7 h-7 text-white stroke-[2]" />
          </div>

          <h2 className="text-xl font-bold tracking-tight mb-1">Welcome!</h2>
          <p className="text-xs text-zinc-400 mb-6">
            Let's get started. What should we call you?
          </p>

          <form onSubmit={handleNameNext} className="space-y-5 text-left">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-300 mb-2">
                Your Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={setupName}
                  onChange={(e) => setSetupName(e.target.value)}
                  placeholder="e.g. Alex"
                  autoFocus
                  required
                  className="w-full bg-zinc-800 border border-zinc-700 focus:border-zinc-500 rounded-2xl pl-11 pr-4 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!setupName.trim()}
              className="w-full py-3.5 rounded-2xl bg-white text-black font-semibold text-sm shadow-lg hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Next</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // STEP 2 / UNLOCK PAGE (Top White Section, Bottom Black Keypad Section)
  const currentPin = !userProfile ? setupPin : enteredPin;
  const nameToDisplay = !userProfile ? setupName : userProfile.name;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-black text-white max-w-md mx-auto overflow-hidden animate-fade-in select-none">
      {/* TOP SECTION: WHITE BACKGROUND, BLACK TEXT */}
      <div className="flex-1 bg-white text-black px-6 pt-12 pb-8 flex flex-col items-center justify-center text-center transition-colors duration-300">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black mb-2">
          {!userProfile ? `Set up PIN, ${nameToDisplay}` : `Welcome back, ${nameToDisplay}`}
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 max-w-xs mb-8 leading-relaxed">
          {!userProfile
            ? 'Choose a 5-digit PIN combination to secure your habits.'
            : 'Still remember that knock-knock combination we agreed on?'}
        </p>

        {/* 5 PIN Boxes */}
        <div className="flex items-center justify-center gap-3 mb-3">
          {Array.from({ length: 5 }).map((_, idx) => {
            const isFilled = idx < currentPin.length;
            return (
              <div
                key={idx}
                className={`w-12 h-14 rounded-2xl border-2 flex items-center justify-center transition-all duration-200 ${
                  isFilled
                    ? 'border-black bg-black text-white scale-105 shadow-md'
                    : 'border-zinc-300 bg-zinc-100'
                }`}
              >
                {isFilled && <div className="w-3.5 h-3.5 rounded-full bg-white" />}
              </div>
            );
          })}
        </div>

        <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest mt-2">
          {!userProfile ? 'Set your 5-digit pin' : 'Enter your pin'}
        </p>

        {pinError && (
          <p className="text-xs text-rose-600 font-semibold mt-3 animate-shake">
            Incorrect PIN. Please try again.
          </p>
        )}
      </div>

      {/* BOTTOM SECTION: BLACK BACKGROUND KEYPAD */}
      <div className="bg-black text-white px-6 py-6 border-t border-zinc-800">
        {/* Keypad Grid (3x4) */}
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNumClick(num)}
              className="h-14 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-xl font-bold text-white flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm"
            >
              {num}
            </button>
          ))}

          {/* Empty spacer / Erase Option */}
          <div className="h-14 flex items-center justify-center">
            {!userProfile && setupStep === 'pin' && (
              <button
                type="button"
                onClick={() => setSetupStep('name')}
                className="text-xs text-zinc-400 hover:text-white font-medium"
              >
                Back
              </button>
            )}
          </div>

          {/* 0 button */}
          <button
            onClick={() => handleNumClick(0)}
            className="h-14 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-xl font-bold text-white flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm"
          >
            0
          </button>

          {/* Backspace button */}
          <button
            onClick={handleBackspace}
            className="h-14 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800 text-white flex items-center justify-center transition-all active:scale-90 cursor-pointer shadow-sm"
            title="Delete"
          >
            <Delete className="w-5 h-5 stroke-[2]" />
          </button>
        </div>

        {/* Returning User: Forgot PIN Option */}
        {userProfile && (
          <div className="mt-4 pt-3 border-t border-zinc-900 text-center">
            {!showEraseConfirm ? (
              <button
                type="button"
                onClick={() => setShowEraseConfirm(true)}
                className="text-xs text-zinc-500 hover:text-rose-400 font-medium transition-colors cursor-pointer inline-flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Forgot PIN? Erase All Data</span>
              </button>
            ) : (
              <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-left space-y-2">
                <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>Erase All Data?</span>
                </div>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  For security, forgetting your PIN requires erasing all local data to set up a new PIN.
                </p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowEraseConfirm(false)}
                    className="flex-1 py-1.5 rounded-xl text-xs font-medium text-zinc-300 bg-white/5 hover:bg-white/10 text-center"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onEraseAllData}
                    className="flex-1 py-1.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 shadow-md text-center"
                  >
                    Confirm Erase
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

