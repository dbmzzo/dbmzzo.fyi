import { createStore as reduxCreateStore } from 'redux';


const reducer = (state, action) => {
  if (action.type === 'TOGGLE_GRID') {
    return { ...state, gridActive: !state.gridActive };
  }
  if (action.type === 'TOGGLE_DARK') {
    const isDark = document.body.className == "dark";
    localStorage.setItem("dark", isDark ? "false" : "true");
    document.body.className = isDark ? '' : 'dark';
    return { ...state, darkActive: !state.darkActive };
  }
  return state;
};

const isDark = localStorage.getItem("dark") == "true";
const initialState = { gridActive: false, darkActive: isDark };

const createStore = () => reduxCreateStore(reducer, initialState);
export default createStore;
