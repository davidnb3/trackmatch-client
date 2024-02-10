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
  const [tracks, setTracks] = useState([{}, {}]);

  const addTrack = () => {
    setTracks([...tracks, {}]);
  };

  const resetTracks = () => {
    setTracks([{}, {}]); // Reset to two tracks
  };

  const removeTrack = () => {
    if (tracks.length > 2) {
      setTracks(tracks.slice(0, -1)); // Remove the last track
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          Add Tracks
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add new tracks</DialogTitle>
          <DialogDescription>
            Add two new tracks from Spotify that sound good when mixing
            together. You can then add them to your TrackMate or Spotify
            playlists.
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
              />
              <Input
                id={`artist${index + 1}`}
                type="text"
                placeholder="Kosmical"
                className="col-span-2"
                aria-label={`artist ${index + 1}`}
              />
              <Input
                id={`songKey${index + 1}`}
                type="text"
                placeholder="4A"
                className="col-span-1"
                aria-label={`song key ${index + 1}`}
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
          <Button type="submit" onClick={resetTracks}>
            Add tracks
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
