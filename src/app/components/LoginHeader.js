import React from "react";
import { View } from "react-native";
import { Title, Subheading } from "react-native-paper";
import { responsive } from "../config/ResponsiveConfig";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";

export function LoginHeader() {
  return (
    <View style={{ margin: "5%" }}>
      <Title style={{ fontSize: rf(responsive.text.loginHeaderTitle) }}>Welcome User</Title>
      <Subheading style={{ fontSize: rf(responsive.text.loginHeaderText) }}>
        Please Sign In to Continue..
      </Subheading>
    </View>
  );
}
