import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// const API_URL = 'http://localhost:8000';
const API_URL = 'https://ggcomms-backend.onrender.com';

export const getFriendRequests = createAsyncThunk('user/get', async (_, thunkAPI) => {
    try {
        const response = await axios.get(`${API_URL}/api/v1/users/getFriendRequests`, { withCredentials: true })
        return response.data.data.pendingRequests
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message || "Failed to get any friend requests")
    }
})
export const accptFriendrReq = createAsyncThunk('user/post/accpt', async (data, thunkAPI) => {
    try {

        const response = await axios.post(`${API_URL}/api/v1/users/accept-request`, data, { withCredentials: true })

        return response.data
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to accpt friend request');
    }
})
export const declineFriendrReq = createAsyncThunk('user/post/decline', async (data, thunkAPI) => {
    try {

        const response = await axios.post(`${API_URL}/api/v1/users/decline-request`, data, { withCredentials: true })

        return response.data
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.message || 'Failed to decline friend request');
    }
})

const friendSlice = createSlice({
    name: 'friend',
    initialState: {
        friend: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(declineFriendrReq.pending, state => {
                state.loading = true;
            })
            .addCase(declineFriendrReq.fulfilled, state => {
                state.loading = false;
            })
            .addCase(declineFriendrReq.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(accptFriendrReq.pending, state => {
                state.loading = true;
            })
            .addCase(accptFriendrReq.fulfilled, state => {
                state.loading = false;
            })
            .addCase(accptFriendrReq.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getFriendRequests.pending, state => {
                state.loading = true;
            })
            .addCase(getFriendRequests.fulfilled, (state, action) => {
                state.loading = false;
                state.friend = action.payload;

            })
            .addCase(getFriendRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
})

export default friendSlice.reducer;