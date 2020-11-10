import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Catalogue from "./../screens/Catalogue";

const Drawer = createDrawerNavigator();

const NavigationDrawer = () => (
  <Drawer.Navigator>
    <Drawer.Screen name="Home" component={Catalogue} />
  </Drawer.Navigator>
);

export default NavigationDrawer;
