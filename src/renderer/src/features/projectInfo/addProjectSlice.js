import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  componentPath: '',
  serverPath: '',
};

export const addProjectSlice = createSlice({
  name: 'addProject',
  initialState,
  reducers: {
    addPath: (state, action) => {
      const pathType = action.payload[0];
      const pathName = action.payload[1];
      state[pathType] = pathName;
    },
  },
});

export const { addPath } = addProjectSlice.actions;
export default addProjectSlice.reducer;
