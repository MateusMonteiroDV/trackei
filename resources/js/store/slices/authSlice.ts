import axios from '@/lib/axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const fetchUser = createAsyncThunk(
    'auth/fetchUser',
    async (_, { rejectWithValue, getState }) => {
        try {
            const state = getState() as { auth: { token: string | null } };
            const res = await axios.get('/api/me', {
                headers: {
                    Authorization: `Bearer ${state.auth.token}`,
                },
            });
            return res.data;
        } catch {
            return rejectWithValue(null);
        }
    },
);

const initialState = {
    token: null as string | null,
    user: null as any,
    loading: false,
    authenticated: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken(state, action) {
            state.token = action.payload as string | null;
            state.authenticated = false;
            state.user = null;
        },
        setUser(state, action) {
            state.user = action.payload;
        },

        logout(state) {
            state.token = null;
            state.user = null;
            state.authenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.authenticated = true;
                state.loading = false;
            })
            .addCase(fetchUser.rejected, (state) => {
                state.loading = false;
                state.authenticated = false;
                // Don't clear token on failure to maintain persistence
                // state.token = null;
                state.user = null;
            })
            .addDefaultCase((state) => state ?? initialState);
    },
});

export const { setToken, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
