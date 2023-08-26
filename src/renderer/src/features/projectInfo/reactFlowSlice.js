import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  nodeInfo: [],
  components: [],
  componentName: '',
};

export const reactFlowSlice = createSlice({
  name: 'reactFlow',
  initialState,
  reducers: {
    setComponents: (state, action) => {
      // get filepath name from component path
      state.components = action.payload;
    },
    setNodeInfo: (state, action) => {
      state.nodeInfo = action.payload;
    },
    setComponentName: (state, action) => {
      state.components = action.payload;
    },
  },
});

export const { setComponents, setNodeInfo, setComponentName } =
  reactFlowSlice.actions;
export default reactFlowSlice.reducer;
