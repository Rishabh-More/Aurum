import React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
  HeaderBackButton,
} from "@react-navigation/stack";

import Cart from "./../screens/Cart";
import Customers from "./../screens/Customers";
import LinkOptions from "./../screens/LinkOptions";
import Success from "./../screens/Success";

const CartStack = createStackNavigator();

const CartStacks = () => (
  <CartStack.Navigator
    screenOptions={{ cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS }}>
    <CartStack.Screen name="cart" component={Cart} options={{ headerShown: false }} />
    <CartStack.Screen
      name="customers"
      component={Customers}
      options={{ headerTitle: "Customer Details" }}
    />
    <CartStack.Screen
      name="link-options"
      component={LinkOptions}
      options={{ headerTitle: "Catalogue Link Options" }}
    />
    <CartStack.Screen
      name="success"
      component={Success}
      options={({ navigation }) => ({
        headerTitle: "Generated Successfully",
        headerLeft: () => <HeaderBackButton onPress={() => navigation.navigate("cart")} />,
      })}
    />
  </CartStack.Navigator>
);

export default CartStacks;
