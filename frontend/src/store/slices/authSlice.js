import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authApi from "../../api/authApi";
import userApi from "../../api/userApi";
import { setToken, clearToken } from "../../api/tokenManager";

// Helper to safely get stored user
const getStoredUser = () => {
  try {
    const raw = localStorage.getItem("chat_user");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
};

const initialToken = localStorage.getItem("chat_token") || null;
const initialUser = getStoredUser();

export const verifyFirebaseTokenThunk = createAsyncThunk(
  "auth/verifyFirebaseToken",
  async (firebaseToken, { rejectWithValue }) => {
    try {
      const body = await authApi.verifyFirebaseToken(firebaseToken);
      console.log("[verifyFirebaseToken] Full body from API:", body);
      console.log("[verifyFirebaseToken] body.data:", body?.data);
      console.log("[verifyFirebaseToken] body.accessToken:", body?.accessToken);

      // Determine the correct payload shape
      // If body already has accessToken directly, use body.
      // If body.data has accessToken, use body.data. 
      const payload = body?.data?.accessToken ? body.data : body;
      console.log("[verifyFirebaseToken] Final payload:", payload);
      return payload; // { accessToken, user }
    } catch (error) {
      console.error("[verifyFirebaseToken] error:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const completeProfileThunk = createAsyncThunk(
  "auth/completeProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const body = await authApi.completeProfile(formData);
      console.log("[completeProfile] Full body from API:", body);
      // Same shape detection
      const payload = body?.data !== undefined ? body.data : body;
      return payload; // updatedUser
    } catch (error) {
      console.error("[completeProfile] error:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCurrentUserThunk = createAsyncThunk(
  "auth/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const body = await userApi.getMe();
      console.log("[fetchCurrentUser] Full body from API:", body);
      const payload = body?.data !== undefined ? body.data : body;
      return payload; // user
    } catch (error) {
      console.error("[fetchCurrentUser] error:", error.message);
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: initialUser,
    token: initialToken,
    isAuthenticated: Boolean(initialToken),
    isProfileCompleted: Boolean(initialUser?.isProfileCompleted),
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isProfileCompleted = false;
      state.error = null;
      clearToken();                              // ← tokenManager clear
      localStorage.removeItem("chat_token");
      localStorage.removeItem("chat_user");
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      state.isProfileCompleted = Boolean(state.user?.isProfileCompleted);
      localStorage.setItem("chat_user", JSON.stringify(state.user));
    },
  },
  extraReducers: (builder) => {
    // ─── verifyFirebaseTokenThunk ───
    builder
      .addCase(verifyFirebaseTokenThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyFirebaseTokenThunk.fulfilled, (state, action) => {
        state.loading = false;
        const { accessToken, user } = action.payload;
        console.log("[authSlice] fulfilled - accessToken:", accessToken);
        console.log("[authSlice] fulfilled - accessToken type:", typeof accessToken);
        console.log("[authSlice] fulfilled - user:", user);
        state.token = accessToken;
        state.user = user;
        state.isAuthenticated = true;
        state.isProfileCompleted = Boolean(user?.isProfileCompleted);
        setToken(accessToken);                   // ← tokenManager update (FIRST!)
        localStorage.setItem("chat_token", accessToken);
        localStorage.setItem("chat_user", JSON.stringify(user));
      })
      .addCase(verifyFirebaseTokenThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to verify authentication";
      });

    // ─── completeProfileThunk ───
    builder
      .addCase(completeProfileThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(completeProfileThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isProfileCompleted = true;
        localStorage.setItem("chat_user", JSON.stringify(action.payload));
      })
      .addCase(completeProfileThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to complete profile";
      });

    // ─── fetchCurrentUserThunk ───
    builder
      .addCase(fetchCurrentUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isProfileCompleted = Boolean(action.payload?.isProfileCompleted);
        localStorage.setItem("chat_user", JSON.stringify(action.payload));
      })
      .addCase(fetchCurrentUserThunk.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        clearToken();                            // ← tokenManager clear
        localStorage.removeItem("chat_token");
        localStorage.removeItem("chat_user");
      });
  },
});

export const { logout, clearAuthError, updateUser } = authSlice.actions;
export default authSlice.reducer;
