import store from './store';

describe('rootReducer', () => {
  test('должен правильно инициализировать начальное состояние', () => {
    const state = store.getState();
    expect(state.ingredients).toBeDefined();
    expect(state.burgerConstructor).toBeDefined();
    expect(state.order).toBeDefined();
    expect(state.feed).toBeDefined();
    expect(state.user).toBeDefined();
    expect(state.profileOrders).toBeDefined();
  });
});
