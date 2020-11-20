import React, { useState, useEffect } from "react";
import { useStore } from "../config/Store";
import { useTheme, useNavigation } from "@react-navigation/native";
import { useDeviceOrientation, useDimensions } from "@react-native-community/hooks";
import { isTablet, isPhone } from "react-native-device-detection";
import { SafeAreaView, View, Text, StyleSheet, FlatList, Alert } from "react-native";
import CartOrderItem from "../components/pure components/CartOrderItem";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Appbar } from "react-native-paper";
import { Button } from "react-native-elements";
import Toast from "react-native-simple-toast";

export default function Cart() {
  const { colors, dark } = useTheme();
  const navigation = useNavigation();
  const orientation = useDeviceOrientation();
  const dimensions = useDimensions();

  const phoneColumns = isPhone && orientation.portrait ? 1 : 2;
  const tabColumns = isTablet && orientation.portrait ? 2 : 3;

  const { state, dispatch } = useStore();

  useEffect(() => {
    //If No feature has been selected, ask user for feature
    RequestFeature();
  }, []);

  function RequestFeature() {
    if (state.indicators.requestedFeature == "" && state.data.cart.length != 0) {
      Alert.alert("Checkout Method", `How would you like to checkout products from Cart?`, [
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
      ]);
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
          keyExtractor={(item) => item.skuNumber}
          renderItem={({ item }) => <CartOrderItem cart={item} />}
          contentContainerStyle={
            state.data.cart.length == 0 ? { flexGrow: 1, justifyContent: "center" } : {}
          }
          ListEmptyComponent={
            state.data.cart.length == 0 ? (
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: "grey" }}>You currently have no items in your Cart</Text>
                <Text style={{ color: colors.text, fontSize: 16 }}>
                  Add items from Catalogue to show Here
                </Text>
                <Button
                  type="clear"
                  title="Products Catalogue"
                  titleStyle={{ color: colors.accent }}
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
            state.data.cart.length != 0
              ? dispatch({ type: "CLEAR_CART" })
              : Toast.show("No Items to clear")
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
