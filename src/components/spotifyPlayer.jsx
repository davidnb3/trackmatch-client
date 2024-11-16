import { useSpotifyPlayer } from "@/contexts/useSpotifyPlayer";
import { PlayIcon, PauseIcon, SpeakerLoudIcon } from "@radix-ui/react-icons";

const Player = () => {
  const {
    isReady,
    isPlaying,
    currentTrack,
    position,
    duration,
    volume,
    pause,
    resume,
    seek,
    setPlayerVolume,
  } = useSpotifyPlayer();

  const handleSeek = (e) => {
    seek(e.target.value);
  };

  const handleVolumeChange = (e) => {
    setPlayerVolume(e.target.value);
  };

  if (!isReady) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 flex items-center justify-between">
      {currentTrack && (
        <div className="flex items-center space-x-4">
          <img
            src={currentTrack.album.images[0].url}
            alt={currentTrack.name}
            className="w-16 h-16"
          />
          <div>
            <h3 className="text-lg font-medium">{currentTrack.name}</h3>
            <p className="text-sm text-gray-400">
              {currentTrack.artists[0].name}
            </p>
          </div>
        </div>
      )}
      <div className="flex items-center space-x-4">
        {isPlaying ? (
          <button onClick={pause}>
            <PauseIcon className="w-6 h-6" />
          </button>
        ) : (
          <button onClick={resume}>
            <PlayIcon className="w-6 h-6" />
          </button>
        )}
      </div>
      <div className="flex items-center space-x-4">
        <input
          type="range"
          min="0"
          max={duration}
          value={position}
          onChange={handleSeek}
          className="w-64"
        />
        <div className="flex items-center space-x-2">
          <SpeakerLoudIcon className="w-6 h-6" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default Player;
