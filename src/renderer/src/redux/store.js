import { configureStore } from '@reduxjs/toolkit';
import projectReducer from '../features/projectSlice';
import detailReducer from '../features/detailSlice';

export const store = configureStore({
  reducer: {
    project: projectReducer,
    detail: detailReducer,
  },
});
