import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchTrackMatches = createAsyncThunk(
  "trackMatches/fetchTrackMatches",
  async ({ page = 1, limit = 50, jwtToken }) => {
    try {
      const response = await fetch(
        `http://localhost:3001/trackmatches?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return { trackMatches: data.trackMatches, totalPages: data.totalPages };
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

export const createTrackMatch = createAsyncThunk(
  "trackMatches/createTrackMatch",
  async ({ cleanedTracks, jwtToken }) => {
    try {
      const response = await fetch("http://localhost:3001/trackmatches", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cleanedTracks }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }
);

export const updateExistingTrackMatch = createAsyncThunk(
  "trackMatches/updateExistingTrackMatch",
  async ({ id, tracks, jwtToken }) => {
    try {
      const response = await fetch(`http://localhost:3001/trackmatches/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
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
      throw new Error(error.message);
    }
  }
);

export const deleteTrackMatch = createAsyncThunk(
  "trackMatches/deleteTrackMatch",
  async ({ id, jwtToken }) => {
    const response = await fetch(`http://localhost:3001/trackmatches/${id}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
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
  initialState: { entities: [], loading: false, totalPages: 1 },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrackMatches.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrackMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = action.payload.trackMatches;
        state.totalPages = action.payload.totalPages;
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
