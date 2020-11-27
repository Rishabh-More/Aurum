import React from "react";
import { View, StyleSheet } from "react-native";
import { Avatar, Title, Caption } from "react-native-paper";
import { responsive } from "../config/ResponsiveConfig";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";

export function DrawerHeaderContent({ theme, shop }) {
  const { colors } = theme;
  const avatar = shop.shopLogoUrl;

  return (
    <View style={drawerHeader.container}>
      <View
        style={{
          flexDirection: "row",
          marginTop: 15,
        }}>
        <Avatar.Image
          source={{ uri: avatar }}
          size={50}
          style={{ borderColor: colors.accent, borderWidth: 1 }}
        />
        <View style={drawerHeader.userInfo}>
          <Title style={[drawerHeader.title, { color: colors.text }]}>{shop.shopName}</Title>
          <Caption style={[drawerHeader.caption, { color: colors.text }]}>{shop.email}</Caption>
        </View>
      </View>
    </View>
  );
}

const drawerHeader = StyleSheet.create({
  container: {
    paddingLeft: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: "column",
    marginLeft: 15,
  },
  title: {
    fontSize: rf(responsive.text.drawerHeader),
    marginTop: 3,
    fontWeight: "bold",
  },
  caption: {
    fontSize: rf(responsive.text.drawerHeader),
    lineHeight: 14,
  },
});
