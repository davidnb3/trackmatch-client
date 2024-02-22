import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen(true);
  };
  const closeDialog = () => setIsOpen(false);

  const [tracks, setTracks] = useState(
    trackMatch?.tracks || [
      {
        name: "",
        artist: "",
        key: "",
        cover:
          "https://images.unsplash.com/photo-1615247001958-f4bc92fa6a4a?w=300&dpr=2&q=80",
      },
      {
        name: "",
        artist: "",
        key: "",
        cover:
          "https://images.unsplash.com/photo-1615247001958-f4bc92fa6a4a?w=300&dpr=2&q=80",
      },
    ]
  );

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
  };

  const addTrack = () => {
    setTracks([
      ...tracks,
      {
        name: "",
        artist: "",
        key: "",
        cover:
          "https://images.unsplash.com/photo-1615247001958-f4bc92fa6a4a?w=300&dpr=2&q=80",
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
          "https://images.unsplash.com/photo-1615247001958-f4bc92fa6a4a?w=300&dpr=2&q=80",
      },
      {
        name: "",
        artist: "",
        key: "",
        cover:
          "https://images.unsplash.com/photo-1615247001958-f4bc92fa6a4a?w=300&dpr=2&q=80",
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
      closeDialog();
    } else {
      dispatch(createTrackMatch(tracks));
      closeDialog();
      resetTracks();
    }
  };

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
            <div key={index} className="grid grid-cols-6 items-center gap-4">
              <Input
                id={`trackName${index + 1}`}
                value={track.name}
                type="text"
                placeholder="Another Night"
                className="col-span-3"
                aria-label={`track name ${index + 1}`}
                onChange={(e) =>
                  handleInputChange(index, "name", e.target.value)
                }
              />
              <Input
                id={`artist${index + 1}`}
                value={track.artist}
                type="text"
                placeholder="Kosmical"
                className="col-span-2"
                aria-label={`artist ${index + 1}`}
                onChange={(e) =>
                  handleInputChange(index, "artist", e.target.value)
                }
              />
              <Input
                id={`songKey${index + 1}`}
                value={track.key}
                type="text"
                placeholder="4A"
                className="col-span-1"
                aria-label={`song key ${index + 1}`}
                onChange={(e) =>
                  handleInputChange(index, "key", e.target.value)
                }
              />
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
