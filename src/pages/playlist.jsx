import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { TrackMatch } from "../components/TrackMatch";
import { AddTracksDialog } from "../components/AddTracksDialog";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlaylistById } from "../store/playlistsSlice";
import { Input } from "@/components/ui/input";
import useAuth from "@/hooks/useAuth";

export default function Playlist() {
  const { playlistId } = useParams();
  const dispatch = useDispatch();
  const playlist = useSelector((state) => state.playlists.selectedPlaylist);
  const isLoading = useSelector((state) => state.playlists.trackMatchesLoading);
  const pendingTracks = useSelector((state) => state.tracks.pendingTracks);
  const { jwtToken } = useAuth();

  useEffect(() => {
    dispatch(fetchPlaylistById({ playlistId, jwtToken }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playlistId]);

  return (
    <div className="h-full px-4 py-6 lg:px-8">
      <Tabs defaultValue="cards" className="h-full space-y-6">
        <div className="space-between flex items-center gap-4 lg:gap-8">
          <TabsList>
            <TabsTrigger value="cards" className="relative">
              Cards
            </TabsTrigger>
            <TabsTrigger value="columns">Columns</TabsTrigger>
          </TabsList>
          <Input type="text" placeholder="Search" />
          <div className="ml-auto">
            <AddTracksDialog>
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
            </AddTracksDialog>
          </div>
        </div>
        <TabsContent value="cards" className="border-none p-0 outline-none">
          <div className="mt-6 space-y-1">
            {isLoading ? (
              <>
                <Skeleton className="h-6 w-[150px]" />
                <Skeleton className="h-6 w-[300px]" />
              </>
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
            {isLoading ? (
              <>
                <Skeleton className="h-[200px] w-[266px]" />
                <Skeleton className="h-[200px] w-[398px]" />
                <Skeleton className="h-[200px] w-[530px]" />
                <Skeleton className="h-[200px] w-[266px]" />
              </>
            ) : (
              playlist?.trackMatches?.map((trackMatch, index) => (
                <TrackMatch
                  key={index}
                  trackMatch={trackMatch.trackMatch}
                  id={index}
                  instanceId={trackMatch._id}
                  view={"card"}
                />
              ))
            )}
          </div>
        </TabsContent>
        <TabsContent value="columns" className="border-none p-0 outline-none">
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
              columnGap: "20px",
            }}
          >
            {playlist?.trackMatches
              ?.slice()
              .reverse()
              .map((trackMatch, index) => (
                <div
                  style={{ breakInside: "avoid", marginBottom: "1rem" }}
                  key={index}
                >
                  <TrackMatch
                    key={index}
                    trackMatch={trackMatch.trackMatch}
                    id={index}
                    instanceId={trackMatch._id}
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
