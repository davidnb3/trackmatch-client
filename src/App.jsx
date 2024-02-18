import Home from "./pages/home.jsx";
import Browse from "./pages/browse.jsx";
import Playlist from "./pages/playlist.jsx";
import Songs from "./pages/library.jsx";

import { DndContext } from "@dnd-kit/core";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export default function App() {
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

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/library" element={<Songs />} />
          <Route path="/playlists/:playlistId" element={<Playlist />} />
        </Routes>
      </Router>
    </DndContext>
  );
}
