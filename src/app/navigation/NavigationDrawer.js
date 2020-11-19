import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Catalogue from "./../screens/Catalogue";
import { CustomDrawerContent } from "../components/CustomDrawerContent";

const Drawer = createDrawerNavigator();

const NavigationDrawer = () => (
  <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
    <Drawer.Screen name="Home" component={Catalogue} />
  </Drawer.Navigator>
);

export default NavigationDrawer;
