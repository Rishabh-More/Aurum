import React from "react";
import { isPhone } from "react-native-device-detection";
import { useStore } from "../../config/Store";
import { useTheme } from "@react-navigation/native";
import { useDeviceOrientation } from "@react-native-community/hooks";
import { View, Text, StyleSheet } from "react-native";
import { Card, Title } from "react-native-paper";
import { Button } from "react-native-elements";
import FastImage from "react-native-fast-image";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

const tabThumbImageHeight = "70%";
const phoneThumbImageHeight = "65%";

const GroupCatalogueItem = ({ design }) => {
  const orientation = useDeviceOrientation();
  const { colors, dark } = useTheme();

  //State Code
  const { state, dispatch } = useStore();

  async function AddAllProductsToCart() {
    //Step 1: We need to include filter as well as
    //Our Products for a particular design will change based on filter
    let data = [];
    //Step 2: So we fetch data from our filter[] and not our products[] from the store
    if (state.data.filter.length != 0) {
      //If filter is not empty, then we use filter[]
      data = state.data.filter;
    } else {
      //We use all products i.e. catalogue[]
      data = state.data.catalogue;
    }
    //Step 3: Now we need to collect only those items which belong to that design number from the filter[]
    const result = await data.filter((item) => item.designNumber == design.designNumber);
    await dispatch({ type: "ADD_ALL_TO_CART", payload: result });
  }

  return (
    <Card
      style={[
        styles.container,
        isPhone
          ? { aspectRatio: orientation.portrait ? 1 : 1 }
          : { aspectRatio: orientation.portrait ? 1.3 : 1.5 },
      ]}>
      <FastImage
        style={[styles.image, { borderColor: colors.accent }]}
        source={
          design.imageUrl == ""
            ? require("../../res/assets/broken-image.png")
            : { uri: design.imageUrl, priority: FastImage.priority.normal }
        }
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.info}>
        <View style={styles.textInfo}>
          <Title style={{ color: colors.textSubtle }}>{design.designNumber}</Title>
          <Text style={{ fontSize: 16, fontWeight: "600", color: "grey" }}>
            Quantity: {design.count}
          </Text>
        </View>
        <View style={styles.button}>
          <Button
            type="outline"
            icon={<Icon name="cart-arrow-right" size={isPhone ? 30 : 40} color={colors.accent} />}
            buttonStyle={{ borderColor: colors.accent, borderWidth: 0.5, borderRadius: 10 }}
            onPress={() => AddAllProductsToCart()}
          />
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 5,
    borderRadius: 10,
    elevation: 3,
  },
  info: {
    flexDirection: "row",
    marginStart: 5,
    marginEnd: 5,
  },
  textInfo: {
    flex: 2,
    marginStart: 5,
    margin: 3,
  },
  image: {
    margin: 5,
    borderRadius: 10,
    maxWidth: "100%",
    height: isPhone ? phoneThumbImageHeight : tabThumbImageHeight,
    //resizeMode: "cover",
    borderWidth: 0.5,
  },
  button: {
    flex: 1,
    justifyContent: "flex-end",
  },
});

export default GroupCatalogueItem;
