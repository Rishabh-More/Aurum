import React, { useEffect, useState } from "react";
import { getProductsFromShop } from "../api/ApiService";
import { getAuthToken, useDatabase } from "../config/Persistence";
import { SafeAreaView, StyleSheet, Text } from "react-native";

export default function Catalogue() {
  //TODO Tests
  const realm = useDatabase();
  const [shop, setShop] = useState({});

  useEffect(() => {
    //1. Test Auth token retrieval
    // getAuthToken().then((token) => {
    //   console.log("auth token", token);
    // });
    //2. Test persisted Shop Data
    try {
      let shop = realm.objects("Shop");
      console.log("Persisted Shop Data", shop);
      console.log("Shop Id", shop[0].id);
      setShop(shop[0]);
      getAuthToken().then((token) => {
        console.log("token is", token);
      });
    } catch (error) {
      console.log("failed to retrieve shop object", error);
    }
  }, []);

  useEffect(() => {
    console.log("Now Shop Data is", shop);
    if (shop.id != null) {
      getProductsFromShop(shop.id)
        .then((data) => {
          console.log("Shop Products", data);
        })
        .catch((error) => {
          console.log("Failed to get products from shop", error);
        });
    }
  }, [shop]);
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
