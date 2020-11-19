import React, { createContext, useState, useEffect, useContext } from "react";
import SplashScreen from "react-native-splash-screen";
import { useTheme } from "@react-navigation/native";
import { getSessionCredentials } from "../config/Persistence";
import NavigationDrawer from "./NavigationDrawer";
import AuthStacks from "./AuthStacks";

const SplashContext = createContext();
const AuthContext = createContext();

export const useAuthorization = () => useContext(AuthContext);

export function Authorizer() {
  //TODO check whether user is already signed in or not.
  const { colors, dark } = useTheme();
  const [isAuthorized, setAuthorization] = useState(false);

  useEffect(() => {
    VerifyCredentials();
  }, []);

  async function VerifyCredentials() {
    //TODO Check from Async Storage?
    var session = await getSessionCredentials();
    console.log("saved session", session);
    if (session) {
      await setAuthorization(true);
      SplashScreen.hide();
    } else {
      await setAuthorization(false);
      SplashScreen.hide();
    }
  }

  return (
    <AuthContext.Provider value={{ setAuthorization }}>
      {isAuthorized ? <NavigationDrawer /> : <AuthStacks />}
    </AuthContext.Provider>
  );
}
