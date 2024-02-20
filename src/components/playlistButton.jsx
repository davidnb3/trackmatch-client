import { Button } from "@/components/ui/button";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import PropTypes from "prop-types";

import { DeleteItemDialog } from "./deleteItemDialog";
import { EditPlaylistDialog } from "./editPlaylistDialog";
import { useDroppable } from "@dnd-kit/core";

PlaylistButton.propTypes = {
  playlist: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
  }),
};

export function PlaylistButton({ playlist }) {
  const { setNodeRef, isOver } = useDroppable({
    id: playlist._id,
  });

  const navigate = useNavigate();

  const navigateToPlaylist = () => {
    navigate(`/playlists/${playlist._id}`);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Button
          onClick={navigateToPlaylist}
          ref={setNodeRef}
          variant="ghost"
          className={`w-full justify-between items-center flex group ${
            isOver ? "bg-primary text-primary-foreground" : ""
          }`}
        >
          <div className="flex items-center min-w-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-4 w-4 flex-shrink-0"
            >
              <path d="M21 15V6" />
              <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
              <path d="M12 12H3" />
              <path d="M16 6H3" />
              <path d="M12 18H3" />
            </svg>
            <span className="overflow-hidden text-ellipsis text-nowrap">
              {playlist.name}
            </span>
          </div>
        </Button>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-40">
        <EditPlaylistDialog playlist={playlist}>
          <ContextMenuItem>
            <Pencil1Icon className="mr-2" />
            Edit
          </ContextMenuItem>
        </EditPlaylistDialog>
        <DeleteItemDialog item={playlist} apiPath="playlists">
          <ContextMenuItem>
            <TrashIcon className="mr-2" />
            Delete
          </ContextMenuItem>
        </DeleteItemDialog>
      </ContextMenuContent>
    </ContextMenu>
  );
}
