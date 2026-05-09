import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

interface ProfileOrdersState {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: ProfileOrdersState = {
  orders: [],
  loading: false,
  error: null
};

export const fetchProfileOrders = createAsyncThunk(
  'profileOrders/fetch',
  getOrdersApi
);

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProfileOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProfileOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    });
    builder.addCase(fetchProfileOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Ошибка загрузки заказов';
    });
  }
});

export default profileOrdersSlice.reducer;
