import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet, ScrollView } from "react-native";

export default function CatalogueLinks() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>This is Catalogue Links Screen</Text>
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
