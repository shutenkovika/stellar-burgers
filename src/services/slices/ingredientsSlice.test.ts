import ingredientsReducer, { fetchIngredients } from './ingredientsSlice';
import { TIngredient } from '@utils-types';

const testIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Тестовая булка',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'test.png',
    image_large: 'test_large.png',
    image_mobile: 'test_mobile.png'
  }
];

describe('ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    loading: false,
    error: null
  };

  test('должен вернуть начальное состояние', () => {
    expect(ingredientsReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  test('fetchIngredients.pending — loading становится true', () => {
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.pending('', undefined)
    );
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('fetchIngredients.fulfilled — данные записываются в стор', () => {
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.fulfilled(testIngredients, '', undefined)
    );
    expect(state.loading).toBe(false);
    expect(state.ingredients).toEqual(testIngredients);
  });

  test('fetchIngredients.rejected — ошибка записывается в стор', () => {
    const error = new Error('Ошибка загрузки');
    const state = ingredientsReducer(
      initialState,
      fetchIngredients.rejected(error, '', undefined)
    );
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });
});
