import type { TrackData } from "../types";

// export const Player = ({ track }: { track: TrackData }) => {
//   if (!track) return null;

//   return (
//     <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md p-4 flex items-center gap-4 z-50">
//       <img
//         src={track.coverUrl}
//         alt={track.title}
//         className="w-12 h-12 object-cover rounded"
//       />
//       <div>
//         <div className="font-medium">{track.title}</div>
//         <div className="text-sm text-gray-500">{track.artist}</div>
//       </div>
//     </div>
//   );
// };

import { useEffect, useRef, useState } from "react";

type PlayerProps = {
  track: TrackData | null;
};

export const Player = ({ track }: PlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play();
      }
    }
  }, [isPlaying, track]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration;
    setProgress((current / total) * 100);
  };

  if (!track) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md p-4 flex items-center gap-4 z-50">
      <img
        src={track.coverUrl}
        alt={track.title}
        className="w-12 h-12 object-cover rounded"
      />
      <div className="flex-1">
        <div className="font-medium">{track.title}</div>
        <div className="text-sm text-gray-500">{track.artist}</div>
        <div className="w-full h-2 bg-gray-200 rounded mt-2">
          <div
            className="h-2 bg-blue-500 rounded"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <button
        onClick={togglePlay}
        className="text-xl px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
      >
        {isPlaying ? "⏸" : "▶️"}
      </button>

      <audio
        ref={audioRef}
        src={track.audioUrl}
        onTimeUpdate={handleTimeUpdate}
      />
    </div>
  );
};
