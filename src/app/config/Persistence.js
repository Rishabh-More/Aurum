import React, { createContext, useContext } from "react";
import DeviceInfo from "react-native-device-info";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ShopSchema, CompanySchema, AddressSchema, CartSchema } from "../config/Schemas";
import { logoutFromShop } from "../api/ApiService";
//import { Realm } from "realm";
const Realm = require("realm");
const DatabaseContext = createContext();
const useDatabase = () => useContext(DatabaseContext);

let realm = new Realm({
  path: "PersistantDatabase.realm",
  schema: [ShopSchema, CompanySchema, AddressSchema, CartSchema],
  schemaVersion: 5,
});

async function SaveThemeSettings() {
  try {
    console.log("saving in storage: DarkTheme", isDarkTheme);
    await AsyncStorage.setItem("@app_theme_isDark", JSON.stringify(isDarkTheme));
  } catch (error) {
    console.log("failed to save theme", error);
  }
}

async function getSessionCredentials() {
  try {
    const session = await AsyncStorage.getItem("@auth_session");
    if (session != null) {
      //User is already signed in, session = true
      return JSON.parse(session);
    } else {
      //No Session is saved, user is not signed in
      return false;
    }
  } catch (error) {
    console.log("failed to retrieve session from local");
    return false;
  }
}

async function getAuthToken() {
  try {
    const token = await AsyncStorage.getItem("@auth_token");
    if (token != null) {
      return token;
    }
  } catch (error) {
    console.log("couldn't fetch token from storage");
    return "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjpbeyJjcmVhdGVkQXQiOiIyMDIwLTExLTEzVDA4OjU2OjIyLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIwLTExLTEzVDA5OjE3OjI1LjAwMFoiLCJpZCI6MTU3LCJkZXZpY2VOYW1lIjoiT25lUGx1cyAzVCBBbmRyb2lkIiwiZGV2aWNlSWQiOiIyMDU5NzM3MWYxMTA3ZWM5IiwiYnJhbmROYW1lIjoiT25lUGx1cyIsIm1vZGVsTmFtZSI6Ik9ORVBMVVMgQTMwMDMiLCJvdHAiOjU2ODksIm90cENyZWF0ZWRBdCI6IjIwMjAtMTEtMTNUMDk6MTc6MjUuMDAwWiIsImF1dGhFeHBpcmVBdCI6bnVsbCwib3RwRXhwaXJlQXQiOiIyMDIwLTExLTEzVDA5OjI3OjI1LjAwMFoiLCJkZWxldGVkQXQiOm51bGwsInNob3BJZCI6MTE1fV0sImlhdCI6MTYwNTI1OTA3MSwiZXhwIjoxNjA1OTE0MjcxfQ.jnpzUUO-AJHEyHdUG2LMIK-K7ktTZ1MspiWgPiNnteQ";
  }
}

async function LogoutUser(shopId) {
  try {
    return new Promise(async function (resolve, reject) {
      //TODO Call signout api
      await logoutFromShop(shopId, DeviceInfo.getUniqueId())
        .then(async (status) => {
          console.log("logged out?", status);
          await ClearUserSession();
          resolve(status);
        })
        .catch((error) => {
          console.log("Couldn't sign out", error);
          reject(error);
        });
    });
  } catch (error) {
    console.log("[PERSISTENCE] Failed to logout", error);
  }
}

async function ClearUserSession() {
  const keys = ["@auth_session", "@auth_token"];
  //TODO Clear Shop Data from Realm DB
  try {
    await realm.write(() => {
      let shop = realm.objects("Shop");
      realm.delete(shop);
      let cart = realm.objects("Cart");
      realm.delete(cart);
    });
  } catch (error) {
    console.log("failed to clear objects", error);
    return;
  }
  //TODO Clear Session and token from AsyncStorage
  try {
    await AsyncStorage.multiRemove(keys);
  } catch (error) {
    console.log("failed to remove from local", error);
  }
}

const DatabaseProvider = ({ children }) => {
  return <DatabaseContext.Provider value={realm}>{children}</DatabaseContext.Provider>;
};

export {
  DatabaseProvider,
  useDatabase,
  getSessionCredentials,
  getAuthToken,
  SaveThemeSettings,
  LogoutUser,
};
