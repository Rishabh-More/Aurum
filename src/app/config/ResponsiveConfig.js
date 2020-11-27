import { PixelRatio } from "react-native";

const ScalingWithDpi = () => {
  let scale = PixelRatio.get();
  if (scale <= 2.375 && scale < 2.625) {
    //Scaling Factors here
    return;
  } else if (scale >= 2.625 && scale < 3) {
    //Scaling Factors here
    return;
  } else if (scale >= 3 && scale < 3.125) {
    //Scaling Factors here
    return;
  } else if (scale >= 3.125 && scale < 3.375) {
    //Scaling Factors here
    return;
  }
};

export const responsive = {
  text: {
    loginHeaderTitle: 2,
    loginHeaderText: 1.8,
    loginContent: 1.8,
    loginFooter: 2,
    drawerHeader: 1.6,
    catalogueTitle: 2,
    catalogueText: 1.2,
    catalogueFooter: 1.8,
    cartTitle: 2,
    cartText: 1.8,
    detailsTitle: 2,
    detailsText: 1.6,
    linkOptions: 1.8,
    linkTitle: 2,
    linkText: 1.4,
    linkButton: 1.8,
    linkSuccessText: 1.8,
    linkSuccessButton: 2,
  },
};
