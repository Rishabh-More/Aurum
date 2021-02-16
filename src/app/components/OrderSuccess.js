import React from "react";
import { useTheme } from "@react-navigation/native";
import { SafeAreaView, StyleSheet, View, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Subheading, Title } from "react-native-paper";
import { Button } from "react-native-elements";
import Toast from "react-native-simple-toast";

export default function OrderSuccess({ success }) {
  const { colors, dark } = useTheme();
  return (
    <SafeAreaView style={styles.container}>
      <View style={{ width: "80%" }}>
        <Icon
          name="check-decagram"
          size={100}
          color={colors.accent}
          style={{ alignSelf: "center" }}
        />
        <Title style={{ color: colors.accent, alignSelf: "center" }}>
          Order No. {success.orderNo} Successfully Generated
        </Title>
        <View style={{ alignItems: "center", marginTop: 15, marginBottom: 15, margin: 10 }}>
          <Subheading>You can download the Order Receipt Here:</Subheading>
        </View>
        <Button
          type="clear"
          title="Download Order Receipt"
          titleStyle={{ color: colors.accent }}
          buttonStyle={{ marginTop: 10, marginBottom: 10 }}
          onPress={() => Toast.show("Receipt is not available yet. We're working on it")}
        />
      </View>
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
