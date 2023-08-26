import { configureStore } from '@reduxjs/toolkit';
import addProjectReducer from '../features/projectInfo/addProjectSlice';
import reactFlowReducer from '../features/projectInfo/reactFlowSlice';

export const store = configureStore({
  reducer: {
    addProject: addProjectReducer,
    reactFlow: reactFlowReducer,
  },
});
