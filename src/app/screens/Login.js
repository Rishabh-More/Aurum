import React, { useEffect } from "react";
import DeviceInfo from "react-native-device-info";
import { SafeAreaView, StyleSheet, Text } from "react-native";
//TODO For Now, just use uniqueId for Login Api
export default function Login() {
  useEffect(() => {
    DeviceInfo.getBuildId().then((buildId) => {
      console.log("Build ID", buildId);
    });
    console.log("Device Id", DeviceInfo.getDeviceId());
    console.log("Unique Id", DeviceInfo.getUniqueId());
  }, []);
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
