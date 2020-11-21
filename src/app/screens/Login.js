import React, { useState, useEffect } from "react";
import DeviceInfo from "react-native-device-info";
import { useDeviceOrientation } from "@react-native-community/hooks";
import { useTheme, useNavigation } from "@react-navigation/native";
import { isTablet } from "react-native-device-detection";
import { generateLoginOTP } from "../api/ApiService";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  ScrollView,
  ImageBackground,
} from "react-native";
import { LoginHeader } from "../components/LoginHeader";
import { LoginFooter } from "../components/LoginFooter";
import { LoginContent } from "../components/LoginContent";
import Toast from "react-native-simple-toast";
import { DropDownHolder } from "../config/DropDownHolder";
//TODO For Now, just use uniqueId for Login Api
export default function Login() {
  //Configs
  const navigation = useNavigation();
  const orientation = useDeviceOrientation();
  const { colors, dark } = useTheme();

  const responsive = {
    parent: isTablet && orientation.landscape ? "row" : "column",
    main: { flex: isTablet ? 1.5 : 3 },
    header: { flex: isTablet ? 0 : 1, justifyContent: isTablet ? "center" : null },
    button: { flex: isTablet ? 0 : 1, justifyContent: isTablet ? "center" : null },
  };

  /** State Codes */
  //States
  const [isEmulator, setIsEmulator] = useState(false);
  const [isReady, setReady] = useState(false);
  const [login, setLogin] = useState({
    email: "",
    password: "",
    licenseKey: "",
    deviceName: "",
  });
  const [loading, setLoading] = useState(false);

  //Errors
  const [errorEmail, setEmailError] = useState(false);
  const [errorPWD, setPWDError] = useState(false);
  const [errorLicense, setLicenseError] = useState(false);
  const [errorDevice, setDeviceError] = useState(false);

  //Error Messages
  const [messageEmail, setEmailMessage] = useState("Looks Good");
  const [messagePWD, setPWDMessage] = useState("All Good");

  useEffect(() => {
    DeviceInfo.isEmulator().then((isEmulator) => {
      console.log("isEmulator?", isEmulator);
      setIsEmulator(isEmulator);
    });
  }, []);

  useEffect(() => {
    console.log("login", login);
  }, [login]);

  useEffect(() => {
    if (isReady) {
      GenerateOTP();
    } else {
      setLoading(false);
    }
  }, [isReady]);

  async function VerifyInputs() {
    setLoading(true);
    var pattern = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
    if (login.email == "") {
      //Email cannot be empty
      await setLoading(false);
      setEmailMessage("Email cannot be Blank!");
      setEmailError(true);
      return;
    } else if (login.email != "" && !pattern.test(login.email)) {
      //Email is not valid
      await setLoading(false);
      setEmailMessage("This is not a valid email address!");
      setEmailError(true);
      return;
    } else {
      console.log("resolved email");
      setEmailMessage("");
      setEmailError(false);
    }
    if (login.password == "") {
      //Password cannot be empty
      await setLoading(false);
      setPWDMessage("Password cannot be Empty!");
      setPWDError(true);
      return;
    } else if (login.password.length < 5) {
      //Password must be minimum 5 characters.
      await setLoading(false);
      setPWDMessage("Password must be of minimum 5 characters!");
      setPWDError(true);
      return;
    } else {
      console.log("resolved password");
      setPWDMessage("");
      setPWDError(false);
    }
    if (login.licenseKey == "") {
      //License Key can't be Empty
      await setLoading(false);
      setLicenseError(true);
      return;
    } else {
      console.log("License resolved");
      setLicenseError(false);
    }
    if (login.deviceName == "") {
      //Device Name can't be empty as well
      await setLoading(false);
      setDeviceError(true);
      return;
    } else {
      console.log("Device name resolved");
      setDeviceError(false);
    }
    Toast.show("Validation Successful");
    console.log("login body", login);
    GetDeviceDetails();
  }

  async function GetDeviceDetails() {
    if (!isEmulator) {
      //TODO Fill in the device details.
      if (Platform.OS == "android") {
        //Set Device brand name
        await setLogin({
          ...login,
          brandName: DeviceInfo.getBrand(),
          modelName: DeviceInfo.getModel(),
          deviceId: DeviceInfo.getUniqueId(),
          otp: "",
          vendorId: "vendor123",
        });
        await setReady(true);
      } else {
        //For iOS
      }
    } else {
      Toast.show("Oops, DeviceID not available for Emulator");
    }
  }

  async function GenerateOTP() {
    if (isReady) {
      console.log("calling api");
      await generateLoginOTP(login)
        .then((data) => {
          console.log("login success?", data);
          Toast.show("An OTP has been sent to your Registered Email Id", Toast.LONG);
          navigation.navigate("verify", login);
          setLoading(false);
          setReady(false);
        })
        .catch((error) => {
          console.log("login error", error);
          DropDownHolder.alert("error", "Failed to Login", error);
          setLoading(false);
          setReady(false);
          return;
        });
    } else {
      console.log("still not ready");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={"dark-content"} backgroundColor={colors.accent} />
      <View
        style={{
          flex: 1,
          flexDirection: responsive.parent,
          backgroundColor: colors.accent,
        }}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}></View>
        <View style={{ flex: responsive.main.flex, justifyContent: "center" }}>
          <View style={[styles.content, { backgroundColor: colors.primary }]}>
            <View
              style={{
                flex: responsive.header.flex,
                justifyContent: responsive.header.justifyContent,
              }}>
              {/**For Header */}
              <LoginHeader />
            </View>
            {isTablet ? (
              <LoginContent
                {...{
                  login,
                  setLogin,
                  errorEmail,
                  errorPWD,
                  errorLicense,
                  errorDevice,
                  messageEmail,
                  messagePWD,
                }}
              />
            ) : (
              <View style={{ flex: 5 }}>
                {/**For Content */}
                <ScrollView
                  style={{ flex: 1 }}
                  keyboardShouldPersistTaps="always"
                  keyboardDismissMode="on-drag">
                  <LoginContent
                    {...{
                      login,
                      setLogin,
                      errorEmail,
                      errorPWD,
                      errorLicense,
                      errorDevice,
                      messageEmail,
                      messagePWD,
                    }}
                  />
                </ScrollView>
              </View>
            )}
            <View
              style={{
                flex: responsive.button.flex,
                justifyContent: responsive.button.justifyContent,
              }}>
              {/**For Footer */}
              <LoginFooter {...{ loading, VerifyInputs }} />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    flex: isTablet ? 0 : 1,
    margin: isTablet ? "8%" : "5%",
    justifyContent: "center",
    borderRadius: 25,
  },
});
