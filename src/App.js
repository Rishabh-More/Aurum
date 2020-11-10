import "react-native-gesture-handler";
import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import Authorizer from "./app/navigation/Authorizer";

export default function App() {
  return (
    <NavigationContainer>
      <Authorizer />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
