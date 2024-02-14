import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

import { Button } from "@/components/ui/button";

export function DeletePlaylistDialog({ playlist, children }) {
  const [isOpen, setIsOpen] = useState(false);

  const openDialog = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen(true);
  };
  const closeDialog = () => setIsOpen(false);

  const deletePlaylist = () => {
    // delete the playlist
    closeDialog();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={openDialog}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-1">Delete Playlist?</DialogTitle>
          <DialogDescription>
            This will delete <span className="font-bold">{playlist.name}</span>{" "}
            from your library and{" "}
            <span className="font-bold">cannot be undone</span>.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={closeDialog} variant="outline">
            Cancel
          </Button>
          <Button onClick={deletePlaylist}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
