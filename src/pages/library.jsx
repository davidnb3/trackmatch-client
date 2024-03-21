import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { AddTracks } from "../components/add-tracks-dialog";
import { useEffect, useState } from "react";
import { fetchTracks } from "../store/tracksSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Library() {
  const tracks = useSelector((state) => state.tracks.entities);
  const [selectedArtist, setSelectedArtist] = useState(null);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTracks());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get a list of unique artists
  const artists = [...new Set(tracks.map((track) => track.artist))];

  // Get the tracks of the selected artist
  const selectedArtistTracks = tracks.filter(
    (track) => track.artist === selectedArtist
  );

  return (
    <div className="h-full px-4 py-6 lg:px-8">
      <div className="space-between flex items-center">
        <Input type="text" placeholder="Search" className="max-w-md" />
        <div className="ml-auto">
          <AddTracks>
            <Button>
              <PlusCircledIcon className="mr-2 h-4 w-4" />
              Add Tracks
            </Button>
          </AddTracks>
        </div>
      </div>

      <div className="mt-6 space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight">Library</h2>
        <p className="text-sm text-muted-foreground">Everything in one place</p>
      </div>
      <Separator className="my-4" />
      <div className="h-full px-4 py-6 lg:px-8 flex">
        <div className="w-1/2">
          <ul>
            {artists.map((artist) => (
              <li key={artist} onClick={() => setSelectedArtist(artist)}>
                {artist}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-1/2">
          <ul>
            {selectedArtistTracks.map((track) => (
              <li key={track._id}>{track.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
