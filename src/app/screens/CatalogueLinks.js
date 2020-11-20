import React, { useState, useEffect } from "react";
import { useStore } from "../config/Store";
import { useTheme, useNavigation } from "@react-navigation/native";
import { useDeviceOrientation, useDimensions } from "@react-native-community/hooks";
import { isTablet, isPhone } from "react-native-device-detection";
import { SafeAreaView, View, Text, StyleSheet, FlatList } from "react-native";
import { Appbar, Title } from "react-native-paper";
import { BarIndicator } from "react-native-indicators";
import { getCatalogueLinks } from "../api/ApiService";
import CatalogueLinkItem from "../components/pure components/CatalogueLinkItem";

export default function CatalogueLinks() {
  const { colors, dark } = useTheme();
  const navigation = useNavigation();
  const orientation = useDeviceOrientation();
  const dimensions = useDimensions();

  const phoneColumns = isPhone && orientation.portrait ? 1 : 2;
  const tabColumns = isTablet && orientation.portrait ? 2 : 3;

  //State Codes
  const { state, dispatch } = useStore();
  const [visible, setVisible] = useState(true);
  const [isRefreshing, setRefreshing] = useState(false);
  const [refresh, updateRefresh] = useState(false);

  useEffect(() => {
    console.log("indicator", state.indicators.isFetchingLinks);
    fetchCatalogueLinks();
  }, []);

  useEffect(() => {
    refresh ? updateRefresh(false) : updateRefresh(true);
    if (state.data.links.length != 0) {
      console.log("links flag is", state.indicators.isFetchingLinks);
      dispatch({ type: "SET_LINKS_REFRESH", payload: false });
    } else {
      dispatch({ type: "SET_LINKS_REFRESH", payload: false });
    }
  }, [state.data.links]);

  async function fetchCatalogueLinks() {
    getCatalogueLinks(state.shop.id)
      .then(async (links) => {
        console.log("links response", links);
        await dispatch({ type: "UPDATE_LINKS", payload: links });
        await dispatch({ type: "SET_LINKS_REFRESH", payload: true });
        setVisible(false);
        setRefreshing(false);
      })
      .catch((error) => {
        console.log("response error", error);
      });
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
        <Appbar.Content title="Catalogue Links" titleStyle={{ fontSize: 16 }} />
      </Appbar>
      <View style={{ flex: 1, alignItems: "center" }}>
        <FlatList
          key={[orientation.landscape, orientation.portrait, refresh]}
          numColumns={isPhone ? phoneColumns : tabColumns}
          style={styles.flatlist}
          contentContainerStyle={
            state.data.links.length == 0 ? { flexGrow: 1, justifyContent: "center" } : {}
          }
          data={state.data.links}
          extraData={refresh}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CatalogueLinkItem link={item} columns={isPhone ? phoneColumns : tabColumns} />
          )}
          onRefresh={() => {
            setRefreshing(true);
            fetchCatalogueLinks();
          }}
          refreshing={isRefreshing}
          ListEmptyComponent={
            !visible && state.data.links.length == 0 ? (
              <View style={{ alignItems: "center" }}>
                <Text style={{ color: "grey" }}>You currently have no Active Links</Text>
                <Text style={{ color: colors.text, fontSize: 18, fontWeight: "900", padding: 10 }}>
                  Pull to Refresh
                </Text>
              </View>
            ) : null
          }
        />

        {visible ? (
          <View style={{ width: "100%", height: "100%", flex: 1, position: "absolute" }}>
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
                <Text style={{ color: colors.text }}>Please Wait, Getting Catalogue Links</Text>
                <BarIndicator size={30} count={5} color={colors.accent} style={{ maxHeight: 75 }} />
              </View>
            </View>
          </View>
        ) : null}
      </View>
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
  },
});
