import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchTrackMatches = createAsyncThunk(
  "trackMatches/fetchTrackMatches",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3001/trackmatches");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const trackMatches = await response.json();
      return trackMatches;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createTrackMatch = createAsyncThunk(
  "trackMatches/createTrackMatch",
  async (tracks, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:3001/trackmatches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tracks }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateExistingTrackMatch = createAsyncThunk(
  "trackMatches/updateExistingTrackMatch",
  async ({ id, tracks }, { rejectWithValue }) => {
    console.log("ID", id);
    console.log("TRACKS", tracks);
    try {
      const response = await fetch(`http://localhost:3001/trackmatches/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tracks }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("DATA", data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteTrackMatch = createAsyncThunk(
  "trackMatches/deleteTrackMatch",
  async (id) => {
    const response = await fetch(`http://localhost:3001/trackmatches/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return id;
  }
);

export const trackMatchesSlice = createSlice({
  name: "trackMatches",
  initialState: { entities: [], loading: "idle" },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrackMatches.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(fetchTrackMatches.fulfilled, (state, action) => {
        state.loading = "idle";
        state.entities = action.payload;
      })
      .addCase(createTrackMatch.fulfilled, (state, action) => {
        state.entities.push(action.payload.trackMatch);
      })
      .addCase(updateExistingTrackMatch.fulfilled, (state, action) => {
        const index = state.entities.findIndex(
          (trackMatch) => trackMatch._id === action.payload.trackMatch._id
        );
        if (index !== -1) {
          state.entities[index] = action.payload.trackMatch;
        }
      })
      .addCase(deleteTrackMatch.fulfilled, (state, action) => {
        state.entities = state.entities.filter(
          (trackMatch) => trackMatch._id !== action.payload
        );
      });
  },
});

export default trackMatchesSlice.reducer;
