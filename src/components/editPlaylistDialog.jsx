import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function EditPlaylistDialog({ playlist, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(playlist.name);
  const [description, setDescription] = useState(playlist.description || "");

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  const updatePlaylist = () => {
    // update the playlist
    closeDialog();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={openDialog}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-1">Edit Playlist</DialogTitle>
        </DialogHeader>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Playlist name"
        />
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
        />
        <DialogFooter>
          <Button onClick={closeDialog} variant="outline">
            Cancel
          </Button>
          <Button onClick={updatePlaylist}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
