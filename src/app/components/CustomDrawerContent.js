import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../../App";
import { useTheme } from "@react-navigation/native";
import { useDatabase, SaveThemeSettings, LogoutUser } from "../config/Persistence";
import { useAuthorization } from "../navigation/Authorizer";
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
    SaveThemeSettings(isDarkTheme);
  }, [isDarkTheme]);

  async function getShopData() {
    try {
      let shop = await realm.objects("Shop");
      console.log("Persisted Shop Data", shop);
      //console.log("Shop Id", shop[0].id);
      await setShop(shop[0]);
    } catch (error) {
      console.log("failed to retrieve shop object", error);
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
          LogoutUser(shop.id)
            .then((success) => {
              if (success) {
                setAuthorization(false);
              }
            })
            .catch((error) => {
              console.log("[DRAWER] Failed to Logout", error);
            });
          console.log("logging out");
        },
      },
    ]);
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
            {/* <DrawerItem
              icon={({ size }) => <Icon name="account-outline" color={colors.accent} size={size} />}
              label={() => <Text style={{ color: colors.text }}>About Us</Text>}
            /> */}
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
