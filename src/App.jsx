import Home from "./pages/home.jsx";
import Browse from "./pages/browse.jsx";
import Playlist from "./pages/playlist.jsx";
import Songs from "./pages/library.jsx";
import { Menu } from "./components/menu";
import { Sidebar } from "./components/sidebar";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchTrackMatches } from "./store/trackMatchesSlice";
import { DndContext } from "@dnd-kit/core";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export default function App() {
  const dispatch = useDispatch();
  const handleDragEnd = (event) => {
    const { over } = event;

    if (over) {
      const playlistId = over.id;
      const trackMatchId = event.active.data.current.trackMatchId;

      fetch(`http://localhost:3001/playlists/${playlistId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trackMatchId }),
      });
    }
  };

  useEffect(() => {
    dispatch(fetchTrackMatches());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Router>
        <Menu /> {/* Add Menu component here */}
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
