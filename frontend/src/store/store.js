import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';
import usersReducer from './slices/usersSlice';
import reviewsReducer from './slices/reviewsSlice';

const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    users: usersReducer,
    reviews: reviewsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
