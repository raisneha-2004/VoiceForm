import React from 'react';

interface AudioWaveformProps {
  isRecording: boolean;
  volumeLevel: number; // 0 to 100
  barCount?: number;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  isRecording,
  volumeLevel,
  barCount = 12
}) => {
  return (
    <div className="flex items-center justify-center gap-1 h-8 px-2">
      {Array.from({ length: barCount }).map((_, i) => {
        // Compute responsive height based on volume and index
        const distance = Math.abs(i - (barCount - 1) / 2);
        const factor = Math.max(0.2, 1 - distance / (barCount / 2));
        const dynamicHeight = isRecording
          ? Math.max(6, Math.min(32, Math.round(volumeLevel * factor * 0.35 + Math.random() * 6)))
          : 4;

        return (
          <span
            key={i}
            className={`w-1 rounded-full transition-all duration-100 ${
              isRecording
                ? 'bg-gradient-to-t from-indigo-600 to-purple-400'
                : 'bg-slate-300 dark:bg-slate-700'
            }`}
            style={{ height: `${dynamicHeight}px` }}
          />
        );
      })}
    </div>
  );
};
