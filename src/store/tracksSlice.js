import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import disc from "../assets/disc.svg";

export const fetchTracks = createAsyncThunk(
  "tracks/fetchTracks",
  async (_, thunkAPI) => {
    try {
      const response = await fetch(`http://localhost:3001/tracks`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { data };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteTrackByName = createAsyncThunk(
  "tracks/deleteTrackByName",
  async (name, thunkAPI) => {
    try {
      const response = await fetch(`http://localhost:3001/tracks/${name}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return { name };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
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
      },
      {
        name: "",
        artist: "",
        artistSpotifyId: "",
        key: "",
        cover: disc,
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
        },
        {
          name: "",
          artist: "",
          artistSpotifyId: "",
          key: "",
          cover: disc,
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
