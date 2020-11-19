import React, { createContext, useContext, useReducer, useCallback } from "react";
import combineReducers from "react-combine-reducers";

import { initialIndicators, indicatorReducer } from "../reducers/Indicators";
import { initialData, dataReducer } from "../reducers/Data";
import { initialQuery, queryReducer } from "../reducers/Query";

const StoreContext = createContext();
const useStore = () => useContext(StoreContext);

const StoreProvider = ({ children }) => {
  const [reducer, appState] = useCallback(
    combineReducers({
      //TODO Add your local state reducers here
      indicators: [indicatorReducer, initialIndicators],
      data: [dataReducer, initialData],
      filters: [queryReducer, initialQuery],
    }),
    [reducer, appState]
  );

  const [state, dispatch] = useReducer(reducer, appState);
  return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
};

export { StoreProvider, useStore };
