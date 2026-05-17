import store from './store';

describe('rootReducer', () => {
  it('rootReducer handles unknown action correctly', () => {
    const sameState = store.getState();
    store.dispatch({ type: 'UNKNOWN_ACTION' });
    const state = store.getState();
    expect(state).toEqual(sameState);
  });
});
