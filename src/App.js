import "react-native-gesture-handler";
import React, { createContext, useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";
import { AppDefaultTheme, AppDarkTheme } from "./app/res/Themes";
import { NavigationContainer } from "@react-navigation/native";
import Authorizer from "./app/navigation/Authorizer";

export const ThemeContext = createContext();

export default function App() {
  const [isDarkTheme, setDarkTheme] = useState(false);
  const theme = isDarkTheme ? AppDarkTheme : AppDefaultTheme;
  return (
    <PaperProvider theme={theme}>
      <ThemeContext.Provider value={{ isDarkTheme, setDarkTheme }}>
        <NavigationContainer theme={theme}>
          <Authorizer />
        </NavigationContainer>
      </ThemeContext.Provider>
    </PaperProvider>
  );
}
