import React, { createContext, useState, useEffect, useContext } from "react";
import SplashScreen from "react-native-splash-screen";
import { useStore } from "../config/Store";
import { useDatabase } from "../config/Persistence";
import { getSessionCredentials } from "../config/Persistence";
import NavigationDrawer from "./NavigationDrawer";
import AuthStacks from "./AuthStacks";

const SplashContext = createContext();
const AuthContext = createContext();

export const useAuthorization = () => useContext(AuthContext);

export function Authorizer() {
  //TODO check whether user is already signed in or not.
  const realm = useDatabase();
  const { state, dispatch } = useStore();
  const [isAuthorized, setAuthorization] = useState(false);

  useEffect(() => {
    VerifyCredentials();
  }, []);

  async function VerifyCredentials() {
    //TODO Check from Async Storage?
    var session = await getSessionCredentials();
    console.log("saved session", session);
    if (session) {
      await DispatchShopData();
      await setAuthorization(true);
    } else {
      await setAuthorization(false);
    }
    sleep(1000).then(() => {
      SplashScreen.hide();
    });
  }

  async function DispatchShopData() {
    try {
      let shop = await realm.objects("Shop");
      console.log("[AUTHORIZER] dispatching realm shop", shop[0]);
      await dispatch({ type: "UPDATE_SHOP_DETAILS", payload: shop[0] });
    } catch (error) {
      console.log("failed to retrieve shop object", error);
    }
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  return (
    <AuthContext.Provider value={{ setAuthorization }}>
      {isAuthorized ? <NavigationDrawer /> : <AuthStacks />}
    </AuthContext.Provider>
  );
}
