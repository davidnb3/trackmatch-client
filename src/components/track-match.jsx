import { PlusCircledIcon } from "@radix-ui/react-icons";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

import { playlists } from "../data/playlists";

export function TrackMatch({
  album1,
  album2,
  aspectRatio = "portrait",
  width,
  height,
  className,
  ...props
}) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <ContextMenu>
        <ContextMenuTrigger>
          <Card className="w-full">
            <div className="flex space-x-4">
              <CardContent>
                <div className="overflow-hidden rounded-md">
                  <img
                    src={album1.cover}
                    alt={album1.name}
                    width={width}
                    height={height}
                    className={cn(
                      "h-auto w-auto object-cover transition-all hover:scale-105",
                      aspectRatio === "portrait"
                        ? "aspect-[3/4]"
                        : "aspect-square"
                    )}
                  />
                </div>
                <CardTitle>{album1.name}</CardTitle>
                <CardDescription>{album1.artist}</CardDescription>
              </CardContent>
              <CardContent>
                <div className="overflow-hidden rounded-md">
                  <img
                    src={album2.cover}
                    alt={album2.name}
                    width={width}
                    height={height}
                    className={cn(
                      "h-auto w-auto object-cover transition-all hover:scale-105",
                      aspectRatio === "portrait"
                        ? "aspect-[3/4]"
                        : "aspect-square"
                    )}
                  />
                </div>
                <CardTitle>{album2.name}</CardTitle>
                <CardDescription>{album2.artist}</CardDescription>
              </CardContent>
            </div>
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
