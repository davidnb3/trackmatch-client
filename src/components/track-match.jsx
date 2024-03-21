import {
  Pencil1Icon,
  TrashIcon,
  MinusCircledIcon,
} from "@radix-ui/react-icons";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  createPlaylist,
  addTrackMatchToPlaylist,
  removeTrackMatchFromPlaylist,
} from "../store/playlistsSlice";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Card, CardContent } from "@/components/ui/card";
import { AddTracks } from "./add-tracks-dialog";
import PropTypes from "prop-types";
import { DeleteItemDialog } from "./deleteItemDialog";
import { useDispatch, useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { useParams } from "react-router-dom";

TrackMatch.propTypes = {
  trackMatch: PropTypes.shape({
    tracks: PropTypes.array,
    _id: PropTypes.string,
  }),
  id: PropTypes.number,
  view: PropTypes.string,
  instanceId: PropTypes.string,
};

export function TrackMatch({ trackMatch, id, view, instanceId }) {
  const { playlistId } = useParams();
  const dispatch = useDispatch();
  const playlists = useSelector((state) => state.playlists.entities);

  const handleCreateNewPlaylist = (event) => {
    event.preventDefault();
    dispatch(createPlaylist());
  };

  const handleAddToPlaylist = (playlistId) => {
    dispatch(
      addTrackMatchToPlaylist({ playlistId, trackMatch: trackMatch._id })
    );
  };

  const handleRemoveClick = () => {
    dispatch(
      removeTrackMatchFromPlaylist({
        playlistId,
        instanceId,
      })
    );
  };

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `trackMatchCard-${id}`,
      data: {
        trackMatch: trackMatch?._id,
      },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.7 : 1,
      }
    : undefined;

  if (!trackMatch?.tracks?.length) {
    // If there are no tracks, don't render anything
    return null;
  }

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
          {view === "card" && (
            <Card className="inline-flex justify-center shadow-md p-4 space-x-4">
              {trackMatch?.tracks?.map((track, index) => (
                <CardContent key={index} className="space-y-3 p-0">
                  <div className="overflow-hidden rounded-md w-[100px]">
                    <img
                      src={track.cover}
                      alt={track.name}
                      className={cn(
                        "hover:scale-105",
                        "aspect-square",
                        "h-24 w-24"
                      )}
                    />
                  </div>
                  <div className="space-y-1 text-sm w-[100px]">
                    <h3 className="font-medium leading-none overflow-hidden text-ellipsis text-nowrap">
                      {track.name}
                    </h3>
                    <p className="text-xs text-muted-foreground overflow-hidden text-ellipsis text-nowrap">
                      {track.artist}
                    </p>
                    <p className="text-xs text-muted-foreground overflow-hidden text-ellipsis text-nowrap">
                      {track.key}
                    </p>
                  </div>
                </CardContent>
              ))}
            </Card>
          )}
          {view === "list" && (
            <div style={{ breakInside: "avoid", marginBottom: "1rem" }}>
              <Card className="flex flex-col w-64 pr-2 shadow-md">
                {trackMatch?.tracks?.map((track, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <img
                      src={track.cover}
                      alt={track.name}
                      className="w-16 h-16 flex-shrink-0"
                    />
                    <div className="overflow-hidden">
                      <h3 className="font-medium leading-none overflow-hidden text-ellipsis text-nowrap">
                        {track.name}
                      </h3>
                      <p className="text-xs text-muted-foreground overflow-hidden text-ellipsis text-nowrap">
                        {track.artist}
                      </p>
                      <p className="text-xs text-muted-foreground overflow-hidden text-ellipsis text-nowrap">
                        {track.key}
                      </p>
                    </div>
                  </div>
                ))}
              </Card>
            </div>
          )}
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-40">
        <ContextMenuSub>
          <ContextMenuSubTrigger>Add to Playlist</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuItem onClick={handleCreateNewPlaylist}>
              <PlusCircledIcon className="mr-2 h-4 w-4" />
              New Playlist
            </ContextMenuItem>
            <ContextMenuSeparator />
            {Array.isArray(playlists) &&
              playlists
                .slice()
                .reverse()
                .map((playlist) => (
                  <ContextMenuItem
                    key={playlist._id}
                    onClick={() => handleAddToPlaylist(playlist._id)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="mr-2 h-4 w-4"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21 15V6M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM12 12H3M16 6H3M12 18H3" />
                    </svg>
                    {playlist.name}
                  </ContextMenuItem>
                ))}
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />

        <AddTracks trackMatch={trackMatch}>
          <ContextMenuItem>
            <Pencil1Icon className="mr-2" />
            Edit
          </ContextMenuItem>
        </AddTracks>
        {playlistId && (
          <ContextMenuItem onClick={handleRemoveClick}>
            <MinusCircledIcon className="mr-2" />
            Remove
          </ContextMenuItem>
        )}
        <DeleteItemDialog
          item={{ _id: trackMatch._id, name: "TrackMatch" }}
          apiPath="trackmatches"
        >
          <ContextMenuItem>
            <TrashIcon className="mr-2" />
            Delete
          </ContextMenuItem>
        </DeleteItemDialog>
      </ContextMenuContent>
    </ContextMenu>
  );
}
