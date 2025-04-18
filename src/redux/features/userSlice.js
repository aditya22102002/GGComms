import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// const API_URL = 'http://localhost:8000';
const API_URL = 'https://ggcomms-backend.onrender.com';

export const getCurrentUser = createAsyncThunk('user/get', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}/api/v1/users/getUser`, { withCredentials: true });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to get user');
  }
});

export const sendFriendrReq = createAsyncThunk('user/post', async (data, thunkAPI) => {
  try {

    const response = await axios.post(`${API_URL}/api/v1/users/send-request`, data, { withCredentials: true })

    return response.data
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to send friend request');
  }
})



const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      
      .addCase(sendFriendrReq.pending, state => {
        state.loading = true;
      })
      .addCase(sendFriendrReq.fulfilled, state => {
        state.loading = false;
      })
      .addCase(sendFriendrReq.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCurrentUser.pending, state => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
