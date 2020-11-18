import React from "react";
import { View } from "react-native";
import { Title, Subheading } from "react-native-paper";

export function LoginHeader() {
  return (
    <View style={{ margin: "5%" }}>
      <Title>Welcome User</Title>
      <Subheading>Please Sign In to Continue..</Subheading>
    </View>
  );
}
