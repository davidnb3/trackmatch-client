import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const getUserData = createAsyncThunk(
  "user/getUserData",
  async (accessToken) => {
    const response = await fetch("http://localhost:3001/auth/user", {
      body: JSON.stringify({ accessToken }),
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (response.status === 401) {
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }
    const userData = await response.json();
    return userData;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: {
      spotifyId: "",
      name: "",
      email: "",
      image: "",
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserData.fulfilled, (state, action) => {
      state.user = action.payload;
    });
  },
});

export default userSlice.reducer;
