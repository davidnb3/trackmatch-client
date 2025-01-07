import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { TrackMatch } from "../components/TrackMatch";
import { AddTracksDialog } from "../components/AddTracksDialog";
import { useSelector } from "react-redux";
import { PagePagination } from "../components/PagePagination";
import { Input } from "@/components/ui/input";

export default function Browse() {
  const trackMatches = useSelector((state) => state.trackMatches.entities);
  const trackMatchesLoading = useSelector(
    (state) => state.trackMatches.loading
  );
  const pendingTracks = useSelector((state) => state.tracks.pendingTracks);

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
            <h2 className="text-2xl font-semibold tracking-tight">
              Browse the Collection
            </h2>
            <p className="text-sm text-muted-foreground">
              Everything in one place
            </p>
          </div>
          <Separator className="my-4" />
          <div className="flex flex-wrap justify-start gap-4">
            {trackMatchesLoading ? (
              <>
                <Skeleton className="h-[200px] w-[266px]" />
                <Skeleton className="h-[200px] w-[398px]" />
                <Skeleton className="h-[200px] w-[530px]" />
                <Skeleton className="h-[200px] w-[266px]" />
              </>
            ) : (
              trackMatches
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
        <TabsContent value="columns" className="border-none p-0 outline-none">
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
              columnGap: "20px",
            }}
          >
            {trackMatches
              ?.slice()
              .reverse()
              .map((trackMatch, index) => (
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
      {!trackMatchesLoading && <PagePagination />}
    </div>
  );
}
