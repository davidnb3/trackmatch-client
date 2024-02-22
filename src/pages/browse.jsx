import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { TrackMatch } from "../components/track-match";
import { AddTracks } from "../components/add-tracks-dialog";
import { useSelector } from "react-redux";

export default function Browse() {
  const trackMatches = useSelector((state) => state.trackMatches.entities);
  const trackMatchesLoading = useSelector(
    (state) => state.trackMatches.loading
  );

  return (
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
            <h2 className="text-2xl font-semibold tracking-tight">
              Browse the Collection
            </h2>
            <p className="text-sm text-muted-foreground">
              Everything in one place
            </p>
          </div>
          <Separator className="my-4" />
          <div className="flex flex-wrap justify-start gap-4">
            {trackMatchesLoading === "loading" ? (
              <>
                <Skeleton className="h-[200px] w-[266px]" />
                <Skeleton className="h-[200px] w-[398px]" />
                <Skeleton className="h-[200px] w-[530px]" />
                <Skeleton className="h-[200px] w-[266px]" />
              </>
            ) : (
              trackMatches.map((trackMatch, index) => (
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
            {trackMatches.map((trackMatch, index) => (
              <TrackMatch
                key={index}
                trackMatch={trackMatch}
                id={index}
                view={"list"}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
