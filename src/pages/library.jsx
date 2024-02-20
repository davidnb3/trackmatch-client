import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { TrackMatch } from "../components/track-match";
import { trackMatches } from "../data/albums";
import { AddTracks } from "../components/add-tracks-dialog";

export default function Songs() {
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
            <h2 className="text-2xl font-semibold tracking-tight">Library</h2>
            <p className="text-sm text-muted-foreground">
              Everything in one place
            </p>
          </div>
          <Separator className="my-4" />
          <div className="flex flex-wrap justify-start gap-4">
            {trackMatches.map((trackMatch, index) => (
              <TrackMatch key={index} trackMatch={trackMatch} id={index} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="list" className="border-none p-0 outline-none">
          <div className="mt-6 space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">
              Library Page
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
              <div
                style={{ breakInside: "avoid", marginBottom: "1rem" }}
                key={index}
              >
                <TrackMatch key={index} trackMatch={trackMatch} id={index} />
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
