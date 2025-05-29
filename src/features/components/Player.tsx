import { useEffect, useRef, useState } from "react";
import type { TrackData } from "../types";

type PlayerProps = {
  track: TrackData | null;
};

export const Player = ({ track }: PlayerProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.load();
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play();
      }
    }
    setProgress(0);
    setCurrentTime(0);
    setDuration(0);
  }, [track]);

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
    const total = audioRef.current.duration || 1;
    setCurrentTime(current);
    setDuration(total);
    setProgress((current / total) * 100);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const percent = parseFloat(e.target.value);
    const total = audioRef.current.duration || 1;
    const newTime = (percent / 100) * total;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    setProgress(percent);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol;
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${m}:${s}`;
  };

  if (!track) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md p-4 flex flex-col sm:flex-row sm:items-center gap-4 z-50">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <img
          src={track.coverUrl}
          alt={track.title}
          className="w-12 h-12 object-cover rounded"
        />
        <div>
          <div className="font-medium">{track.title}</div>
          <div className="text-sm text-gray-500">{track.artist}</div>
        </div>
      </div>

      <div className="flex-1 w-full sm:w-auto flex flex-col sm:flex-row sm:items-center gap-2">
        <button
          onClick={togglePlay}
          className="text-xl px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          {isPlaying ? "⏸" : "▶️"}
        </button>

        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={handleSeek}
          className="w-full sm:w-48 accent-blue-500"
        />

        {/* 時間表示 */}
        <div className="text-sm text-gray-600 w-24 text-center">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        {/* 音量 */}
        <div className="flex items-center gap-2">
          <span className="text-gray-500 text-sm">🔉</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={handleVolumeChange}
            className="w-24 accent-blue-500"
          />
        </div>
      </div>

      <audio
        ref={audioRef}
        src={track.audioUrl}
        onTimeUpdate={handleTimeUpdate}
      />
    </div>
  );
};
