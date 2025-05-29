import { useState } from "react";

import { tracks } from "../features/data/tracks";

import { TrackCard } from "../features/components/TrackCard";
import { Player } from "../features/components/Player";

import type { TrackData } from "../features/types";

export const Tracks = () => {
  const [selectedTrack, setSelectedTrack] = useState<TrackData | null>(null);

  return (
    <main className="max-w-2xl mx-auto p-6 pb-24 space-y-4">
      {selectedTrack && <Player track={selectedTrack} />}
      {tracks.map((track) => (
        <TrackCard key={track.id} track={track} onClick={setSelectedTrack} />
      ))}
    </main>
  );
};
