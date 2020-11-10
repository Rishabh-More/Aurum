import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./../screens/Login";
import Verification from "./../screens/Verification";

const Authorized = createStackNavigator();

const AuthStacks = () => (
  <Authorized.Navigator>
    <Authorized.Screen name="login" component={Login} />
    <Authorized.Screen name="verify" component={Verification} />
  </Authorized.Navigator>
);

export default AuthStacks;
