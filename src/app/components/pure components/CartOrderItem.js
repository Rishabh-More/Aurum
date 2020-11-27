import React, { useEffect, useState, useRef } from "react";
import { useStore } from "../../config/Store";
import { useDatabase } from "../../config/Persistence";
import { useTheme } from "@react-navigation/native";
import { usePrevious } from "../../hooks/usePrevious";
import { isPhone } from "react-native-device-detection";
import { responsive } from "../../config/ResponsiveConfig";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";
import { View, Text, StyleSheet } from "react-native";
import { Card, Title, TextInput } from "react-native-paper";
import { Button } from "react-native-elements";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FastImage from "react-native-fast-image";
import Toast from "react-native-simple-toast";
import Counter from "react-native-counters";

const CartOrderItem = ({ cart }) => {
  const realm = useDatabase();
  const { colors, dark } = useTheme();

  //State Codes
  const { state, dispatch } = useStore();
  const [updated, setUpdated] = useState(false);
  const [props, setProps] = useState({
    skuNumber: cart.skuNumber,
    metalPurity: cart.metalPurity,
    metalType: cart.metalType,
    orderProductRemarks: cart.orderProductRemarks,
    orderProductQuantity: 1,
  });
  const prevObject = usePrevious(props);

  useEffect(() => {
    if (prevObject != null) {
      console.log("Cart Update function called");
      UpdateCartItem();
      console.log("Cart Updated");
    }
    console.log("useEffect ran");
  }, [props]);

  async function UpdateCartItem() {
    try {
      await realm.write(() => {
        realm.create(
          "Cart",
          {
            id: cart.id,
            metalPurity: props.metalPurity,
            metalType: props.metalType,
            orderProductQuantity: props.orderProductQuantity,
            orderProductRemarks: props.orderProductRemarks,
          },
          "modified"
        );
      });
      let realmCart = await realm.objects("Cart");
      await dispatch({ type: "UPDATE_CART_ITEM", payload: realmCart });
    } catch (error) {
      console.log("failed to update cart item", error);
    }
  }

  async function removeFromCart() {
    try {
      const index = state.data.cart.map((item) => item.skuNumber).indexOf(cart.skuNumber);
      console.log("index is", index);
      await realm.write(() => {
        let product = realm.objects("Cart");
        let index = product.map((item) => item.skuNumber).indexOf(cart.skuNumber);
        realm.delete(product[index]);
      });
      await dispatch({ type: "DELETE_FROM_CART", payload: index });
      Toast.show(`Removed item ${cart.skuNumber}`);
    } catch (error) {
      console.log("couldn't remove from cart", error);
    }
  }

  const minusIcon = (isPlusDisabled) => {
    return <MaterialCommunityIcons name="minus" size={isPhone ? 18 : 24} color={colors.accent} />;
  };

  const plusIcon = (isPlusDisabled) => {
    return <MaterialCommunityIcons name="plus" size={isPhone ? 18 : 24} color={colors.accent} />;
  };

  return (
    <Card style={styles.container}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View
          style={{
            flex: 1.5,
          }}>
          <View
            style={{
              margin: 5,
              borderRadius: 10,
              borderWidth: 0.5,
              borderColor: colors.accent,
            }}>
            <FastImage
              style={{
                flex: 1,
                borderRadius: 10,
                maxWidth: "100%",
                aspectRatio: 0.85,
              }}
              source={
                cart.imageUrl == ""
                  ? require("../../res/assets/broken-image.png")
                  : { uri: cart.imageUrl }
              }
              resizeMode={FastImage.resizeMode.stretch}
            />
          </View>
        </View>
        <View style={{ flex: 3 }}>
          <View style={{ flexDirection: "row", alignItems: "center", margin: 5 }}>
            {/* <Title style={{ color: colors.accent }}>{cart.skuNumber}</Title> */}
            <Text style={{ fontSize: rf(responsive.text.cartText), margin: 5, color: colors.text }}>
              Design Number:{" "}
            </Text>
            <Title style={{ fontSize: rf(responsive.text.cartTitle), color: colors.accent }}>
              {cart.designNumber}
            </Title>
          </View>
          <View style={{ flexDirection: "row", zIndex: 5 }}>
            <View
              style={{
                flex: 1,
                height: 50,
                justifyContent: "center",
                marginEnd: 10,
                marginTop: 5,
                marginStart: 5,
                marginBottom: 5,
                borderRadius: 5,
                borderColor: colors.border,
                borderWidth: 1,
              }}>
              <SectionedMultiSelect
                single={true}
                disabled={state.indicators.requestedFeature != "order" ? true : false}
                colors={{
                  primary: colors.accent,
                  selectToggleTextColor:
                    state.indicators.requestedFeature == "order" ? colors.text : colors.disabled,
                }}
                showDropDowns={false}
                expandDropDowns={true}
                items={[
                  {
                    name: "Purity",
                    id: 0,
                    purity: [
                      { name: "14 Kt", id: "14.0" },
                      { name: "18 Kt", id: "18.0" },
                    ],
                  },
                ]}
                selectedItems={[props.metalPurity]}
                uniqueKey="id"
                subKey="purity"
                IconRenderer={MaterialIcons}
                styles={{
                  selectToggle: { marginStart: 10, marginEnd: 10 },
                  container: {
                    maxHeight: "30%",
                    width: "80%",
                    alignSelf: "center",
                    borderRadius: 15,
                  },
                  modalWrapper: { justifyContent: "center" },
                }}
                onSelectedItemsChange={(value) => {
                  console.log("[ONCHANGE PROPS]", props);
                  setProps({ ...props, metalPurity: value[0] });
                  if (updated) setUpdated(false);
                }}
              />
            </View>
            <View
              style={{
                flex: 1,
                height: 50,
                justifyContent: "center",
                marginEnd: 10,
                marginTop: 5,
                marginBottom: 5,
                borderRadius: 5,
                borderColor: colors.border,
                borderWidth: 1,
              }}>
              <SectionedMultiSelect
                single={true}
                disabled={state.indicators.requestedFeature != "order" ? true : false}
                colors={{
                  primary: colors.accent,
                  selectToggleTextColor:
                    state.indicators.requestedFeature == "order" ? colors.text : colors.disabled,
                }}
                showDropDowns={false}
                expandDropDowns={true}
                items={[
                  {
                    name: "Color Types",
                    id: 0,
                    colors: [
                      { name: "YG", id: "YG" },
                      { name: "WG", id: "WG" },
                      { name: "PG", id: "PG" },
                      { name: "YW", id: "YW" },
                      { name: "PW", id: "PW" },
                    ],
                  },
                ]}
                selectedItems={[props.metalType]}
                uniqueKey="id"
                subKey="colors"
                IconRenderer={MaterialIcons}
                styles={{
                  selectToggle: { marginStart: 10, marginEnd: 10 },
                  container: {
                    maxHeight: "50%",
                    width: "80%",
                    alignSelf: "center",
                    borderRadius: 15,
                  },
                  modalWrapper: { justifyContent: "center" },
                }}
                onSelectedItemsChange={(value) => {
                  setProps({ ...props, metalType: value[0] });
                  if (updated) setUpdated(false);
                }}
              />
            </View>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", margin: 5 }}>
            <TextInput
              label="Remarks"
              disabled={state.indicators.requestedFeature != "order" ? true : false}
              placeholder="Type some Remarks"
              value={props.orderProductRemarks}
              underlineColor={colors.accent}
              style={{ flex: 1, borderRadius: 5, fontSize: rf(responsive.text.cartText) }}
              theme={{ colors: { primary: colors.accent, background: colors.card } }}
              onChangeText={(text) => {
                setProps({ ...props, orderProductRemarks: text });
                if (updated) setUpdated(false);
              }}
            />
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              margin: 5,
              justifyContent: "flex-end",
              alignItems: "center",
            }}>
            {state.indicators.requestedFeature == "order" ? (
              <Counter
                start={cart.orderProductQuantity}
                min={1}
                max={100}
                minusIcon={(isMinusDiabled) => minusIcon(isMinusDiabled)}
                plusIcon={(isPlusDisabled) => plusIcon(isPlusDisabled)}
                buttonStyle={{
                  aspectRatio: 1,
                  width: isPhone ? 25 : 50,
                  margin: 5,
                  borderColor: colors.accent,
                  borderRadius: 10,
                  borderWidth: 1.5,
                }}
                buttonTextStyle={{ color: colors.accent }}
                countTextStyle={{ color: colors.accent, fontSize: isPhone ? 14 : 8 }}
                onChange={(value) => {
                  setProps({ ...props, orderProductQuantity: value });
                  if (updated) setUpdated(false);
                }}
              />
            ) : null}
            <Button
              type="outline"
              icon={
                <MaterialCommunityIcons name="trash-can-outline" size={24} color={colors.accent} />
              }
              buttonStyle={{
                margin: 5,
                alignSelf: "flex-end",
                borderColor: colors.accent,
                borderRadius: 10,
                borderWidth: 0.5,
              }}
              onPress={() => removeFromCart()}
            />
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,
    borderRadius: 15,
    elevation: 3,
  },
});

export default CartOrderItem;
