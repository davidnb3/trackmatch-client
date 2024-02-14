import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

import { TrackMatchCard } from "../components/track-match-card";
import { TrackMatchList } from "../components/track-match-list";
import { Menu } from "../components/menu";
import { Sidebar } from "../components/sidebar";
import { playlistsPlaceholder } from "../data/playlists";
import { AddTracks } from "../components/add-tracks-dialog";

import { useEffect, useState } from "react";

export default function Browse() {
  const [allTrackMatches, setAllTrackMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllTrackMatches().then((trackMatches) =>
      setAllTrackMatches(trackMatches)
    );
  }, []);

  const getAllTrackMatches = async () => {
    try {
      const response = await fetch("http://localhost:3001/tracks/trackmatches");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const trackMatches = await response.json();
      setIsLoading(false);
      return Array.isArray(trackMatches) ? trackMatches : [];
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  };

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
                      <TabsTrigger value="live" disabled>
                        Live
                      </TabsTrigger>
                    </TabsList>
                    <div className="ml-auto mr-4">
                      <AddTracks />
                    </div>
                  </div>
                  <TabsContent
                    value="cards"
                    className="border-none p-0 outline-none"
                  >
                    <div className="mt-6 space-y-1">
                      <h2 className="text-2xl font-semibold tracking-tight">
                        Browse the Collection
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Everything in one place
                      </p>
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
                      {allTrackMatches.map((trackMatch, index) => (
                        <TrackMatchCard
                          key={index}
                          trackMatch={trackMatch}
                          id={index}
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
                        Browse the Collection
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Everything in one place
                      </p>
                    </div>
                    <Separator className="my-4" />
                    <div
                      style={{
                        columnCount: "auto",
                        columnWidth: "220px",
                      }}
                    >
                      {allTrackMatches.map((trackMatch, index) => (
                        <div
                          style={{ breakInside: "avoid", marginBottom: "1rem" }}
                          key={index}
                        >
                          <TrackMatchList
                            key={index}
                            trackMatch={trackMatch}
                            id={index}
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
