import React, { useState, useEffect } from "react";
import NavigationDrawer from "./NavigationDrawer";
import AuthStacks from "./AuthStacks";

export default function Authorizer() {
  const [isAuthorized, setAuthority] = useState(false);

  return isAuthorized ? <NavigationDrawer /> : <AuthStacks />;
}
