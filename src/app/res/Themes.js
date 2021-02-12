import { DefaultTheme as PaperDefaultTheme, DarkTheme as PaperDarkTheme } from "react-native-paper";

const Colors = {
  accent: "rgb(232, 30, 98)", //"rgb(255, 152, 0)",
  accentLight: "rgb(255, 96, 143)", //"rgb(255, 201, 71)",
  accentLightTransparent: "rgba(255, 96, 143, 0.1)",
  accentDark: "rgb(175, 0, 57)", //"rgb(198, 105, 0)",
  accentDarkTransparent: "rgba(175, 0, 57, 0.1)",
};

const AppDefaultTheme = {
  name: "Light Theme",
  dark: false,
  ...PaperDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    primary: "rgb(255, 255, 255)",
    accent: Colors.accent,
    accentDark: Colors.accentDark,
    accentDarkTransparent: Colors.accentDarkTransparent,
    accentLight: Colors.accentLight,
    accentLightTransparent: Colors.accentLightTransparent,
    statusBar: "rgb(232, 232, 232)",
    background: "rgb(245, 245, 240)",
    card: "rgb(255, 255, 255)",
    modal: "rgb(245,245,240)",
    text: "rgb(28, 28, 30)",
    textSubtle: "rgb(87, 87, 87)",
    textInverse: "rgb(255, 255, 255)",
    border: "rgb(224, 224, 224)",
    disabled: "rgb(204,204,204)",
    notification: "rgb(255, 69, 58)",
  },
};

const AppDarkTheme = {
  name: "Dark Theme",
  dark: true,
  ...PaperDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    primary: "rgb(36, 36, 36)",
    accent: Colors.accent,
    accentDark: Colors.accentDark,
    accentDarkTransparent: Colors.accentDarkTransparent,
    accentLight: Colors.accentLight,
    accentLightTransparent: Colors.accentLightTransparent,
    statusBar: "rgb(18, 18, 18)",
    background: "rgb(18, 18, 18)",
    card: "rgb(30, 30, 30)",
    modal: "rgb(55, 55, 55)",
    text: "rgb(225, 225, 225)",
    textSubtle: "rgb(245,245,245)",
    textInverse: "rgb(28, 28, 30)",
    border: "rgb(87, 87, 87)",
    disabled: "rgb(96,99,104)",
    notification: "rgb(255, 69, 58)",
  },
};

export { AppDefaultTheme, AppDarkTheme };
