import React, { createContext, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ShopSchema, CompanySchema, AddressSchema } from "../config/Schemas";
//import { Realm } from "realm";
const Realm = require("realm");
const DatabaseContext = createContext();
const useDatabase = () => useContext(DatabaseContext);

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

let realm = new Realm({
  path: "PersistantDatabase.realm",
  schema: [ShopSchema, CompanySchema, AddressSchema],
  schemaVersion: 1,
});

const DatabaseProvider = ({ children }) => {
  return <DatabaseContext.Provider value={realm}>{children}</DatabaseContext.Provider>;
};

export { DatabaseProvider, useDatabase, getSessionCredentials, getAuthToken };
