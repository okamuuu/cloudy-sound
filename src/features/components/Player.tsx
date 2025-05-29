import { useEffect, useState } from "react";
import {
  play,
  pause,
  seek,
  setVolume,
  toggleMute,
  isPlaying$,
  currentTime$,
  duration$,
  volume$,
} from "../services/playerService";

export const Player = ({ url }: { url: string }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVol] = useState(1);

  useEffect(() => {
    const subs = [
      isPlaying$.subscribe(setIsPlaying),
      currentTime$.subscribe(setCurrentTime),
      duration$.subscribe(setDuration),
      volume$.subscribe(setVol),
    ];

    play(url); // 自動再生

    return () => subs.forEach((s) => s.unsubscribe());
  }, [url]);

  return (
    <div className="p-4 bg-gray-900 text-white">
      <button onClick={() => (isPlaying ? pause() : play())}>
        {isPlaying ? "⏸" : "▶️"}
      </button>
      <input
        type="range"
        min={0}
        max={duration}
        step={0.1}
        value={currentTime}
        onChange={(e) => seek(Number(e.target.value))}
      />
      <span>
        {format(currentTime)} / {format(duration)}
      </span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
      />
      <button onClick={toggleMute}>🔇</button>
    </div>
  );
};

function format(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
