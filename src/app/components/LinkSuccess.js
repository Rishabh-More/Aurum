import React, { useEffect, useState } from "react";
import { useNavigation, useTheme } from "@react-navigation/native";
import { useDeviceOrientation } from "@react-native-community/hooks";
import { isPhone, isTablet } from "react-native-device-detection";
import { responsiveFontSize as rf } from "react-native-responsive-dimensions";
import { shortShareableLink } from "../api/ApiService";
import { SafeAreaView, StyleSheet, View, Text, Share } from "react-native";
import { Title, Subheading } from "react-native-paper";
import { Button } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { responsive } from "../config/ResponsiveConfig";

export default function LinkSuccess({ success }) {
  console.log("link success", success);
  const { colors, dark } = useTheme();
  const navigation = useNavigation();
  const orientation = useDeviceOrientation();
  const [shareable, setShareable] = useState("Getting Url...");

  useEffect(() => {
    shortShareableLink(success.catalogueUrl)
      .then((url) => {
        setShareable(url);
        console.log("shortened link", shareable);
      })
      .catch((error) => {
        console.log("failed to short url", error);
      });
  }, []);

  async function ShareGeneratedUrl(url) {
    const baseMessage = `Hi,\nPlease Access your Catalogue using this link: ${url}.`;
    const message = success.otp != null ? `${baseMessage}\n OTP: ${success.otp}` : baseMessage;
    try {
      const result = await Share.share({
        message: message,
      });
      if (result.action == Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          //shared
          console.log("Link Shared successfully");
        }
      } else if (result.action == Share.dismissedAction) {
        //dismissed
      }
    } catch (error) {
      console.log("sharing error", error);
    }
  }
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
          Link Generated Successfully!!
        </Title>
        <View
          style={{
            alignItems: "center",
            marginTop: 15,
            marginBottom: 15,
            margin: 10,
          }}>
          <Subheading style={{ fontSize: rf(responsive.text.linkSuccessText) }}>
            Link Name: {success.name}
          </Subheading>
          <Subheading style={{ fontSize: rf(responsive.text.linkSuccessText) }}>
            Generated url: {shareable}
          </Subheading>
          {success.otp != null ? (
            <Subheading style={{ fontSize: rf(responsive.text.linkSuccessText) }}>
              Link OTP: {success.otp}
            </Subheading>
          ) : null}
        </View>
        <Button
          title="Share"
          icon={
            <Icon
              name="share-variant"
              size={rf(3)}
              color="#fff"
              style={{ marginStart: 5, marginEnd: 5 }}
            />
          }
          titleStyle={{ fontSize: rf(responsive.text.linkSuccessButton) }}
          buttonStyle={{
            width: isPhone ? "75%" : "40%",
            height: 50,
            backgroundColor: colors.accent,
            borderRadius: 25,
            alignSelf: "center",
          }}
          onPress={() => ShareGeneratedUrl(shareable)}
        />
        <Button
          type="clear"
          title="View Catalogue Links"
          titleStyle={{ fontSize: rf(responsive.text.linkSuccessButton), color: colors.accent }}
          buttonStyle={{ marginTop: 10, marginBottom: 10 }}
          onPress={() => navigation.navigate("Links")}
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
