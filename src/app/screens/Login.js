import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";

export default function Login() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>This is Login Screen</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
