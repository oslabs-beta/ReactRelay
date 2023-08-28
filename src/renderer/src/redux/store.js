import { configureStore } from '@reduxjs/toolkit';
import addProjectReducer from '../features/projectInfo/addProjectSlice';
import reactFlowReducer from '../features/projectInfo/reactFlowSlice';
import detailReducer from '../features/projectInfo/detailSlice';

export const store = configureStore({
  reducer: {
    addProject: addProjectReducer,
    reactFlow: reactFlowReducer,
    detail: detailReducer,
  },
});
