import { useEffect, useRef } from "react";
import { useMachine } from "@xstate/react";
import { playerMachine } from "../machines/playerMachine";
import { PiPlayThin, PiPauseThin } from "react-icons/pi";

import { Subject } from "rxjs";
import { debounceTime } from "rxjs/operators";

import { SeekBar } from "./SeekBar";

import type { TrackData } from "../types";

export const Player = ({ track }: { track: TrackData }) => {
  const [state, send] = useMachine(playerMachine);
  const isPlaying = state.matches("playing");
  const duration = state.context.duration;
  const currentTime = state.context.currentTime;
  const lastSeekSource = state.context.lastSeekSource;

  // seekSubjectはユーザーのシーク操作用
  const seekSubject = useRef(new Subject<number>()).current;
  useEffect(() => {
    const sub = seekSubject.pipe(debounceTime(10)).subscribe((time) => {
      if (audioRef.current) {
        audioRef.current.currentTime = time;
      }
    });
    return () => sub.unsubscribe();
  }, [seekSubject]);

  function handleChangeSeek(value: number) {
    const time = value;
    seekSubject.next(time); // audioのcurrentTime更新はdebounce後に
  }

  const audioRef = useRef<HTMLAudioElement>(null);

  // ステート遷移で再生／停止制御
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(console.error);
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  // トラック変更時に再ロード
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.load();
    send({ type: "play" });
  }, [send, track.audioUrl]);

  // currentTime を監視する
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (lastSeekSource !== "user") {
      return;
    }
    audio.currentTime = currentTime;
  }, [currentTime, lastSeekSource]);

  return (
    <>
      {/* Audio */}
      <audio
        ref={audioRef}
        src={track.audioUrl}
        preload="metadata"
        onLoadedMetadata={(e) => {
          const duration = e.currentTarget.duration;
          send({ type: "loaded", duration });
        }}
        onTimeUpdate={(e) => {
          const currentTime = e.currentTarget.currentTime;
          send({ type: "tick", value: currentTime, source: "system" });
        }}
      />
      {/* Player */}
      <div>
        <div className="flex flex-col w-full w-full bg-white rounded-xl p-4 flex items-center gap-2 border border-black/10">
          <div className="flex items-center gap-4 p-4 w-full">
            <div className="group relative w-16 h-16 rounded-full overflow-hidden shadow-md border-2 border-black/30">
              <img
                src={track.coverUrl}
                alt={track.artist}
                className="h-full object-cover hover:scale-110 transition-transform duration-300"
              />
              <button
                className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                onClick={() => send({ type: isPlaying ? "pause" : "play" })}
              >
                {isPlaying ? (
                  <PiPauseThin className="w-6 h-6" />
                ) : (
                  <PiPlayThin className="w-6 h-6" />
                )}
              </button>
            </div>
            <div className="w-auto flex flex-col gap-1 leading-tight">
              <div className="text-left text-sm font-semibold text-gray-400 truncate">
                {track.artist}
              </div>
              <div className="text-left text-sm text-gray-300 truncate">
                {track.title}
              </div>
            </div>
          </div>
          <div className="w-full flex items-center px-4">
            <SeekBar
              currentTime={currentTime}
              duration={duration}
              //   onSeek={(value) => send({ type: "seek", value, source: "user" })}
              onSeek={handleChangeSeek}
            />
          </div>
        </div>
      </div>
    </>
  );
};
