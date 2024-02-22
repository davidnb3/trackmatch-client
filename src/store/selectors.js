import { createSelector } from "@reduxjs/toolkit";

export const selectTrackMatchesForPlaylist = createSelector(
  // First input: all trackMatches
  (state) => state.trackMatches.entities,
  // Second input: the current playlist
  (state) => state.playlists.selectedPlaylist,
  // Output: the trackMatches for the current playlist
  (trackMatches, playlist) => {
    if (!playlist) return [];
    return playlist.trackMatches.map((id) =>
      trackMatches.find((tm) => tm._id === id)
    );
  }
);
