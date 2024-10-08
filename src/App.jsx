import Home from "./pages/home.jsx";
import Browse from "./pages/browse.jsx";
import Playlist from "./pages/playlist.jsx";
import Library from "./pages/library.jsx";
import { Menu } from "./components/menu";
import { Sidebar } from "./components/sidebar";
import { ConfirmDialog } from "./components/confirmDialog";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchTrackMatches } from "./store/trackMatchesSlice";
import { DndContext } from "@dnd-kit/core";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { addTrackMatchToPlaylist } from "./store/playlistsSlice";

import "./App.css";

export default function App() {
  const [playlistId, setPlaylistId] = useState(null);
  const [trackMatch, setTrackMatch] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const dispatch = useDispatch();

  const handleDragEnd = (event) => {
    const { over } = event;

    if (over) {
      const playlistId = over.id;
      const trackMatch = event.active.data.current.trackMatch;

      dispatch(
        addTrackMatchToPlaylist({ playlistId, trackMatch, confirmed: false })
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
      addTrackMatchToPlaylist({ playlistId, trackMatch, confirmed: true })
    );
    setShowDialog(false);
  };

  useEffect(() => {
    dispatch(fetchTrackMatches({ page: 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Send the request only when the previous access token has expired
    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = localStorage.getItem("spotifyTokenExpirationTime");

    if (
      !localStorage.getItem("spotifyAccessToken") ||
      !expirationTime ||
      currentTime >= expirationTime
    ) {
      // Send a request to the server to get the access token
      fetch("http://localhost:3001/auth/getToken")
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          // Save the access token to localStorage
          localStorage.setItem("spotifyAccessToken", data.accessToken);
          localStorage.setItem(
            "spotifyTokenExpirationTime",
            currentTime + data.expiresIn
          );
        })
        .catch((error) => console.error(error));
    }
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
            <div
              className="grid lg:grid-cols-5"
              style={{ height: "calc(100vh - 40px)" }}
            >
              <Sidebar className="hidden lg:block" />
              <div className="col-span-3 lg:col-span-4 lg:border-l">
                <Routes>
                  <Route path="/" element={<Home />} />
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
