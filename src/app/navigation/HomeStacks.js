import React from "react";
import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";

import CatalogueStacks from "./CatalogueStacks";
import Filter from "./../screens/Filter";

const MainStack = createStackNavigator();

const HomeStacks = () => (
  <MainStack.Navigator
    mode="modal"
    screenOptions={{
      cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
    }}>
    <MainStack.Screen
      name="home-catalogue"
      component={CatalogueStacks}
      options={{ headerShown: false }}
    />
    <MainStack.Screen
      name="filter"
      component={Filter}
      options={{ headerTitle: "Product Filters" }}
    />
  </MainStack.Navigator>
);

export default HomeStacks;
