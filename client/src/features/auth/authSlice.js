import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

import axiosClient from '../../utils/axiosClient';

const initialState = {
  user: null,
  loading: false,
  initialized: false,
  error: null,
};

export const fetchMe =
    createAsyncThunk('auth/fetchMe', async (_, {rejectWithValue}) => {
      try {
        const response = await axiosClient.get('/auth/me');
        return response.data.user;
      } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Not authenticated');
      }
    });

export const loginUser = createAsyncThunk(
    'auth/loginUser', async (credentials, {dispatch, rejectWithValue}) => {
      try {
        await axiosClient.post('/auth/login', credentials);

        const response = await axiosClient.get('/auth/me');

        return response.data.user;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || 'Login failed');
      }
    });

export const registerUser = createAsyncThunk(
    'auth/registerUser', async (userData, {rejectWithValue}) => {
      try {
        await axiosClient.post('/auth/register', userData);

        const response = await axiosClient.get('/auth/me');

        return response.data.user;
      } catch (error) {
        const data = error.response?.data;

        const message = typeof data === 'string' ? data :
                                                   data?.message ||
                data?.Error || data?.error || 'Registration failed';

        console.log('Registration error:', data);

        return rejectWithValue(message);
      }
    });

export const logoutUser =
    createAsyncThunk('auth/logoutUser', async (_, {rejectWithValue}) => {
      try {
        await axiosClient.post('/auth/logout');
        return true;
      } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || 'Logout failed');
      }
    });

const authSlice = createSlice({
  name: 'auth',

  initialState,

  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

        // FETCH ME
        .addCase(
            fetchMe.pending,
            (state) => {
              state.loading = true;
              state.error = null;
            })

        .addCase(
            fetchMe.fulfilled,
            (state, action) => {
              state.loading = false;
              state.user = action.payload;
              state.initialized = true;
            })

        .addCase(
            fetchMe.rejected,
            (state) => {
              state.loading = false;
              state.user = null;
              state.initialized = true;
            })

        // LOGIN
        .addCase(
            loginUser.pending,
            (state) => {
              state.loading = true;
              state.error = null;
            })

        .addCase(
            loginUser.fulfilled,
            (state, action) => {
              state.loading = false;
              state.user = action.payload;
              state.initialized = true;
            })

        .addCase(
            loginUser.rejected,
            (state, action) => {
              state.loading = false;
              state.user = null;
              state.error = action.payload;
            })

        // REGISTER
        .addCase(
            registerUser.pending,
            (state) => {
              state.loading = true;
              state.error = null;
            })

        .addCase(
            registerUser.fulfilled,
            (state, action) => {
              state.loading = false;
              state.user = action.payload;
              state.initialized = true;
            })

        .addCase(
            registerUser.rejected,
            (state, action) => {
              state.loading = false;
              state.user = null;
              state.error = action.payload;
            })

        // LOGOUT
        .addCase(
            logoutUser.pending,
            (state) => {
              state.loading = true;
            })

        .addCase(
            logoutUser.fulfilled,
            (state) => {
              state.loading = false;
              state.user = null;
              state.error = null;
              state.initialized = true;
            })

        .addCase(logoutUser.rejected, (state, action) => {
          state.loading = false;
          state.user = null;
          state.error = action.payload;
        });
  },
});

export const {clearAuthError} = authSlice.actions;

export default authSlice.reducer;