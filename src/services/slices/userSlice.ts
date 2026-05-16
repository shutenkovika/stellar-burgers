import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  TLoginData,
  TRegisterData
} from '../../utils/burger-api';

import { setCookie, deleteCookie } from '../../utils/cookie'; // добавь импорт

interface UserState {
  user: TUser | null;
  isAuthChecked: boolean; // проверили ли мы токен при загрузке
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthChecked: false,
  loading: false,
  error: null
};

// Проверка текущего пользователя по токену
export const fetchUser = createAsyncThunk('user/fetchUser', getUserApi);

// Логин
export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    // сохраняем токены!
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);

// Регистрация
export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    // сохраняем токены!
    localStorage.setItem('refreshToken', response.refreshToken);
    setCookie('accessToken', response.accessToken);
    return response.user;
  }
);

// Обновление профиля
export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => {
    const response = await updateUserApi(data);
    return response.user;
  }
);

// Выход
export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken'); // вместо setCookie с expires: -1
});

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchUser
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.isAuthChecked = true;
    });
    builder.addCase(fetchUser.rejected, (state) => {
      state.isAuthChecked = true; // даже если ошибка — проверку считаем выполненной
    });

    // loginUser
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Ошибка входа';
    });

    // registerUser
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.user = action.payload;
      state.loading = false;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Ошибка регистрации';
    });

    // updateUser
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.user = action.payload;
    });

    // logoutUser
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
    });
  }
});

export default userSlice.reducer;
