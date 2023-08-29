import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nodeInfo: [],
  server: {},
  serverPath: '',
  components: {},
  componentName: '',
  componentPath: '',
};

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    addPath: (state, action) => {
      const pathType = action.payload[0];
      const pathName = action.payload[1];
      state[pathType] = pathName;
    },
    setServer: (state, action) => {
      state.server = action.payload;
    },
    setComponents: (state, action) => {
      state.components = action.payload;
    },
    setNodeInfo: (state, action) => {
      state.nodeInfo = action.payload;
    },
    setComponentName: (state, action) => {
      state.componentName = action.payload;
    },
  },
});

export const {
  addPath,
  setServer,
  setComponents,
  setComponentName,
  setNodeInfo,
} = projectSlice.actions;
export default projectSlice.reducer;
