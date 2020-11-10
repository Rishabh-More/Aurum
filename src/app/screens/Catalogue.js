import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";

export default function Catalogue() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>This is Product Catalogue Screen</Text>
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
