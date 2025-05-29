// src/machines/playerMachine.ts
import { setup, assign } from "xstate";
import { BehaviorSubject } from "rxjs";

export interface PlayerContext {
  isMuted: boolean;
  loop: boolean;
  volume: number;
  currentTime: number;
  duration: number;
}

export type PlayerEvent =
  | { type: "play" }
  | { type: "pause" }
  | { type: "toggleMute" }
  | { type: "toggleLoop" }
  | { type: "changeVolume"; value: number }
  | { type: "seek"; value: number }
  | { type: "loaded"; duration: number }
  | { type: "updateTime"; value: number };

// 状態の外部通知用の BehaviorSubject
export const player$ = new BehaviorSubject<PlayerContext & { state: string }>({
  isMuted: false,
  loop: false,
  volume: 1,
  currentTime: 0,
  duration: 0,
  state: "paused",
});

export const playerMachine = setup({
  types: {
    context: {} as PlayerContext,
    events: {} as PlayerEvent,
  },
  actions: {
    notify: ({ context, self }) => {
      const currentState = self.getSnapshot().value as string;
      player$.next({ ...context, state: currentState });
    },
  },
}).createMachine({
  id: "player",
  initial: "paused",
  context: {
    isMuted: false,
    loop: false,
    volume: 1,
    currentTime: 0,
    duration: 0,
  },
  states: {
    playing: {
      entry: "notify",
      on: {
        pause: {
          target: "paused",
        },
      },
    },
    paused: {
      entry: "notify",
      on: {
        play: {
          target: "playing",
        },
      },
    },
  },
  on: {
    toggleMute: {
      actions: assign({
        isMuted: ({ context }) => !context.isMuted,
      }),
    },
    toggleLoop: {
      actions: assign({
        loop: ({ context }) => !context.loop,
      }),
    },
    changeVolume: {
      actions: assign({
        volume: ({ event }) => event.value,
      }),
    },
    seek: {
      actions: assign({
        currentTime: ({ event }) => event.value,
      }),
    },
    loaded: {
      actions: assign({
        duration: ({ event }) => event.duration,
      }),
    },
    updateTime: {
      actions: assign({
        currentTime: ({ event }) => event.value,
      }),
    },
  },
});
