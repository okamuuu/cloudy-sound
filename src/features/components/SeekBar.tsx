function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${secs}`;
}

export const SeekBar = ({
  currentTime,
  duration,
  onSeek,
}: {
  currentTime: number;
  duration: number;
  onSeek: (value: number) => void;
}) => {
  const progress = (currentTime / duration) * 100;

  return (
    <div className="w-full flex justify-between items-center">
      <div className="w-3/4 ">
        <input
          type="range"
          min={0}
          max={duration}
          value={currentTime}
          onChange={(e) => onSeek(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right, #6b7280 ${progress}%, #d1d5db ${progress}%)`,
          }}
          className="w-full h-2 rounded-lg appearance-none 
             [&::-webkit-slider-thumb]:appearance-none 
             [&::-webkit-slider-thumb]:h-4 
             [&::-webkit-slider-thumb]:w-4 
             [&::-webkit-slider-thumb]:rounded-full 
             [&::-webkit-slider-thumb]:bg-white 
             [&::-webkit-slider-thumb]:border 
             [&::-webkit-slider-thumb]:border-gray-600
             focus:outline-none"
        />
      </div>
      <div className="text-gray-500 text-sm text-right font-mono tabular-nums whitespace-nowrap min-w-[80px]">
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
};
