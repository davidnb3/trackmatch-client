import Home from "./pages/home.jsx";
import Browse from "./pages/browse.jsx";
import Playlist from "./pages/playlist.jsx";
import Songs from "./pages/library.jsx";
import { Menu } from "./components/menu";
import { Sidebar } from "./components/sidebar";
import { ConfirmDialog } from "./components/confirmDialog";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchTrackMatches } from "./store/trackMatchesSlice";
import { DndContext } from "@dnd-kit/core";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { addTrackMatchToPlaylist } from "./store/playlistsSlice";
import { useState } from "react";

export default function App() {
  const [playlistId, setPlaylistId] = useState(null);
  const [trackMatchId, setTrackMatchId] = useState(null);
  const dispatch = useDispatch();
  const [showDialog, setShowDialog] = useState(false);
  const handleDragEnd = (event) => {
    const { over } = event;

    if (over) {
      const playlistId = over.id;
      const trackMatchId = event.active.data.current.trackMatchId;

      dispatch(
        addTrackMatchToPlaylist({ playlistId, trackMatchId, confirmed: false })
      )
        .then((action) => {
          console.log(action.payload);
          if (action.payload === "TrackMatch already in playlist") {
            setPlaylistId(playlistId);
            setTrackMatchId(trackMatchId);
            setShowDialog(true);
          }
        })
        .catch((error) => {
          throw new Error(error);
        });
    }
  };

  const handleAddToPlaylist = () => {
    dispatch(
      addTrackMatchToPlaylist({ playlistId, trackMatchId, confirmed: true })
    );
    setShowDialog(false);
  };

  useEffect(() => {
    dispatch(fetchTrackMatches({ page: 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Router>
        <Menu />
        <ConfirmDialog
          open={showDialog}
          onOpenChange={setShowDialog}
          onAddToPlaylist={handleAddToPlaylist}
        />
        <div className="border-t">
          <div className="bg-background">
            <div className="grid lg:grid-cols-5">
              <Sidebar className="hidden lg:block" />
              <div className="col-span-3 lg:col-span-4 lg:border-l">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/browse" element={<Browse />} />
                  <Route path="/library" element={<Songs />} />
                  <Route path="/playlists/:playlistId" element={<Playlist />} />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      </Router>
    </DndContext>
  );
}
