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
import { DndContext } from "@dnd-kit/core";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { addTrackMatchToPlaylist } from "./store/playlistsSlice";

import "./App.css";

export default function App() {
  const [playlistId, setPlaylistId] = useState(null);
  const [trackMatch, setTrackMatch] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const dispatch = useDispatch();
  const expiresIn = localStorage.getItem("expiresIn");
  const refreshToken = localStorage.getItem("refreshToken");

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
    const accessToken = localStorage.getItem("spotifyAccessToken");
    if (accessToken) {
      setHasToken(true);
    }
  }, [hasToken]);

  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      const body = {
        refreshToken,
      };

      fetch("http://localhost:3001/auth/refreshToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          localStorage.setItem("spotifyAccessToken", data.accessToken);
          localStorage.setItem("expiresIn", data.expiresIn);
        })
        .catch((error) => console.error(error));
    }
  };

  useEffect(() => {
    if (!refreshToken || !expiresIn) return;
    if (expiresIn) {
      const timeout = setInterval(() => {
        refreshAccessToken();
      }, (expiresIn - 60) * 1000); // Refresh the token 1 minute before it expires

      return () => clearTimeout(timeout);
    }
  }, [refreshToken, expiresIn]);

  if (!hasToken) {
    return <Login />;
  }

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
