import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiFetch } from '../utils/apiClient'

const initialState = {
  data: null,
  status: 'idle',
  error: null,
  loginStatus: 'idle',
  loginError: null,
  registerStatus: 'idle',
  registerError: null,
  logoutStatus: 'idle',
  logoutError: null,
  codeStatus: 'idle',
  codeError: null,
  passwordStatus: 'idle',
  passwordError: null,
  updateNameStatus: 'idle',
  updateNameError: null,
}

const unwrapErrorMessage = (error) =>
  (typeof error === 'string' && error) ||
  error?.message ||
  error?.payload?.error ||
  'Произошла ошибка'

export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrent',
  async (_, { rejectWithValue }) => {
    try {
      const user = await apiFetch('/api-root/user/')
      return user
    } catch (error) {
      if (
        error.status === 401 ||
        error.status === 403 ||
        error.status === 404
      ) {
        return null
      }
      return rejectWithValue(unwrapErrorMessage(error))
    }
  },
)

export const loginUser = createAsyncThunk(
  'user/login',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      await apiFetch('/api-root/login/', {
        method: 'POST',
        body: payload,
      })
      const user = await dispatch(fetchCurrentUser()).unwrap()
      return user
    } catch (error) {
      return rejectWithValue(unwrapErrorMessage(error))
    }
  },
)

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await apiFetch('/api-root/logout/', {
        method: 'POST',
      })
      return true
    } catch (error) {
      return rejectWithValue(unwrapErrorMessage(error))
    }
  },
)

export const requestEmailCode = createAsyncThunk(
  'user/requestEmailCode',
  async ({ email, isRegistered }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        email,
        is_registered: isRegistered ? 'true' : 'false',
      })
      await apiFetch(`/api-root/code/?${params.toString()}`)
      return true
    } catch (error) {
      return rejectWithValue(unwrapErrorMessage(error))
    }
  },
)

export const registerUser = createAsyncThunk(
  'user/register',
  async ({ email, password, name, email_code }, { dispatch, rejectWithValue }) => {
    try {
      await apiFetch('/api-root/register/', {
        method: 'POST',
        body: {
          email,
          password,
          name,
          email_code,
        },
      })
      const user = await dispatch(
        loginUser({ email, password }),
      ).unwrap()
      return user
    } catch (error) {
      return rejectWithValue(unwrapErrorMessage(error))
    }
  },
)

export const updateUserName = createAsyncThunk(
  'user/updateName',
  async ({ name, password }, { rejectWithValue }) => {
    try {
      const updated = await apiFetch('/api-root/user/', {
        method: 'PATCH',
        body: { name, password },
      })
      return updated
    } catch (error) {
      return rejectWithValue(unwrapErrorMessage(error))
    }
  },
)

export const changePasswordWithCode = createAsyncThunk(
  'user/changePassword',
  async ({ email, password, email_code }, { rejectWithValue }) => {
    try {
      await apiFetch('/api-root/user/', {
        method: 'POST',
        body: { email, password, email_code },
      })
      return true
    } catch (error) {
      return rejectWithValue(unwrapErrorMessage(error))
    }
  },
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.data = action.payload
        state.error = null
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload || action.error.message
        state.data = null
      })

    builder
      .addCase(loginUser.pending, (state) => {
        state.loginStatus = 'loading'
        state.loginError = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginStatus = 'succeeded'
        state.loginError = null
        state.data = action.payload
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginStatus = 'failed'
        state.loginError = action.payload || action.error.message
      })

    builder
      .addCase(registerUser.pending, (state) => {
        state.registerStatus = 'loading'
        state.registerError = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.registerStatus = 'succeeded'
        state.registerError = null
        state.data = action.payload
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.registerStatus = 'failed'
        state.registerError = action.payload || action.error.message
      })

    builder
      .addCase(logoutUser.pending, (state) => {
        state.logoutStatus = 'loading'
        state.logoutError = null
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.logoutStatus = 'succeeded'
        state.logoutError = null
        state.data = null
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.logoutStatus = 'failed'
        state.logoutError = action.payload || action.error.message
      })

    builder
      .addCase(requestEmailCode.pending, (state) => {
        state.codeStatus = 'loading'
        state.codeError = null
      })
      .addCase(requestEmailCode.fulfilled, (state) => {
        state.codeStatus = 'succeeded'
        state.codeError = null
      })
      .addCase(requestEmailCode.rejected, (state, action) => {
        state.codeStatus = 'failed'
        state.codeError = action.payload || action.error.message
      })

    builder
      .addCase(changePasswordWithCode.pending, (state) => {
        state.passwordStatus = 'loading'
        state.passwordError = null
      })
      .addCase(changePasswordWithCode.fulfilled, (state) => {
        state.passwordStatus = 'succeeded'
        state.passwordError = null
      })
      .addCase(changePasswordWithCode.rejected, (state, action) => {
        state.passwordStatus = 'failed'
        state.passwordError = action.payload || action.error.message
      })

    builder
      .addCase(updateUserName.pending, (state) => {
        state.updateNameStatus = 'loading'
        state.updateNameError = null
      })
      .addCase(updateUserName.fulfilled, (state, action) => {
        state.updateNameStatus = 'succeeded'
        state.updateNameError = null
        state.data = action.payload
      })
      .addCase(updateUserName.rejected, (state, action) => {
        state.updateNameStatus = 'failed'
        state.updateNameError = action.payload || action.error.message
      })
  },
})

export default userSlice.reducer
