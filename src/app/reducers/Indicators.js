const initialIndicators = {
  areProductsSelected: false,
  dataRefreshed: false,
  linksRefreshed: false,
  isSortByGroup: false,
  isFilterApplied: false,
  requestedFeature: "",
  isCartVisited: false,
};

const indicatorReducer = (state, action) => {
  switch (action.type) {
    case "SET_SELECTION_FLAG":
      return { ...state, areProductsSelected: action.payload };
    case "SET_SORT_FLAG":
      return { ...state, isSortByGroup: action.payload };
    case "SET_FILTER_FLAG":
      return { ...state, isFilterApplied: action.payload };
    case "SET_DATA_REFRESH":
      return { ...state, dataRefreshed: action.payload };
    case "SET_LINKS_REFRESH":
      return { ...state, linksRefreshed: action.payload };
    case "SERVE_FEATURE_REQUEST":
      return { ...state, requestedFeature: action.payload };
    case "CLEAR_FEATURE_REQUEST":
      return { ...state, requestedFeature: "" };
    case "SET_CART_CLICKED":
      console.log("last visited payload:", action.payload);
      return { ...state, isCartVisited: action.payload };
    case "CLEAR_CART_CLICKED":
      return { ...state, isCartVisited: false };
    default:
      console.log("[INDICATOR] default state returned");
      return state;
  }
};

export { initialIndicators, indicatorReducer };
