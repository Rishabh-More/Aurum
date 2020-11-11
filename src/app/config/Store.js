import React, { createContext, useContext, useReducer, useCallback } from "react";
import combineReducers from "react-combine-reducers";

const StoreContext = createContext();
const useStore = () => useContext(StoreContext);

const StoreProvider = ({ children }) => {
  const [reducer, appState] = useCallback(
    combineReducers({
      //TODO Add your local state reducers here
    }),
    [reducer, appState]
  );

  const [state, dispatch] = useReducer(reducer, appState);
  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
};

export { StoreProvider, useStore };
