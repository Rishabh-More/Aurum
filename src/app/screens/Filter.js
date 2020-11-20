import React from "react";
import { useStore } from "../config/Store";
import { useDimensions } from "@react-native-community/hooks";
import { useTheme, useNavigation } from "@react-navigation/native";
import { useDataFilter } from "../hooks/useDataFilter";
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
  console.log("[HOOK] saved query is", query);
  const { state, dispatch } = useStore();

  async function clearFilter() {
    await ClearFilter();
    updateQuery({
      range: {
        grossWt: { start: 0, end: 100 },
        netWt: { start: 0, end: 100 },
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
                max={parseFloat(100)}
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
                max={parseFloat(100)}
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
              colors={{ primary: colors.accent, chipColor: colors.accent }}
              items={[
                {
                  name: "Item Category",
                  id: 0,
                  children: [
                    { name: "Rings", id: "RINGS" },
                    { name: "Pendant", id: "PENDANT" },
                    { name: "Necklace", id: "NECKLACE" },
                    { name: "Bracelet", id: "BRACELET" },
                    { name: "Amulet", id: "AMULET" },
                    { name: "Medallion", id: "MEDALLION" },
                  ],
                },
              ]}
              uniqueKey="id"
              subKey="children"
              IconRenderer={Icon}
              selectText="Select Category"
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
              selectedItems={query.itemCategory}
              showRemoveAll={true}
            />
          </View>
          <View style={{ marginStart: 15, marginEnd: 15 }}>
            <Title>Item Type</Title>
            <SectionedMultiSelect
              colors={{ primary: colors.accent, chipColor: colors.accent }}
              items={[
                {
                  name: "Item Type",
                  id: 0,
                  children: [
                    { name: "CH", id: "CH" },
                    { name: "CHE", id: "CHE" },
                    { name: "HBR", id: "HBR" },
                  ],
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
              selectedItems={query.itemType}
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
          containerStyle={{ flex: 1 }}
          buttonStyle={{ backgroundColor: colors.accent, margin: 5, height: 50, borderRadius: 15 }}
          onPress={async () => {
            console.log("filter query is", query);
            await dispatch({ type: "UPDATE_QUERY", payload: query });
            ApplyFilter();
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
