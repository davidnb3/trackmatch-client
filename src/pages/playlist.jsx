import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { TrackMatch } from "../components/track-match";
import { AddTracks } from "../components/add-tracks-dialog";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlaylistById } from "../store/playlistsSlice";
import { selectTrackMatchesForPlaylist } from "../store/selectors";

export default function Playlist() {
  const { playlistId } = useParams();
  const dispatch = useDispatch();
  const playlist = useSelector((state) => state.playlists.selectedPlaylist);
  const status = useSelector((state) => state.playlists.trackMatchesLoading);
  const playlistTrackMatches = useSelector(selectTrackMatchesForPlaylist);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPlaylistById(playlistId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, playlistId]);

  return (
    <div className="h-full px-4 py-6 lg:px-8">
      <Tabs defaultValue="cards" className="h-full space-y-6">
        <div className="space-between flex items-center">
          <TabsList>
            <TabsTrigger value="cards" className="relative">
              Cards
            </TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
          <div className="ml-auto">
            <AddTracks>
              <Button>
                <PlusCircledIcon className="mr-2 h-4 w-4" />
                Add Tracks
              </Button>
            </AddTracks>
          </div>
        </div>
        <TabsContent value="cards" className="border-none p-0 outline-none">
          <div className="mt-6 space-y-1">
            {status === "loading" ? (
              <Skeleton className="h-6 w-[200px]" />
            ) : (
              <>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {playlist?.name}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {playlist?.description}
                </p>
              </>
            )}
          </div>
          <Separator className="my-4" />
          <div className="flex flex-wrap justify-start gap-4">
            {status === "loading" ? (
              <>
                <Skeleton className="h-[200px] w-[266px]" />
                <Skeleton className="h-[200px] w-[398px]" />
                <Skeleton className="h-[200px] w-[530px]" />
                <Skeleton className="h-[200px] w-[266px]" />
              </>
            ) : (
              playlistTrackMatches
                ?.slice()
                .reverse()
                .map((trackMatch, index) => (
                  <TrackMatch
                    key={index}
                    trackMatch={trackMatch}
                    id={index}
                    view={"card"}
                  />
                ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="list" className="border-none p-0 outline-none">
          <div className="mt-6 space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              {playlist?.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {playlist?.description}
            </p>
          </div>
          <Separator className="my-4" />
          <div
            style={{
              columnCount: "auto",
              columnWidth: "220px",
            }}
          >
            {playlistTrackMatches
              ?.slice()
              .reverse()
              .map((trackMatch, index) => (
                <div
                  style={{ breakInside: "avoid", marginBottom: "1rem" }}
                  key={index}
                >
                  <TrackMatch
                    key={index}
                    trackMatch={trackMatch}
                    id={index}
                    view={"list"}
                  />
                </div>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
