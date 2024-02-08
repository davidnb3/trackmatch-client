import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { TrackMatch } from "../components/track-match";
import { Menu } from "../components/menu";
import { PodcastEmptyPlaceholder } from "../components/podcast-empty-placeholder";
import { Sidebar } from "../components/sidebar";
import { trackMatches } from "../data/albums";
import { playlists } from "../data/playlists";
import { AddTracks } from "../components/add-tracks-dialog";

export const metadata = {
  title: "Music App",
  description: "Example music app using the components.",
};

export default function Browse() {
  return (
    <>
      <div className="hidden md:block">
        <Menu />
        <div className="border-t">
          <div className="bg-background">
            <div className="grid lg:grid-cols-5">
              <Sidebar playlists={playlists} className="hidden lg:block" />
              <div className="col-span-3 lg:col-span-4 lg:border-l">
                <div className="h-full px-4 py-6 lg:px-8">
                  <Tabs defaultValue="music" className="h-full space-y-6">
                    <div className="space-between flex items-center">
                      <TabsList>
                        <TabsTrigger value="music" className="relative">
                          Music
                        </TabsTrigger>
                        <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
                        <TabsTrigger value="live" disabled>
                          Live
                        </TabsTrigger>
                      </TabsList>
                      <div className="ml-auto mr-4">
                        <AddTracks />
                      </div>
                    </div>
                    <TabsContent
                      value="music"
                      className="border-none p-0 outline-none "
                    >
                      <div className="mt-6 space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">
                          Made for You
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Your personal playlists. Updated daily.
                        </p>
                      </div>
                      <Separator className="my-4" />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {" "}
                        {/* Modify this line */}
                        {trackMatches.map((trackMatch, index) => (
                          <TrackMatch
                            key={index}
                            album1={{
                              name: trackMatch.trackName1,
                              artist: trackMatch.artist1,
                              cover: trackMatch.cover1,
                            }}
                            album2={{
                              name: trackMatch.trackName2,
                              artist: trackMatch.artist2,
                              cover: trackMatch.cover2,
                            }}
                          />
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent
                      value="podcasts"
                      className="h-full flex-col border-none p-0 data-[state=active]:flex"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">
                            New Episodes
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Your favorite podcasts. Updated daily.
                          </p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <PodcastEmptyPlaceholder />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
