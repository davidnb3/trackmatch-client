import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Card, CardContent } from "@/components/ui/card";

import { cn } from "@/lib/utils";
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
import { playlistsPlaceholder } from "../data/playlists";

export function TrackMatchCard({ trackMatch, id }) {
  const tracks = [];
  for (let i = 1; i <= Object.keys(trackMatch).length / 4; i++) {
    tracks.push({
      name: trackMatch[`trackName${i}`],
      artist: trackMatch[`artist${i}`],
      cover: trackMatch[`cover${i}`],
      key: trackMatch[`key${i}`],
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
          <Card className="inline-flex justify-center shadow-md">
            {tracks.map((track, index) => (
              <CardContent key={index} className="space-y-3">
                <div className="overflow-hidden rounded-md w-[100px]">
                  <img
                    src={track.cover}
                    alt={track.name}
                    className={cn("hover:scale-105", "aspect-square")}
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
              {playlistsPlaceholder.map((playlist) => (
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
