import { configureStore } from '@reduxjs/toolkit';
import projectReducer from '../features/projectSlice';
import detailReducer from '../features/detailSlice';
import searchReducer from '../features/searchSlice';

export const store = configureStore({
  reducer: {
    project: projectReducer,
    detail: detailReducer,
    search: searchReducer,
  },
});
