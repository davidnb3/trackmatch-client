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

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { PlusCircledIcon, MinusCircledIcon } from "@radix-ui/react-icons";

export function AddTracks() {
  const [isOpen, setIsOpen] = useState(false);
  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  const [tracks, setTracks] = useState([
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

  const handleInputChange = (index, field, value) => {
    const newTracks = [...tracks];
    newTracks[index][field] = value;
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
    ]); // Reset to two tracks
  };

  const removeTrack = () => {
    if (tracks.length > 1) {
      setTracks(tracks.slice(0, -1)); // Remove the last track
    }
  };

  const createTrackMatch = async (tracks) => {
    for (let track of tracks) {
      if (!track.name || !track.artist || !track.key || !track.cover) {
        alert("Please fill in all fields.");
        return;
      }
    }
    try {
      const response = await fetch(
        "http://localhost:3001/tracks/trackmatches",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tracks }),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
      closeDialog();
      resetTracks();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button onClick={openDialog}>
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          Add Tracks
        </Button>
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
          <Button type="submit" onClick={() => createTrackMatch(tracks)}>
            Add tracks
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
