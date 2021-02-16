import React, { useEffect, useState } from "react";
import { useStore } from "../config/Store";
import { useDatabase } from "../config/Persistence";
import { useTheme, useNavigation, NavigationAction, CommonActions } from "@react-navigation/native";
import { responsive } from "../config/ResponsiveConfig";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";
import { View, Text } from "react-native";
import { Title } from "react-native-paper";
import { Button, Overlay } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LinearGradient from "react-native-linear-gradient";

export function CatalogueCartFooter() {
  const { colors, dark } = useTheme();
  const navigation = useNavigation();
  const realm = useDatabase();

  //State Code
  const { state, dispatch } = useStore();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (state.indicators.isCartVisited) {
      setVisible(true);
    }
  }, [state.indicators.isCartVisited]);

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

  async function NavigateToCart() {
    await dispatch({ type: "SET_LAST_VISITED", payload: "cart" });
    //await dispatch({ type: "SERVE_FEATURE_REQUEST", payload: "link" });
    setVisible(false);
    navigation.navigate("Cart", { last_screen: "cart" });
  }

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
      }}
    >
      <View style={{ flex: 3, alignItems: "center" }}>
        <Text
          style={{
            fontSize: rf(responsive.text.catalogueFooter),
            fontWeight: "600",
            color: "#fff",
          }}
        >
          Items Added to Cart: {state.data.cart.length}
        </Text>
      </View>
      <View
        style={{
          flex: 3,
          flexDirection: "row",
          alignItems: "center",
          marginTop: 10,
          marginBottom: 10,
        }}
      >
        <Button
          icon={<Icon name="delete-sweep-outline" size={24} color={colors.accent} />}
          buttonStyle={{ height: 50, width: 50, backgroundColor: "#fff", borderRadius: 25 }}
          onPress={() => ClearCartItems()}
        />
        <Button
          title="Checkout"
          ViewComponent={LinearGradient}
          titleStyle={{ fontSize: rf(responsive.text.catalogueFooter) }}
          containerStyle={{
            flex: 1,
            margin: 10,
            marginStart: 5,
            marginEnd: 15,
            borderRadius: 25,
          }}
          buttonStyle={{ height: 50 }}
          linearGradientProps={{
            colors: [colors.accent, colors.accentLight],
            start: { x: 1, y: 1 },
            end: { x: 1, y: 0 },
          }}
          onPress={() => {
            setVisible(true);
            console.log("Called");
            //navigation.navigate("Cart");
          }}
        />
      </View>
      <Overlay
        title="Select Action"
        isVisible={visible}
        overlayStyle={{ borderRadius: 15, backgroundColor: colors.modal }}
        onBackdropPress={() => setVisible(false)}
      >
        <View style={{ margin: 5 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Icon name="cart-outline" size={24} color={colors.accent} style={{ marginStart: 5 }} />
            <Title style={{ marginStart: 5, marginEnd: 5, marginTop: 5, marginBottom: 5 }}>
              Checkout Items
            </Title>
          </View>
          <Text
            style={{
              marginStart: 10,
              marginEnd: 10,
              marginTop: 5,
              marginBottom: 5,
              color: colors.text,
            }}
          >
            How would you like to checkout to Cart?
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Button
              icon={
                <Icon
                  name="tag-heart"
                  size={20}
                  color={dark ? colors.modal : colors.textInverse}
                  style={{ marginEnd: 3 }}
                />
              }
              titleStyle={{ color: dark ? colors.modal : colors.textInverse }}
              buttonStyle={{
                backgroundColor: colors.accent,
                marginStart: 5,
                marginEnd: 5,
                marginBottom: 10,
                marginTop: 10,
                //height: 50,
                borderRadius: 10,
              }}
              title="Generate Order"
              onPress={async () => {
                await dispatch({ type: "SERVE_FEATURE_REQUEST", payload: "order" });
                await dispatch({ type: "CLEAR_CART_CLICKED" });
                setVisible(false);
                NavigateToCart();
              }}
            />
            <Button
              icon={
                <Icon
                  name="link-variant"
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
                marginTop: 10,
                //height: 50,
                borderRadius: 10,
              }}
              type="outline"
              title="Generate Link"
              onPress={async () => {
                setVisible(false);
                await dispatch({ type: "SERVE_FEATURE_REQUEST", payload: "link" });
                await dispatch({ type: "CLEAR_CART_CLICKED" });
                NavigateToCart();
              }}
            />
          </View>
        </View>
      </Overlay>
    </View>
  );
}
