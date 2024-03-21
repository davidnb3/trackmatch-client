// store.js
import { configureStore } from "@reduxjs/toolkit";
import playlistsReducer from "./playlistsSlice";
import trackMatchesReducer from "./trackMatchesSlice";
import tracksReducer from "./tracksSlice";

export const store = configureStore({
  reducer: {
    playlists: playlistsReducer,
    trackMatches: trackMatchesReducer,
    tracks: tracksReducer,
  },
});
