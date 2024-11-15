import { createContext, useContext, useState, useEffect } from "react";

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
        console.log("Ready with Device ID", device_id);
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

  const play = (spotifyUri) => {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
      method: "PUT",
      body: JSON.stringify({ uris: [spotifyUri] }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
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

  return (
    <SpotifyPlayerContext.Provider
      value={{
        player,
        deviceId,
        isReady,
        isPlaying,
        currentTrack,
        play,
        pause,
        resume,
        nextTrack,
        previousTrack,
      }}
    >
      {children}
    </SpotifyPlayerContext.Provider>
  );
};
