import React, { createContext, useState, useEffect, useContext } from "react";
import { getSessionCredentials } from "../config/Persistence";
import NavigationDrawer from "./NavigationDrawer";
import AuthStacks from "./AuthStacks";

const AuthContext = createContext();
export const useAuthorization = () => useContext(AuthContext);

export function Authorizer() {
  //TODO check whether user is already signed in or not.
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
    } else {
      await setAuthorization(false);
    }
  }

  return (
    <AuthContext.Provider value={{ setAuthorization }}>
      {isAuthorized ? <NavigationDrawer /> : <AuthStacks />}
    </AuthContext.Provider>
  );
}
