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
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { deleteTrackMatch } from "../store/trackMatchesSlice";
import { deletePlaylist } from "../store/playlistsSlice";
import { deleteTrack } from "../store/tracksSlice";
import { Button } from "@/components/ui/button";

DeleteItemDialog.propTypes = {
  item: PropTypes.shape({
    name: PropTypes.string,
    _id: PropTypes.string,
  }),
  apiPath: PropTypes.string,
  children: PropTypes.node,
};

export function DeleteItemDialog({ item, apiPath, children }) {
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const openDialog = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsOpen(true);
  };

  const closeDialog = () => setIsOpen(false);

  const deleteItem = async () => {
    if (apiPath === "trackmatches") {
      dispatch(deleteTrackMatch(item._id));
    }

    if (apiPath === "playlists") {
      dispatch(deletePlaylist(item._id));
    }

    if (apiPath === "tracks") {
      dispatch(deleteTrack(item._id));
    }

    closeDialog();

    if (apiPath === "playlists") {
      navigate("/");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild onClick={openDialog}>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="mb-1">Delete {item.name}?</DialogTitle>
          <DialogDescription>
            This will delete <span className="font-bold">{item.name}</span> from
            your library and <span className="font-bold">cannot be undone</span>
            .
            {apiPath === "tracks"
              ? " This will also remove the track from all your TrackMatches."
              : ""}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={closeDialog} variant="outline">
            Cancel
          </Button>
          <Button onClick={deleteItem}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
