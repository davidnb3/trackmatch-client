import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Card } from "@/components/ui/card";

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

import { useDraggable } from "@dnd-kit/core";
import { playlists } from "../data/playlists";

export function TrackMatchList({ trackMatch, id }) {
  const tracks = [];
  for (let i = 1; i <= Object.keys(trackMatch).length / 3; i++) {
    tracks.push({
      name: trackMatch[`trackName${i}`],
      artist: trackMatch[`artist${i}`],
      cover: trackMatch[`cover${i}`],
    });
  }

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `trackMatchCard-${id}`,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <ContextMenu>
        <ContextMenuTrigger>
          <Card className="flex flex-col w-64 pr-2 shadow-md">
            {tracks.map((track, index) => (
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
                </div>
              </div>
            ))}
          </Card>
        </ContextMenuTrigger>
        <ContextMenuContent className="w-40">
          <ContextMenuItem>Add to Library</ContextMenuItem>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Add to Playlist</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              <ContextMenuItem>
                <PlusCircledIcon className="mr-2 h-4 w-4" />
                New Playlist
              </ContextMenuItem>
              <ContextMenuSeparator />
              {playlists.map((playlist) => (
                <ContextMenuItem key={playlist}>
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
                  {playlist}
                </ContextMenuItem>
              ))}
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />
          <ContextMenuItem>Play Next</ContextMenuItem>
          <ContextMenuItem>Play Later</ContextMenuItem>
          <ContextMenuItem>Create Station</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem>Like</ContextMenuItem>
          <ContextMenuItem>Share</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </div>
  );
}
