import { createContext, useContext, useState, useEffect } from "react";
import useAuth from "@/hooks/useAuth";

const SpotifyPlayerContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSpotifyPlayer = () => {
  return useContext(SpotifyPlayerContext);
};

// eslint-disable-next-line react/prop-types
export const SpotifyPlayerProvider = ({ accessToken, children }) => {
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const { refreshAccessToken } = useAuth();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      // eslint-disable-next-line no-undef
      const player = new Spotify.Player({
        name: "Web Playback SDK",
        getOAuthToken: (cb) => {
          cb(accessToken);
        },
        volume: 0.5,
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        setDeviceId(device_id);
        setIsReady(true);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
        setIsReady(false);
      });

      player.addListener("player_state_changed", (state) => {
        if (state) {
          setCurrentTrack(state.track_window.current_track);
          setIsPlaying(!state.paused);
          setPosition(state.position);
          setDuration(state.duration);
        }
      });

      player.addListener("initialization_error", ({ message }) => {
        console.error(message);
      });

      player.addListener("authentication_error", ({ message }) => {
        console.error(message);
      });

      player.addListener("account_error", ({ message }) => {
        console.error(message);
      });

      player.addListener("playback_error", ({ message }) => {
        console.error(message);
      });

      player.connect();
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [accessToken]);

  const play = async (spotifyUri) => {
    try {
      let response = await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: "PUT",
          body: JSON.stringify({ uris: [spotifyUri] }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 401) {
        // Token expired, refresh it
        const newAccessToken = await refreshAccessToken();
        if (newAccessToken) {
          // Retry the original request with the new token
          response = await fetch(
            `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
            {
              method: "PUT",
              body: JSON.stringify({ uris: [spotifyUri] }),
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${newAccessToken}`,
              },
            }
          );
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const pause = () => {
    player.pause();
  };

  const resume = () => {
    player.resume();
  };

  const nextTrack = () => {
    player.nextTrack();
  };

  const previousTrack = () => {
    player.previousTrack();
  };

  const seek = (position) => {
    player.seek(position);
  };

  const setPlayerVolume = (volume) => {
    player.setVolume(volume);
    setVolume(volume);
  };

  return (
    <SpotifyPlayerContext.Provider
      value={{
        player,
        deviceId,
        isReady,
        isPlaying,
        currentTrack,
        position,
        duration,
        volume,
        play,
        pause,
        resume,
        nextTrack,
        previousTrack,
        seek,
        setPlayerVolume,
      }}
    >
      {children}
    </SpotifyPlayerContext.Provider>
  );
};
