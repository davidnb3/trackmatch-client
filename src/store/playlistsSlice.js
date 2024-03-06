import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import {
  deleteTrackMatch,
  updateExistingTrackMatch,
} from "./trackMatchesSlice";

export const fetchPlaylists = createAsyncThunk(
  "playlists/fetchPlaylists",
  async () => {
    const response = await fetch("http://localhost:3001/playlists");
    if (!response.ok) {
      throw new Error("Failed to fetch playlists");
    }
    const playlists = await response.json();
    return playlists;
  }
);

export const fetchPlaylistById = createAsyncThunk(
  "playlists/fetchPlaylistById",
  async (id) => {
    const response = await fetch(`http://localhost:3001/playlists/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch playlist");
    }
    const playlist = await response.json();
    return playlist;
  }
);

export const createPlaylist = createAsyncThunk(
  "playlists/createPlaylist",
  async () => {
    const date = new Date();
    const formattedDate = `${date.getDate()}.${
      date.getMonth() + 1
    }.${date.getFullYear()}`;

    const response = await fetch("http://localhost:3001/playlists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: "New Playlist",
        trackMatches: [],
        description: `My new playlist created on ${formattedDate}`,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create playlist");
    }

    const newPlaylist = await response.json();

    return newPlaylist.playlist;
  }
);

export const updatePlaylist = createAsyncThunk(
  "playlists/updatePlaylist",
  async ({ id, name, description }) => {
    const response = await fetch(`http://localhost:3001/playlists/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        description,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const updatedPlaylist = await response.json();

    return updatedPlaylist.playlist;
  }
);

export const deletePlaylist = createAsyncThunk(
  "playlists/deletePlaylist",
  async (id) => {
    const response = await fetch(`http://localhost:3001/playlists/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return id;
  }
);

export const addTrackMatchToPlaylist = createAsyncThunk(
  "playlists/addTrackMatchToPlaylist",
  async ({ playlistId, trackMatch, confirmed }) => {
    const response = await fetch(
      `http://localhost:3001/playlists/${playlistId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trackMatch, confirmed }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    console.log(data.message);
    return data.message;
  }
);

export const removeTrackMatchFromPlaylist = createAsyncThunk(
  "playlists/removeTrackMatchFromPlaylist",
  async ({ playlistId, instanceId }) => {
    const response = await fetch(
      `http://localhost:3001/playlists/${playlistId}/trackMatches`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ instanceId }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to add track match to playlist");
    }

    return { playlistId, instanceId };
  }
);

const playlistsSlice = createSlice({
  name: "playlists",
  initialState: {
    entities: [],
    playlistsLoading: false,
    trackMatchesLoading: false,
    selectedPlaylist: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaylists.pending, (state) => {
        state.playlistsLoading = true;
      })
      .addCase(fetchPlaylists.fulfilled, (state, action) => {
        state.playlistsLoading = false;
        state.entities = action.payload;
      })
      .addCase(fetchPlaylistById.pending, (state) => {
        state.trackMatchesLoading = true;
      })
      .addCase(fetchPlaylistById.fulfilled, (state, action) => {
        state.trackMatchesLoading = false;
        state.selectedPlaylist = action.payload;
      })
      .addCase(createPlaylist.fulfilled, (state, action) => {
        state.entities.push(action.payload);
      })
      .addCase(updatePlaylist.fulfilled, (state, action) => {
        const index = state.entities.findIndex(
          (playlist) => playlist._id === action.payload._id
        );
        if (index !== -1) {
          state.entities[index] = action.payload;
        }
        if (
          state.selectedPlaylist &&
          state.selectedPlaylist._id === action.payload._id
        ) {
          state.selectedPlaylist.name = action.payload.name;
          state.selectedPlaylist.description = action.payload.description;
        }
      })
      .addCase(deletePlaylist.fulfilled, (state, action) => {
        state.entities = state.entities.filter(
          (playlist) => playlist._id !== action.payload
        );
      })
      .addCase(deleteTrackMatch.fulfilled, (state, action) => {
        state.entities.forEach((playlist) => {
          playlist.trackMatches = playlist.trackMatches.filter(
            (trackMatch) => trackMatch !== action.payload
          );
        });
        if (state.selectedPlaylist) {
          state.selectedPlaylist.trackMatches =
            state.selectedPlaylist.trackMatches.filter(
              (trackMatch) => trackMatch !== action.payload
            );
        }
      })
      .addCase(updateExistingTrackMatch.fulfilled, (state, action) => {
        if (
          state.selectedPlaylist &&
          state.selectedPlaylist.trackMatches.find(
            (trackMatch) =>
              trackMatch.trackMatch._id === action.payload.trackMatch._id
          )
        ) {
          const selectedTrackMatchIndex =
            state.selectedPlaylist.trackMatches.findIndex(
              (trackMatch) =>
                trackMatch.trackMatch._id === action.payload.trackMatch._id
            );

          state.selectedPlaylist.trackMatches[
            selectedTrackMatchIndex
          ].trackMatch = action.payload.trackMatch;
        }
      })
      .addCase(removeTrackMatchFromPlaylist.fulfilled, (state, action) => {
        const { playlistId, instanceId } = action.payload;
        if (
          state.selectedPlaylist &&
          state.selectedPlaylist._id === playlistId
        ) {
          state.selectedPlaylist.trackMatches =
            state.selectedPlaylist.trackMatches.filter((trackMatch) => {
              return trackMatch._id !== instanceId;
            });
        }
      });
  },
});

export default playlistsSlice.reducer;
