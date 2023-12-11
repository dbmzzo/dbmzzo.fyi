import { createStore as reduxCreateStore } from 'redux';


const reducer = (state, action) => {
  if (action.type === 'TOGGLE_GRID') {
    return { ...state, gridActive: !state.gridActive };
  }
  return state;
};

const initialState = { gridActive: false };

const createStore = () => reduxCreateStore(reducer, initialState);
export default createStore;
