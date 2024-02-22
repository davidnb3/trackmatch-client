// store.js
import { configureStore } from "@reduxjs/toolkit";
import playlistsReducer from "./playlistsSlice";
import trackMatchesReducer from "./trackMatchesSlice";

export const store = configureStore({
  reducer: {
    playlists: playlistsReducer,
    trackMatches: trackMatchesReducer,
  },
});
