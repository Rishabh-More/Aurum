import React from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Welcome to Aurum!</Text>
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
