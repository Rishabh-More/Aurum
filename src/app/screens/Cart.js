import React, { useEffect } from "react";
import { useStore } from "../config/Store";
import { useDatabase } from "../config/Persistence";
import { useTheme, useNavigation, useNavigationState, useRoute } from "@react-navigation/native";
import { useDeviceOrientation, useDimensions } from "@react-native-community/hooks";
import { isTablet, isPhone } from "react-native-device-detection";
import { responsive } from "./../config/ResponsiveConfig";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";
import { SafeAreaView, View, Text, StyleSheet, FlatList, Alert } from "react-native";
import CartOrderItem from "../components/pure components/CartOrderItem";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Appbar } from "react-native-paper";
import { Button } from "react-native-elements";
import Toast from "react-native-simple-toast";

export default function Cart() {
  const realm = useDatabase();
  const route = useRoute();
  const { colors, dark } = useTheme();
  const navigation = useNavigation();
  const navigationState = useNavigationState((state) => state.routes);
  const orientation = useDeviceOrientation();
  const dimensions = useDimensions();
  let test;

  const phoneColumns = isPhone && orientation.portrait ? 1 : 2;
  const tabColumns = isTablet && orientation.portrait ? 2 : 3;

  const { state, dispatch } = useStore();

  useEffect(() => {
    //Screen is focused, ask Confirmation for Checkout Method.
    const screenFocus = navigation.addListener("focus", () => {
      //If No feature has been selected, ask user for feature
      console.log("[CART] Cart from Screen Focus", test);
      if (state.data.cart.length != 0) {
        //RequestFeature();
      }
      //console.log("[CART] Props in route", route);
    });
    //Unsubscribe to listener if component gets unmounted;
    return screenFocus;
  }, [navigation]);

  useEffect(() => {
    //RequestFeature();
    test = state.data.cart;
    console.log("[CART] Cart updated in store", test);
    console.log("Last Visited:", state.indicators);
  }, [state.data.cart]);

  useEffect(() => {
    // Anything in here is fired on component mount.
    console.log("[CART] Cart updated in mounting");
    return () => {
      // Anything in here is fired on component unmount.
      console.log("[CART] Cart updated unmounting");
    };
  }, []);

  async function ClearCartItems() {
    try {
      await realm.write(() => {
        let cart = realm.objects("Cart");
        realm.delete(cart);
      });
      await dispatch({ type: "CLEAR_CART" });
    } catch (error) {
      console.log("failed to clear cart", error);
    }
  }

  function RequestFeature() {
    if (state.data.cart.length != 0) {
      Alert.alert(
        "Checkout Method",
        `How would you like to checkout products from Cart?`,
        [
          {
            text: "Generate Order",
            style: "default",
            onPress: async () => {
              await dispatch({ type: "SERVE_FEATURE_REQUEST", payload: "order" });
              Toast.show("Checkout as Order");
            },
          },
          {
            text: "Generate Link",
            style: "destructive",
            onPress: async () => {
              await dispatch({ type: "SERVE_FEATURE_REQUEST", payload: "link" });
              Toast.show("Checkout as Catalogue Link");
            },
          },
        ],
        { cancelable: true }
      );
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <Appbar style={{ width: "100%" }}>
        <Appbar.Action
          icon="menu"
          size={30}
          color={colors.accent}
          onPress={() => navigation.openDrawer()}
        />
        <Appbar.Content title="Cart" titleStyle={{ fontSize: 16 }} />
      </Appbar>
      <View style={{ flex: 1 }}>
        <FlatList
          key={[orientation.landscape, orientation.portrait]}
          numColumns={isPhone ? phoneColumns : tabColumns}
          style={styles.flatlist}
          data={state.data.cart}
          //extraData={state.data.cart}
          keyExtractor={(item) => item.skuNumber}
          renderItem={({ item }) => <CartOrderItem cart={item} />}
          contentContainerStyle={
            state.data.cart.length == 0 ? { flexGrow: 1, justifyContent: "center" } : {}
          }
          ListEmptyComponent={
            state.data.cart.length == 0 ? (
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontSize: rf(responsive.text.cartText), color: "grey" }}>
                  You currently have no items in your Cart
                </Text>
                <Text style={{ color: colors.text, fontSize: rf(responsive.text.cartText) }}>
                  Add items from Catalogue to show Here
                </Text>
                <Button
                  type="clear"
                  title="Products Catalogue"
                  titleStyle={{ fontSize: rf(responsive.text.cartTitle), color: colors.accent }}
                  onPress={() => navigation.navigate("catalogue")}
                />
              </View>
            ) : null
          }
        />
      </View>
      <View style={{ flexDirection: "row" }}>
        <Button
          icon={
            <Icon
              name="delete-sweep-outline"
              size={20}
              color={colors.accent}
              style={{ marginEnd: 3 }}
            />
          }
          titleStyle={{ color: colors.accent }}
          buttonStyle={{
            borderColor: colors.accent,
            marginStart: 5,
            marginEnd: 5,
            marginBottom: 10,
            height: 50,
            borderRadius: 10,
          }}
          containerStyle={{ flex: 1 }}
          type="outline"
          title="Clear Cart"
          onPress={() =>
            state.data.cart.length != 0 ? ClearCartItems() : Toast.show("No Items to clear")
          }
        />
        <Button
          // icon={
          //   <Icon name="tag-heart" size={20} color={colors.textInverse} style={{ marginEnd: 3 }} />
          // }
          titleStyle={{ color: colors.textInverse }}
          buttonStyle={{
            backgroundColor: colors.accent,
            marginStart: 5,
            marginEnd: 5,
            marginBottom: 10,
            height: 50,
            borderRadius: 10,
          }}
          containerStyle={{ flex: 1 }}
          title="Checkout"
          onPress={() => {
            if (state.indicators.requestedFeature == "order") {
              navigation.navigate("customers");
            } else if (state.indicators.requestedFeature == "link") {
              navigation.navigate("link-options");
            } else {
              RequestFeature();
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatlist: {
    flex: 1,
    marginBottom: 15,
  },
});
