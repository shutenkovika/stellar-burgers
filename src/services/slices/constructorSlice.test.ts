import { configureStore } from '@reduxjs/toolkit';
import constructorReducer, {
  addIngredient,
  removeIngredient,
  clearConstructor,
  moveIngredient
} from './constructorSlice';
import { TIngredient } from '@utils-types';

const testIngredient: TIngredient = {
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
};

const testIngredientMain: TIngredient = {
  _id: '2',
  name: 'Тестовая начинка',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'test.png',
  image_large: 'test_large.png',
  image_mobile: 'test_mobile.png'
};

describe('constructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  test('должен вернуть начальное состояние', () => {
    expect(constructorReducer(undefined, { type: 'unknown' })).toEqual(
      initialState
    );
  });

  test('добавление булки', () => {
    const state = constructorReducer(
      initialState,
      addIngredient(testIngredient)
    );
    expect(state.bun).not.toBeNull();
    expect(state.bun!.name).toBe('Тестовая булка');
  });

  test('добавление начинки', () => {
    const state = constructorReducer(
      initialState,
      addIngredient(testIngredientMain)
    );
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].name).toBe('Тестовая начинка');
  });

  test('удаление ингредиента', () => {
    const stateWithIngredient = constructorReducer(
      initialState,
      addIngredient(testIngredientMain)
    );
    const id = stateWithIngredient.ingredients[0].id;
    const state = constructorReducer(stateWithIngredient, removeIngredient(id));
    expect(state.ingredients).toHaveLength(0);
  });

  test('очистка конструктора', () => {
    const stateWithItems = {
      bun: { ...testIngredient, id: '1' },
      ingredients: [{ ...testIngredientMain, id: '2' }]
    };
    const state = constructorReducer(stateWithItems, clearConstructor());
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });

  test('изменение порядка ингредиентов', () => {
    const state1 = constructorReducer(
      initialState,
      addIngredient(testIngredientMain)
    );
    const testIngredientMain2 = {
      ...testIngredientMain,
      _id: '3',
      name: 'Второй ингредиент'
    };
    const state2 = constructorReducer(
      state1,
      addIngredient(testIngredientMain2)
    );

    const movedState = constructorReducer(
      state2,
      moveIngredient({ from: 0, to: 1 })
    );
    expect(movedState.ingredients[0].name).toBe('Второй ингредиент');
    expect(movedState.ingredients[1].name).toBe('Тестовая начинка');
  });
});
