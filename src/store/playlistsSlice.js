import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { deleteTrackMatch } from "./trackMatchesSlice";

export const fetchPlaylists = createAsyncThunk(
  "playlists/fetchPlaylists",
  async () => {
    const response = await fetch("http://localhost:3001/playlists");
    const playlists = await response.json();
    return playlists;
  }
);

export const fetchPlaylistById = createAsyncThunk(
  "playlists/fetchPlaylistById",
  async (id) => {
    const response = await fetch(`http://localhost:3001/playlists/${id}`);
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

const playlistsSlice = createSlice({
  name: "playlists",
  initialState: {
    entities: [],
    playlistsLoading: "idle",
    trackMatchesLoading: "idle",
    selectedPlaylist: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPlaylists.pending, (state) => {
        state.playlistsLoading = "loading";
      })
      .addCase(fetchPlaylists.fulfilled, (state, action) => {
        state.playlistsLoading = "idle";
        state.entities = action.payload;
      })
      .addCase(fetchPlaylistById.pending, (state) => {
        state.trackMatchesLoading = "loading";
      })
      .addCase(fetchPlaylistById.fulfilled, (state, action) => {
        state.trackMatchesLoading = "idle";
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
      })
      .addCase(deletePlaylist.fulfilled, (state, action) => {
        state.entities = state.entities.filter(
          (playlist) => playlist._id !== action.payload
        );
      })
      .addCase(deleteTrackMatch.fulfilled, (state, action) => {
        state.entities.forEach((playlist) => {
          playlist.trackMatches = playlist.trackMatches.filter(
            (trackMatchId) => trackMatchId !== action.payload
          );
        });
        if (state.selectedPlaylist) {
          state.selectedPlaylist.trackMatches =
            state.selectedPlaylist.trackMatches.filter(
              (trackMatchId) => trackMatchId !== action.payload
            );
        }
      });
  },
});

export default playlistsSlice.reducer;
