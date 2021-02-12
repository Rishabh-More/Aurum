import React, { useState, useEffect } from "react";
import { isPhone } from "react-native-device-detection";
import { useStore } from "../../config/Store";
import { useDatabase } from "../../config/Persistence";
import { useDeviceOrientation, useDimensions } from "@react-native-community/hooks";
import { useTheme, useNavigation } from "@react-navigation/native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsive } from "../../config/ResponsiveConfig";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import CheckBox from "react-native-check-box";
import { Card, Title } from "react-native-paper";
import { Button } from "react-native-elements";
import FastImage from "react-native-fast-image";
import ImageView from "react-native-image-viewing";
import Toast from "react-native-simple-toast";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const SingleCatalogueItem = ({ product, columns }) => {
  const orientation = useDeviceOrientation();
  const dimensions = useDimensions();
  const navigation = useNavigation();
  const realm = useDatabase();
  const { colors, dark } = useTheme();

  const responsivePhoneAspect = orientation.portrait ? 1 : 1;
  const responsiveTabletAspect = orientation.portrait ? 5 : 1;

  //State Code
  const { state, dispatch } = useStore();
  const [visible, setIsVisible] = useState(false);
  const [selected, setSelected] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let found = state.data.cart.find((item) => item.skuNumber == product.skuNumber);
    if (found != null) {
      //Item already exists in array
      setAdded(true);
    } else {
      setAdded(false);
    }
  }, [state.data.cart.length]);

  useEffect(() => {
    ValidateItemSelection(selected);
  }, [selected]);

  useEffect(() => {
    if (state.indicators.areProductsSelected) {
      console.log("Checking true");
      setSelected(true);
    } else {
      console.log("Checking false");
      setSelected(false);
    }
  }, [state.indicators.areProductsSelected]);

  useEffect(() => {
    console.log("[REDUX] Selection is", state.data.selection.length);
  }, [state.data.selection]);

  async function AddProductToCart() {
    const { shopId, createdAt, updatedAt, ...rest } = product;
    //console.log("original product", product);
    console.log("cart object now", rest);
    //Check if item exists in cart or not
    let found = await state.data.cart.find((item) => item.skuNumber == product.skuNumber);
    console.log("did found item", found);
    if (found != null) {
      //Item already exists in array
      Toast.show("Item is already added to Cart");
    } else {
      //Item does not exist in Cart. Add to it
      try {
        //TODO Add Product to Realm as well
        await realm.write(() => {
          realm.create("Cart", rest);
        });
        await dispatch({
          type: "ADD_TO_CART",
          payload: { ...rest, orderProductQuantity: 1, orderProductRemarks: "" },
        });
      } catch (error) {
        console.log("failed add to cart", error);
      }
    }
  }

  async function ValidateItemSelection(selectionValue) {
    let existsInSelection = await state.data.selection.find(
      (item) => item.skuNumber == product.skuNumber
    );
    console.log("Exists in Selection: ", existsInSelection);
    //If Checkbox is selected & item doesn't exist in array
    //Add to selection array
    if (selectionValue == true && existsInSelection == null) {
      console.log("Adding Item from Adapter");
      await dispatch({ type: "ADD_TO_SELECTION", payload: product });
    }
    //If Checkbox is deselected but item exists in array
    //Remove from Selection
    else if (selectionValue == false && existsInSelection != null) {
      console.log("Removing Item from Adapter");
      let index = state.data.selection.indexOf(product);
      await dispatch({ type: "REMOVE_SELECTION", payload: index });
    }
  }

  return (
    <Card
      style={[
        styles.container,
        isPhone ? { aspectRatio: responsivePhoneAspect } : { aspectRatio: responsiveTabletAspect },
        { width: dimensions.screen.width / columns - 2 * 5 }, // Compensated width with margin 2 * margin
      ]}
      onPress={() => navigation.navigate("details", product)}
      //onLongPress={} //TODO Select the car item here
    >
      <View
        style={{
          alignSelf: "baseline" && "flex-end",
          borderTopRightRadius: 10,
          borderBottomLeftRadius: 10,
          backgroundColor: colors.accentLightTransparent,
          position: "absolute",
          zIndex: 2,
        }}
      >
        <CheckBox
          style={{ margin: 10 }}
          checkBoxColor={colors.accentLight}
          checkedCheckBoxColor={colors.accentLight}
          isChecked={selected}
          onClick={() => setSelected(!selected)}
        />
      </View>
      <TouchableOpacity style={{ flex: 2 }} onPress={() => setIsVisible(true)}>
        <FastImage
          style={styles.image}
          source={
            product.imageUrl == ""
              ? require("../../res/assets/broken-image.png")
              : { uri: product.imageUrl, priority: FastImage.priority.normal }
          }
          resizeMode={FastImage.resizeMode.stretch}
        />
        <ImageView
          images={[{ uri: product.imageUrl }]}
          imageIndex={0}
          visible={visible}
          backgroundColor={colors.background}
          onRequestClose={() => setIsVisible(false)}
        />
      </TouchableOpacity>
      <Title style={[styles.title, { color: colors.accent }]}>{product.skuNumber}</Title>
      <View style={styles.content}>
        <View style={styles.info}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <Text style={[styles.text, { flex: 2, color: colors.textSubtle }]}>
                <Text style={{ fontWeight: "bold" }}>G Wt: </Text>
                {product.grossWeight}
              </Text>
              <Text style={[styles.text, { flex: 1, color: colors.textSubtle }]}>
                <Text style={{ fontWeight: "bold" }}>{product.metalPurity}</Text>
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-evenly",
              }}
            >
              <Text style={[styles.text, { flex: 2, color: colors.textSubtle }]}>
                <Text style={{ fontWeight: "bold" }}>N Wt: </Text>
                {product.netWeight}
              </Text>
              <Text style={[styles.text, { flex: 1, color: colors.textSubtle }]}>
                <Text style={{ fontWeight: "bold" }}>{product.metalType}</Text>
              </Text>
            </View>
            {product.totalDiamondWeight != "" ? (
              <Text style={[styles.text, { color: colors.textSubtle }]}>
                <Text style={{ fontWeight: "bold", color: colors.textSubtle }}>D Wt: </Text>
                {product.totalDiamondWeight} Cts
              </Text>
            ) : null}
          </View>
          <View style={styles.button}>
            <Button
              type={added ? "solid" : "outline"}
              icon={
                <Icon
                  name="cart-outline"
                  size={20}
                  color={added ? colors.primary : colors.accent}
                />
              }
              buttonStyle={{
                borderColor: colors.accent,
                backgroundColor: added ? colors.accent : colors.primary,
              }}
              containerStyle={{ margin: 5, marginBottom: 5, width: 50 }}
              onPress={() => AddProductToCart()}
            />
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    margin: 5,
    borderRadius: 10,
    elevation: 3,
  },
  content: {
    flex: 1,
    margin: 5,
  },
  info: {
    flex: 1,
    flexDirection: "row",
  },
  title: {
    fontSize: rf(responsive.text.catalogueTitle),
    marginStart: 10,
    marginEnd: 10,
  },
  text: {
    //flex: 1,
    marginLeft: 5,
    fontSize: rf(responsive.text.catalogueText),
  },
  image: {
    margin: 3,
    marginBottom: 5,
    borderRadius: 10,
    maxWidth: "100%",
    height: "100%",
    //resizeMode: "cover",
  },
  button: {
    flexDirection: "column-reverse",
    alignItems: "flex-end",
  },
});

export default SingleCatalogueItem;
