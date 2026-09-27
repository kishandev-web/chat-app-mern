import { createSlice } from "@reduxjs/toolkit";

const initialTheme = localStorage.getItem("theme") || "light";
if (initialTheme === "dark") {
  document.documentElement.classList.add("dark");
} else {
  document.documentElement.classList.remove("dark");
}

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    theme: initialTheme,
    newChatModalOpen: false,
    newGroupModalOpen: false,
    profileModalOpen: false,
  },
  reducers: {
    toggleTheme: (state) => {
      const nextTheme = state.theme === "light" ? "dark" : "light";
      state.theme = nextTheme;
      localStorage.setItem("theme", nextTheme);
      if (nextTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
    setNewChatModalOpen: (state, action) => {
      state.newChatModalOpen = action.payload;
    },
    setNewGroupModalOpen: (state, action) => {
      state.newGroupModalOpen = action.payload;
    },
    setProfileModalOpen: (state, action) => {
      state.profileModalOpen = action.payload;
    },
  },
});

export const {
  toggleTheme,
  setNewChatModalOpen,
  setNewGroupModalOpen,
  setProfileModalOpen,
} = uiSlice.actions;

export default uiSlice.reducer;
