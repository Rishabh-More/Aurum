const initialShop = {
  id: 0,
  email: "",
  shopName: "",
  companyId: 0,
  addressId: 0,
  features: "",
  licenseKey: "",
};

const shopReducer = (state, action) => {
  switch (action.type) {
    case "UPDATE_SHOP_DETAILS":
      return {
        ...state,
        id: action.payload.id,
        email: action.payload.email,
        shopName: action.payload.shopName,
        companyId: action.payload.companyId,
        addressId: action.payload.addressId,
        features: action.payload.features,
        licenseKey: action.payload.licenseKey,
      };
    case "CLEAR_SHOP":
      return {
        ...state,
        id: 0,
        email: "",
        shopName: "",
        companyId: 0,
        addressId: 0,
        features: "",
        licenseKey: "",
      };
    default:
      return state;
  }
};

export { initialShop, shopReducer };
