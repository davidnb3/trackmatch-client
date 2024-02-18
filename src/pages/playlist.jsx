import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";

import { TrackMatch } from "../components/track-match";
import { Menu } from "../components/menu";
import { Sidebar } from "../components/sidebar";
import { playlistsPlaceholder } from "../data/playlists";
import { AddTracks } from "../components/add-tracks-dialog";

export default function Playlist() {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [trackMatches, setTrackMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3001/playlists/${playlistId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setPlaylist(data);
        setTrackMatches(data.trackMatches);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      });
  }, [playlistId]);

  return (
    <>
      <Menu />
      <div className="border-t">
        <div className="bg-background">
          <div className="grid lg:grid-cols-5">
            <Sidebar
              playlists={playlistsPlaceholder}
              className="hidden lg:block"
            />
            <div className="col-span-3 lg:col-span-4 lg:border-l">
              <div className="h-full px-4 py-6 lg:px-8">
                <Tabs defaultValue="cards" className="h-full space-y-6">
                  <div className="space-between flex items-center">
                    <TabsList>
                      <TabsTrigger value="cards" className="relative">
                        Cards
                      </TabsTrigger>
                      <TabsTrigger value="list">List</TabsTrigger>
                    </TabsList>
                    <div className="ml-auto mr-4">
                      <AddTracks>
                        <Button>
                          <PlusCircledIcon className="mr-2 h-4 w-4" />
                          Add Tracks
                        </Button>
                      </AddTracks>
                    </div>
                  </div>
                  <TabsContent
                    value="cards"
                    className="border-none p-0 outline-none"
                  >
                    <div className="mt-6 space-y-1">
                      {isLoading ? (
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
                      {isLoading ? (
                        <>
                          <Skeleton className="h-[200px] w-[266px]" />
                          <Skeleton className="h-[200px] w-[398px]" />
                          <Skeleton className="h-[200px] w-[530px]" />
                          <Skeleton className="h-[200px] w-[266px]" />
                        </>
                      ) : (
                        ""
                      )}
                      {trackMatches.map((trackMatch, index) => (
                        <TrackMatch
                          key={index}
                          trackMatch={trackMatch}
                          id={index}
                          view={"card"}
                        />
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent
                    value="list"
                    className="border-none p-0 outline-none"
                  >
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
                      {trackMatches.map((trackMatch, index) => (
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
