import { TrackCard } from "../features/components/TrackCard";
import { tracks } from "../features/data/tracks";

export const Tracks = () => {
  return (
    <main className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">Tracks</h1>
      {tracks.map((track) => (
        <TrackCard key={track.id} track={track} />
      ))}
    </main>
  );
};
