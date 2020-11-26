import React, { useEffect, useState } from "react";
import { useStore } from "../config/Store";
import { useDimensions } from "@react-native-community/hooks";
import { useTheme, useNavigation } from "@react-navigation/native";
import { useDataFilter } from "../hooks/useDataFilter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView, View, Text, StyleSheet, ScrollView } from "react-native";
import { Card, Divider, Title } from "react-native-paper";
import { Button } from "react-native-elements";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import MultiSlider from "@ptomasroos/react-native-multi-slider";
import Toast from "react-native-simple-toast";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Filter() {
  const { colors, dark } = useTheme();
  const navigation = useNavigation();
  const dimensions = useDimensions();

  const { query, updateQuery, ApplyFilter, ClearFilter } = useDataFilter();
  const { state, dispatch } = useStore();
  const [loading, setLoading] = useState(false);
  const [maxNetWeight, setMaxNetWeight] = useState(0);
  const [maxGrossWeight, setMaxGrossWeight] = useState(0);
  const [itemCategory, setItemCategory] = useState([]);
  const [itemType, setItemType] = useState([]);

  useEffect(() => {
    console.log("[SCREEN] saved query is", query);
  }, [query]);

  useEffect(() => {
    SetupFilterOptions();
  }, []);

  useEffect(() => {
    updateQuery({
      ...query,
      range: {
        grossWt: { start: 0, end: maxGrossWeight },
        netWt: { start: 0, end: maxNetWeight },
      },
    });
  }, [maxNetWeight, maxGrossWeight]);

  async function SetupFilterOptions() {
    //TODO Check for saved filter options in Async Storage;
    try {
      let savedOptions = await AsyncStorage.getItem("@filter_options");
      console.log("saved options", savedOptions);
      if (savedOptions == null) {
        //Perform Logic to find values & save the values
        let maxNetWeight = await Math.ceil(
          Math.max.apply(
            Math,
            state.data.catalogue.map(function (item) {
              return item.netWeight;
            })
          )
        );
        let maxGrossWeight = await Math.ceil(
          Math.max.apply(
            Math,
            state.data.catalogue.map(function (item) {
              return item.grossWeight;
            })
          )
        );
        console.log("[FILTER SCREEN] maxNetWeight & maxGrossWeight", maxNetWeight, maxGrossWeight);
        const categories = [];
        const types = [];
        state.data.catalogue.forEach((item) => {
          if (!categories.includes(item.itemCategory)) {
            categories.push(item.itemCategory);
          }
          if (!types.includes(item.itemType)) {
            types.push(item.itemType);
          }
        });
        const category = categories.map((item) => ({
          name: item.charAt(0) + item.substring(1).toLowerCase(),
          id: item,
        }));
        const type = types.map((item) => ({
          name: item,
          id: item,
        }));
        let options = {
          maxNetWeight: maxNetWeight,
          maxGrossWeight: maxGrossWeight,
          itemCategory: category[0].id != "" && category[0].id != "" ? category : [],
          itemType: type[0].id != "" && type[0].id != "" ? type : [],
        };
        try {
          await AsyncStorage.setItem("@filter_options", JSON.stringify(options));
          setMaxNetWeight(maxNetWeight);
          setMaxGrossWeight(maxGrossWeight);
          setItemCategory(options.itemCategory);
          setItemType(options.itemType);
        } catch (error) {
          console.log("Failed to save filter options to AsyncStorage");
        }
      } else {
        //Values already saved, set them to the state
        let options = JSON.parse(savedOptions);
        console.log("[FILTER] saved category & type", options.itemCategory, options.itemType);
        setMaxNetWeight(options.maxNetWeight);
        setMaxGrossWeight(options.maxGrossWeight);
        setItemCategory(options.itemCategory);
        setItemType(options.itemType);
      }
    } catch (error) {
      console.log("Failed to get saved filter options", error);
    }
  }

  async function DispatchNApplyFilter() {
    console.log("filter query is", query);
    await dispatch({ type: "UPDATE_QUERY", payload: query });
    ApplyFilter()
      .then(() => {
        setLoading(false);
        navigation.goBack();
      })
      .catch((error) => {
        console.log("Failed to apply Filter", error);
        Toast.show("Couldn't Apply Filter");
        return;
      });
  }

  async function clearFilter() {
    await ClearFilter();
    updateQuery({
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

  function SliderThumbs() {
    return (
      <View
        style={{
          width: 25,
          height: 25,
          borderRadius: 13,
          backgroundColor: colors.primary,
          borderColor: colors.accent,
          borderWidth: 1.5,
        }}
      />
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Card style={[styles.cardcontainer, { flex: 1 }]}>
          {/** For Range Sliders */}
          <View style={{ marginStart: 15, marginEnd: 15 }}>
            <Title>Gross Weight</Title>
            <View style={styles.rangeContainer}>
              <View
                style={[
                  styles.rangeValue,
                  {
                    backgroundColor: colors.primary,
                    borderColor: colors.accent,
                    marginEnd: 20,
                  },
                ]}>
                <Text style={{ color: colors.text }}>{query.range.grossWt.start}</Text>
              </View>
              <MultiSlider
                useNativeDriver={true}
                sliderLength={dimensions.window.width - 175}
                selectedStyle={{ backgroundColor: colors.accent }}
                containerStyle={{
                  alignItems: "center",
                }}
                trackStyle={{ height: 3, borderRadius: 5 }}
                customMarkerLeft={() => SliderThumbs()}
                customMarkerRight={() => SliderThumbs()}
                values={[query.range.grossWt.start, query.range.grossWt.end]}
                isMarkersSeparated={true}
                min={parseFloat(0)}
                max={maxGrossWeight != 0 ? maxGrossWeight : parseFloat(100)}
                allowOverlap={false}
                minMarkerOverlapDistance={10}
                onValuesChangeFinish={(value) =>
                  updateQuery({
                    ...query,
                    range: {
                      ...query.range,
                      grossWt: { start: value[0], end: value[1] },
                    },
                  })
                }
              />
              <View
                style={[
                  styles.rangeValue,
                  {
                    backgroundColor: colors.primary,
                    borderColor: colors.accent,
                    marginStart: 20,
                  },
                ]}>
                <Text style={{ color: colors.text }}>{query.range.grossWt.end}</Text>
              </View>
            </View>
          </View>
          <View style={{ marginStart: 15, marginEnd: 15 }}>
            <Title>Net Weight</Title>
            <View style={styles.rangeContainer}>
              <View
                style={[
                  styles.rangeValue,
                  {
                    backgroundColor: colors.primary,
                    borderColor: colors.accent,
                    marginEnd: 20,
                  },
                ]}>
                <Text style={{ color: colors.text }}>{query.range.netWt.start}</Text>
              </View>
              <MultiSlider
                useNativeDriver={true}
                sliderLength={dimensions.window.width - 175}
                selectedStyle={{ backgroundColor: colors.accent }}
                containerStyle={{
                  alignItems: "center",
                }}
                trackStyle={{ height: 3, borderRadius: 5 }}
                customMarkerLeft={() => SliderThumbs()}
                customMarkerRight={() => SliderThumbs()}
                values={[query.range.netWt.start, query.range.netWt.end]}
                isMarkersSeparated={true}
                min={parseFloat(0)}
                max={maxNetWeight != 0 ? maxNetWeight : parseFloat(100)}
                allowOverlap={false}
                minMarkerOverlapDistance={10}
                onValuesChangeFinish={(value) =>
                  updateQuery({
                    ...query,
                    range: {
                      ...query.range,
                      netWt: { start: value[0], end: value[1] },
                    },
                  })
                }
              />
              <View
                style={[
                  styles.rangeValue,
                  {
                    backgroundColor: colors.primary,
                    borderColor: colors.accent,
                    marginStart: 20,
                  },
                ]}>
                <Text style={{ color: colors.text }}>{query.range.netWt.end}</Text>
              </View>
            </View>
          </View>
        </Card>
        <Divider style={{ width: "95%", alignSelf: "center" }} />
        <Card style={styles.cardcontainer}>
          {/** For Dropdown Pickers */}
          <View style={{ marginStart: 15, marginEnd: 15, marginTop: 10 }}>
            <Title>Item Status</Title>
            <SectionedMultiSelect
              colors={{ primary: colors.accent, chipColor: colors.accent }}
              items={[
                {
                  name: "Item Status",
                  id: 0,
                  children: [
                    { name: "In Stock", id: "INSTOCK" },
                    { name: "Sold", id: "SOLD" },
                  ],
                },
              ]}
              uniqueKey="id"
              subKey="children"
              IconRenderer={Icon}
              selectText="Select Stock"
              showDropDowns={false}
              styles={{
                container: {
                  maxHeight: "30%",
                  width: "80%",
                  alignSelf: "center",
                  borderRadius: 15,
                },
                modalWrapper: {
                  justifyContent: "center",
                },
              }}
              onSelectedItemsChange={(value) => updateQuery({ ...query, itemStatus: value })}
              selectedItems={query.itemStatus}
              showRemoveAll={true}
            />
          </View>
          <View style={{ marginStart: 15, marginEnd: 15 }}>
            <Title>Item Category</Title>
            <SectionedMultiSelect
              disabled={itemCategory.length == 0 ? true : false}
              colors={{ primary: colors.accent, chipColor: colors.accent }}
              items={[
                {
                  name: "Item Category",
                  id: 0,
                  children: itemCategory,
                },
              ]}
              uniqueKey="id"
              subKey="children"
              IconRenderer={Icon}
              selectText={itemCategory.length != 0 ? "Select Category" : "No Options Available"}
              showDropDowns={false}
              styles={{
                container: {
                  maxHeight: "50%",
                  width: "80%",
                  alignSelf: "center",
                  borderRadius: 15,
                },
                modalWrapper: { justifyContent: "center" },
              }}
              onSelectedItemsChange={(value) => updateQuery({ ...query, itemCategory: value })}
              selectedItems={itemCategory.length != 0 ? query.itemCategory : []}
              showRemoveAll={true}
            />
          </View>
          <View style={{ marginStart: 15, marginEnd: 15 }}>
            <Title>Item Type</Title>
            <SectionedMultiSelect
              disabled={itemType.length == 0 ? true : false}
              colors={{ primary: colors.accent, chipColor: colors.accent }}
              items={[
                {
                  name: "Item Type",
                  id: 0,
                  children: itemType,
                },
              ]}
              uniqueKey="id"
              subKey="children"
              IconRenderer={Icon}
              selectText="Select Type"
              showDropDowns={false}
              styles={{
                container: {
                  maxHeight: "35%",
                  width: "80%",
                  alignSelf: "center",
                  borderRadius: 15,
                },
                modalWrapper: { justifyContent: "center" },
              }}
              onSelectedItemsChange={(value) => updateQuery({ ...query, itemType: value })}
              selectedItems={itemType.length != 0 ? query.itemType : []}
              showRemoveAll={true}
            />
          </View>
        </Card>
      </ScrollView>
      <Divider style={{ width: "95%", alignSelf: "center" }} />
      <View style={styles.buttons}>
        <Button
          title={state.data.filter.length !== 0 ? "Clear Filter" : "Cancel"}
          type="outline"
          titleStyle={{ color: colors.accent }}
          containerStyle={{ flex: 1 }}
          buttonStyle={{ borderColor: colors.accent, margin: 5, height: 50, borderRadius: 15 }}
          onPress={() => {
            if (state.data.filter.length !== 0) {
              //Clear Filter Logic
              clearFilter();
              Toast.show("Filter Cleared");
              navigation.goBack();
            } else {
              //Go Back
              navigation.goBack();
            }
          }}
        />
        <Button
          title="Apply"
          loading={loading}
          containerStyle={{ flex: 1 }}
          buttonStyle={{ backgroundColor: colors.accent, margin: 5, height: 50, borderRadius: 15 }}
          onPress={() => {
            setLoading(true);
            DispatchNApplyFilter();
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    //alignItems: "center",
  },
  cardcontainer: {
    marginStart: 5,
    marginEnd: 5,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 15,
  },
  rangeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  rangeValue: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 5,
    height: 30,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    alignContent: "stretch",
    marginTop: 5,
    marginBottom: 5,
  },
});
