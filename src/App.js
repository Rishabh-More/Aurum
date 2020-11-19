import "react-native-gesture-handler";
import React, { createContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StoreProvider } from "./app/config/Store";
import { DatabaseProvider } from "./app/config/Persistence";
import { Provider as PaperProvider } from "react-native-paper";
import { AppDefaultTheme, AppDarkTheme } from "./app/res/Themes";
import { NavigationContainer } from "@react-navigation/native";
import { Authorizer } from "./app/navigation/Authorizer";

export const ThemeContext = createContext();

export default function App() {
  const [isDarkTheme, setDarkTheme] = useState(false);
  const theme = isDarkTheme ? AppDarkTheme : AppDefaultTheme;

  useEffect(() => {
    LoadSavedTheme();
  }, []);

  async function LoadSavedTheme() {
    try {
      var theme = await AsyncStorage.getItem("@app_theme_isDark");
      console.log("saved dark theme", theme);
      if (JSON.parse(theme) === true) {
        //User has saved Dark Theme
        await setDarkTheme(true);
      } else {
        //Switch to Default Light Theme
        await setDarkTheme(false);
      }
    } catch (error) {
      console.log("failed to get saved theme", error);
    }
  }

  return (
    <PaperProvider theme={theme}>
      <DatabaseProvider>
        <StoreProvider>
          <ThemeContext.Provider value={{ isDarkTheme, setDarkTheme }}>
            <NavigationContainer theme={theme}>
              <Authorizer />
            </NavigationContainer>
          </ThemeContext.Provider>
        </StoreProvider>
      </DatabaseProvider>
    </PaperProvider>
  );
}
