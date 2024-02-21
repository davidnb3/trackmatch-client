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
import PropTypes from "prop-types";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

EditPlaylistDialog.propTypes = {
  playlist: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
  onPlaylistUpdate: PropTypes.func.isRequired,
};

export function EditPlaylistDialog({ playlist, children, onPlaylistUpdate }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(playlist.name);
  const [description, setDescription] = useState(playlist.description || "");

  const openDialog = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen(true);
  };
  const closeDialog = () => setIsOpen(false);

  const updatePlaylist = async () => {
    const response = await fetch(
      `http://localhost:3001/playlists/${playlist._id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const updatedPlaylist = await response.json();

    onPlaylistUpdate(updatedPlaylist);

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
