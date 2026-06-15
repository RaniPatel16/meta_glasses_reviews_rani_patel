import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as reviewService from '../../services/reviewService';
import { handleApiError } from '../../utils/errorHandler';
import toast from 'react-hot-toast';

export const fetchReviews = createAsyncThunk('reviews/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const data = await reviewService.getReviewsApi(params);
    return data;
  } catch (error) {
    return rejectWithValue(handleApiError(error, 'Failed to fetch reviews'));
  }
});

export const fetchReviewById = createAsyncThunk('reviews/fetchById', async (id, { rejectWithValue }) => {
  try {
    const data = await reviewService.getReviewByIdApi(id);
    return data;
  } catch (error) {
    return rejectWithValue(handleApiError(error, 'Failed to fetch review details'));
  }
});

export const createReview = createAsyncThunk('reviews/create', async (reviewData, { rejectWithValue }) => {
  try {
    const data = await reviewService.createReviewApi(reviewData);
    toast.success('Review created successfully');
    return data;
  } catch (error) {
    return rejectWithValue(handleApiError(error, 'Failed to create review'));
  }
});

export const updateReview = createAsyncThunk('reviews/update', async ({ id, data }, { rejectWithValue }) => {
  try {
    const result = await reviewService.updateReviewApi(id, data);
    toast.success('Review updated successfully');
    return result;
  } catch (error) {
    return rejectWithValue(handleApiError(error, 'Failed to update review'));
  }
});

export const deleteReview = createAsyncThunk('reviews/delete', async (id, { rejectWithValue }) => {
  try {
    await reviewService.deleteReviewApi(id);
    toast.success('Review deleted successfully');
    return id;
  } catch (error) {
    return rejectWithValue(handleApiError(error, 'Failed to delete review'));
  }
});

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
    pagination: {
      total: 0,
      page: 1,
      limit: 10,
      pages: 1
    },
    selectedReview: null,
    loading: false,
    actionLoading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearReviewError: (state) => {
      state.error = null;
      state.success = false;
    },
    setSelectedReview: (state, action) => {
      state.selectedReview = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Reviews
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        // Check if the backend sent a raw array directly instead of wrapping it in an object
        state.reviews = Array.isArray(action.payload) 
          ? action.payload 
          : (action.payload.data || action.payload.reviews || []);
          
        const meta = action.payload.pagination || action.payload.meta;
        if (meta) {
          state.pagination = { ...state.pagination, ...meta };
        }
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Single Review
      .addCase(fetchReviewById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedReview = action.payload.data || action.payload.review || action.payload;
      })
      .addCase(fetchReviewById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Review
      .addCase(createReview.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createReview.fulfilled, (state) => {
        state.actionLoading = false;
        state.success = true;
      })
      .addCase(createReview.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      // Update Review
      .addCase(updateReview.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateReview.fulfilled, (state) => {
        state.actionLoading = false;
        state.success = true;
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })
      // Delete Review
      .addCase(deleteReview.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteReview.fulfilled, (state) => {
        state.actionLoading = false;
        state.success = true;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReviewError, setSelectedReview } = reviewsSlice.actions;
export default reviewsSlice.reducer;
