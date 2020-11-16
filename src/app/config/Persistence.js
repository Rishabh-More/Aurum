import React, { createContext, useContext } from "react";
import { ShopSchema, CompanySchema, AddressSchema } from "../config/Schemas";
//import { Realm } from "realm";
const Realm = require("realm");
const DatabaseContext = createContext();
const useDatabase = () => useContext(DatabaseContext);

let realm = new Realm({
  path: "PersistantDatabase.realm",
  schema: [ShopSchema, CompanySchema, AddressSchema],
  schemaVersion: 0,
});

const DatabaseProvider = ({ children }) => {
  return <DatabaseContext.Provider value={realm}>{children}</DatabaseContext.Provider>;
};

export { DatabaseProvider, useDatabase };
