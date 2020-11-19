import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { CustomDrawerContent } from "../components/CustomDrawerContent";

import HomeStacks from "./HomeStacks";
import CartStacks from "./CartStacks";
import CatalogueLinks from "./../screens/CatalogueLinks";

const Drawer = createDrawerNavigator();

const NavigationDrawer = () => (
  <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
    <Drawer.Screen name="Home" component={HomeStacks} options={{ headerShown: false }} />
    <Drawer.Screen name="Cart" component={CartStacks} />
    <Drawer.Screen name="Links" component={CatalogueLinks} />
  </Drawer.Navigator>
);

export default NavigationDrawer;
