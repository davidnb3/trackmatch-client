import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { useState, useCallback } from "react";
import { camelotNotationMajor, camelotNotationMinor } from "@/lib/utils";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
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
  const [activeTrackIndex, setActiveTrackIndex] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [tracks, setTracks] = useState(
    trackMatch?.tracks || [
      {
        name: "",
        artist: "",
        key: "",
        cover:
          "https://i.scdn.co/image/ab67616d0000b2733d891016ec5a952aab252db1",
      },
      {
        name: "",
        artist: "",
        key: "",
        cover:
          "https://i.scdn.co/image/ab67616d0000b2733d891016ec5a952aab252db1",
      },
    ]
  );
  const [searchQuery, setSearchQuery] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen(true);
  };

  const closeDialog = () => {
    setSearchResults([]);
    resetTracks();
    setIsOpen(false);
  };

  const addTrack = () => {
    setTracks([
      ...tracks,
      {
        name: "",
        artist: "",
        key: "",
        cover:
          "https://i.scdn.co/image/ab67616d0000b2733d891016ec5a952aab252db1",
      },
    ]);
  };

  const resetTracks = () => {
    setTracks([
      {
        name: "",
        artist: "",
        key: "",
        cover:
          "https://i.scdn.co/image/ab67616d0000b2733d891016ec5a952aab252db1",
      },
      {
        name: "",
        artist: "",
        key: "",
        cover:
          "https://i.scdn.co/image/ab67616d0000b2733d891016ec5a952aab252db1",
      },
    ]);
  };

  const removeTrack = () => {
    if (tracks.length > 1) {
      setTracks(tracks.slice(0, -1)); // Remove the last track
    }
  };

  const submitTrackMatch = (tracks) => {
    for (let track of tracks) {
      if (!track.name || !track.artist || !track.key || !track.cover) {
        alert("Please fill in all fields.");
        return;
      }
    }

    if (trackMatch) {
      dispatch(updateExistingTrackMatch({ id: trackMatch._id, tracks }));
    } else {
      dispatch(createTrackMatch(tracks));
      resetTracks();
    }

    setSearchQuery("");
    setSearchResults([]);
    closeDialog();
  };

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
          key: key,
          cover: result.cover,
        };
      }

      // Otherwise, return the original track object
      return track;
    });

    setTracks(newTracks);
    setSearchQuery(null);
    setSearchResults([]);
  };

  const getTrackKey = (selectedTrack) => {
    return new Promise((resolve, reject) => {
      const accessToken = localStorage.getItem("spotifyAccessToken");
      fetch(`https://api.spotify.com/v1/audio-features/${selectedTrack.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          let mode = data.mode;
          let camelotKey;
          if (mode === 0) {
            camelotKey = camelotNotationMinor[data.key];
          } else if (mode === 1) {
            camelotKey = camelotNotationMajor[data.key];
          } else {
            console.error("Invalid mode:", mode);
          }

          resolve(camelotKey);
        })
        .catch((error) => {
          console.error(error);
          reject(error);
        });
    });
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
    debounce((searchQuery) => {
      console.log(searchQuery);
      if (searchQuery && searchQuery.trim() !== "") {
        const accessToken = localStorage.getItem("spotifyAccessToken");
        fetch(
          `https://api.spotify.com/v1/search?query=${encodeURIComponent(
            searchQuery
          )}&type=track&limit=20`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
          .then((response) => response.json())
          .then((data) => {
            const searchResults = data.tracks.items.map((item) => ({
              id: item.id,
              name: item.name,
              artist: item.artists[0].name,
              cover: item.album.images[0].url,
            }));
            setSearchResults(searchResults);
          })
          .catch((error) => console.error(error));
      } else {
        setSearchResults([]);
      }
    }, 500),
    [] // dependencies
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={openDialog}>
        {children}
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
                  onChange={(e) =>
                    handleInputChange(index, "artist", e.target.value)
                  }
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
              className="mr-2 h-4 w-4 cursor-pointer"
              onClick={addTrack}
            />
            <MinusCircledIcon
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
            Add tracks
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
