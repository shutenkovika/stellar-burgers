import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';

interface OrderState {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
}

const initialState: OrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return {
      ...response.order,
      ingredients // передаём те же id что отправили
    } as TOrder;
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.pending, (state) => {
      state.orderRequest = true;
      state.error = null;
    });
    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.orderRequest = false;
      state.orderModalData = action.payload;
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.orderRequest = false;
      state.error = action.error.message || 'Ошибка заказа';
    });
  }
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
