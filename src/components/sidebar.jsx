import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Pencil1Icon, TrashIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { DeletePlaylistDialog } from "./deletePlaylistDialog";
import { EditPlaylistDialog } from "./editPlaylistDialog";
import { Link } from "react-router-dom";
import { playlistsPlaceholder } from "@/data/playlists";
import { useDroppable } from "@dnd-kit/core";

export function Sidebar({ className }) {
  const pathname = window.location.pathname;
  const [playlists, setPlaylists] = useState([]);

  const { setNodeRef, ...props } = useDroppable({
    id: "unique-id",
  });

  console.log(props);
  const getAllPlaylists = async () => {
    try {
      const response = await fetch("http://localhost:3001/playlists");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const playlists = await response.json();
      setPlaylists(playlists);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const createNewPlaylist = async () => {
    try {
      const response = await fetch("http://localhost:3001/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "New Playlist",
          trackMatches: [],
          description: "My new Playlist",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newPlaylist = await response.json();
      setPlaylists([...playlists, newPlaylist.playlist]);
    } catch (error) {
      console.error("Failed to add playlist:", error);
    }
  };

  useEffect(() => {
    getAllPlaylists();
  }, [playlists]);

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Discover
          </h2>
          <div className="space-y-1">
            <Link to="/">
              <Button
                variant={pathname === "/" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="10 8 16 12 10 16 10 8" />
                </svg>
                Listen Now
              </Button>
            </Link>
            <Link to="/browse">
              <Button
                variant={pathname === "/browse" ? "secondary" : "ghost"}
                className="w-full justify-start"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <rect width="7" height="7" x="3" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="14" rx="1" />
                  <rect width="7" height="7" x="3" y="14" rx="1" />
                </svg>
                Browse
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9" />
                <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5" />
                <circle cx="12" cy="12" r="2" />
                <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5" />
                <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19" />
              </svg>
              Radio
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Library
          </h2>
          <div className="space-y-1">
            <Link to="/playlists">
              <Button variant="ghost" className="w-full justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="M21 15V6" />
                  <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                  <path d="M12 12H3" />
                  <path d="M16 6H3" />
                  <path d="M12 18H3" />
                </svg>
                Playlists
              </Button>
            </Link>
            <Link to="/songs">
              <Button variant="ghost" className="w-full justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <circle cx="8" cy="18" r="4" />
                  <path d="M12 18V2l7 4" />
                </svg>
                Songs
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Made for You
            </Button>
            <Link to="/artists">
              <Button variant="ghost" className="w-full justify-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 h-4 w-4"
                >
                  <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12" />
                  <circle cx="17" cy="7" r="5" />
                </svg>
                Artists
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="m16 6 4 14" />
                <path d="M12 6v14" />
                <path d="M8 8v12" />
                <path d="M4 4v16" />
              </svg>
              Albums
            </Button>
          </div>
        </div>
        <div className="py-2">
          <h2 className="flex items-center justify-between relative px-7 text-lg font-semibold tracking-tight">
            Playlists
            <PlusCircledIcon
              className="h-4 w-4 cursor-pointer ml-2"
              onClick={createNewPlaylist}
            />
          </h2>

          <div className="px-3 py-2">
            {playlistsPlaceholder
              ?.slice()
              .reverse()
              .map((playlist, i) => (
                <Button
                  key={i}
                  ref={setNodeRef}
                  variant="ghost"
                  className="w-full justify-between items-center flex group"
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
                      {playlist}
                    </span>
                  </div>
                  <div className="flex opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-1">
                      <EditPlaylistDialog playlist={playlist}>
                        <Pencil1Icon className="h-4 w-4 cursor-pointer" />
                      </EditPlaylistDialog>
                    </div>
                    <div className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 p-1">
                      <DeletePlaylistDialog playlist={playlist}>
                        <TrashIcon className="h-4 w-4 cursor-pointer" />
                      </DeletePlaylistDialog>
                    </div>
                  </div>
                </Button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
