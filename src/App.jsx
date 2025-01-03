import Home from "./pages/home.jsx";
import Browse from "./pages/browse.jsx";
import Playlist from "./pages/playlist.jsx";
import Library from "./pages/library.jsx";
import Login from "./pages/login.jsx";
import { Menu } from "./components/menu";
import { Sidebar } from "./components/sidebar";
import { ConfirmDialog } from "./components/confirmDialog";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchTrackMatches } from "./store/trackMatchesSlice";
import { DndContext, PointerSensor, useSensor } from "@dnd-kit/core";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { addTrackMatchToPlaylist } from "./store/playlistsSlice";
import useAuth from "./hooks/useAuth.jsx";

import "./App.css";

export default function App() {
  const [playlistId, setPlaylistId] = useState(null);
  const [trackMatch, setTrackMatch] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const { hasAccessToken, accessToken, jwtToken } = useAuth();
  const dispatch = useDispatch();

  const handleDragEnd = (event) => {
    const { over } = event;

    if (over) {
      const playlistId = over.id;
      const trackMatch = event.active.data.current.trackMatch;

      dispatch(
        addTrackMatchToPlaylist({
          playlistId,
          trackMatch,
          confirmed: false,
          jwtToken,
        })
      )
        .then((action) => {
          if (action.payload === "TrackMatch already in playlist") {
            setPlaylistId(playlistId);
            setTrackMatch(trackMatch);
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
      addTrackMatchToPlaylist({
        playlistId,
        trackMatch,
        confirmed: true,
        jwtToken,
      })
    );
    setShowDialog(false);
  };

  useEffect(() => {
    if (!jwtToken) return;

    dispatch(fetchTrackMatches({ page: 1, jwtToken }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jwtToken]);

  const pointerSensor = useSensor(PointerSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    },
  });

  if (!hasAccessToken) {
    return <Login />;
  }

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={[pointerSensor]}>
      <Router>
        <Menu />
        <ConfirmDialog
          open={showDialog}
          onOpenChange={setShowDialog}
          onAddToPlaylist={handleAddToPlaylist}
        />
        <div className="border-t">
          <div className="bg-background">
            <div
              className="grid lg:grid-cols-5"
              style={{ height: "calc(100vh - 40px)" }}
            >
              <Sidebar className="hidden lg:block" />
              <div className="col-span-3 lg:col-span-4 lg:border-l">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/browse" element={<Browse />} />
                  <Route path="/library" element={<Library />} />
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
