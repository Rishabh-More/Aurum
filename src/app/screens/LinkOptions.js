import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet, ScrollView } from "react-native";

export default function LinkOptions() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>This is Link Options Screen</Text>
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