import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { PlusCircledIcon } from "@radix-ui/react-icons";

export function AddTracks() {
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
          <div className="grid grid-cols-6 items-center gap-4">
            <span className="text-left col-span-3 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Track Name
            </span>
            <span className="text-left col-span-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Artist
            </span>
            <span className="text-left col-span-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Key
            </span>
          </div>
          <div className="grid grid-cols-6 items-center gap-4">
            <Input
              id="trackName1"
              type="text"
              placeholder="Another Night"
              className="col-span-3"
              aria-label="track name 1"
            />
            <Input
              id="artist1"
              type="text"
              placeholder="Kosmical"
              className="col-span-2"
              aria-label="artist 1"
            />
            <Input
              id="songKey1"
              type="text"
              placeholder="4A"
              className="col-span-1"
              aria-label="song key 1"
            />
          </div>
          <div className="grid grid-cols-6 items-center gap-4">
            <Input
              id="trackName2"
              type="text"
              placeholder="Another Night"
              className="col-span-3"
              aria-label="track name 2"
            />
            <Input
              id="artist2"
              type="text"
              placeholder="Kosmical"
              className="col-span-2"
              aria-label="artist 2"
            />
            <Input
              id="songKey2"
              type="text"
              placeholder="4A"
              className="col-span-1"
              aria-label="song key 2"
            />
          </div>
          <div className="grid grid-cols-1 items-center gap-4">
            <PlusCircledIcon className="mr-2 h-4 w-4" />
          </div>
        </div>

        <DialogFooter>
          <Button type="submit">Add tracks</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
