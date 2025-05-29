export type Track = {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
};

export const TrackCard = ({ track }: { track: Track }) => {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-white shadow hover:bg-gray-100">
      <img
        src={track.coverUrl}
        alt={track.title}
        className="w-16 h-16 rounded-md object-cover"
      />
      <div>
        <h3 className="text-lg font-semibold">{track.title}</h3>
        <p className="text-gray-500">{track.artist}</p>
      </div>
    </div>
  );
};
