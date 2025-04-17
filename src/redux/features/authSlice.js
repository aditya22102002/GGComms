import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// const API_URL = 'http://localhost:8000/api/v1/users';
const API_URL = 'https://ggcomms-backend.onrender.com/api/v1/users';


export const getUser = createAsyncThunk('auth/getUser', async (_, thunkAPI) => {
  try {
    const response = await axios.get(`${API_URL}/getUser`, { withCredentials: true });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue('Session expired');
  }
});

export const loginUser = createAsyncThunk('auth/login', async (data, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/login`, data, { withCredentials: true });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (data, thunkAPI) => {
  try {
    const response = await axios.post(`${API_URL}/register`, data, { withCredentials: true });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Register failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    loading: false,
    error: null,
  },
  reducers: {
    logout: state => {
      state.user = null;
      localStorage.removeItem('user');
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        const user = action.payload?.data?.user;
        if (user) {
          state.user = user;
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          state.user = null;
          localStorage.removeItem('user');
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, state => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, state => {
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        localStorage.setItem('user', JSON.stringify(action.payload.data));
      })
      .addCase(getUser.rejected, (state) => {
        state.loading = false;
        state.user = null;
        localStorage.removeItem('user');
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
