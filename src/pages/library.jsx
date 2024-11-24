import React from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { AddTracks } from "../components/add-tracks-dialog";
import { useEffect, useState } from "react";
import { fetchTracks } from "../store/tracksSlice";
import { useDispatch, useSelector } from "react-redux";
import { TrashIcon } from "@radix-ui/react-icons";
import { DeleteItemDialog } from "../components/deleteItemDialog";
import { tracksSlice } from "../store/tracksSlice";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export default function Library() {
  const tracks = useSelector((state) => state.tracks.entities);
  const trackMatches = useSelector((state) => state.trackMatches.entities);
  const pendingTracks = useSelector((state) => state.tracks.pendingTracks);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [artists, setArtists] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTracks());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackMatches]);

  useEffect(() => {
    const artistMap = new Map(
      tracks.map((track) => [
        track.artistSpotifyId,
        { artist: track.artist, id: track.artistSpotifyId },
      ])
    );

    const uniqueArtists = Array.from(artistMap.values());

    const fetchArtistImage = async (artist) => {
      let accessToken = localStorage.getItem("spotifyAccessToken");

      try {
        let response = await fetch(
          `https://api.spotify.com/v1/artists/${artist.id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const data = await response.json();
        return { ...artist, image: data.images[0]?.url };
      } catch (error) {
        console.error(error);
        throw error;
      }
    };

    Promise.all(uniqueArtists.map(fetchArtistImage)).then(setArtists);
  }, [tracks]);

  const selectedArtistTracksMap = new Map(
    tracks
      .filter((track) => track.artist === selectedArtist?.artist)
      .map((track) => [`${track.name}`, track])
  );

  const selectedArtistTracks = Array.from(selectedArtistTracksMap.values());

  const addPendingTrack = (track) => {
    dispatch(tracksSlice.actions.addPendingTrack(track));
  };

  return (
    <div className="h-full px-4 py-6 lg:px-8">
      <div className="space-between flex items-center gap-4 lg:gap-8">
        <Input type="text" placeholder="Search" />
        <div className="ml-auto">
          <AddTracks>
            <div className="relative">
              <Button>
                <PlusCircledIcon className="mr-2 h-4 w-4" />
                Add TrackMatch
              </Button>
              {pendingTracks[0].name !== "" && (
                <div
                  className="notification-badge absolute h-4 w-4 rounded-full bg-primary-500 animate-ping"
                  style={{
                    backgroundImage: `url(${
                      pendingTracks[pendingTracks.length - 1].cover
                    })`,
                  }}
                />
              )}
            </div>
          </AddTracks>
        </div>
      </div>

      <div className="mt-6 space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Your Library</h2>
        <p className="text-sm text-muted-foreground">Everything in one place</p>
      </div>
      <Separator className="my-4" />
      <div className="flex">
        <div
          className="w-1/2 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 15rem)" }}
        >
          <ul className="list-none">
            {artists.map((artist) => (
              <li
                key={artist.id}
                onClick={() => setSelectedArtist(artist)}
                className="flex items-center cursor-pointer hover:bg-secondary p-2"
              >
                <img
                  src={artist.image}
                  alt={artist.artist}
                  className="w-10 h-10 mr-4"
                />
                <span className="text-lg">{artist.artist}</span>
              </li>
            ))}
          </ul>
        </div>
        <div
          className="w-1/2 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 15rem)" }}
        >
          <ul className="list-none">
            {selectedArtistTracks.map((track, index) => (
              <React.Fragment key={index}>
                <ContextMenu>
                  <ContextMenuTrigger>
                    <li className="flex items-center cursor-pointer hover:bg-secondary p-2">
                      <img
                        src={track.cover}
                        alt={track.name}
                        className="w-10 h-10 mr-4"
                      />
                      <span className="text-lg">{track.name}</span>
                    </li>
                  </ContextMenuTrigger>
                  <ContextMenuContent className="w-46">
                    <ContextMenuItem onClick={() => addPendingTrack(track)}>
                      <PlusCircledIcon className="mr-2" />
                      {pendingTracks[0].name == ""
                        ? "Create TrackMatch"
                        : "Add to TrackMatch"}
                    </ContextMenuItem>
                    <DeleteItemDialog item={track} apiPath="tracks">
                      <ContextMenuItem>
                        <TrashIcon className="mr-2" />
                        Delete
                      </ContextMenuItem>
                    </DeleteItemDialog>
                  </ContextMenuContent>
                </ContextMenu>
              </React.Fragment>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
