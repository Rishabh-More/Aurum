const initialQuery = {
  range: {
    grossWt: { start: 0, end: 100 },
    netWt: { start: 0, end: 100 },
  },
  itemStatus: [],
  itemCategory: [],
  itemType: [],
};

const queryReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_QUERY":
      console.log("[HOOK] state for store query", state);
      return {
        ...state,
        range: action.payload.range,
        itemStatus: action.payload.itemStatus,
        itemCategory: action.payload.itemCategory,
        itemType: action.payload.itemType,
      };
    case "CLEAR_QUERY":
      return {
        ...state,
        range: initialQuery.range,
        itemStatus: initialQuery.itemStatus,
        itemCategory: initialQuery.itemCategory,
        itemType: initialQuery.itemType,
      };
    default:
      return state;
  }
};

export { initialQuery, queryReducer };
