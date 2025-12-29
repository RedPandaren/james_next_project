import { configureStore } from "@reduxjs/toolkit";
import navReducer from "./naviSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      navigation: navReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
