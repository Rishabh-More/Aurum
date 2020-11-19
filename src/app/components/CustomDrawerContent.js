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
import { Drawer, Divider } from "react-native-paper";
import { DrawerHeaderContent } from "./DrawerHeaderContent";
import ToggleSwitch from "toggle-switch-react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export function CustomDrawerContent(props) {
  const { isDarkTheme, setDarkTheme } = useContext(ThemeContext);
  const theme = useTheme();
  const { setAuthorization } = useAuthorization();
  const { colors, dark, name } = theme;

  const realm = useDatabase();
  const [shop, setShop] = useState({
    company: {
      companyLogoUrl: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50",
      companyName: "Getting Shop Details...",
      email: "Getting Shop Details...",
      id: 0,
    },
    email: "Getting Shop Details...",
    id: 0,
    shopName: "Getting Shop Details...",
  });

  useEffect(() => {
    getShopData();
  }, []);

  useEffect(() => {
    SaveThemeSettings();
  }, [isDarkTheme]);

  async function getShopData() {
    try {
      let shop = await realm.objects("Shop");
      console.log("Persisted Shop Data", shop);
      console.log("Shop Id", shop[0].id);
      await setShop(shop[0]);
    } catch (error) {
      console.log("failed to retrieve shop object", error);
    }
  }

  async function SaveThemeSettings() {
    try {
      console.log("saving in storage: DarkTheme", isDarkTheme);
      await AsyncStorage.setItem("@app_theme_isDark", JSON.stringify(isDarkTheme));
    } catch (error) {
      console.log("failed to save theme", error);
    }
  }

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
        <View style={drawer.drawerContainer}>
          <DrawerHeaderContent shop={shop} theme={theme} />
          <Divider />
          <Drawer.Section style={drawer.drawerSection}>
            <DrawerItem
              icon={({ size }) => <Icon name="home-outline" color={colors.accent} size={size} />}
              label={() => <Text style={{ color: colors.text }}>Catalogue</Text>}
              onPress={() => props.navigation.navigate("Home")}
            />
            <DrawerItem
              icon={({ size }) => <Icon name="cart-outline" color={colors.accent} size={size} />}
              label={() => <Text style={{ color: colors.text }}>Cart</Text>}
              onPress={() => props.navigation.navigate("Cart")}
            />
            <DrawerItem
              icon={({ size }) => <Icon name="link-variant" color={colors.accent} size={size} />}
              label={() => <Text style={{ color: colors.text }}>Catalogue Links</Text>}
              onPress={() => props.navigation.navigate("Links")}
            />
            <DrawerItem
              icon={({ size }) => <Icon name="account-outline" color={colors.accent} size={size} />}
              label={() => <Text style={{ color: colors.text }}>About Us</Text>}
            />
          </Drawer.Section>
          <Drawer.Section title="Theme">
            <View style={drawer.preferences}>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <Icon
                  style={{ marginLeft: 5, marginRight: 10 }}
                  name={dark ? "moon-waning-crescent" : "white-balance-sunny"}
                  color={colors.accent}
                  size={20}
                />
                <Text style={{ color: colors.text }}>{name}</Text>
              </View>
              <View>
                <ToggleSwitch
                  isOn={dark}
                  onColor={colors.accent}
                  size="medium"
                  onToggle={() => setDarkTheme(!isDarkTheme)}
                />
              </View>
            </View>
          </Drawer.Section>
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
