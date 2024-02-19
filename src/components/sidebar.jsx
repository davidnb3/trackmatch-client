import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { PlaylistButton } from "./playlistButton";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import PropTypes from "prop-types";

Sidebar.propTypes = {
  className: PropTypes.string,
};

export function Sidebar({ className }) {
  const pathname = window.location.pathname;
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAllPlaylists = async () => {
    try {
      const response = await fetch("http://localhost:3001/playlists");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const playlists = await response.json();
      setPlaylists(playlists);
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const createNewPlaylist = async () => {
    try {
      const date = new Date();
      const formattedDate = `${date.getDate()}.${
        date.getMonth() + 1
      }.${date.getFullYear()}`;

      const response = await fetch("http://localhost:3001/playlists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "New Playlist",
          trackMatches: [],
          description: `My new playlist created on ${formattedDate}`,
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
  }, []);

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
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
                Discover
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
          </div>
          <div className="space-y-1">
            <Link to="/library">
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
                Your Library
              </Button>
            </Link>
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
          {isLoading ? (
            <div className="px-7 py-4">
              {Array(5)
                .fill()
                .map((_, index) => (
                  <Skeleton key={index} className="h-6  mb-2" />
                ))}
            </div>
          ) : (
            <div className="px-3 py-2">
              {playlists
                ?.slice()
                .reverse()
                .map((playlist) => (
                  <PlaylistButton playlist={playlist} key={playlist._id} />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
