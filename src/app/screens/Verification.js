import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";

export default function Verification() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>This is OTP Screen</Text>
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
