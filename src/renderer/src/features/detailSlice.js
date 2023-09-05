import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  active: null,
  activeComponentCode: '',
  treeContainerClick: true,
};

export const detailSlice = createSlice({
  name: 'detail',
  initialState,
  reducers: {
    setTreeContainerClick: (state) => {
      state.treeContainerClick = !state.treeContainerClick;
    },
    setActive: (state, action) => {
      state.active = action.payload;
    },
    setActiveComponentCode: (state, action) => {
      state.activeComponentCode = action.payload;
    },
  },
});

export const { setTreeContainerClick, setActive, setActiveComponentCode } =
  detailSlice.actions;
export default detailSlice.reducer;
