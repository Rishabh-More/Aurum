import React, { useContext, useState, useEffect } from "react";
import DeviceInfo from "react-native-device-info";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeContext } from "../../App";
import { useTheme } from "@react-navigation/native";
import { useDatabase } from "../config/Persistence";
import { useAuthorization } from "../navigation/Authorizer";
import { logoutFromShop } from "../api/ApiService";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { SafeAreaView, StyleSheet, View, Alert, Text } from "react-native";
import { Drawer } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export function CustomDrawerContent(props) {
  const { isDarkTheme, setDarkTheme } = useContext(ThemeContext);
  const theme = useTheme();
  const { setAuthorization } = useAuthorization();
  const { colors, dark, name } = theme;

  const realm = useDatabase();
  const [shop, setShop] = useState({});

  useEffect(() => {
    try {
      let shop = realm.objects("Shop");
      console.log("Persisted Shop Data", shop);
      console.log("Shop Id", shop[0].id);
      setShop(shop[0]);
    } catch (error) {
      console.log("failed to retrieve shop object", error);
    }
  }, []);

  function ConfirmSignOut() {
    Alert.alert("Log Out", "Are you sure you wish to Log Out from the app?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        style: "default",
        onPress: () => {
          props.navigation.closeDrawer();
          //TODO Show some kind of Splash/Overlay while waiting for Api response + clearing credential data
          LogoutUser();
          console.log("logging out");
        },
      },
    ]);
  }

  async function LogoutUser() {
    //TODO Call signout api
    await logoutFromShop(shop.id, DeviceInfo.getUniqueId())
      .then((status) => {
        console.log("logged out?", status);
        ClearUserSession();
      })
      .catch((error) => {
        console.log("Couldn't sign out", error);
        return;
      });
    await setAuthorization(false);
  }

  async function ClearUserSession() {
    const keys = ["@auth_session", "@auth_token"];
    //TODO Clear Shop Data from Realm DB
    try {
      let shop = await realm.objects("Shop");
      await realm.delete(shop);
    } catch (error) {
      console.log("failed to clear objects", error);
      return;
    }
    //TODO Clear Session and token from AsyncStorage
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.log("failed to remove from local", error);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View>
          <Text>This is Custom Drawer Content</Text>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={drawer.bottomSection}>
        <DrawerItem
          icon={({ size }) => <Icon name="logout" color={colors.accent} size={size} />}
          label={() => <Text style={{ color: colors.text }}>Log Out</Text>}
          onPress={() => ConfirmSignOut()}
        />
      </Drawer.Section>
    </SafeAreaView>
  );
}

const drawer = StyleSheet.create({
  drawerContainer: {
    flex: 1,
  },
  drawerSection: {
    marginTop: 10,
  },
  preferences: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  bottomSection: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
});
