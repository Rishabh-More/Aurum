const initialData = {
  catalogue: [],
  products: [],
  designs: [],
  filter: [],
  cart: [],
  links: [],
};

const dataReducer = (state, action) => {
  switch (action.type) {
    case "SET_PRODUCTS":
      return { ...state, catalogue: action.payload, products: action.payload };
    case "UPDATE_PRODUCTS":
      return { ...state, products: action.payload };
    case "SEARCH_PRODUCTS":
      //State here only has initialData fields.
      return { ...state, products: action.payload };
    case "UPDATE_DESIGNS":
      return { ...state, designs: action.payload };
    case "UPDATE_FILTER":
      return { ...state, filter: action.payload };
    case "CLEAR_FILTER":
      return { ...state, filter: [] };
    case "ADD_TO_CART":
      return { ...state, cart: [...state.cart, action.payload] };
    case "ADD_ALL_TO_CART":
      return { ...state, cart: state.cart.concat(action.payload) };
    case "UPDATE_CART_ITEM":
      //const indexCart = state.cart.map((item) => item.skuNumber).indexOf(action.payload.skuNumber);
      // console.log("[DATA REDUCER] cart before updating", state.cart);
      // console.log("[DATA REDUCER] cart item at index", state.cart[indexCart]);
      // console.log("[DATA REDUCER]before slicing", state.cart.slice(0, indexCart));
      // console.log("[DATA RECUDER] updated cart item", {
      //   ...state.cart[indexCart],
      //   metalPurity: action.payload.metalPurity,
      //   metalType: action.payload.metalType,
      //   orderProductQuantity: action.payload.orderProductQuantity,
      //   orderProductRemarks: action.payload.orderProductRemarks,
      // });
      // console.log("[DATA REDUCER] after slicing", state.cart.slice(indexCart + 1));
      return { ...state, cart: action.payload };
    case "DELETE_FROM_CART":
      return {
        ...state,
        cart: [...state.cart.slice(0, action.payload), ...state.cart.slice(action.payload + 1)],
      };
    case "CLEAR_CART":
      return { ...state, cart: [] };
    case "UPDATE_LINKS":
      return { ...state, links: action.payload };
    case "UPDATE_LINKS_OTP":
      const indexLink = state.links.map((item) => item.id).indexOf(action.payload.id);
      return {
        ...state,
        links: [
          ...state.links.slice(0, indexLink),
          {
            ...state.links[indexLink],
            otp: action.payload.otp,
            otpCreatedAt: action.payload.otpCreatedAt,
            otpexpireAt: action.payload.otpExpireAt,
            updatedAt: action.payload.updatedAt,
          },
          ...state.links.slice(indexLink + 1),
        ],
      };
    case "DELETE_LINK":
      return {
        ...state,
        links: [...state.links.slice(0, action.payload), ...state.links.slice(action.payload + 1)],
      };
    default:
      return state;
  }
};

export { initialData, dataReducer };
