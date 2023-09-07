import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchValue: '',
  showSearch: false
};

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchValue: (state, action) => {
      state.searchValue = action.payload;
    },
    setShowSearch: (state) => {
      state.showSearch = !state.showSearch
    }
  },
});

export const {
  setSearchValue,
  setShowSearch
} = searchSlice.actions;
export default searchSlice.reducer;
