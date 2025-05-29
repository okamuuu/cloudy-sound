import { useEffect, useRef } from "react";
import { audioEvents$, setupAudioListeners } from "../services/playerService";

import { useMachine } from "@xstate/react";
import { playerMachine } from "../machines/playerMachine";

export function Player() {
  const [state, send] = useMachine(playerMachine);
  const isPlaying = state.matches("playing");
  const isMuted = state.context.isMuted;
  const volume = state.context.volume;
  const currentTime = state.context.currentTime;
  const duration = state.context.duration;

  //

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex flex-col">
      <div className="flex items-center space-x-4">
        <button onClick={() => send({ type: isPlaying ? "pause" : "play" })}>
          {state.matches("playing") ? "Pause" : "Play"}
        </button>
        <input
          type="range"
          min={0}
          max={state.context.duration || 0}
          value={state.context.currentTime}
          onChange={(e) =>
            send({ type: "seek", value: Number(e.target.value) })
          }
          className="flex-grow"
        />
        <span>
          {formatTime(state.context.currentTime)} /{" "}
          {formatTime(state.context.duration)}
        </span>
        {/* <button onClick={() => send({ type: "TOGGLE_MUTE" })}>
          {state.context.isMuted ? "Unmute" : "Mute"}
        </button>
        <button
          onClick={() => send({ type: "TOGGLE_LOOP" })}
          className={
            state.context.loop
              ? "bg-green-600 px-2 py-1 rounded"
              : "bg-gray-700 px-2 py-1 rounded"
          }
        >
          Loop
        </button> */}
      </div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={state.context.volume}
        onChange={(e) =>
          send({ type: "CHANGE_VOLUME", value: Number(e.target.value) })
        }
        className="mt-2"
      />
    </div>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}
