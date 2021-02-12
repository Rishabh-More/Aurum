const initialIndicators = {
  areProductsSelected: false,
  dataRefreshed: false,
  linksRefreshed: false,
  isSortByGroup: false,
  isFilterApplied: false,
  requestedFeature: "",
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
    default:
      return state;
  }
};

export { initialIndicators, indicatorReducer };
