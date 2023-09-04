import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  active: null,
  activeComponentCode: '',
  treeContainerClick: true,
  activeRoute: {endPointName: '', methodName: ''}
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
    setActiveRoute: (state, action) => {
      state.activeRoute = action.payload;
    }
  },
});

export const { setTreeContainerClick, setActive, setActiveComponentCode, setActiveRoute } =
  detailSlice.actions;
export default detailSlice.reducer;
