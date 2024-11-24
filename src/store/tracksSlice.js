import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import disc from "../assets/disc.svg";

export const fetchTracks = createAsyncThunk(
  "tracks/fetchTracks",
  async (jwtToken) => {
    try {
      const response = await fetch(`http://localhost:3001/tracks`, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

export const deleteTrackByName = createAsyncThunk(
  "tracks/deleteTrackByName",
  async ({ name, jwtToken }) => {
    try {
      const response = await fetch(`http://localhost:3001/tracks/${name}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return { name };
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

export const tracksSlice = createSlice({
  name: "tracks",
  initialState: {
    entities: [],
    loading: false,
    pendingTracks: [
      {
        name: "",
        artist: "",
        artistSpotifyId: "",
        key: "",
        cover: disc,
        uri: "",
      },
      {
        name: "",
        artist: "",
        artistSpotifyId: "",
        key: "",
        cover: disc,
        uri: "",
      },
    ],
  },
  reducers: {
    addPendingTrack: (state, action) => {
      const index = state.pendingTracks.findIndex((track) => !track.name);
      if (index !== -1) {
        state.pendingTracks = [{ ...action.payload }];
      } else {
        state.pendingTracks.push(action.payload);
      }
    },
    resetPendingTracks: (state) => {
      state.pendingTracks = [
        {
          name: "",
          artist: "",
          artistSpotifyId: "",
          key: "",
          cover: disc,
          uri: "",
        },
        {
          name: "",
          artist: "",
          artistSpotifyId: "",
          key: "",
          cover: disc,
          uri: "",
        },
      ];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTracks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTracks.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = action.payload.data;
      })
      .addCase(deleteTrackByName.fulfilled, (state, action) => {
        state.entities = state.entities.filter(
          (track) => track.name !== action.payload.name
        );
      });
  },
});

export default tracksSlice.reducer;
