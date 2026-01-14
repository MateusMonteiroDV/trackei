import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '@/lib/axios'

export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get('/api/user')
      return res.data
    } catch {
      return rejectWithValue(null)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null as any,
    user: null as any,
    loading: false,
    authenticated: false,
  },
  reducers: {
    setToken(state,action){
        state.token = action.payload
    },
    setUser(state, action) {
      state.user = action.payload
    },

    logout(state) {
      state.token = null
      state.user = null
      state.authenticated = false
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUser.pending, state => {
        state.loading = true
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload
        state.authenticated = true
        state.loading = false
      })
      .addCase(fetchUser.rejected, state => {
        state.loading = false
        state.authenticated = false
      })
  },
})

export const {setToken,setUser, logout } = authSlice.actions
export default authSlice.reducer
