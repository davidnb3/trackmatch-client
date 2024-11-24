import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { useSelector } from "react-redux";
import { useState, useCallback, useEffect } from "react";
import { camelotNotationMajor, camelotNotationMinor } from "@/lib/utils";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { tracksSlice } from "@/store/tracksSlice";
import disc from "@/assets/disc.svg";
import useAuth from "@/hooks/useAuth";
import {
  createTrackMatch,
  updateExistingTrackMatch,
} from "../store/trackMatchesSlice";
import { PlusCircledIcon, MinusCircledIcon } from "@radix-ui/react-icons";

AddTracks.propTypes = {
  trackMatch: PropTypes.shape({
    tracks: PropTypes.array,
    _id: PropTypes.string,
  }),
  children: PropTypes.node,
};

export function AddTracks({ children, trackMatch }) {
  const dispatch = useDispatch();
  const pendingTracks = useSelector((state) => state.tracks.pendingTracks);
  const [activeTrackIndex, setActiveTrackIndex] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [tracks, setTracks] = useState(trackMatch?.tracks || pendingTracks);
  // eslint-disable-next-line no-unused-vars
  const [searchQuery, setSearchQuery] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const { accessToken, refreshAccessToken, userData } = useAuth();

  useEffect(() => {
    setTracks(trackMatch?.tracks || pendingTracks);
  }, [pendingTracks, trackMatch]);

  const openDialog = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen(true);
  };

  const closeDialog = () => {
    setSearchResults([]);
    setIsOpen(false);

    if (!trackMatch) {
      resetTracks();
    }

    dispatch(tracksSlice.actions.resetPendingTracks());
  };

  const addTrack = () => {
    setTracks([
      ...tracks,
      {
        name: "",
        artist: "",
        artistSpotifyId: "",
        key: "",
        cover: disc,
        uri: "",
        user: userData._id,
      },
    ]);
  };

  const resetTracks = () => {
    setTracks([
      {
        name: "",
        artist: "",
        artistSpotifyId: "",
        key: "",
        cover: disc,
        uri: "",
        user: userData._id,
      },
      {
        name: "",
        artist: "",
        artistSpotifyId: "",
        key: "",
        cover: disc,
        uri: "",
        user: userData._id,
      },
    ]);
  };

  const removeTrack = () => {
    if (tracks.length > 1) {
      setTracks(tracks.slice(0, -1)); // Remove the last track
    }
  };

  function debounce(func, delay) {
    let debounceTimer;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(context, args), delay);
    };
  }

  const handleInputChange = (index, field, value) => {
    // Create a new copy of the tracks array
    const newTracks = tracks.map((track, i) => {
      // If this is the track we want to modify, return a new object
      if (i === index) {
        return { ...track, [field]: value };
      }
      // Otherwise, return the original track object
      return track;
    });

    setTracks(newTracks);

    if (field === "name" || field === "artist") {
      // Update the search query for this track
      const track = newTracks[index];
      const newSearchQuery = `${track.artist} ${track.name}`;
      setSearchQuery(newSearchQuery);
      debouncedSearch(newSearchQuery);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      if (searchQuery && searchQuery.trim() !== "") {
        try {
          let response = await fetch(
            `https://api.spotify.com/v1/search?query=${encodeURIComponent(
              searchQuery
            )}&type=track&limit=20`,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          const data = await response.json();
          const searchResults = data.tracks.items.map((item) => {
            // Try to find the image with a height of 300
            let selectedImage = item.album.images.find(
              (image) => image.height === 300
            );

            return {
              trackId: item.id,
              name: item.name,
              artist: item.artists[0].name,
              artistSpotifyId: item.artists[0].id,
              // If there's no image with a height of 300, just take the first one in the array
              cover: selectedImage
                ? selectedImage.url
                : item.album.images[0].url,
              uri: item.uri,
              user: userData._id,
            };
          });

          setSearchResults(searchResults);
        } catch (error) {
          console.error(error);
        }
      } else {
        setSearchResults([]);
      }
    }, 500),
    [userData, accessToken, refreshAccessToken]
  );

  const handleSelectResult = async (index, result) => {
    // Create a new copy of the tracks array
    const key = await getTrackKey(result);

    const newTracks = tracks.map((track, i) => {
      // If this is the track we want to modify, return a new object
      if (i === index) {
        return {
          ...track,
          name: result.name,
          artist: result.artist,
          artistSpotifyId: result.artistSpotifyId,
          key: key,
          cover: result.cover,
          uri: result.uri,
          user: userData._id,
        };
      }

      // Otherwise, return the original track object
      return track;
    });

    setTracks(newTracks);
    setSearchQuery(null);
    setSearchResults([]);
  };

  const getTrackKey = async (selectedTrack) => {
    try {
      let response = await fetch(
        `https://api.spotify.com/v1/audio-features/${selectedTrack.trackId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const data = await response.json();
      // Mode represents either major (1) or minor (0)
      let mode = data.mode;
      let camelotKey;
      if (mode === 0) {
        camelotKey = camelotNotationMinor[data.key];
      } else if (mode === 1) {
        camelotKey = camelotNotationMajor[data.key];
      } else {
        console.error("Invalid mode:", mode);
      }

      return camelotKey;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const submitTrackMatch = (tracks) => {
    for (let track of tracks) {
      if (!track.name || !track.artist || !track.key || !track.cover) {
        alert("Please fill in all fields.");
        return;
      }
    }

    // Get rid of the _id and __v fields from MongoDB
    // eslint-disable-next-line no-unused-vars
    const cleanedTracks = tracks.map(({ _id, __v, ...rest }) => rest);

    if (trackMatch) {
      dispatch(updateExistingTrackMatch({ id: trackMatch._id, tracks }));
    } else {
      dispatch(createTrackMatch(cleanedTracks));
      resetTracks();
    }

    setSearchQuery("");
    setSearchResults([]);
    closeDialog();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={openDialog}>
        <div className="relative">
          {children}

          {pendingTracks[0].name !== "" && (
            <div
              className="notification-badge absolute h-4 w-4 rounded-full bg-primary-500 animate-ping"
              style={{
                backgroundImage: `url(${
                  pendingTracks[pendingTracks.length - 1].cover
                })`,
              }}
            />
          )}
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-1">Add new tracks</DialogTitle>
          <DialogDescription>
            Add two or more tracks into a TrackMatch which you can drag and drop
            into as many playlists as you like.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {tracks.map((track, index) => (
            <div key={index} className="relative">
              <div
                key={index}
                className="grid grid-cols-7 items-center gap-4"
                style={{ gridTemplateColumns: "auto 1fr 1fr 1fr 1fr 1fr 1fr" }}
              >
                <img
                  src={track.cover}
                  alt={`album cover for track ${index + 1}`}
                  className="h-10 w-10 object-cover"
                />
                <Input
                  id={`trackName${index + 1}`}
                  value={track.name}
                  type="text"
                  placeholder="Track Name"
                  className="col-span-3"
                  aria-label={`track name ${index + 1}`}
                  onChange={(e) => {
                    handleInputChange(index, "name", e.target.value);
                    setActiveTrackIndex(index);
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setSearchResults([]);
                    }, 200);
                  }}
                />
                <Input
                  id={`artist${index + 1}`}
                  value={track.artist}
                  type="text"
                  placeholder="Artist"
                  className="col-span-2"
                  aria-label={`artist ${index + 1}`}
                  onChange={(e) => {
                    handleInputChange(index, "artist", e.target.value);
                    setActiveTrackIndex(index);
                  }}
                  onBlur={() => {
                    setTimeout(() => {
                      setSearchResults([]);
                    }, 200);
                  }}
                />
                <Input
                  id={`songKey${index + 1}`}
                  value={track.key}
                  type="text"
                  placeholder="Key"
                  className="col-span-1"
                  aria-label={`song key ${index + 1}`}
                  onChange={(e) =>
                    handleInputChange(index, "key", e.target.value)
                  }
                  onBlur={() => {
                    setTimeout(() => {
                      setSearchResults([]);
                    }, 200);
                  }}
                />
              </div>
              {activeTrackIndex === index && searchResults.length > 0 && (
                <div
                  className="absolute z-50 overflow-auto rounded-md border shadow-md bg-background"
                  style={{
                    gridTemplateColumns: "auto 1fr 1fr 1fr 1fr 1fr 1fr",
                    top: "50px",
                    left: 0,
                    right: 0,
                    maxHeight: "300px",
                  }}
                >
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-7 gap-4 items-center"
                      style={{
                        gridTemplateColumns: "auto 1fr 1fr 1fr 1fr 1fr 1fr",
                      }}
                      onClick={() =>
                        handleSelectResult(activeTrackIndex, result)
                      }
                    >
                      <img
                        src={result.cover}
                        alt={`cover for search result ${index + 1}`}
                        className="h-10 w-10 object-cover"
                      />
                      <div className="col-span-3 overflow-hidden text-ellipsis text-nowrap">
                        {result.name}
                      </div>
                      <div className="col-span-2 overflow-hidden text-ellipsis text-nowrap">
                        {result.artist}
                      </div>
                      <div className="col-span-1 overflow-hidden text-ellipsis text-nowrap"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="flex">
            <PlusCircledIcon
              aria-label="Add track"
              className="mr-2 h-4 w-4 cursor-pointer"
              onClick={addTrack}
            />
            <MinusCircledIcon
              aria-label="Remove track"
              className="mr-2 h-4 w-4 cursor-pointer"
              onClick={removeTrack}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={closeDialog} variant="outline">
            Cancel
          </Button>
          <Button type="submit" onClick={() => submitTrackMatch(tracks)}>
            Save TrackMatch
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
