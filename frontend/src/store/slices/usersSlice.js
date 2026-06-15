import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as userService from '../../services/userService';
import { handleApiError } from '../../utils/errorHandler';
import toast from 'react-hot-toast';

export const fetchUsers = createAsyncThunk('users/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const data = await userService.getUsersApi(params);
    return data;
  } catch (error) {
    return rejectWithValue(handleApiError(error, 'Failed to fetch users'));
  }
});

export const fetchUserById = createAsyncThunk('users/fetchById', async (id, { rejectWithValue }) => {
  try {
    const data = await userService.getUserByIdApi(id);
    return data;
  } catch (error) {
    return rejectWithValue(handleApiError(error, 'Failed to fetch user details'));
  }
});

export const createUser = createAsyncThunk('users/create', async (userData, { rejectWithValue }) => {
  try {
    const data = await userService.createUserApi(userData);
    toast.success('User created successfully');
    return data;
  } catch (error) {
    return rejectWithValue(handleApiError(error, 'Failed to create user'));
  }
});

export const updateUser = createAsyncThunk('users/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const result = await userService.updateUserApi(id, data);
    toast.success('User updated successfully');
    return result;
  } catch (error) {
    return rejectWithValue(handleApiError(error, 'Failed to update user'));
  }
});

export const deleteUser = createAsyncThunk('users/delete', async (id, { rejectWithValue }) => {
  try {
    await userService.deleteUserApi(id);
    toast.success('User deleted successfully');
    return id;
  } catch (error) {
    return rejectWithValue(handleApiError(error, 'Failed to delete user'));
  }
});

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      pages: 1
    },
    selectedUser: null,
    loading: false,
    actionLoading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearUserError: (state) => {
      state.error = null;
      state.success = false;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        // Fix: Check if the backend sent a raw array directly instead of wrapping it in an object
        state.users = Array.isArray(action.payload) 
          ? action.payload 
          : (action.payload.data || action.payload.users || []);
          
        const meta = action.payload.pagination || action.payload.meta;
        if (meta) {
          state.pagination = { ...state.pagination, ...meta };
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload.data || action.payload.user;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createUser.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.success = true;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(updateUser.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.success = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteUser.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.success = true;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearUserError, setSelectedUser } = usersSlice.actions;
export default usersSlice.reducer;
