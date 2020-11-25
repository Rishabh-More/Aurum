import React, { useState, useEffect } from "react";
import { useStore } from "../config/Store";
import { useTheme, useNavigation } from "@react-navigation/native";
import { useAuthorization } from "./../navigation/Authorizer";
import { useDatabase } from "../config/Persistence";
import { loginToShop } from "../api/ApiService";
import { SafeAreaView, StatusBar, StyleSheet, View, Text, Alert } from "react-native";
import { Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LinearGradient from "react-native-linear-gradient";
import OTPTextView from "react-native-otp-textinput";
import Toast from "react-native-simple-toast";
import { DropDownHolder } from "../config/DropDownHolder";

export default function Verification({ route }) {
  const login = route.params;
  const navigation = useNavigation();
  const { setAuthorization } = useAuthorization();
  const realm = useDatabase();
  const [loading, setloading] = useState(false);
  const { colors, dark } = useTheme();
  console.log("login body", route.params);

  //State Code
  const { state, dispatch } = useStore();
  const [otp, setOtp] = useState("");

  useEffect(
    () =>
      navigation.addListener("beforeRemove", (nav) => {
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
    setloading(true);
    if (otp === "") {
      Toast.show("ERROR: OTP cannot be blank!");
      setloading(false);
      return;
    } else if (otp != "" && otp.length < 4) {
      Toast.show("ERROR: OTP must be of 4 Digits!");
      setloading(false);
      return;
    } else {
      //Success
      login.otp = otp;
      await loginToShop(login)
        .then((data) => {
          console.log("api verification", data);
          SaveCredentials(data);
        })
        .catch((error) => {
          console.log("failed to validate otp", error);
          DropDownHolder.alert("error", "Failed to Verify OTP", error);
          setloading(false);
          return;
        });
    }
  }

  async function SaveCredentials(data) {
    //TODO Save
    //1. data.shop (Shop Data)
    try {
      await dispatch({ type: "UPDATE_SHOP_DETAILS", payload: data.shop });
      await realm.write(() => {
        realm.create("Shop", data.shop, true);
      });
    } catch (error) {
      console.log("failed to save to realm", error);
    }
    //2. token (Auth token)
    await SaveSession(data.token).catch((error) => {
      console.log("couldn't save session to local", error);
      setloading(false);
      return;
    });
    setloading(false);
    //TODO setAuthorization& navigate to Navigation Drawer
    await setAuthorization(true);
  }

  async function SaveSession(token) {
    const auth_token = ["@auth_token", token];
    const session = ["@auth_session", JSON.stringify(true)];
    try {
      await AsyncStorage.multiSet([auth_token, session]);
    } catch (error) {
      console.log("failed to save session", error);
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
          loading={loading}
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
