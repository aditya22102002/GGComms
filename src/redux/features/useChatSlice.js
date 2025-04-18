// src/redux/chatSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// const API_URL = 'http://localhost:8000';
const API_URL = 'https://ggcomms-backend.onrender.com';

export const fetchUsers = createAsyncThunk("chat/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/api/v1/message/users`);
    return res.data.data;
  } catch (err) {
    console.log(err);
    
    return rejectWithValue(err.response.data.message);
  }
});


export const fetchMessages = createAsyncThunk("chat/fetchMessages", async (id, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/api/v1/message/${id}`, { withCredentials: true });

    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});


export const sendMessage = createAsyncThunk("chat/sendMessage", async ({ id, text }, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/api/v1/message/send/${id}`, { text }, { withCredentials: true });
    return { id, text };
  } catch (err) {
    return rejectWithValue(err.response.data.message);
  }
});

export const fetchFriends = createAsyncThunk("chat/fetchFriends", async () => {
  try {
    const res = await axios.get(`${API_URL}/api/v1/users/list`,{
      withCredentials:true,
    });
    return res.data.friends;
  } catch (error) {

    throw error
  }
});




const chatSlice = createSlice({
  name: "chat",
  initialState: {
    users: [],
    messages: [],
    friends: [],
    selectedUserId: null,
    loading: false,
    error: null,
  },
  reducers: {
    setSelectedUserId: (state, action) => {
      state.selectedUserId = action.payload;
    },
    addIncomingMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.friends = action.payload;
      })
      .addCase(fetchUsers.pending, (state) => { state.loading = true; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchMessages.pending, (state) => { state.loading = true; })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push({ ...action.payload, senderId: "me" }); // Adjust according to logic
      });
  },
});

export const { setSelectedUserId, addIncomingMessage } = chatSlice.actions;
export default chatSlice.reducer;
