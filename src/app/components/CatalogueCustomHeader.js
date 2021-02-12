import React from "react";
import { useStore } from "../config/Store";
import { useDatabase } from "../config/Persistence";
import { useTheme, useNavigation } from "@react-navigation/native";
//import useSortFilter from "../hooks/useSortFilter";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { Searchbar } from "react-native-paper";
import { Badge } from "react-native-elements";
import { ButtonGroup, Button } from "react-native-elements";
import Toast from "react-native-simple-toast";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export function CatalogueCustomHeader() {
  const realm = useDatabase();
  const { colors, dark } = useTheme();
  const navigation = useNavigation();
  const { state, dispatch } = useStore();
  //const { SortBy } = useSortFilter();

  const options = ["Sku", "Design"];
  const selected = state.indicators.isSortByGroup ? 1 : 0;

  const SearchProducts = async (query) => {
    let search = [];
    if (!state.indicators.isSortByGroup) {
      search = state.data.filter.length != 0 ? state.data.filter : state.data.catalogue;
    } else {
      search = state.data.designs;
    }
    const result = search.filter(function (item) {
      let pattern = new RegExp(query, "i");
      return state.indicators.isSortByGroup
        ? item.designNumber.match(pattern)
        : item.skuNumber.match(pattern);
    });
    await dispatch({ type: "SEARCH_PRODUCTS", payload: result });
  };

  const AddAlltoSelection = async () => {
    if (state.data.catalogue.length != 0 && state.data.products.length != 0) {
      await dispatch({ type: "SET_SELECTION", payload: state.data.products });
      await dispatch({ type: "SET_SELECTION_FLAG", payload: true });
    }
  };

  const RemoveAllFromSelection = async () => {
    await dispatch({ type: "CLEAR_SELECTION" });
    await dispatch({ type: "SET_SELECTION_FLAG", payload: false });
  };

  const AddAllSelectedToCart = async () => {
    if (state.data.selection.length != 0) {
      //Step 1: Remove all bad props from selected items.
      const cleanedList = state.data.selection.map(
        ({ shopId, createdAt, updatedAt, ...rest }) => rest
      );
      console.log("Cleaned Selection List", cleanedList);
      //Step 2: Add props for order in cart
      const formattedList = cleanedList.map((values) => ({
        ...values,
        orderProductQuantity: 1,
        orderProductRemarks: "",
      }));
      console.log("Formatted Selection List", formattedList);
      try {
        //Step 3: Save All to Realm
        await realm.write(() => {
          realm.create("Cart", cleanedList);
        });
        //Step 4: Dispatch to Redux
        await dispatch({ type: "ADD_ALL_TO_CART", payload: formattedList });
      } catch (error) {
        Toast.show("Failed to Add to Cart");
        console.log("Failed to save to realm", error);
      }
      await RemoveAllFromSelection();
    } else {
      Toast.show("No products selected!");
    }
  };

  return (
    <View style={styles.parentContainer}>
      <StatusBar
        barStyle={dark ? "light-content" : "dark-content"}
        backgroundColor={colors.statusBar}
      />
      <View style={{ backgroundColor: colors.primary }}>
        <View style={styles.headerTopContentWrapper}>
          <Icon
            name="menu"
            size={30}
            color={colors.accent}
            onPress={() => navigation.openDrawer()}
          />
          <View style={styles.titleViewWrapper}>
            <Text
              style={{
                fontSize: 16,
                color: colors.text,
                fontWeight: "bold",
              }}
            >
              Catalogue
            </Text>
          </View>
          {/* <ButtonGroup
            buttons={options}
            selectedIndex={selected}
            containerStyle={{
              flex: 0.8,
              borderColor: colors.accent,
              borderWidth: 1,
              borderRadius: 10,
              backgroundColor: "transparent",
            }}
            buttonStyle={{ margin: 2 }}
            selectedButtonStyle={{ backgroundColor: colors.accent, borderRadius: 8 }}
            innerBorderStyle={{ color: "transparent" }}
            onPress={(index) => {
              if (index == 0) {
                dispatch({ type: "SET_SORT_FLAG", payload: false });
              } else {
                dispatch({ type: "SET_SORT_FLAG", payload: true });
              }
            }}
          /> */}
          <Text
            style={{
              fontSize: 16,
              color: colors.text,
              fontWeight: "bold",
              marginEnd: 5,
            }}
          >
            Selected: {state.data.selection.length != 0 ? state.data.selection.length : "None"}
          </Text>
          <Button
            type={state.data.selection.length != 0 ? "solid" : "outline"}
            containerStyle={{ marginStart: 5, marginEnd: 5 }}
            buttonStyle={{
              borderRadius: 10,
              backgroundColor: state.data.selection.length != 0 ? colors.accent : "transparent",
              borderColor: colors.accent,
            }}
            titleStyle={{
              color: state.data.selection.length != 0 ? colors.textInverse : colors.accent,
            }}
            title={state.data.selection.length != 0 ? "Deselect All" : "Select All"}
            onPress={() =>
              state.data.selection.length == 0 ? AddAlltoSelection() : RemoveAllFromSelection()
            }
          />
          <Button
            type="outline"
            containerStyle={{ marginStart: 5, marginEnd: 5 }}
            buttonStyle={{ borderRadius: 25, borderColor: colors.primary }}
            icon={<Icon name="cart-arrow-down" size={25} color={colors.accent} />}
            onPress={() => AddAllSelectedToCart()}
          />
          <Icon
            name={state.indicators.isFilterApplied ? "filter" : "filter-outline"}
            size={30}
            color={colors.accent}
            onPress={() => navigation.navigate("filter")}
          />
          {state.indicators.isFilterApplied ? (
            <Badge
              status="success"
              containerStyle={{ position: "absolute", top: -2, right: -2 }}
              badgeStyle={{
                backgroundColor: colors.accentDark,
                borderWidth: 0,
              }}
              value={
                state.filters.itemStatus.length +
                state.filters.itemCategory.length +
                state.filters.itemType.length +
                2
              }
            />
          ) : null}
        </View>
        <View style={styles.headerBottomContentWrapper}>
          <Searchbar
            style={[
              styles.searchStyle,
              {
                borderColor: dark ? colors.border : colors.accent,
              },
            ]}
            placeholder="Search Products"
            onChangeText={(text) => SearchProducts(text)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  parentContainer: { width: "100%" },
  headerTopContentWrapper: {
    flexDirection: "row",
    margin: 10,
    alignItems: "center",
  },
  headerBottomContentWrapper: { margin: 10 },
  titleViewWrapper: { flex: 1, marginStart: 10, marginEnd: 10 },
  searchStyle: {
    borderRadius: 5,
    borderWidth: 0.5,
    elevation: 4,
  },
});
