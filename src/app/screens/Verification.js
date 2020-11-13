import React, { useState, useEffect } from "react";
import { useTheme, useNavigation } from "@react-navigation/native";
import { loginToShop } from "../api/ApiService";
import { SafeAreaView, StatusBar, StyleSheet, View, Text, Alert } from "react-native";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from "react-native-linear-gradient";
import OTPTextView from "react-native-otp-textinput";
import Toast from "react-native-simple-toast";

export default function Verification({ route }) {
  const login = route.params;
  const navigation = useNavigation();
  const [pending, setPending] = useState(true);
  const { colors, dark } = useTheme();
  console.log("login body", route.params);

  //State Code
  const [otp, setOtp] = useState("");

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (nav) => {
        if (!pending) {
          return;
        }

        nav.preventDefault();

        Alert.alert(
          "Sure you want to leave?",
          "You haven't verified your otp yet. Would you like to resend a new otp or leave?",
          [
            {
              text: "Leave",
              style: "destructive",
              onPress: () => {
                navigation.dispatch(nav.data.action);
              },
            },
            { text: "Resend OTP", style: "cancel" },
          ]
        );
      }),
    [navigation]
  );

  async function ValidateOTP() {
    if (otp == "") {
      Toast.show("ERROR: OTP cannot be blank!");
      return;
    } else if (otp != "" && otp.length < 4) {
      Toast.show("ERROR: OTP must be of 4 Digits!");
      return;
    } else {
      //Success
      login.otp = otp;
      await loginToShop(login)
        .then((data) => {
          console.log("api verification", data);
          //TODO Save
          //1. data.shop (Shop Data)
          //2. token (Auth token)
          SaveToken(data.token);

          //Validate User Session & navigate to Catalogue.
        })
        .catch((error) => {
          console.log("failed to validate otp", error);
          Toast.show("Invalid OTP. Please enter a valid otp");
        });
    }
  }

  async function SaveToken(token) {
    try {
      await AsyncStorage.setItem("@auth_token", token);
    } catch (error) {
      console.log("failed to save token");
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.accentDark }]}>
      <StatusBar barStyle={"dark-content"} backgroundColor={colors.accentDark} />
      <View style={{ flex: 1 }} />
      <View style={{ flex: 5 }}>
        <Text style={{ color: colors.textInverse, alignSelf: "center" }}>
          OTP has been sent to your registered email address.
        </Text>
        <Text
          style={{
            color: colors.textInverse,
            fontSize: 24,
            fontWeight: "900",
            alignSelf: "center",
            marginTop: 30,
            margin: 15,
          }}>
          Please Enter a valid OTP
        </Text>
        <OTPTextView
          keyboardType="numeric"
          inputCount={4}
          inputCellLength={1}
          tintColor={colors.accentLight}
          offTintColor={colors.accentLight}
          containerStyle={{ marginStart: 15, marginEnd: 15, justifyContent: "center" }}
          textInputStyle={{
            borderRadius: 15,
            borderWidth: 3,
            alignSelf: "center",
            color: colors.textInverse,
          }}
          handleTextChange={(text) => {
            setOtp(text);
          }}
        />
        <Button
          title="Verify OTP"
          loading={false}
          ViewComponent={LinearGradient}
          containerStyle={{ marginTop: 30, width: "75%", alignSelf: "center" }}
          buttonStyle={{ height: 50, margin: 10, borderRadius: 15 }}
          linearGradientProps={{
            colors: [colors.accent, colors.accentLight],
            start: { x: 1, y: 1 },
            end: { x: 1, y: 0 },
          }}
          onPress={() => ValidateOTP()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});
