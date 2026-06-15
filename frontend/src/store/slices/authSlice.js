import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const loginUser = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/login', credentials);
    const token = response.data.token || response.data.data?.token; // Adjust based on backend response
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(response.data.data?.user || response.data.user || {}));
    }
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
  try {
    const response = await api.post('/auth/register', userData);
    const token = response.data.token || response.data.data?.token;
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(response.data.data?.user || response.data.user || {}));
    }
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Registration failed');
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/users/${id}`, data);
    const updatedUser = response.data.data || response.data;
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Profile update failed');
  }
});

const getInitialUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: getInitialUser(),
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.success = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    clearAuthError: (state) => {
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.token = action.payload.token || action.payload.data?.token;
        state.user = action.payload.user || action.payload.data?.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.token = action.payload.token || action.payload.data?.token;
        state.user = action.payload.user || action.payload.data?.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
