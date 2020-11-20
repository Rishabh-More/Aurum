const initialShop = {
  id: 0,
  email: "",
  shopName: "",
  company: {
    id: 0,
    email: "",
    companyName: "",
    companyLogoUrl: "",
  },
};

const shopReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_SHOP_DETAILS":
      return {
        ...state,
        id: action.payload.id,
        email: action.payload.email,
        shopName: action.payload.shopName,
        company: action.payload.company,
      };
    default:
      return state;
  }
};

export { initialShop, shopReducer };
