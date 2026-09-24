import { createSlice } from "@reduxjs/toolkit";
// import { setLoading } from "./authSlice";

const blogSlice = createSlice({
  name: "blog",
  initialState: {
    loading: false,
    blog: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setBlog: (state, action) => {
      state.blog = action.payload;
    },
  },
});
export const { setLoading, setBlog } = blogSlice.actions;
export default blogSlice.reducer;
