// store.js
import { configureStore } from "@reduxjs/toolkit";
import playlistsReducer from "./playlistsSlice";
import trackMatchesReducer from "./trackMatchesSlice";
import tracksReducer from "./tracksSlice";
import userReducer from "./userSlice";

export const store = configureStore({
  reducer: {
    playlists: playlistsReducer,
    trackMatches: trackMatchesReducer,
    tracks: tracksReducer,
    user: userReducer,
  },
});
