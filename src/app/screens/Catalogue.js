import React, { useState, useEffect, useRef } from "react";
import { useStore } from "../config/Store";
import { useDatabase } from "../config/Persistence";
import { useTheme } from "@react-navigation/native";
import useSortFilter from "../hooks/useSortFilter";
import { useDataFilter } from "../hooks/useDataFilter";
import { useDeviceOrientation, useDimensions } from "@react-native-community/hooks";
import { isTablet, isPhone } from "react-native-device-detection";
import { DropDownHolder } from "../config/DropDownHolder";
import { SafeAreaView, StyleSheet, View, Text, FlatList } from "react-native";
import { BarIndicator } from "react-native-indicators";
import { CatalogueCustomHeader } from "../components/CatalogueCustomHeader";
import { CatalogueCartFooter } from "../components/CatalogueCartFooter";
import { getProductsFromShop } from "../api/ApiService";
import SingleCatalogueItem from "../components/pure components/SingleCatalogueItem";
import GroupCatalogueItem from "./../components/pure components/GroupCatalogueItem";

export default function Catalogue() {
  //Configuration
  const dimensions = useDimensions();
  const orientation = useDeviceOrientation();
  const { colors, dark } = useTheme();
  const realm = useDatabase();
  const overlay = useRef(true);
  console.log("[CATALOGUE] screen dimensions are: ", dimensions);

  const smallScreenPhone = orientation.portrait ? 1 : 2;
  const largeScreenPhone = orientation.portrait ? 2 : 3;

  const responsivePhoneColumns =
    isPhone && dimensions.screen.scale > 3 ? smallScreenPhone : largeScreenPhone; //isPhone && orientation.portrait ? 2 : 3;
  const responsiveTabColumns = isTablet && orientation.portrait ? 3 : 4;

  const numColumns = isPhone ? responsivePhoneColumns : responsiveTabColumns;
  console.log("[CATALOGUE] numColumns is", numColumns);

  //State Codes
  const { state, dispatch } = useStore();
  const { SortBy } = useSortFilter();
  const { query, updateQuery, ApplyFilter, ClearFilter } = useDataFilter();
  const [refresh, updateRefresh] = useState(false);
  const [isRefreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log("[CATALOGUE] State object", state);
    getProductsFromShop(state.shop.id)
      .then((data) => {
        console.log("api response", data);
        dispatch({ type: "SET_PRODUCTS", payload: data });
        overlay.current = !overlay.current;
        //Check for Saved Cart items
        CheckSavedCart();
      })
      .catch((error) => {
        console.log("Failed to get products from shop", error);
      });
  }, []);

  useEffect(() => {
    refresh ? updateRefresh(false) : updateRefresh(true);
    if (state.data.products.length != 0 && state.indicators.dataRefreshed) {
      dispatch({ type: "SET_DATA_REFRESH", payload: false });
      overlay.current = false;
    }
  }, [state.data.products]);

  useEffect(() => {
    //console.log("cart updated", state.data.cart);
  }, [state.data.cart]);

  useEffect(() => {
    console.log("filter updated", state.data.filter);
    if (state.data.filter.length !== 0) {
      //Update the products
      dispatch({ type: "UPDATE_PRODUCTS", payload: state.data.filter });
    } else {
      //Original Data
      dispatch({ type: "UPDATE_PRODUCTS", payload: state.data.catalogue });
    }
    refresh ? updateRefresh(false) : updateRefresh(true);
  }, [state.data.filter]);

  useEffect(() => {
    console.log("state after sort updated", state.indicators.isSortByGroup);
    if (state.indicators.isSortByGroup) {
      overlay.current ? (overlay.current = true) : (overlay.current = true);
      SortBy("group");
    } else {
      console.log("sku logic executed");
      overlay.current ? (overlay.current = true) : (overlay.current = true);
      SortBy("item");
    }
  }, [state.indicators.isSortByGroup]);

  useEffect(() => {
    console.log("sorted data is", state.data.designs);
    dispatch({ type: "SET_DATA_REFRESH", payload: true });
    dispatch({ type: "UPDATE_PRODUCTS", payload: state.data.designs });
  }, [state.data.designs]);

  useEffect(() => {
    console.log("orientation changed", orientation);
  }, [orientation]);

  async function CheckSavedCart() {
    try {
      let cart = await realm.objects("Cart");
      if (cart.length != 0 && state.data.cart.length === 0) {
        //There are saved cart items, push these to Store immediately
        cart.forEach((item) => {
          console.log("cart item?", item);
          dispatch({ type: "ADD_ALL_TO_CART", payload: item });
        });
      }
    } catch (error) {
      console.log("failed to read stored cart", error);
    }
  }

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

  async function ValidateFilterNUpdateProducts() {
    setRefreshing(true);
    if (state.data.cart.length != 0) {
      await ClearCartItems();
    }
    if (state.data.isFilterApplied) {
      //Clear the Filter first
      await ClearFilter();
      await updateQuery({
        range: {
          grossWt: { start: 0, end: maxGrossWeight },
          netWt: { start: 0, end: maxNetWeight },
        },
        itemStatus: [],
        itemCategory: [],
        itemType: [],
      });
      await dispatch({ type: "CLEAR_QUERY" });
    }
    await getProductsFromShop(state.shop.id)
      .then((data) => {
        console.log("api response", data);
        dispatch({ type: "SET_PRODUCTS", payload: data });
        setRefreshing(false);
      })
      .catch((error) => {
        console.log("[CATALOGUE] failed to update products", error);
        DropDownHolder.alert("error", "Failed to Update Catalogue Items", error);
        setRefreshing(false);
        return;
      });
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.accentDark }]}>
      <CatalogueCustomHeader />
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
          borderBottomLeftRadius: state.data.cart.length != 0 ? 30 : 0,
          borderBottomRightRadius: state.data.cart.length != 0 ? 30 : 0,
        }}>
        <FlatList
          key={[orientation.landscape, orientation.portrait, state.data.products]}
          numColumns={numColumns}
          style={styles.flatlist}
          columnWrapperStyle={numColumns > 1 ? styles.columns : null}
          data={state.data.products}
          extraData={refresh}
          keyExtractor={(item) =>
            state.indicators.isSortByGroup ? item.designNumber : item.skuNumber
          }
          renderItem={({ item }) => {
            return state.indicators.isSortByGroup ? (
              <GroupCatalogueItem
                design={item}
                columns={isPhone ? responsivePhoneColumns : responsiveTabColumns}
              />
            ) : (
              <SingleCatalogueItem
                product={item}
                columns={isPhone ? responsivePhoneColumns : responsiveTabColumns}
              />
            );
          }}
          refreshing={isRefreshing}
          onRefresh={() => {
            ValidateFilterNUpdateProducts();
          }}
        />

        {/**Show Loading OverLay if array is still updating */}
        {overlay.current ? (
          <View
            ref={overlay}
            style={{
              width: "100%",
              height: "100%",
              flex: 1,
              position: "absolute",
            }}>
            <View
              style={{
                flex: 1,
                position: "absolute",
                width: "100%",
                height: "100%",
              }}>
              <View
                style={{
                  flex: 1,
                  position: "absolute",
                  opacity: dark ? 0.3 : 0.9,
                  backgroundColor: dark ? colors.accentDark : colors.primary,
                  borderBottomLeftRadius: state.data.cart.length != 0 ? 30 : 0,
                  borderBottomRightRadius: state.data.cart.length != 0 ? 30 : 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 1,
                }}
              />
              <View
                style={{
                  flex: 1,
                  zIndex: 2,
                  width: "100%",
                  height: "100%",
                  opacity: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                <Text style={{ color: colors.text }}>Please Wait, Updating List...</Text>
                <BarIndicator size={30} count={5} color={colors.accent} style={{ maxHeight: 75 }} />
              </View>
            </View>
          </View>
        ) : null}
      </View>
      {state.data.cart.length != 0 ? <CatalogueCartFooter /> : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatlist: {
    marginLeft: 2,
    marginTop: 10,
    marginRight: 2,
    marginBottom: 10,
    width: "100%",
    maxHeight: "95%",
  },
  columns: {
    //flexWrap: "wrap",
    justifyContent: "flex-start",
  },
});
