import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NavState {
  activeOption: string;
}

const initialState: NavState = {
  activeOption: "Overview",
};

export const navSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setActiveOption: (state: NavState, action: PayloadAction<string>) => {
      state.activeOption = action.payload;
    },
  },
});

export const { setActiveOption } = navSlice.actions;
export default navSlice.reducer;
