import type { TrackData } from "../types";

export const Player = ({ track }: { track: TrackData }) => {
  if (!track) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-md p-4 flex items-center gap-4 z-50">
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
  );
};
