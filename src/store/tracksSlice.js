import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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

export const deleteTrack = createAsyncThunk(
  "tracks/deleteTrack",
  async (id, thunkAPI) => {
    try {
      const response = await fetch(`http://localhost:3001/tracks/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return { id };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const tracksSlice = createSlice({
  name: "tracks",
  initialState: { entities: [], loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTracks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTracks.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = action.payload.data;
      })
      .addCase(deleteTrack.fulfilled, (state, action) => {
        state.entities = state.entities.filter(
          (track) => track._id !== action.payload.id
        );
      });
  },
});

export default tracksSlice.reducer;
