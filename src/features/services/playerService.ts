import { Subject } from "rxjs";

export type AudioTypeData = "TIME_UPDATE" | "DURATION_CHANGE" | "ENDED";

export const audioEvents$ = new Subject<{
  type: AudioTypeData;
  value?: number;
}>();

export function setupAudioListeners(audio: HTMLAudioElement) {
  const timeUpdate = () =>
    audioEvents$.next({ type: "TIME_UPDATE", value: audio.currentTime });
  const durationChange = () =>
    audioEvents$.next({ type: "DURATION_CHANGE", value: audio.duration });
  const ended = () => audioEvents$.next({ type: "ENDED" });

  audio.addEventListener("timeupdate", timeUpdate);
  audio.addEventListener("durationchange", durationChange);
  audio.addEventListener("ended", ended);

  return () => {
    audio.removeEventListener("timeupdate", timeUpdate);
    audio.removeEventListener("durationchange", durationChange);
    audio.removeEventListener("ended", ended);
  };
}
