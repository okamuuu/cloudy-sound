import { BehaviorSubject, interval, fromEvent } from "rxjs";
import { map, takeUntil, filter } from "rxjs/operators";

const audio = new Audio();

export const isPlaying$ = new BehaviorSubject(false);
export const currentTime$ = new BehaviorSubject(0);
export const duration$ = new BehaviorSubject(0);
export const volume$ = new BehaviorSubject(1);
export const track$ = new BehaviorSubject<string | null>(null); // audio URL

// 再生処理
export function play(url?: string) {
  if (url && track$.value !== url) {
    track$.next(url);
    audio.src = url;
    audio.load();
  }
  audio.play();
  isPlaying$.next(true);
}

// 一時停止
export function pause() {
  audio.pause();
  isPlaying$.next(false);
}

// シーク
export function seek(to: number) {
  audio.currentTime = to;
  currentTime$.next(to);
}

// 音量調整
export function setVolume(vol: number) {
  audio.volume = vol;
  volume$.next(vol);
}

// ミュート切り替え
export function toggleMute() {
  audio.muted = !audio.muted;
}

// イベント購読
audio.addEventListener("timeupdate", () => {
  currentTime$.next(audio.currentTime);
});

audio.addEventListener("loadedmetadata", () => {
  duration$.next(audio.duration);
});

audio.addEventListener("ended", () => {
  isPlaying$.next(false);
});
